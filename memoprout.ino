#include "memoprout.h"
#include "MemoProut_controller.h"
#include "MemoProut_speaker.h"
#include "MemoProut_pins.h"
#include "MemoProut_config.h"
#include <TrueRandom.h>
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

char *gameBufferFile = "GAME.PRT";
byte mainState = STARTUP;
byte gameState = PLAY_SOUND;
char *gameKind = BASIC;

MemoProut_speaker speaker = MemoProut_speaker();
MemoProut_controller controller = MemoProut_controller();

void checkLeds() {
  byte checkLedIndex = 0;
  while (mainState == CHECK_LEDS) {
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
}

void setup() {
  Serial.begin(9600);
  speaker.init();
  controller.init();
}

void startup() {
  controller.resetLeds();
  gotoState(MENU);
}

void gotoState(byte state) {
  mainState = WAIT;
  while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
    controller.listenButtons();
  }
  if (state == MENU) {
    speaker.playSound(F("UI/MENU.WAV"));
  }
  mainState = state;
}

void menu() {
  controller.listenButtons();
  switch (controller.currentPressedButton) {
    case 0: 
      // basic game
      gameState = PREPARE_GAME;
      gameKind = BASIC;
      gotoState(GAME_LOOP);
    break;
    case 1:
      // kids game
      gameState = PREPARE_GAME;
      gameKind = KIDS;
      gotoState(GAME_LOOP);
    break;
    case 15:
      // movie game
      gameState = PREPARE_GAME;
      gameKind = CINEMA;
      gotoState(GAME_LOOP);
    break;
    case 2:
      if (!speaker.isPlaying()) {
        speaker.playSoundAndWait(F("UI/HISCORE.WAV"));
        speaker.playSoundAndWait(F("SCORE/S9.WAV"));
      }
    break;
    case 12:
      // vol +
      if (speaker.canUpVolume && !speaker.isPlaying()) {
        speaker.upVolume();
        speaker.playSound(F("PROUTS/P10.WAV"));
      }
    break;
    case 13:
      // vol -
      if (speaker.canDownVolume && !speaker.isPlaying()) {
        speaker.downVolume();
        speaker.playSound(F("PROUTS/P10.WAV"));
      }
    break;
    case 26:
      // check leds
      gotoState(CHECK_LEDS);
    break;
    default:
      byte ledsToEnlight[] = { 0, 1, 15, 26 };
      const byte numLeds = sizeof(ledsToEnlight) / sizeof(byte);
      controller.multiLightUp(ledsToEnlight, numLeds);
    break;
  }
}

byte waitButtonRelease = NO_PRESSED_BUTTON;
byte firstWaitButton;
byte currentWaitButton;
byte currentWaitButtonIndex;
byte score;

void prepareNewGame() {
  controller.resetLeds();
  score = 0;
  byte kind = 0;
  currentWaitButtonIndex = 0;
  if (SD.exists(gameBufferFile)) {
    SD.remove(gameBufferFile);
  }
  File gameFile = SD.open(gameBufferFile, FILE_WRITE);
  byte randomButton;
  byte soundVariant;
  for (byte i = 0; i < 30; ++i) {
    randomButton = TrueRandom.random(0, 28);
    if (gameKind == BASIC) {
      soundVariant = TrueRandom.random(1, kind == 3 ? 5 : 9);
    } else if (gameKind == CINEMA) {
      soundVariant = TrueRandom.random(1, 15);
    } else  {
      soundVariant = TrueRandom.random(1, 5);
    }
    if (DEBUG_MODE) {
      Serial.println("write " + String(i) + ": " + String(kind) + ", " + String(soundVariant) + ", " + String(randomButton));
    }
    gameFile.write(kind);
    gameFile.write(soundVariant);
    gameFile.write(randomButton);
    if (i == 0) {
      firstWaitButton = randomButton;
    }
    ++kind;
    if ((kind == 4 && gameKind == BASIC) || (kind == 3 && gameKind != BASIC)) {
      kind = 0;
    }
  }
  gameFile.close();
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
        currentWaitButton = firstWaitButton;
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
        currentWaitButton = firstWaitButton;
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
        if (waitButtonRelease == currentWaitButton) {
          byte ledsToEnlight[] = { controller.LED_OK, currentWaitButton };
          for (byte lightTimer = 0; lightTimer < 100; ++lightTimer) {
            controller.multiLightUp(ledsToEnlight, 2); 
          }
          /*
          controller.lightUp(currentWaitButton);
          GameSound currentGameSound = getGameSoundAt(currentWaitButtonIndex);
          speaker.playSound(getFilename(currentGameSound.kind, currentGameSound.variant));
          while(speaker.isPlaying()) {
            delay(1);
          }
          */
          controller.resetLeds();
          if (++currentWaitButtonIndex <= score) {
            GameSound gameSound = getGameSoundAt(currentWaitButtonIndex);
            currentWaitButton = gameSound.buttonId;
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

void loop() {
  switch(mainState) {
    case STARTUP:
      if (!speaker.isReady()) {
        controller.blinkLed(controller.LED_KO, 3, 100);
        controller.showMessage(F("NO SD"), 150);
      } else {
        controller.blinkLed(controller.LED_OK, 1, 100);
        speaker.playSound(F("PROUTS/P1.WAV"));
        controller.showMessage(F("PROUT"), 120);
        speaker.stopSound();
        startup();
      }
    break;
    case MENU:
      menu();
    break;
    case GAME_LOOP:
      gameLoop();
    break;
    case GAME_OVER:
      controller.blinkLed(controller.LED_KO, 3, 100);
      if (!speaker.isPlaying()) {
        speaker.playSound(String(gameKind) + F("/LOOSE.WAV"));
        controller.showMessage(F("YOU LOOSE"), 160);
      }
      while (speaker.isPlaying()) {
        delay(1);
      }
      gotoState(MENU);
    break;
    case CHECK_LEDS:
      checkLeds();
    break;
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
