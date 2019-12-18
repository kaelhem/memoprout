/*
  MemoProutPad v1.0 - Created by klem on 06/11/2019
  An open-source Arduino audio game
  https://github.com/kaelhem/memoprout  
*/
#include "memoprout.h"
#include "MemoProut_controller.h"
#include "MemoProut_speaker.h"
#include "MemoProut_pins.h"
#include "MemoProut_calibration.h"
#include <avr/pgmspace.h>

#define APP_VERSION 1

#define NO_PRESSED_BUTTON 255

// MAIN STATES
#define STARTUP 0
#define MENU 1
#define GAME_LOOP 2
#define GAME_OVER 3
#define CHECK_LEDS 4
#define CHECK_BUTTONS 5

// GAME STATES
#define PREPARE_GAME 0
#define PLAY_SOUND 1
#define WAIT_BUTTON 2
#define REPLAY_ALL 3

GameObject currentGameObject;
unsigned long lastGameListPos = 0;

byte mainState = STARTUP;
byte gameState = PLAY_SOUND;
byte globalGameIndex = 0;

MemoProut_speaker speaker = MemoProut_speaker();
MemoProut_controller controller = MemoProut_controller();

String serialCommand;

bool isConnected = false;

void setup() {
  Serial.begin(57600);
  while (!Serial) {
    ;
  }
  speaker.init();
  controller.init();
  if (!CalibrationUtils::isCalibrated()) {
    Serial.println(F("NO CALIBRATION !"));
    controller.lightUp(controller.LED_OK);
    // TODO : indicate that calibration is starting with messages for user
    calibrateButtons();
  }
}

void loop() {
  if (Serial.available() > 0) {
    isConnected = true;
    updateMode();
  } else {
    switch(mainState) {
      case STARTUP: startup(); break;
      case MENU: menu(); break;
      case GAME_LOOP: gameLoop(); break;
      case GAME_OVER: gameOver(); break;
      case CHECK_LEDS: checkLeds(); break;
      case CHECK_BUTTONS: checkButtons(); break;
    }
  }
}

/**
 * Allow serial communication with host
 */
void updateMode() {
  controller.lightUp(controller.LED_OK);
  while(isConnected) {
    readCommand();
    executeCommand();
  }
}

void readCommand() {
  bool done = false;
  serialCommand = "";
  while (!done) {
    if (Serial.available() > 0) {
      char c = Serial.read();
      if (c!=10 && c!=13) {
        serialCommand += c;
      } else if (serialCommand != "") {
        done = true;
      }
    }
  }
}

/**
 * Execute command received by host on serial
 */
void executeCommand() {
  if (DEBUG_MODE) {
    Serial.println(serialCommand);
  }
  if (serialCommand == F("UP")) {
    startFileUpload();
  } else if (serialCommand == F("CALIB")) {
    calibrateButtons();
  } else if (serialCommand == F("VER")) {
    Serial.println(APP_VERSION);
  } else if (serialCommand == F("LSGAMES")) {
    listGames();
  } else if (serialCommand == F("EXIT")) {
    isConnected = false;
  } else {
    Serial.println(F("command unknown"));
  }
  serialCommand = "";
}

void listGames() {
  File gameListFile = SD.open(F("GAMES.PRT"), FILE_READ);
  if (gameListFile) {
    while (gameListFile.available() > 0) {
      String buffer = gameListFile.readStringUntil(' ');
      Serial.println(buffer);
      gameListFile.readStringUntil('\n');
    }
  } else {
    Serial.println(F("ERR"));
  }
  gameListFile.close();
}

void calibrateButtons() {
  Serial.println(F("Calibration of buttons - it will be store in EEPROM"));
  byte i;
  int pinValue = -1;
  byte countIdenticals;
  int buttons[14];
  for (i = 0; i < 14; ++i) {
    countIdenticals = 0;
    byte btId = controller.getButtonIdAtIndex(i);
    controller.lightUp(btId);
    while(countIdenticals < 3) {
      int readValue = analogRead(i < 14 ? 1 : 2);
      if (readValue == pinValue) {
        ++countIdenticals;
      } else {
        countIdenticals = 0;
        pinValue = readValue < 1000 ? readValue : -1;
      }
    }
    buttons[btId] = pinValue;
    while(pinValue < 1000) {
      pinValue = analogRead(i < 14 ? 1 : 2);
    }
    pinValue = -1;
  }
  CalibrationUtils::saveCalibration(buttons);
  Serial.println(F("Done."));
  controller.init();
}

