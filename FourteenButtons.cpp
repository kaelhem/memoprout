/*
  FourteenButtons.cpp - Library for manipulating 14 buttons plugged into 1 analog pin (with tower of resistors to differentiate buttons)
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

#include "Arduino.h"
#include "FourteenButtons.h"

const byte NONE = 0;
const byte TOUCH = 1;
const byte PRESS = 2;

FourteenButtons::FourteenButtons()
{
}

void FourteenButtons::setPin(byte pin)
{
  _pin = pin;
  _status = NONE;
  _button = 255;
}

byte FourteenButtons::readValue()
{
  // read analog value each milliseconds, until there are 3 identical values.
  byte idxButton = 0;
  byte countIdenticals = 0;
  while (countIdenticals < 3) {
    byte val = (analogRead(_pin) + (1024 / 28)) / (1024 / 14);
  	if (val == idxButton) {
  	  ++countIdenticals;
  	} else {
  	  countIdenticals = 0;
  	  idxButton = val;
  	}
    delay(1);
  }  
  _button = 255;
  switch (_status) {
    case NONE:
      _status = TOUCH;
    break;
    case TOUCH:
      _status = idxButton < 14 ? PRESS : NONE;
    break;
    case PRESS:
      if (idxButton == 14) {
        _status = NONE;
        _button = 255;
      } else {
      	_button = idxButton;
      }
    break;
  }
  return _button;
}
