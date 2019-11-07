/*
  MemoProut_controller.h - Library that manage the 28 buttons and the 30 leds of the MemoProut Pad©
  Created by klem on 06/11/2019
*/
#ifndef MemoProut_controller_h
#define MemoProut_controller_h

#include "Arduino.h"
#include "FourteenButtons.h"

class MemoProut_controller
{
  public:
    byte currentPressedButton;
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
  private:
    FourteenButtons topButtons;
    FourteenButtons bottomButtons;
    byte leds[4][7][3];
    byte buttonsMap[30][2];
    
    String charToLeds(char c);
    void lightUpColumn(byte pattern, byte column);
    void lightUpPanel(byte patterns[]);

    byte charToHex(char c);
    byte numLedsFromScheme(byte ledScheme[7]);
};

#endif
