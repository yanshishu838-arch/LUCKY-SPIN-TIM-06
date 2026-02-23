import { useState, useEffect, useCallback } from 'react';

const PLAYER_KEY = 'lucky_spin_player';

export const PLAYERS = ['G109', 'G71', 'G17', 'G70', 'M07', 'G31'];

export function usePlayer() {
  const [player, setPlayer] = useState<string | null>(() => {
    return localStorage.getItem(PLAYER_KEY);
  });

  const selectPlayer = useCallback((id: string) => {
    setPlayer(id);
    localStorage.setItem(PLAYER_KEY, id);
  }, []);

  const clearPlayer = useCallback(() => {
    setPlayer(null);
    localStorage.removeItem(PLAYER_KEY);
  }, []);

  return { player, selectPlayer, clearPlayer };
}