void startFileUpload() {
  readCommand();// get file name
  char *filename = serialCommand.c_str();
  if (SD.exists(filename)) {
    Serial.println(0); // file already exists
  } else {
    Serial.println(1); // wait file size
    readCommand();
    unsigned long len = serialCommand.toInt();
    if (len == 0) {
      Serial.println(0); // file size invalid
    } else {
      byte buf[256];
      byte bufferPos = 0;
      unsigned long copied = 0;
      Serial.println(1); // ready to receive file data
      File file = SD.open(filename, FILE_WRITE);
      while (copied < len) {
        if (Serial.available() > 0) {
          buf[bufferPos] = Serial.read();
          ++copied;
          ++bufferPos;
        }
        if (sizeof(buf) == 256) {
          file.write(buf, 256);
          bufferPos = 0;
        }
      }
      if (bufferPos > 0) {
        file.write(buf, bufferPos);
      }
      file.close(); 
    }
  }
}

byte checkLedIndex = 0;

void checkLeds() {
  if (DEBUG_MODE) {
    Serial.println(F("check leds"));
  }
  controller.listenButtons();
  if (controller.currentPressedButton != NO_PRESSED_BUTTON) {
    checkLedIndex = 0;
    gotoState(MENU);
  } else {
    controller.lightUp(controller.getButtonIdAtIndex(checkLedIndex));
    delay(200);
    if (++checkLedIndex == 28) {
      checkLedIndex = 0;
      controller.lightUp(controller.LED_OK);
      delay(200);
      controller.lightUp(controller.LED_KO);
      delay(200);
    }
  }
}

void checkButtons() {
  controller.listenButtons();
  if (controller.currentMultiTouchAction != TOUCH_NONE) {
    gotoState(MENU);
  }
}

String getCurrentGameName() {
  return String(currentGameObject.gameName);
}

void setNextGameObject() {
  File gameListFile = SD.open(F("GAMES.PRT"), FILE_READ);
  if (gameListFile) {
    gameListFile.seek(lastGameListPos);
    String buffer = gameListFile.readStringUntil(' ');
    buffer.trim();
    String kindStr = gameListFile.readStringUntil('\n');
    kindStr.trim();
    byte kind = byte(kindStr.toInt());
    lastGameListPos = gameListFile.position() < gameListFile.size() ? gameListFile.position() : 0;
    gameListFile.close();
    buffer.toCharArray(currentGameObject.gameName, buffer.length() +1);
    currentGameObject.hasSentences = kind == 1;
  } else {
    while (true) {
      controller.blinkLed(controller.LED_KO, 2, 100);
      controller.showMessage(F("NO CONFIG"), 150);
    }
  }
}

void loadConfig() {
  File configFile = SD.open(F("CONFIG.PRT"), FILE_READ);
  if (configFile) {
    globalGameIndex = configFile.read();
    speaker.setVolume(configFile.read());
    configFile.close();
  }
}

void saveConfig() {
  if (SD.exists(F("CONFIG.PRT"))) {
    SD.remove(F("CONFIG.PRT"));
  }
  File configFile = SD.open(F("CONFIG.PRT"), FILE_WRITE);
  configFile.write(globalGameIndex);
  configFile.write(speaker.getVolume());
  configFile.close();
}

void updateGlobalGameIndex() {
  ++globalGameIndex;
  saveConfig();
}

void startup() {
  if (!speaker.isReady()) {
    controller.blinkLed(controller.LED_KO, 3, 100);
    controller.showMessage(F("NO SD"), 150);
  } else {
    loadConfig();
    controller.blinkLed(controller.LED_OK, 1, 100);
    unsigned int i = 0;
    Serial.println(F("STARTUP"));
    // lets board have time to read potential serial entry (~100ms)
    while (i < 50000 && Serial.available() == 0) {
      ++i;
    }
    if (Serial.available() == 0) {
      setNextGameObject();
      speaker.playSound(F("PROUTS/P9.WAV"));
      controller.showMessage(F("PROUT"), 100);
      speaker.stopSound();
      controller.resetLeds();
      mainState = MENU;
      speaker.playSoundAndWait(getCurrentGameName() + F("/GAME.WAV"));
    }
  }
}

