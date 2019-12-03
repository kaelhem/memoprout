/*
  MemoProut_ledButton.h - This class allow to manipulate associated leds/buttons.
  Created by klem on 02/12/2019
*/
#ifndef MemoProut_ledButton_h
#define MemoProut_ledButton_h

#include "Arduino.h"

class MemoProut_ledButton
{
  public:
    MemoProut_ledButton();
    init(byte ledPin0, byte ledPin1, byte buttonId);
    byte getLedPin0();
    byte getLedPin1();
    byte getButtonId();
  private:
    short compressed;
};

#endif
