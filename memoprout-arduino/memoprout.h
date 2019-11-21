/*
  memoprout.h - Default game headers
  Created by klem on 07/11/2019
*/

#ifndef memoprout_h
#define memoprout_h

#define DEBUG_MODE false

struct GameSound {
  byte kind;
  byte variant;
  byte buttonId;
};

struct GameObject {
  char gameName[8];
  bool hasSentences;
};

#endif
