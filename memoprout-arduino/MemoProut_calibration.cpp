/*
  MemoProut_calibration.cpp - Library that helps to save and load data in EEPROM.
  Created by klem on 02/12/2019
*/

#include "Arduino.h"
#include <EEPROM.h>
#include "MemoProut_calibration.h"
									   
static const unsigned long MEMORY_ID = 201912021;

CalibrationUtils::CalibrationUtils() {}

bool CalibrationUtils::isCalibrated() {
  CalibrationObject calibration;
  EEPROM.get(0, calibration);
  return calibration.memoryId != MEMORY_ID;
}

CalibrationObject CalibrationUtils::loadCalibration() {
  CalibrationObject calibration;
  EEPROM.get(0, calibration);
  byte error = calibration.memoryId != MEMORY_ID;
  if (error) {
  	// not yet calibrated!
    Serial.println(F("not yet calibrated!"));
  }
  return calibration;
}

void CalibrationUtils::saveCalibration(short ledButtons[][7]) {
  CalibrationObject calibration;
  byte idx = 0;
  for (byte i = 0; i < 4; i++) {
    for (byte j = 0; j < 7; j++) {
      calibration.ledButtons[idx] = ledButtons[i][j];
      ++idx;
    }
  }
  calibration.memoryId = MEMORY_ID;
  EEPROM.put(0, calibration);
}
