import { motion } from "motion/react";

export default function Avatar({ isThinking }: { isThinking?: boolean }) {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <motion.div
        animate={isThinking ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-full h-full bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-full flex items-center justify-center p-2 shadow-xl ring-4 ring-white/10"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="currentColor"
        >
          {/* Simple Face */}
          <circle cx="50" cy="40" r="30" />
          <path d="M50 70 C30 70, 20 85, 20 95 L80 95 C80 85, 70 70, 50 70" />
          
          {/* Eyes */}
          <motion.g
            animate={isThinking ? {
              y: [0, -2, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <circle cx="40" cy="40" r="4" fill="white" />
            <circle cx="60" cy="40" r="4" fill="white" />
          </motion.g>

          {/* Thinking Bubbles */}
          {isThinking && (
            <>
              <motion.circle
                cx="80" cy="20" r="3"
                animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              />
              <motion.circle
                cx="85" cy="10" r="5"
                animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              />
            </>
          )}
        </svg>
      </motion.div>
      
      {/* Halo/Shadow Effect */}
      <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-full -z-10" />
    </div>
  );
}
