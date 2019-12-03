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
  // read analog value each milliseconds, until there are 5 identical values.
  byte idxButton = 0;
  byte countIdenticals = 0;
  while (countIdenticals < 5) {
    int pinVal = analogRead(_pin);
    byte val = (pinVal + (1024 / 28)) / (1024 / 14);
    // fix issues with bad resistors...
    if (val == 3) {
      val = pinVal < 232 ? 3 : 5;
    } else if (val == 17) {
      val = pinVal < 232 ? 17 : 19;
    }
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