void gotoState(byte state) {
  // WAIT
  mainState = 255;
  while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
    controller.listenButtons();
  }
  if (state == MENU) {
    speaker.playSoundAndWait(F("UI/MENU.WAV"));
  }
  mainState = state;
}

void switchGameKind() {
  setNextGameObject();
  speaker.playSoundAndWait(getCurrentGameName() + F("/GAME.WAV"));
}

void upVolume() {
  if (speaker.canUpVolume && !speaker.isPlaying()) {
    speaker.upVolume();
    saveConfig();
    speaker.playSoundAndWait(F("PROUTS/P10.WAV"));    
  }
}

void downVolume() {
  if (speaker.canDownVolume && !speaker.isPlaying()) {
    speaker.downVolume();
    saveConfig();
    speaker.playSoundAndWait(F("PROUTS/P10.WAV"));
  }
}

void showHiScore() {
  if (!speaker.isPlaying()) {
    byte scoreSoundIndex = max(0, min(readHiScore(), 10));
    if (scoreSoundIndex > 0) {
      speaker.playSoundAndWait(F("UI/HISCORE.WAV"));
    }
    speaker.playSoundAndWait("SCORE/S" + String(scoreSoundIndex) + F(".WAV"));
  } 
}

void menu() {
  controller.listenButtons();
  switch (controller.currentPressedButton) {
    case BT_1: switchGameKind(); break;
    case BT_22: showHiScore(); break;
    case BT_7: upVolume(); break;
    case BT_14: downVolume(); break;
    case BT_28:
      gameState = PREPARE_GAME;
      gotoState(GAME_LOOP);
    break;

    // hidden features :
    case BT_11:
      gotoState(CHECK_LEDS);
    break;
    case BT_18:
      gotoState(CHECK_BUTTONS);
    break;
  }
  byte ledsToEnlight[] = { BT_1, BT_22, BT_7, BT_14, BT_28 };
  const byte numLeds = sizeof(ledsToEnlight) / sizeof(byte);
  controller.multiLightUp(ledsToEnlight, numLeds);
}

byte waitButtonRelease = NO_PRESSED_BUTTON;
GameSound firstWaitSound;
GameSound *currentWaitSound;
byte currentWaitButtonIndex;
byte score;

void prepareNewGame() {
  controller.resetLeds();
  score = 0;
  currentWaitButtonIndex = 0;

  byte i;

  // read the next game ref (pre-registered random values)
  byte randomGame[84];
  File refGameFile = SD.open("GAMES/" + getCurrentGameName() + F(".PRT"), FILE_READ);
  refGameFile.seek(84 * globalGameIndex);
  for (i = 0; i < 84; ++i) {
    randomGame[i] = refGameFile.read();
  }
  refGameFile.close();

  // write this game in buffer file
  if (SD.exists(F("TMP.PRT"))) {
    SD.remove(F("TMP.PRT"));
  }
  File gameFile = SD.open(F("TMP.PRT"), FILE_WRITE);
  for (i = 0; i < 84; ++i) {
    gameFile.write(randomGame[i]);
  }
  gameFile.close();
  firstWaitSound = {randomGame[0], randomGame[1], randomGame[2]};
  updateGlobalGameIndex();
  gameState = PLAY_SOUND;
}

GameSound getGameSoundAt(byte index) {
  delay(10);
  File gameFile = SD.open(F("TMP.PRT"), FILE_READ);
  gameFile.seek(index * 3);
  GameSound gameSound = {};
  gameSound.kind = gameFile.read();
  gameSound.variant = gameFile.read();
  gameSound.buttonId = gameFile.read();
  gameFile.close();
  if (DEBUG_MODE) {
    Serial.println("read " + String(index) + ": " + String(gameSound.kind) + ", " + String(gameSound.variant) + ", " + String(gameSound.buttonId));
  }
  return gameSound;
}

byte readHiScore() {
  File scoreFile = SD.open(F("SCORE.PRT"), FILE_READ);
  if (scoreFile) {
    byte readScore = scoreFile.read();
    scoreFile.close();
    return readScore;
  }
  return 0;
}

void writeHiScore(byte newScore) {
  if (SD.exists(F("SCORE.PRT"))) {
    SD.remove(F("SCORE.PRT"));
  }
  File scoreFile = SD.open(F("SCORE.PRT"), FILE_WRITE);
  scoreFile.write(newScore);
  scoreFile.close();
}

