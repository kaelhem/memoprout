/*
  MemoProut_calibration.cpp - Library that helps to save and load data in EEPROM.
  Created by klem on 02/12/2019
*/

#include "Arduino.h"
#include <EEPROM.h>
#include "MemoProut_calibration.h"
									   
static const unsigned long MEMORY_ID = 2712019;

CalibrationUtils::CalibrationUtils() {}

static bool CalibrationUtils::isCalibrated() {
  CalibrationObject calibration;
  EEPROM.get(0, calibration);
  return calibration.memoryId == MEMORY_ID;
}

static CalibrationObject CalibrationUtils::loadCalibration() {
  CalibrationObject calibration;
  EEPROM.get(0, calibration);
  if (calibration.memoryId != MEMORY_ID) {
  	// not yet calibrated!
    Serial.println(F("not yet calibrated!"));
  }
  return calibration;
}

static void CalibrationUtils::saveCalibration(int buttons[14]) {
  CalibrationObject calibration;
  for (byte i = 0; i < 14; i++) {
    calibration.buttons[i] = buttons[i];
  }
  calibration.memoryId = MEMORY_ID;
  EEPROM.put(0, calibration);
}
