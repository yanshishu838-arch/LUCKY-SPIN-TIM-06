import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Sparkles, Gift, AlertCircle } from 'lucide-react';
import { Prize } from '../constants';
import { cn } from '../lib/utils';

interface ResultModalProps {
  winner: Prize | null;
  onClose: () => void;
}

const ZONK_MESSAGES = [
  "Coba lagi besok ya!",
  "Semoga lebih beruntung di putaran berikutnya.",
  "Jangan menyerah, kesempatan masih ada!"
];

export const ResultModal: React.FC<ResultModalProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  const randomZonkMessage = ZONK_MESSAGES[Math.floor(Math.random() * ZONK_MESSAGES.length)];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ 
            scale: 1, 
            y: 0, 
            opacity: 1,
            x: winner.isZonk ? [0, -10, 10, -10, 10, 0] : 0
          }}
          transition={{
            x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
          }}
          exit={{ scale: 0.8, y: 20, opacity: 0 }}
          className="relative w-full max-w-lg glass-gold border-2 border-gold/30 rounded-[3rem] p-10 md:p-16 text-center overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-champagne/20 hover:text-champagne transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10">
            <div className={cn(
              "mb-8 inline-flex p-6 rounded-[2rem] border shadow-inner",
              winner.isZonk ? "bg-red-500/10 border-red-500/20" : "bg-gold/10 border-gold/20"
            )}>
              {winner.isZonk ? (
                <AlertCircle className="w-16 h-16 text-red-500" />
              ) : (
                <Trophy className="w-16 h-16 text-gold animate-bounce" />
              )}
            </div>

            <h2 className={cn(
              "font-display text-4xl md:text-5xl mb-4 tracking-tighter",
              winner.isZonk ? "text-champagne/90" : "gold-text-gradient"
            )}>
              {winner.isZonk ? "ANDA KURANG BERUNTUNG" : "SELAMAT!"}
            </h2>
            
            <p className="font-serif italic text-champagne/40 text-lg mb-10 leading-relaxed">
              {winner.isZonk ? "Coba lagi besok ya!" : "Anda memenangkan hadiah eksklusif dari kami."}
            </p>

            <div className="relative py-10 px-6 rounded-3xl bg-black/20 border border-white/5 mb-12 group overflow-hidden">
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                winner.isZonk ? "bg-red-500/5" : "bg-gold/5"
              )} />
              <span className={cn(
                "block font-display text-5xl md:text-7xl tracking-tighter relative z-10",
                winner.isZonk ? "text-red-500/80" : "text-champagne neon-glow-gold"
              )}>
                {winner.text}
              </span>
              {!winner.isZonk && (
                <div className="absolute -top-4 -right-4">
                  <Sparkles className="w-12 h-12 text-gold animate-spin-slow opacity-50" />
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className={cn(
                "w-full py-6 rounded-2xl font-display font-bold text-xl tracking-[0.2em] transition-all duration-300 shadow-2xl active:scale-95",
                winner.isZonk 
                  ? "bg-neutral-900 text-champagne/40 border border-white/5 hover:bg-neutral-800" 
                  : "bg-gold text-black hover:bg-gold-dark shadow-[0_10px_40px_rgba(212,175,55,0.3)]"
              )}
            >
              {winner.isZonk ? "TUTUP" : "KLAIM HADIAH"}
            </button>
          </div>

          {/* Decorative elements */}
          <div className={cn(
            "absolute -bottom-20 -left-20 w-64 h-64 blur-[100px] rounded-full opacity-10",
            winner.isZonk ? "bg-red-500" : "bg-gold"
          )} />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 blur-[100px] rounded-full" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
