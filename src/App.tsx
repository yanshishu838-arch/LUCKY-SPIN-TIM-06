import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  History, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clock,
  ShieldCheck,
  UserCircle,
  LogOut
} from 'lucide-react';
import { Wheel } from './components/Wheel';
import { StartMenu } from './components/StartMenu';
import { ResultModal } from './components/ResultModal';
import { Prize } from './constants';
import { useSound } from './hooks/useSound';
import { usePlayer } from './hooks/usePlayer';
import { cn } from './lib/utils';

export default function App() {
  const { player, selectPlayer, clearPlayer } = usePlayer();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [history, setHistory] = useState<Prize[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSpinTime, setLastSpinTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { isMuted, toggleMute, playSpin, stopSpin, playWin, playLose } = useSound();

  // Load history and last spin time
  useEffect(() => {
    const savedHistory = localStorage.getItem('spin_history_v3');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedLastSpin = localStorage.getItem('last_spin_time_v3');
    if (savedLastSpin) setLastSpinTime(parseInt(savedLastSpin));
  }, []);

  // Update cooldown timer
  useEffect(() => {
    if (!lastSpinTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = 24 * 60 * 60 * 1000 - (now - lastSpinTime);

      if (diff <= 0) {
        setLastSpinTime(null);
        localStorage.removeItem('last_spin_time_v3');
        setTimeLeft('');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSpinTime]);

  const handleWin = useCallback((prize: Prize) => {
    setWinner(prize);
    const newHistory = [prize, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('spin_history_v3', JSON.stringify(newHistory));
    
    const now = Date.now();
    setLastSpinTime(now);
    localStorage.setItem('last_spin_time_v3', now.toString());
  }, [history]);

  if (!player) {
    return <StartMenu onSelect={selectPlayer} />;
  }

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-charcoal text-champagne overflow-hidden font-sans selection:bg-gold/30">
      {/* Background Effects */}
      <div className="absolute inset-0 vignette pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-obsidian blur-[120px] rounded-full" />
      </div>

      {/* Main Content Layout */}
      <main className="relative z-20 h-full flex flex-col items-center justify-between py-[clamp(12px,3vh,24px)] px-4 safe-area-padding">
        
        {/* Header Section */}
        <header className="w-full max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass-gold flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-gold animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-[clamp(16px,3.5vw,22px)] leading-none tracking-widest text-gold gold-text-gradient">
                LUCKY SPIN
              </h1>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gold/10 border border-gold/20 w-fit">
                  <UserCircle className="w-2.5 h-2.5 text-gold" />
                  <span className="text-[9px] font-bold text-gold tracking-widest uppercase">ID: {player}</span>
                </div>
                <button 
                  onClick={clearPlayer}
                  className="flex items-center gap-1 text-[8px] text-champagne/30 hover:text-champagne transition-colors uppercase tracking-widest w-fit"
                >
                  <LogOut className="w-2 h-2" />
                  Ganti Pemain
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="p-2.5 rounded-full glass-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 shadow-lg"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2.5 rounded-full glass-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 shadow-lg"
            >
              <History className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Wheel Section - Centered and Scaled */}
        <section className="flex-1 flex flex-col items-center justify-center w-full max-h-[70vh] pt-10">
          <div className="relative scale-[0.8] sm:scale-90 md:scale-100 transition-transform duration-500">
            <Wheel 
              onWin={handleWin} 
              isSpinning={isSpinning} 
              setIsSpinning={setIsSpinning}
              playSpin={playSpin}
              stopSpin={stopSpin}
              playWin={playWin}
              playLose={playLose}
            />
          </div>
        </section>

        {/* Footer Section */}
        <footer className="w-full max-w-md flex flex-col items-center gap-3">
          {lastSpinTime && (
            <div className="glass-gold px-5 py-1.5 rounded-full flex items-center gap-2 animate-bounce-slow shadow-lg">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span className="font-mono text-xs text-gold-light">Next spin in: {timeLeft}</span>
            </div>
          )}
          
          <div className="flex flex-col items-center gap-1 opacity-60">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gold/80">
              <ShieldCheck className="w-3 h-3" />
              <span>Spin is randomized by system probability</span>
            </div>
            <p className="text-[8px] text-champagne/20 tracking-widest uppercase">
              &copy; 2024 LUXURY CASINO GROUP
            </p>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <ResultModal winner={winner} onClose={() => setWinner(null)} />

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="w-full max-w-md glass-dark border border-gold/20 rounded-3xl p-8 max-h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-gold" />
                  <h2 className="font-display text-2xl text-gold tracking-widest">SPIN HISTORY</h2>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-white/30 italic">
                    <Clock className="w-8 h-8 mb-2 opacity-20" />
                    <p>No spin history yet</p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          item.isZonk ? "bg-red-500/10 text-red-500" : "bg-gold/10 text-gold"
                        )}>
                          {item.isZonk ? <X className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-display text-lg tracking-tight group-hover:text-gold transition-colors">
                            {item.text}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">
                            {item.isZonk ? "Better luck next time" : "Premium Reward"}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] text-white/20 font-mono">
                        #{history.length - idx}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] text-center text-white/40 uppercase tracking-[0.2em]">
                  Showing last 10 spins
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
