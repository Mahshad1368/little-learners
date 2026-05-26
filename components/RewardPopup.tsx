"use client";

import { AnimatePresence, motion } from "framer-motion";

export function RewardPopup({ show, title = "Great job!", detail = "You earned a star badge." }: { show: boolean; title?: string; detail?: string }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/35 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-lift dark:bg-slate-900"
            initial={{ scale: 0.7, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
          >
            <div className="mb-4 text-6xl" aria-hidden="true">🌟</div>
            <h2 className="text-3xl font-black text-ink dark:text-white">{title}</h2>
            <p className="mt-2 text-base font-bold text-slate-600 dark:text-slate-300">{detail}</p>
            <div className="mt-6 flex justify-center gap-2 text-3xl" aria-hidden="true">
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>⭐</motion.span>
              <motion.span animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>🏅</motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>⭐</motion.span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
