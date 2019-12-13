/*
  MemoProut_controller.h - Library that manage the 28 buttons and the 30 leds of the MemoProut Pad©
  Created by klem on 06/11/2019
*/
#ifndef MemoProut_controller_h
#define MemoProut_controller_h

#include "Arduino.h"
#include "memoprout.h"
#include "MemoProut_buttons.h"
#include "MemoProut_ledButton.h"

// multi-touch actions
#define TOUCH_NONE 0
#define TOUCH_1 1
#define TOUCH_2 2
#define TOUCH_3 3
#define TOUCH_4 4

class MemoProut_controller
{
  public:
    byte currentPressedButton;
    byte currentMultiTouchAction;
    byte LED_OK;
    byte LED_KO;
  
    MemoProut_controller();
    void init();
    void listenButtons();
    void lightUp(byte buttonId);
    void multiLightUp(byte ledsToEnlight[], byte numLeds);
    void blinkLed(byte ledIndex, byte numBlink, uint8_t duration);
    void resetLeds();
    void showMessage(String msg, int msgSpeed = 200);
    byte getButtonIdAtIndex(byte index);
  private:
    CalibrationUtils calibrationUtils;
    MemoProut_buttons topButtons;
    MemoProut_buttons bottomButtons;
    MemoProut_ledButton leds[4][7];
    byte buttonsMap[30][2];

    byte getButtonIdAt(byte row, byte col);
    void lightUpColumn(byte pattern, byte column);
    void lightUpPanel(byte patterns[]);

    String charToLeds(char c);
    byte charToHex(char c);
    byte numLedsFromScheme(byte ledScheme[7]);
};

#endif
