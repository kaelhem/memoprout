/*
  CalibrationUtils.h - Library that helps to save and load data in EEPROM.
  Created by klem on 17/05/2019
*/
#ifndef CalibrationUtils_h
#define CalibrationUtils_h

#include "Arduino.h"
#include <EEPROM.h>
#include "MemoProut_ledButton.h"

struct CalibrationObject {
  unsigned long memoryId;
  short ledButtons[28];
};

class CalibrationUtils
{
  public:
    CalibrationUtils();
    bool isCalibrated();
    CalibrationObject loadCalibration();
    void saveCalibration(short ledButtons[][7]);
};

#endif
