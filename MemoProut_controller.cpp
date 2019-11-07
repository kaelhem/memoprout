/*
  MemoProut_controller.cpp - Library that manage the 28 buttons and the 30 leds of the MemoProut Pad©
  Created by klem on 06/11/2019
*/

#include "Arduino.h"
#include "MemoProut_controller.h"
#include "MemoProut_pins.h"

/*
REFERENCE MAP :
  { {LED_4, LED_6,  BT_1}, {LED_5, LED_4,  BT_2}, {LED_4, LED_5,  BT_3}, {LED_6, LED_3,  BT_4}, {LED_3, LED_6,  BT_5}, {LED_5, LED_3,  BT_6}, {LED_3, LED_5,  BT_7} },
  { {LED_6, LED_4,  BT_8}, {LED_4, LED_3,  BT_9}, {LED_3, LED_4, BT_10}, {LED_6, LED_2, BT_11}, {LED_2, LED_6, BT_12}, {LED_5, LED_2, BT_13}, {LED_2, LED_5, BT_14} },
  { {LED_2, LED_4, BT_15}, {LED_3, LED_2, BT_16}, {LED_2, LED_3, BT_17}, {LED_6, LED_1, BT_18}, {LED_1, LED_6, BT_19}, {LED_5, LED_1, BT_20}, {LED_1, LED_5, BT_21} },
  { {LED_4, LED_2, BT_22}, {LED_4, LED_1, BT_23}, {LED_1, LED_4, BT_24}, {LED_3, LED_1, BT_25}, {LED_1, LED_3, BT_26}, {LED_2, LED_1, BT_27}, {LED_1, LED_2, BT_28} } 
*/

MemoProut_controller::MemoProut_controller()
{
  // row 1
  leds[0][0] = {LED_4, LED_6,  BT_1};
  leds[0][1] = {LED_5, LED_4,  BT_2};
  leds[0][2] = {LED_4, LED_5,  BT_3};
  leds[0][3] = {LED_6, LED_3,  BT_4};
  leds[0][4] = {LED_3, LED_6,  BT_5};
  leds[0][5] = {LED_5, LED_3,  BT_6};
  leds[0][6] = {LED_3, LED_5,  BT_7};
  // row 2
  leds[1][0] = {LED_6, LED_4,  BT_8};
  leds[1][1] = {LED_4, LED_3,  BT_9};
  leds[1][2] = {LED_3, LED_4, BT_10};
  leds[1][3] = {LED_6, LED_2, BT_11};
  leds[1][4] = {LED_2, LED_6, BT_12};
  leds[1][5] = {LED_5, LED_2, BT_13};
  leds[1][6] = {LED_2, LED_5, BT_14};
  // row 3
  leds[2][0] = {LED_2, LED_4, BT_15};
  leds[2][1] = {LED_3, LED_2, BT_16};
  leds[2][2] = {LED_2, LED_3, BT_17};
  leds[2][3] = {LED_6, LED_1, BT_18};
  leds[2][4] = {LED_1, LED_6, BT_19};
  leds[2][5] = {LED_5, LED_1, BT_20};
  leds[2][6] = {LED_1, LED_5, BT_21};
  // row 4
  leds[3][0] = {LED_4, LED_2, BT_22};
  leds[3][1] = {LED_4, LED_1, BT_23};
  leds[3][2] = {LED_1, LED_4, BT_24};
  leds[3][3] = {LED_3, LED_1, BT_25};
  leds[3][4] = {LED_1, LED_3, BT_26};
  leds[3][5] = {LED_2, LED_1, BT_27};
  leds[3][6] = {LED_1, LED_2, BT_28};
  
  // init buttonsMap()
  for (byte i = 0; i < 4; ++ i) {
    for (byte j = 0; j < 7; ++ j) {
      byte btId = leds[i][j].buttonId;
      buttonsMap[btId][0] = leds[i][j].ledPin0;
      buttonsMap[btId][1] = leds[i][j].ledPin1;
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

byte MemoProut_controller::getButtonIdAt(byte row, byte col)
{
  return leds[row][col].buttonId;
}

byte MemoProut_controller::getButtonIdAtIndex(byte index)
{
  return getButtonIdAt(floor(index / 7), index % 7);
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
      lightUp(leds[i][column].buttonId);
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
  byte val;
  if (pressedButton == 255) {
    val = bottomButtons.readValue();
    pressedButton = val == 255 ? 255 : val + 14;
    currentMultiTouchAction = TOUCH_NONE;
  } else if (pressedButton == BT_1) {
    val = bottomButtons.readValue() + 14;
    if (val == BT_22) {
      currentMultiTouchAction = TOUCH_1;
    } else if (val == BT_28) {
      currentMultiTouchAction = TOUCH_2;
    } else {
      currentMultiTouchAction = TOUCH_NONE;
    }
  } else {
    currentMultiTouchAction = TOUCH_NONE;
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
    ledsMessage += charToLeds(msg.charAt(i)) + "0";
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
