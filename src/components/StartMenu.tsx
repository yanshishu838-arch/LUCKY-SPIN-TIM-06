import React from 'react';
import { motion } from 'motion/react';
import { Users, ChevronRight } from 'lucide-react';
import { PLAYERS } from '../hooks/usePlayer';

interface StartMenuProps {
  onSelect: (id: string) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-charcoal">
      {/* Background Decor */}
      <div className="absolute inset-0 vignette pointer-events-none opacity-50" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-obsidian blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl glass-gold rounded-[2.5rem] p-8 md:p-12 text-center shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-8 inline-flex p-4 rounded-2xl bg-gold/5 border border-gold/10">
          <Users className="w-8 h-8 text-gold" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2 tracking-[0.2em] gold-text-gradient">
          PILIH PEMAIN
        </h1>
        <p className="font-serif italic text-champagne/40 text-sm md:text-base mb-12 tracking-wide">
          Silakan pilih ID pemain untuk memulai sesi eksklusif Anda.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {PLAYERS.map((id, index) => (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(212, 175, 55, 0.4)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(id)}
              className="group relative p-6 rounded-2xl glass-gold flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <span className="font-display text-xl md:text-2xl font-bold tracking-widest text-champagne group-hover:text-gold transition-colors">
                {id}
              </span>
              <div className="w-1 h-1 rounded-full bg-gold/20 group-hover:bg-gold transition-colors" />
            </motion.button>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-[10px] text-champagne/20 uppercase tracking-[0.3em]">
            Luxury Casino Group &copy; 2024
          </p>
        </div>
      </motion.div>
    </div>
  );
};
