/*
  MemoProut_speaker.cpp - Manage the speaker for the Memoprout Pad©
  Created by klem on 07/11/2019
*/

#include "Arduino.h"
#include "MemoProut_speaker.h"
#include "MemoProut_pins.h"
#include "MemoProut.h"
#include <SPI.h>
#include <SD.h>
#include <avr/pgmspace.h>

MemoProut_speaker::MemoProut_speaker()
{
  soundVolume = 4;
  canUpVolume = true;
  canDownVolume = true;
  isSdReady = true;
}

void MemoProut_speaker::init()
{  
  if (!SD.begin(SD_PIN)) {
    isSdReady = false;
  } else {
    tmrpcm.speakerPin = SPEAKER_PIN; // Speaker sur la pin 9
    tmrpcm.setVolume(soundVolume); // gestion du volume de 0 à 7
    tmrpcm.quality(1); // qualitée audio 0 ou 1
    tmrpcm.disable();
  }
}

bool MemoProut_speaker::isReady()
{
  return isSdReady;
}

void MemoProut_speaker::playSound(String filename)
{
  if (DEBUG_MODE) {
    Serial.println("Will play: " + filename);
  }
  if (SD.exists(filename)) {
    tmrpcm.play(filename.c_str());
  } else {
    String defaultSound = F("PROUTS/P1.WAV");
    tmrpcm.play(defaultSound.c_str());
  }
}

void MemoProut_speaker::playSoundAndWait(String filename)
{
  playSound(filename);
  while(isPlaying()) {
    delay(1);
  }
}

void MemoProut_speaker::disableSound()
{
  tmrpcm.disable();
}

void MemoProut_speaker::stopSound()
{
  tmrpcm.stopPlayback();
}

void MemoProut_speaker::upVolume()
{
  if (soundVolume < 6) {
    soundVolume += 1;
  }
  canUpVolume = soundVolume < 6;
  canDownVolume = true;
  tmrpcm.setVolume(soundVolume);
}

void MemoProut_speaker::downVolume()
{
  if (soundVolume > 2) {
    soundVolume -= 1;
  }
  canUpVolume = true;
  canDownVolume = soundVolume > 2;
  tmrpcm.setVolume(soundVolume);
}

byte MemoProut_speaker::getVolume()
{
  return soundVolume;
}

void MemoProut_speaker::setVolume(byte vol)
{
  canUpVolume = true;
  canDownVolume = true;
  if (vol >= 6) {
    soundVolume = 6;
    canUpVolume = false;
  } else if (vol <= 2) {
    soundVolume = 2;
    canDownVolume = false;
  } else {
    soundVolume = vol;
  }
  tmrpcm.setVolume(soundVolume);
}

bool MemoProut_speaker::isPlaying()
{
  return tmrpcm.isPlaying();
}
