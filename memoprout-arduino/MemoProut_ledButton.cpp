/*
  MemoProut_ledButton.cpp - This class allow to manipulate associated leds/buttons.
  Created by klem on 02/12/2019
*/

#include "Arduino.h"
#include "MemoProut_ledButton.h"

/*
REFERENCE MAP :
  { {LED_4, LED_6,  BT_1}, {LED_5, LED_4,  BT_2}, {LED_4, LED_5,  BT_3}, {LED_6, LED_3,  BT_4}, {LED_3, LED_6,  BT_5}, {LED_5, LED_3,  BT_6}, {LED_3, LED_5,  BT_7} },
  { {LED_6, LED_4,  BT_8}, {LED_4, LED_3,  BT_9}, {LED_3, LED_4, BT_10}, {LED_6, LED_2, BT_11}, {LED_2, LED_6, BT_12}, {LED_5, LED_2, BT_13}, {LED_2, LED_5, BT_14} },
  { {LED_2, LED_4, BT_15}, {LED_3, LED_2, BT_16}, {LED_2, LED_3, BT_17}, {LED_6, LED_1, BT_18}, {LED_1, LED_6, BT_19}, {LED_5, LED_1, BT_20}, {LED_1, LED_5, BT_21} },
  { {LED_4, LED_2, BT_22}, {LED_4, LED_1, BT_23}, {LED_1, LED_4, BT_24}, {LED_3, LED_1, BT_25}, {LED_1, LED_3, BT_26}, {LED_2, LED_1, BT_27}, {LED_1, LED_2, BT_28} } 
*/

MemoProut_ledButton::MemoProut_ledButton() {}

MemoProut_ledButton::init(byte ledPin0, byte ledPin1, byte buttonId) {
  compressed = 0;
  byte i;
  for (i = 0; i < 5; ++i) {
    bitWrite(compressed, i, bitRead(ledPin0, i));
    bitWrite(compressed, i + 5, bitRead(ledPin1, i));
    bitWrite(compressed, i + 10, bitRead(buttonId, i));
  }
}

byte MemoProut_ledButton::getLedPin0() {
  byte pin = 0;
  byte i;
  for (i = 0; i < 5; ++i) {
    bitWrite(pin, i, bitRead(compressed, i));
  }
  return pin;
}

byte MemoProut_ledButton::getLedPin1() {
  byte pin = 0;
  byte i;
  for (i = 0; i < 5; ++i) {
    bitWrite(pin, i, bitRead(compressed, i + 5));
  }
  return pin;
}

byte MemoProut_ledButton::getButtonId() {
  byte button = 0;
  byte i;
  for (i = 0; i < 5; ++i) {
    bitWrite(button, i, bitRead(compressed, i + 10));
  }
  return button;
}
