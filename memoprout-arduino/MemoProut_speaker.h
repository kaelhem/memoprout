/*
  MemoProut_speaker.h - Manage the speaker for the Memoprout Pad©
  Created by klem on 07/11/2019
*/
#ifndef MemoProut_speaker_h
#define MemoProut_speaker_h

#include <TMRpcm.h>

class MemoProut_speaker
{
  public:
    bool canUpVolume;
    bool canDownVolume;
    
    MemoProut_speaker();
    void init();
    void playSound(String filename);
    void playSoundAndWait(String filename);
    void stopSound();
    void upVolume();
    void downVolume();
    bool isPlaying();
    bool isReady();
    byte getVolume();
    void setVolume(byte vol);
  private:
    byte soundVolume;
    bool isSdReady;
    TMRpcm tmrpcm;
};

#endif
