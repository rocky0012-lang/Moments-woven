import { motion, AnimatePresence } from "motion/react";
import { AIQuote } from "../services/gemini";
import { Heart, Archive } from "lucide-react";

interface QuoteViewProps {
  quote: AIQuote;
  onNext: () => void;
  isLast: boolean;
  onSave: () => void;
  isSaved: boolean;
  onOpenSaved: () => void;
}

const themes: Record<AIQuote['type'], { main: string; accent: string; glow: string; border: string }> = {
  funny: { 
    main: "bg-[#0A0A0C]", 
    accent: "text-amber-400", 
    glow: "from-amber-500/20", 
    border: "bg-amber-500/50" 
  },
  deep: { 
    main: "bg-[#050505]", 
    accent: "text-indigo-400", 
    glow: "from-indigo-500/20", 
    border: "bg-indigo-500/50" 
  },
  short: { 
    main: "bg-[#080A08]", 
    accent: "text-emerald-400", 
    glow: "from-emerald-500/20", 
    border: "bg-emerald-500/50" 
  },
  motivational: { 
    main: "bg-[#0C0808]", 
    accent: "text-rose-400", 
    glow: "from-rose-500/20", 
    border: "bg-rose-500/50" 
  },
};

export default function QuoteView({ quote, onNext, isLast, onSave, isSaved, onOpenSaved }: QuoteViewProps) {
  const progress = ((10 - quote.number + 1) / 10) * 100;
  const theme = themes[quote.type] || themes.deep;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col ${theme.main} text-slate-100 transition-colors duration-1000 overflow-hidden relative font-sans`}
    >
      {/* Background Color Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={quote.type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Ambient Accent Glow */}
            <div className={`absolute inset-0 bg-linear-to-b ${theme.glow} to-transparent opacity-30`} />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[100%] bg-radial from-white/5 to-transparent blur-[120px] translate-y-1/2`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Background Elements */}
      <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] ${theme.glow.replace('from-', 'bg-')} opacity-10 rounded-full blur-[120px] pointer-events-none transition-all duration-1000`} style={{ zIndex: 1 }}></div>
      <div className={`absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] ${theme.glow.replace('from-', 'bg-')} opacity-5 rounded-full blur-[100px] pointer-events-none transition-all duration-1000`} style={{ zIndex: 1 }}></div>

      <nav className="relative z-10 w-full px-8 md:px-12 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full py-2 px-6 overflow-hidden">
          <p className="text-xs font-medium truncate uppercase tracking-widest text-slate-400">Sequence {quote.number}/10</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
            className={`p-2 rounded-full transition-colors ${isSaved ? 'text-red-500 hover:bg-red-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSaved}
            className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-emerald-400 transition-colors"
          >
            <Archive size={20} />
          </motion.button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-24">
        {/* Big Animated Center Number */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0 -translate-y-20 md:-translate-y-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={quote.number}
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.3, y: -50 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={`text-[25rem] md:text-[40rem] font-black leading-none block ${theme.accent} opacity-30`}>
                {quote.number}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quote Container */}
        <div className="max-w-3xl text-center space-y-8 relative z-20 translate-y-28 md:translate-y-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={quote.text}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-serif italic leading-tight text-white drop-shadow-sm px-4">
                "{quote.text}"
              </p>
              <div className={`h-0.5 w-12 ${theme.border} mx-auto rounded-full transition-colors duration-1000`} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="relative z-10 px-8 md:px-12 pb-12 flex flex-col items-center">
        {/* Progress Bar Container */}
        <div className="w-full max-w-lg bg-white/5 h-[1px] mb-8 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`absolute left-0 top-0 h-full ${theme.border} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
            transition={{ duration: 1 }}
          />
        </div>
        
        <div className="flex items-center gap-8 md:gap-12 relative z-30">
          <motion.button 
            type="button"
            whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 md:px-16 py-4 md:py-5 bg-white text-black rounded-full font-bold text-xs md:text-sm uppercase tracking-[0.2em] transform transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            {isLast ? "Begin Again" : "Next sequence"}
          </motion.button>
        </div>

        {/* Pips */}
        <div className="mt-8 flex gap-2">
          {Array.from({ length: 10 }).map((_, i) => {
            const isActive = 10 - i === quote.number;
            const isCompleted = 10 - i > quote.number;
            return (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  isActive ? "w-8 bg-emerald-500 shadow-[0_0_8px_#10b981]" : isCompleted ? "w-1 bg-emerald-800" : "w-1 bg-slate-800"
                }`}
              />
            );
          })}
        </div>
      </footer>
    </motion.div>
  );
}
