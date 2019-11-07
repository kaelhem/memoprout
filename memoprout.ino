#include "FourteenButtons.h"
#include "MemoProut_controller.h"
#include "MemoProut_pins.h"
#include <SPI.h>
#include <SD.h>
#include <TMRpcm.h>

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

//void showMessage(String msg, int msgSpeed = 200);

byte mainState = STARTUP;
String gameKind = "BASIC";

TMRpcm tmrpcm;
byte soundVolume = 4;
bool canUpVolume = true;
bool canDownVolume = true;

void upVolume() {
  if (soundVolume < 6) {
    soundVolume += 1;
  }
  canUpVolume = soundVolume < 6;
  canDownVolume = true;
  tmrpcm.setVolume(soundVolume);
}

void downVolume() {
  if (soundVolume > 2) {
    soundVolume -= 1;
  }
  canUpVolume = true;
  canDownVolume = soundVolume > 2;
  tmrpcm.setVolume(soundVolume);
}

MemoProut_controller memoProutController = MemoProut_controller();

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
  Serial.println("checkLeds");
  memoProutController.listenButtons();
  if (memoProutController.currentPressedButton != 255) {
    checkLedIndex = 0;
    Serial.println("back to menu");
    gotoState(MENU);
  } else {
    memoProutController.lightUp(checkLedIndex);
    delay(200);
    if (++checkLedIndex == 28) {
      checkLedIndex = 0;
      memoProutController.lightUp(memoProutController.LED_OK);
      delay(200);
      memoProutController.lightUp(memoProutController.LED_KO);
      delay(200);
    }
  }
}

bool sdCardFailed = false;

void setup() {
  Serial.begin(9600); // début de la communication série
  tmrpcm.speakerPin = SPEAKER_PIN; // Speaker sur la pin 9
  tmrpcm.setVolume(soundVolume); // gestion du volume de 0 à 7
  tmrpcm.quality(1); // qualitée audio 0 ou 1
  tmrpcm.disable();

  randomSeed(analogRead(0));

  memoProutController.init();

  // Initialisation de la carte SD
  if (!SD.begin(SD_PIN)) {
    sdCardFailed = true;
  }
}

void playSound(String filename)
{
  if (SD.exists(filename)) {
    tmrpcm.play(filename.c_str());
  } else {
    tmrpcm.play("PROUTS/P1.WAV");
  }
}

void startup() {  
  memoProutController.resetLeds();
  mainState = MENU;
}

void gotoState(byte state) {
  mainState = WAIT;
  Serial.println("WAIT");
  while (memoProutController.currentPressedButton != 255) {
    memoProutController.listenButtons();
  }
  mainState = state;
}

void menu()
{
  memoProutController.listenButtons();
  switch (memoProutController.currentPressedButton) {
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
      if (canUpVolume && !tmrpcm.isPlaying()) {
        upVolume();
        tmrpcm.play("BASIC/INTER1.WAV");
      }
    break;
    case 13:
      // vol -
      if (canDownVolume && !tmrpcm.isPlaying()) {
        downVolume();
        tmrpcm.play("BASIC/INTER1.WAV");
      }
    break;
    case 26:
      // check leds
      Serial.println("CHECK_LEDS");
      gotoState(CHECK_LEDS);
    break;
    default:
      byte ledsToEnlight[] = { 0, 1, 15, 14, 26 };
      const byte numLeds = sizeof(ledsToEnlight) / sizeof(byte);
      memoProutController.multiLightUp(ledsToEnlight, numLeds);
    break;
  }
}

void loop() {
  switch(mainState) {
    case STARTUP:
      Serial.println("Startup");
      if (sdCardFailed) {
        memoProutController.blinkLed(memoProutController.LED_KO, 3, 100);
        memoProutController.showMessage("NO SD");
      } else {
        memoProutController.blinkLed(memoProutController.LED_OK, 1, 100);
        tmrpcm.play("PROUTS/P1.WAV");
        memoProutController.showMessage("PROUT", 50);
        tmrpcm.disable();
        startup();
      }
    break;
    case MENU:
      menu();
    break;
    case GAME_LOOP:
      if (!tmrpcm.isPlaying()) {
        String filename = getNextFilename();
        playSound(filename);
        byte ledIndex = (7 * currentSoundStatus + currentSoundIndex - 1);
        memoProutController.lightUp(ledIndex);
      }
    break;
    case GAME_OVER:
      memoProutController.resetLeds();
      if (!tmrpcm.isPlaying()) {
        String filename = gameKind + "/LOOSE.WAV";
        playSound(filename.c_str());
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
