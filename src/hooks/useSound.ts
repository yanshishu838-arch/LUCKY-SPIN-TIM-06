import { useState, useEffect, useCallback } from 'react';

const SPIN_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3';
const WIN_SOUND = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
const LOSE_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('sound_enabled');
    return saved === 'false';
  });

  const [spinAudio] = useState(new Audio(SPIN_SOUND));
  const [winAudio] = useState(new Audio(WIN_SOUND));
  const [loseAudio] = useState(new Audio(LOSE_SOUND));

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newVal = !prev;
      localStorage.setItem('sound_enabled', (!newVal).toString());
      return newVal;
    });
  }, []);

  const playSpin = useCallback(() => {
    if (isMuted) return;
    spinAudio.currentTime = 0;
    spinAudio.loop = true;
    spinAudio.play().catch(() => {});
  }, [isMuted, spinAudio]);

  const stopSpin = useCallback(() => {
    spinAudio.pause();
    spinAudio.currentTime = 0;
  }, [spinAudio]);

  const playWin = useCallback(() => {
    if (isMuted) return;
    winAudio.currentTime = 0;
    winAudio.play().catch(() => {});
  }, [isMuted, winAudio]);

  const playLose = useCallback(() => {
    if (isMuted) return;
    loseAudio.currentTime = 0;
    loseAudio.play().catch(() => {});
  }, [isMuted, loseAudio]);

  return { isMuted, toggleMute, playSpin, stopSpin, playWin, playLose };
}
