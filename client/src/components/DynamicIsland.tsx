import React from 'react';
import { useAppStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

export function DynamicIsland() {
  const { islandMessage } = useAppStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] flex justify-center w-full max-w-[300px] pointer-events-none">
      <AnimatePresence>
        {islandMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-black/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-[0_0_40px_rgba(107,92,255,0.4)] flex items-center gap-3 border border-white/10 dynamic-island"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium whitespace-nowrap">{islandMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}