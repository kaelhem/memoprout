/*
  MemoProut_controller.cpp - Library that manage the 28 buttons and the 30 leds of the MemoProut Pad©
  Created by klem on 06/11/2019
*/

#include "Arduino.h"
#include "MemoProut_controller.h"
#include "MemoProut_pins.h"

MemoProut_controller::MemoProut_controller()
{
  byte ledMatrix[4][7][3] = {
    { {LED_4, LED_6,  0}, {LED_5, LED_4,  2}, {LED_4, LED_5,  4}, {LED_6, LED_3,  6}, {LED_3, LED_6,  8}, {LED_5, LED_3, 10}, {LED_3, LED_5, 12} },
    { {LED_6, LED_4,  1}, {LED_4, LED_3,  3}, {LED_3, LED_4,  5}, {LED_6, LED_2,  7}, {LED_2, LED_6,  9}, {LED_5, LED_2, 11}, {LED_2, LED_5, 13} },
    { {LED_2, LED_4, 15}, {LED_3, LED_2, 17}, {LED_2, LED_3, 19}, {LED_6, LED_1, 21}, {LED_1, LED_6, 23}, {LED_5, LED_1, 25}, {LED_1, LED_5, 27} },
    { {LED_4, LED_2, 14}, {LED_4, LED_1, 16}, {LED_1, LED_4, 18}, {LED_3, LED_1, 20}, {LED_1, LED_3, 22}, {LED_2, LED_1, 24}, {LED_1, LED_2, 26} }
  };
  
  // init buttonsMap()
  for (byte i = 0; i < 4; ++ i) {
    for (byte j = 0; j < 7; ++ j) {
      byte btId = ledMatrix[i][j][2];
      memcpy(buttonsMap[btId], ledMatrix[i][j], 2);
      memcpy(leds[i][j], ledMatrix[i][j], 3);
    }
  }

  buttonsMap[28][0] = LED_5;
  buttonsMap[28][1] = LED_6;
  buttonsMap[29][0] = LED_6;
  buttonsMap[29][1] = LED_5;
  
  LED_OK = 28;
  LED_KO = 29;

  currentPressedButton = 255;
  topButtons = FourteenButtons();
  bottomButtons = FourteenButtons();
}

void MemoProut_controller::getLedIndex(row, col)
{
  byte idx = (i * 7 + j);
}

void MemoProut_controller::init()
{
  topButtons.setPin(PIN_BUTTONS_TOP);
  bottomButtons.setPin(PIN_BUTTONS_BOTTOM);
  resetLeds();
}

void MemoProut_controller::lightUp(byte buttonId)
{
   resetLeds();
   pinMode(buttonsMap[buttonId][0], OUTPUT);
   pinMode(buttonsMap[buttonId][1], OUTPUT);
   digitalWrite(buttonsMap[buttonId][0], HIGH);
   digitalWrite(buttonsMap[buttonId][1],LOW);
}

void MemoProut_controller::multiLightUp(byte ledsToEnlight[], byte numLeds)
{
  for (byte i = 0; i < numLeds; ++i) {
    lightUp(ledsToEnlight[i]);
    delay(1);
  }
}

void MemoProut_controller::lightUpColumn(byte pattern, byte column)
{  
  for (byte i = 0; i < 4; ++i) {
    if (bitRead(pattern, i) == 1) {
      lightUp(leds[i][column][2]);
      delay(1);
    }
  }
}

void MemoProut_controller::lightUpPanel(byte patterns[])
{
  for (byte i = 0; i < 7; ++i) {
    lightUpColumn(patterns[i], i);
  }
}

void MemoProut_controller::blinkLed(byte ledIndex, byte numBlink, uint8_t duration)
{
  for (byte i = 0; i < numBlink; ++i) {
    lightUp(ledIndex);
    delay(duration);
    resetLeds();
    delay(duration);
  }
}

