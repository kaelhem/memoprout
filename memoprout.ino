#include "memoprout.h"
#include "MemoProut_controller.h"
#include "MemoProut_speaker.h"
#include "MemoProut_pins.h"
#include "MemoProut_config.h"
#include <avr/pgmspace.h>

#define NO_PRESSED_BUTTON 255

// MAIN STATES
#define WAIT 255
#define STARTUP 0
#define MENU 1
#define GAME_LOOP 2
#define GAME_OVER 3
#define CHECK_LEDS 4

// GAME STATES
#define PREPARE_GAME 0
#define PLAY_SOUND 1
#define WAIT_BUTTON 2
#define REPLAY_ALL 3

const char *BASIC = "BASIC";
const char *KIDS = "KIDS";
const char *CINEMA = "CINEMA";
const char *gameBufferFile = "GAME.PRT";
const char *scoreBufferFile = "SCORE.PRT";
const char *configBufferFile = "CFG.PRT";

byte mainState = STARTUP;
byte gameState = PLAY_SOUND;
char *gameKind = BASIC;
byte globalGameIndex = 0;

MemoProut_speaker speaker = MemoProut_speaker();
MemoProut_controller controller = MemoProut_controller();

byte checkLedIndex = 0;

void checkLeds() {
  if (DEBUG_MODE) {
    Serial.println("check leds");
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

void setup() {
  Serial.begin(9600);
  speaker.init();
  controller.init();
}

void loadConfig() {
  if (SD.exists(configBufferFile)) {
    File configFile = SD.open(configBufferFile, FILE_READ);
    globalGameIndex = configFile.read();
    speaker.setVolume(configFile.read());
    configFile.close();
  }
}

void saveConfig() {
  if (SD.exists(configBufferFile)) {
    SD.remove(configBufferFile);
  }
  File configFile = SD.open(configBufferFile, FILE_WRITE);
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
    speaker.playSound(F("PROUTS/P1.WAV"));
    controller.showMessage(F("PROUT"), 120);
    speaker.stopSound();
    controller.resetLeds();
    mainState = MENU;
    speaker.playSound(F("UI/BASIC.WAV"));
  }
}

void gotoState(byte state) {
  if (DEBUG_MODE) {
    Serial.println("will go on state " + String(state));
  }
  mainState = WAIT;
  while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
    controller.listenButtons();
  }
  if (state == MENU) {
    speaker.playSound(F("UI/MENU.WAV"));
  }
  mainState = state;
}

void switchGameKind() {
  if (gameKind == BASIC) {
    gameKind = KIDS;
  } else if (gameKind == KIDS) {
    gameKind = CINEMA;
  } else {
    gameKind = BASIC;
  }
  speaker.playSoundAndWait("UI/" + String(gameKind) + F(".WAV"));
}

void upVolume() {
  if (speaker.canUpVolume && !speaker.isPlaying()) {
    speaker.upVolume();
    saveConfig();
    speaker.playSound(F("PROUTS/P10.WAV"));    
  }
}

void downVolume() {
  if (speaker.canDownVolume && !speaker.isPlaying()) {
    speaker.downVolume();
    saveConfig();
    speaker.playSound(F("PROUTS/P10.WAV"));
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
  File refGameFile = SD.open("GAMES/" + String(gameKind) + F(".PRT"), FILE_READ);
  refGameFile.seek(84 * globalGameIndex);
  for (i = 0; i < 84; ++i) {
    randomGame[i] = refGameFile.read();
  }
  refGameFile.close();

  // write this game in buffer file
  if (SD.exists(gameBufferFile)) {
    SD.remove(gameBufferFile);
  }
  File gameFile = SD.open(gameBufferFile, FILE_WRITE);
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
  File gameFile = SD.open(gameBufferFile, FILE_READ);
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
  if (SD.exists(scoreBufferFile)) {
    File scoreFile = SD.open(scoreBufferFile, FILE_READ);
    byte readScore = scoreFile.read();
    scoreFile.close();
    return readScore;
  }
  return 0;
}

void writeHiScore(byte newScore) {
  if (SD.exists(scoreBufferFile)) {
    SD.remove(scoreBufferFile);
  }
  File scoreFile = SD.open(scoreBufferFile, FILE_WRITE);
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
        if (controller.currentMultiTouchAction == TOUCH_1) {
          // multi touch action 1
          while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
            controller.listenButtons();
          }
          gotoState(MENU);
        } else if (controller.currentMultiTouchAction == TOUCH_2) {
          // multi touch action 2
          while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
            controller.listenButtons();
          }
          gameState = REPLAY_ALL;
        } else {
          waitButtonRelease = controller.currentPressedButton;
        }
      } else if (waitButtonRelease != NO_PRESSED_BUTTON) {
        if (waitButtonRelease == currentWaitSound->buttonId) {
          byte ledsToEnlight[] = { controller.LED_OK, currentWaitSound->buttonId };
          for (byte lightTimer = 0; lightTimer < 100; ++lightTimer) {
            controller.multiLightUp(ledsToEnlight, 2); 
          }
          controller.lightUp(currentWaitSound->buttonId);
          speaker.playSound(getFilename(currentWaitSound->kind, currentWaitSound->variant));
          while(speaker.isPlaying()) {
            delay(1);
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
        waitButtonRelease = NO_PRESSED_BUTTON;
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
  if (score < 3) {
    speaker.playSound(String(gameKind) + F("/LOOSE.WAV"));
  }
  controller.showMessage(F("YOU LOOSE"), 160);
  while (speaker.isPlaying()) {
    delay(1);
  }
  gotoState(MENU);
}

void loop() {
  switch(mainState) {
    case STARTUP: startup(); break;
    case MENU: menu(); break;
    case GAME_LOOP: gameLoop(); break;
    case GAME_OVER: gameOver(); break;
    case CHECK_LEDS: checkLeds(); break;
  }
}

String getFilename(byte soundKindIndex, byte soundVariantIndex) {
  if (gameKind == CINEMA) {
    return String(gameKind) + "/MOVIE" + String(soundVariantIndex) + F(".WAV");
  }
  char *sndId[] = {
    "SUBJECT",
    "VERB",
    "COMP",
    "INTER"
  };
  return String(gameKind) + "/" + String(sndId[soundKindIndex]) + String(soundVariantIndex) + F(".WAV");
}
