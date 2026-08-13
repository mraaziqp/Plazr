import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'pulse' | 'expand' | 'done'>('intro');

  useEffect(() => {
    // Timing sequence matching video/image transition
    const pulseTimer = setTimeout(() => {
      setPhase('pulse');
    }, 700);

    const expandTimer = setTimeout(() => {
      setPhase('expand');
    }, 1900);

    const finishTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(expandTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none"
      >
        {/* Logo Container: 3 Market Stalls Vector + Plazr. Title */}
        <motion.div
          className="relative z-20 flex items-center justify-center space-x-4 sm:space-x-5 px-6"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Detailed Market Stalls Green Line Art */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Soft Ambient Backlight */}
            <motion.div
              animate={
                phase === 'pulse'
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }
                  : { opacity: 0.15 }
              }
              transition={{
                duration: 1.1,
                repeat: phase === 'pulse' ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="absolute w-28 h-28 rounded-full bg-[#65bd82]/30 blur-2xl pointer-events-none"
            />

            <svg
              className="w-24 h-24 sm:w-28 sm:h-28 text-[#65bd82]"
              viewBox="0 0 140 140"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* === STALL 1: TOP-LEFT GAZEBO CANOPY === */}
              {/* Roof Canopy */}
              <path d="M 22 42 L 44 14 L 66 42" />
              <path d="M 44 14 L 44 42" />
              {/* Canopy scalloped/hanging details */}
              <path d="M 22 42 L 22 47 L 44 52 L 66 47 L 66 42 L 22 42" />
              {/* Supporting Legs */}
              <path d="M 23 47 L 23 88" />
              <path d="M 44 52 L 44 88" />
              <path d="M 65 47 L 65 88" />
              {/* Counter top & internal shelves */}
              <path d="M 23 68 L 65 68" />
              <path d="M 25 56 L 35 56" />
              <path d="M 25 62 L 35 62" />
              {/* Stacked boxes on shelf */}
              <rect x="26" y="50" width="8" height="6" strokeWidth="1.8" />
              <rect x="26" y="56" width="8" height="6" strokeWidth="1.8" />
              {/* Vendor Figure (Behind Stall) */}
              <circle cx="50" cy="56" r="3.5" fill="currentColor" />
              <path d="M 50 59.5 L 50 68" />

              {/* === STALL 2: BOTTOM-LEFT PRODUCE DISPLAY & CUSTOMER === */}
              {/* Fruit Display Table */}
              <path d="M 26 88 L 56 88" strokeWidth="2.4" />
              <path d="M 26 98 L 56 98" strokeWidth="2" />
              <path d="M 27 88 L 27 106" />
              <path d="M 55 88 L 55 106" />
              {/* Produce on table */}
              <circle cx="32" cy="84" r="2.5" fill="currentColor" />
              <circle cx="38" cy="84" r="2.5" fill="currentColor" />
              <circle cx="44" cy="84" r="2.5" fill="currentColor" />
              <circle cx="50" cy="84" r="2.5" fill="currentColor" />
              <circle cx="35" cy="79" r="2" fill="currentColor" />
              <circle cx="41" cy="79" r="2" fill="currentColor" />
              <circle cx="47" cy="79" r="2" fill="currentColor" />
              {/* Customer Figure (Left side) */}
              <circle cx="12" cy="84" r="3.5" fill="currentColor" />
              <path d="M 12 87.5 L 12 106" />
              <path d="M 12 94 L 20 90" />
              {/* Vendor behind produce table */}
              <circle cx="52" cy="74" r="3.5" fill="currentColor" />
              <path d="M 52 77.5 L 52 88" />
              <path d="M 52 82 L 44 82" />

              {/* === CRATE BETWEEN STALLS === */}
              <rect x="70" y="94" width="10" height="11" strokeWidth="1.8" />
              <path d="M 70 98 L 80 98" />
              <path d="M 70 102 L 80 102" />
              <path d="M 72 90 C 70 86, 75 86, 75 90 C 75 86, 78 86, 78 90" fill="currentColor" />

              {/* === STALL 3: TOP-RIGHT SLANTED WOODEN KIOSK === */}
              {/* Slanted pitched roof */}
              <path d="M 72 26 L 94 12 L 118 26" />
              <path d="M 72 26 L 72 31 L 118 31 L 118 26 L 72 26" />
              {/* Support posts */}
              <path d="M 74 31 L 74 70" />
              <path d="M 116 31 L 116 70" />
              {/* Front counter */}
              <path d="M 74 52 L 116 52" strokeWidth="2.2" />
              {/* Figures inside exchanging item */}
              <circle cx="84" cy="42" r="3.5" fill="currentColor" />
              <path d="M 84 45.5 L 84 52" />
              <circle cx="98" cy="42" r="3.5" fill="currentColor" />
              <path d="M 98 45.5 L 98 52" />
              <path d="M 84 48 L 98 48" strokeWidth="1.8" />
              {/* Customer standing on right side outside */}
              <circle cx="126" cy="46" r="3.5" fill="currentColor" />
              <path d="M 126 49.5 L 126 68" />
              <path d="M 126 55 L 118 53" />

              {/* === STALL 4: BOTTOM-RIGHT GAZEBO CANOPY === */}
              {/* Roof Canopy */}
              <path d="M 74 72 L 96 46 L 118 72" />
              <path d="M 96 46 L 96 72" />
              <path d="M 74 72 L 74 77 L 96 82 L 118 77 L 118 72 L 74 72" />
              {/* Legs */}
              <path d="M 75 77 L 75 118" />
              <path d="M 96 82 L 96 118" />
              <path d="M 117 77 L 117 118" />
              {/* Counter */}
              <path d="M 75 96 L 117 96" strokeWidth="2.2" />
              {/* Figures in Stall 4 */}
              <circle cx="86" cy="85" r="3.5" fill="currentColor" />
              <path d="M 86 88.5 L 86 96" />
              <circle cx="124" cy="98" r="3.5" fill="currentColor" />
              <path d="M 124 101.5 L 124 118" />
              <path d="M 124 106 L 117 101" />
            </svg>
          </div>

          {/* Plazr. Typography matching exact reference */}
          <div className="flex items-baseline tracking-tight">
            <h1 className="text-5xl sm:text-6xl font-bold text-white font-sans tracking-tight">
              Plazr
            </h1>

            {/* Glowing Green Dot with expanding origin */}
            <div className="relative inline-flex items-baseline">
              <motion.span
                animate={
                  phase === 'pulse' || phase === 'expand'
                    ? {
                        scale: phase === 'expand' ? [1, 2.2] : [1, 1.4, 1],
                        filter: [
                          'drop-shadow(0 0 2px rgba(101,189,130,0.4))',
                          'drop-shadow(0 0 16px rgba(101,189,130,1))',
                          'drop-shadow(0 0 2px rgba(101,189,130,0.4))',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: phase === 'expand' ? 0.35 : 1.0,
                  repeat: phase === 'pulse' ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                className="inline-block text-[#65bd82] font-black text-5xl sm:text-6xl ml-0.5 rounded-full"
              >
                .
              </motion.span>

              {/* Expanding Green Circular Wipe overlay originating right from the dot */}
              {phase === 'expand' && (
                <motion.div
                  initial={{ scale: 0.01, opacity: 0.95 }}
                  animate={{ scale: 45, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#65bd82] shadow-2xl z-50 pointer-events-none"
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