String MemoProut_controller::charToLeds(char c) {
  String result;
  switch(c) {
    case 'A': result = "F5F"; break;
    case 'B': result = "FC"; break;
    case 'C': result = "F99"; break;
    case 'D': result = "F96"; break;
    case 'E': result = "FBB"; break;
    case 'F': result = "F51"; break;
    case 'G': result = "FDD"; break;
    case 'H': result = "F6F"; break;
    case 'I': result = "F"; break;
    case 'J': result = "9F1"; break;
    case 'K': result = "F2D"; break;
    case 'L': result = "F8"; break;
    case 'M': result = "F242F"; break;
    case 'N': result = "F24F"; break;
    case 'O': result = "F9F"; break;
    case 'P': result = "F33"; break;
    case 'Q': result = "F978"; break;
    case 'R': result = "F7B"; break;
    case 'S': result = "BD"; break;
    case 'T': result = "1F1"; break;
    case 'U': result = "F8F"; break;
    case 'V': result = "787"; break;
    case 'W': result = "78687"; break;
    case 'X': result = "9669"; break;
    case 'Y': result = "3C3"; break;
    case 'Z': result = "9DB9"; break;
    default:
      result = "0";
  }
  return result;
}

void MemoProut_controller::resetLeds()
{
   pinMode(LED_1, INPUT);
   pinMode(LED_2, INPUT);
   pinMode(LED_3, INPUT);
   pinMode(LED_4, INPUT);
   pinMode(LED_5, INPUT);
   pinMode(LED_6, INPUT);
   digitalWrite(LED_1, LOW);
   digitalWrite(LED_2, LOW);
   digitalWrite(LED_3, LOW);
   digitalWrite(LED_4, LOW);
   digitalWrite(LED_5, LOW);
   digitalWrite(LED_6, LOW);
}

// --- BUTTONS ---

void MemoProut_controller::listenButtons() {
  byte pressedButton = topButtons.readValue();
  if (pressedButton == 255) {
    byte val = bottomButtons.readValue();
    pressedButton = val == 255 ? 255 : val + 14;
  }
  if (pressedButton != 255 && currentPressedButton != pressedButton) {
    currentPressedButton = pressedButton;
    lightUp(currentPressedButton);
  } else if (pressedButton == 255 && currentPressedButton != 255) {
    resetLeds();
    currentPressedButton = 255;
  }
}

// --- ---

byte MemoProut_controller::charToHex(char c) {
  if (c >= '0' && c <= '9')
    return c - '0';
  if (c >= 'A' && c <= 'F')
    return c - 'A' + 10 ;
}

byte MemoProut_controller::numLedsFromScheme(byte ledScheme[7])
{
  byte numLeds = 0;
  for (byte i = 0; i < 7; ++i) {
    switch(ledScheme[i]) {
      case 1: case 2: case 4: case 8: numLeds += 1; break;
      case 3: case 5: case 9: case 6: case 0xA: case 0xC: numLeds += 2; break;
      case 7: case 0xB: case 0xD: case 0xE: numLeds += 3; break;
      case 0xF: numLeds += 4; break;
    }
  }
  return numLeds;
}

void MemoProut_controller::showMessage(String msg, int msgSpeed) {
  String ledsMessage = "000000";
  byte i;
  for (i = 0; i < msg.length(); ++i) {
    ledsMessage += charToLeds(msg.charAt(i)) + "00";
  }
  bool isFinished = false;
  while (!isFinished) {
    byte scheme[7];
    byte len = min(ledsMessage.length(), 7);
    for (i = 0; i < len; ++i) {
      scheme[i] = charToHex(ledsMessage.charAt(i));
    }
    uint8_t duration = (msgSpeed) / numLedsFromScheme(scheme);
    for (byte count = 0; count < duration; ++count) {
      lightUpPanel(scheme);
    }
    if (ledsMessage.length() > 1) {
      ledsMessage = ledsMessage.substring(1);
    } else {
      isFinished = true;
    }
  }
}
