/*
  MemoProut_controller.h - Library that manage the 28 buttons and the 30 leds of the MemoProut Pad©
  Created by klem on 06/11/2019
*/
#ifndef MemoProut_controller_h
#define MemoProut_controller_h

#include "Arduino.h"
#include "FourteenButtons.h"

// multi-touch actions
#define TOUCH_NONE 0
#define TOUCH_1 1
#define TOUCH_2 2
#define TOUCH_3 3
#define TOUCH_4 4

struct LedButton {
  byte ledPin0;
  byte ledPin1;
  byte buttonId;
};

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
    byte getButtonIdAt(byte row, byte col);
    byte getButtonIdAtIndex(byte index);
  private:
    FourteenButtons topButtons;
    FourteenButtons bottomButtons;
    LedButton leds[4][7];
    byte buttonsMap[30][2];
    
    String charToLeds(char c);
    void lightUpColumn(byte pattern, byte column);
    void lightUpPanel(byte patterns[]);

    byte charToHex(char c);
    byte numLedsFromScheme(byte ledScheme[7]);
};

#endif
