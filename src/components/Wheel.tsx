import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { PRIZES, Prize } from '../constants';
import { cn } from '../lib/utils';

interface WheelProps {
  onWin: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  playSpin: () => void;
  stopSpin: () => void;
  playWin: () => void;
  playLose: () => void;
}

export const Wheel: React.FC<WheelProps> = ({ 
  onWin, 
  isSpinning, 
  setIsSpinning,
  playSpin,
  stopSpin,
  playWin,
  playLose
}) => {
  const controls = useAnimation();
  const [motionBlur, setMotionBlur] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const spin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    playSpin();

    // DEMO MODE: Find ZONK index dynamically
    const zonkIndex = PRIZES.findIndex(p => p.text.toUpperCase() === "ZONK");
    if (zonkIndex === -1) {
      console.error("ZONK segment not found!");
      setIsSpinning(false);
      return;
    }

    const segmentAngle = 360 / PRIZES.length;
    // Dramatically long spins for 10 seconds (e.g., 15 full rotations)
    const fullSpins = 15;
    
    // Calculate target angle to land exactly in the middle of the ZONK segment
    // The wheel is rotated -90deg initially in SVG, and pointer is at the top (0deg in screen space)
    // To land segment i under the pointer, we need to rotate the wheel by:
    // 360 - (i * segmentAngle + segmentAngle / 2)
    const targetAngleCenter = zonkIndex * segmentAngle + segmentAngle / 2;
    const landingRotation = 360 - targetAngleCenter;
    
    // Final rotation must be relative to current rotation to avoid jumping
    const newRotation = currentRotation + (fullSpins * 360) + (landingRotation - (currentRotation % 360));
    
    // Add a tiny jitter (±0.2deg) for realism while staying safely within the segment
    const jitter = (Math.random() - 0.5) * 0.4;
    const finalRotation = newRotation + jitter;

    const blurInterval = setInterval(() => {
      setMotionBlur(prev => Math.min(prev + 1, 12));
    }, 100);

    // Absolute 10 seconds duration as requested
    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 10,
        ease: [0.12, 0.72, 0.08, 1], // Custom ease for dramatic 10s finish
      },
    });

    clearInterval(blurInterval);
    setMotionBlur(0);
    stopSpin();
    
    setCurrentRotation(finalRotation);
    setIsSpinning(false);
    
    const prize = PRIZES[zonkIndex];
    onWin(prize);

    if (prize.isZonk) {
      playLose();
    } else {
      playWin();
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#F9E2AF', '#AA8A27', '#FFFFFF', '#10B981'],
        ticks: 500,
        gravity: 1,
        scalar: 1.2
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-full">
      {/* Spotlight behind wheel */}
      <div className="absolute w-[clamp(400px,100vw,800px)] h-[clamp(400px,100vw,800px)] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Pointer - Champagne Gold Metallic */}
      <div className="absolute top-0 z-40 -mt-12 md:-mt-16">
        <div className="relative">
          <div className="w-16 h-24 md:w-22 md:h-28 bg-gradient-to-b from-champagne via-gold to-gold-dark shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.2)] clip-path-pointer" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-60" />
            <div className="absolute top-0 left-0 w-full h-full metal-shine opacity-30" />
          </div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-white/40 rounded-full blur-[1px]" />
        </div>
      </div>

      {/* Wheel Container - Responsive Clamp */}
      <div 
        className="relative w-[clamp(280px,52vw,560px)] h-[clamp(280px,52vw,560px)] rounded-full border-[clamp(8px,2vw,16px)] border-gold-dark/30 shadow-[0_30px_100px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{ filter: `blur(${motionBlur}px)` }}
      >
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 noise z-10 pointer-events-none" />
        
        {/* Outer Gold Rim Bezel */}
        <div className="absolute inset-0 border-[4px] border-gold/20 rounded-full z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />

        <motion.div
          animate={controls}
          className="w-full h-full relative"
          initial={{ rotate: 0 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <defs>
              <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="0.4" result="blur" />
                <feOffset dx="0" dy="0" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="innerDepth" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
                <feOffset dx="0.5" dy="0.5" />
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadow" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="shadow" />
                </feMerge>
              </filter>
              <linearGradient id="champagneGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C5B358" />
                <stop offset="50%" stopColor="#F7E7CE" />
                <stop offset="100%" stopColor="#C5B358" />
              </linearGradient>
            </defs>
            {PRIZES.map((prize, i) => {
              const angle = 360 / PRIZES.length;
              const startAngle = i * angle;
              const endAngle = (i + 1) * angle;
              const midAngle = startAngle + angle / 2;
              
              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
              
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
              
              // Text positioning: 68% radius
              const textRadius = 34; 
              const textX = 50 + textRadius * Math.cos((Math.PI * midAngle) / 180);
              const textY = 50 + textRadius * Math.sin((Math.PI * midAngle) / 180);
              
              // Auto-flip logic: if midAngle is between 90 and 270, flip 180
              const shouldFlip = midAngle > 90 && midAngle < 270;
              const textRotation = shouldFlip ? midAngle + 180 : midAngle;

              return (
                <g key={prize.id} filter="url(#innerDepth)">
                  <path
                    d={pathData}
                    fill={prize.color}
                    stroke="rgba(212, 175, 55, 0.1)"
                    strokeWidth="0.1"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill={prize.isSpecial ? "url(#champagneGold)" : (prize.textColor || "white")}
                    fontSize={prize.isSpecial ? "2.8" : "3.2"}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    filter="url(#textGlow)"
                    className={cn(
                      "select-none pointer-events-none uppercase tracking-[0.04em]",
                      prize.isSpecial ? "font-display" : "font-serif"
                    )}
                    style={{ 
                      paintOrder: 'stroke',
                      stroke: prize.color === '#FDFBF7' ? 'rgba(0,0,0,0.1)' : 'rgba(212,175,55,0.1)',
                      strokeWidth: '0.05px',
                      textShadow: prize.glowColor ? `0 0 4px ${prize.glowColor}` : 'none'
                    }}
                  >
                    {prize.isSpecial ? (
                      <>
                        <tspan x={textX} dy="-0.5em">100$</tspan>
                        <tspan x={textX} dy="1.1em">(SPECIAL)</tspan>
                      </>
                    ) : (
                      prize.text
                    )}
                  </text>
                  {prize.isSpecial && (
                    <circle 
                      cx={50 + 44 * Math.cos((Math.PI * midAngle) / 180)} 
                      cy={50 + 44 * Math.sin((Math.PI * midAngle) / 180)} 
                      r="0.6" 
                      fill="white" 
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center Cap - Embossed Gold Coin Style */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(50px,12vw,90px)] h-[clamp(50px,12vw,90px)] bg-matte-black rounded-full border-[clamp(3px,0.6vw,5px)] border-gold shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center z-30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-light/40 via-transparent to-gold-dark/40" />
          <div className="absolute inset-0 metal-shine opacity-20" />
          <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center shadow-inner">
            <div className="w-[75%] h-[75%] rounded-full border border-white/20 flex items-center justify-center bg-gold-dark/10 backdrop-blur-sm">
              <Trophy className="w-[50%] h-[50%] text-white/70" />
              <div className="absolute w-2 h-2 bg-white rounded-full blur-[2px] animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Spin Button - Mid-Dark Luxury Style */}
      <div className="mt-[clamp(24px,6vh,48px)] relative group">
        <div className="absolute -inset-10 bg-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-champagne/40 to-gold/20 rounded-full blur-sm opacity-30 group-hover:opacity-100 transition duration-500"></div>
        <button
          onClick={spin}
          disabled={isSpinning}
          className={cn(
            "relative px-[clamp(40px,10vw,80px)] py-[clamp(16px,4vh,32px)] rounded-full font-display font-black text-[clamp(20px,5vw,32px)] tracking-[0.3em] transition-all duration-700 transform active:scale-95 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]",
            isSpinning 
              ? "bg-matte-black text-white/20 cursor-not-allowed border border-white/5" 
              : "glass-gold text-champagne border border-gold/30 hover:border-gold hover:text-white hover:bg-gold/20"
          )}
        >
          <span className="relative z-10">{isSpinning ? "SPINNING" : "SPIN NOW"}</span>
          {!isSpinning && <div className="absolute inset-0 metal-shine opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />}
        </button>
        
        {/* DEMO MODE INDICATOR */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gold/40 font-display tracking-[0.3em] uppercase animate-pulse">
            DEMO MODE: HASIL FIX ZONK
          </p>
        </div>
      </div>
    </div>
  );
};
