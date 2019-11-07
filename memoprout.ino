#include "MemoProut_controller.h"
#include "MemoProut_speaker.h"
#include "MemoProut_pins.h"
#include "MemoProut_config.h"

#define NO_PRESSED_BUTTON 255

// MAIN STATES
#define WAIT 255
#define STARTUP 0
#define MENU 1
#define GAME_LOOP 2
#define GAME_OVER 3
#define CHECK_LEDS 4

// GAME STATES
#define PLAY_SOUND 0
#define WAIT_BUTTON 1

byte mainState = STARTUP;
String gameKind = "BASIC";

MemoProut_speaker speaker = MemoProut_speaker();
MemoProut_controller controller = MemoProut_controller();

uint8_t currentStatus = 0;
uint8_t currentSoundStatus;
uint8_t currentSoundIndex;

char* sndId[] = {
  "SUBJECT",
  "VERB",
  "COMP",
  "INTER"
};

byte checkLedIndex = 0;

void checkLeds() {
  if (DEBUG_MODE) {
    Serial.println("CHECK LEDS");
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
  randomSeed(analogRead(0));
  speaker.init();
  controller.init();
}

void startup() {
  if (DEBUG_MODE) {
    Serial.println("STARTUP");
  }
  controller.resetLeds();
  mainState = MENU;
}

void gotoState(byte state) {
  mainState = WAIT;
  while (controller.currentPressedButton != NO_PRESSED_BUTTON) {
    controller.listenButtons();
  }
  mainState = state;
}

void menu()
{
  controller.listenButtons();
  switch (controller.currentPressedButton) {
    case 0: 
      // basic game
      gameKind = "BASIC";
      gotoState(GAME_LOOP);
    break;
    case 1:
      // kids game
      gameKind = "KIDS";
      gotoState(GAME_LOOP);
    break;
    case 15:
      // music game
      gameKind = "MUSIC";
      gotoState(GAME_LOOP);
    break;
    case 14:
      // movie game
      gameKind = "CINEMA";
      gotoState(GAME_LOOP);
    break;
    case 12:
      // vol +
      if (speaker.canUpVolume && !speaker.isPlaying()) {
        speaker.upVolume();
        speaker.playSound("BASIC/INTER1.WAV");
      }
    break;
    case 13:
      // vol -
      if (speaker.canDownVolume && !speaker.isPlaying()) {
        speaker.downVolume();
        speaker.playSound("BASIC/INTER1.WAV");
      }
    break;
    case 26:
      // check leds
      gotoState(CHECK_LEDS);
    break;
    default:
      byte ledsToEnlight[] = { 0, 1, 15, 14, 26 };
      const byte numLeds = sizeof(ledsToEnlight) / sizeof(byte);
      controller.multiLightUp(ledsToEnlight, numLeds);
    break;
  }
}

void loop() {
  switch(mainState) {
    case STARTUP:
      if (!speaker.isReady()) {
        controller.blinkLed(controller.LED_KO, 3, 100);
        controller.showMessage("NO SD");
      } else {
        controller.blinkLed(controller.LED_OK, 1, 100);
        speaker.playSound("PROUTS/P1.WAV");
        controller.showMessage("PROUT", 50);
        speaker.stopSound();
        startup();
      }
    break;
    case MENU:
      menu();
    break;
    case GAME_LOOP:
      if (!speaker.isPlaying()) {
        speaker.playSound(getNextFilename());
        byte ledIndex = (7 * currentSoundStatus + currentSoundIndex - 1);
        controller.lightUp(ledIndex);
      }
    break;
    case GAME_OVER:
      controller.resetLeds();
      if (!speaker.isPlaying()) {
        speaker.playSound(gameKind + "/LOOSE.WAV");
      }
    break;
    case CHECK_LEDS:
      checkLeds();
    break;
  }
}

String getNextFilename() {
  String filename = gameKind + "/" + String(sndId[currentStatus]);
  byte maxIndex = currentStatus == 3 ? 5 : 9;
  currentSoundIndex = random(1, maxIndex);
  currentSoundStatus = currentStatus;
  filename += String(currentSoundIndex) + ".WAV";
  ++currentStatus;
  if (currentStatus == 4) {
    currentStatus = 0;
  }
  return filename;
}