void gameLoop() {
  switch (gameState) {
    case PREPARE_GAME:
      prepareNewGame();
    break;
    case PLAY_SOUND:
      if (!speaker.isPlaying()) {
        GameSound gameSound = getGameSoundAt(score);
        controller.lightUp(gameSound.buttonId);
        currentWaitButtonIndex = 0;
        currentWaitSound = &firstWaitSound;
        waitButtonRelease = NO_PRESSED_BUTTON;
        speaker.playSoundAndWait(getFilename(gameSound.kind, gameSound.variant));
        controller.resetLeds();
        gameState = WAIT_BUTTON;
      }
    break;
    case REPLAY_ALL:
      for (byte i = 0; i <= score; ++i) {
        GameSound gameSound = getGameSoundAt(i);
        controller.lightUp(gameSound.buttonId);
        speaker.playSoundAndWait(getFilename(gameSound.kind, gameSound.variant));
        controller.resetLeds();
        currentWaitButtonIndex = 0;
        currentWaitSound = &firstWaitSound;
        waitButtonRelease = NO_PRESSED_BUTTON;
        gameState = WAIT_BUTTON;
      }
    break;
    case WAIT_BUTTON:
      controller.listenButtons();
      if (controller.currentPressedButton != NO_PRESSED_BUTTON) {
        if (controller.currentMultiTouchAction != TOUCH_NONE) {
          byte action = controller.currentMultiTouchAction;
          while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
            controller.listenButtons();
          }
          waitButtonRelease = NO_PRESSED_BUTTON;
          switch (action) {
            case TOUCH_1: gotoState(MENU); break;
            case TOUCH_2: gameState = REPLAY_ALL; break;
            case TOUCH_3: upVolume(); break;
            case TOUCH_4: downVolume(); break;
          }
        } else {
          waitButtonRelease = controller.currentPressedButton;
        }
      } else if (waitButtonRelease != NO_PRESSED_BUTTON) {
        if (waitButtonRelease == currentWaitSound->buttonId) {
          waitButtonRelease = NO_PRESSED_BUTTON;
          byte ledsToEnlight[] = { controller.LED_OK, currentWaitSound->buttonId };
          for (byte lightTimer = 0; lightTimer < 100; ++lightTimer) {
            controller.multiLightUp(ledsToEnlight, 2); 
          }
          controller.lightUp(currentWaitSound->buttonId);
          speaker.playSound(getFilename(currentWaitSound->kind, currentWaitSound->variant));
          while(speaker.isPlaying()) {
            if (currentWaitButtonIndex <= score) {
              controller.listenButtons();
              if (controller.currentPressedButton != NO_PRESSED_BUTTON) {
                speaker.stopSound();
                waitButtonRelease = controller.currentPressedButton;
              }
            } else {
              delay(1);
            }
          }
          controller.resetLeds();
          if (++currentWaitButtonIndex <= score) {
            currentWaitSound = &getGameSoundAt(currentWaitButtonIndex);
          } else {
            score += 1;
            gameState = PLAY_SOUND;
          }
        } else {
          gotoState(GAME_OVER);
        }
      }
    break;
  }  
}

void gameOver() {
  byte hiScore = readHiScore();
  if (score > hiScore) {
    writeHiScore(score);
  }
  controller.blinkLed(controller.LED_KO, 3, 100);
  speaker.playSoundAndWait(F("UI/LOOSE.WAV"));
  if (score > 0) {
    speaker.playSoundAndWait(F("UI/URSCORE.WAV"));
    byte scoreSoundIndex = max(0, min(score, 10));
    speaker.playSoundAndWait("SCORE/S" + String(scoreSoundIndex) + F(".WAV"));
  }
  if (score < 5) {
    speaker.playSound(getCurrentGameName() + F("/LOOSE.WAV"));
  }
  controller.showMessage(F("YOU LOOSE"), 160);
  while (speaker.isPlaying()) {
    delay(1);
  }
  gotoState(MENU);
}

String getFilename(byte soundKindIndex, byte soundVariantIndex) {
  if (currentGameObject.hasSentences) {
    char *sndId[] = {
      "SUBJECT",
      "VERB",
      "COMP",
      "INTER"
    };
    return getCurrentGameName() + "/" + String(sndId[soundKindIndex]) + String(soundVariantIndex) + F(".WAV"); 
  } else {
    return getCurrentGameName() + "/M" + String(soundVariantIndex) + F(".WAV");
  }
}
