/*
  FourteenButtons.h - Library for manipulating 14 buttons plugged into 1 analog pin (with tower of resistors to differentiate buttons)
  Created by klem on 27/10/2019
  More info on circuit here : http://modelleisenbahn.triskell.org/spip.php?article59

  Resistors value are : 
    pull-up: 1500
    120
    120
    180
    180
    220
    330
    330
    560
    680
    1000
    1800
    3300
    10000
*/
#ifndef FourteenButtons_h
#define FourteenButtons_h

#include "Arduino.h"

class FourteenButtons
{
  public:
    FourteenButtons();
    void setPin(byte pin);
    byte readValue();

  private:
    byte _pin;
    byte _status;
    byte _button;
};

#endif
