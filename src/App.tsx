/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Heart, MapPin, Sparkles, Loader2, Bookmark, X, Trash2 } from "lucide-react";
import { AIQuote, generateQuotes } from "./services/gemini";
import Avatar from "./components/Avatar";
import QuoteView from "./components/QuoteView";

type AppState = "home" | "generating" | "countdown";

export default function App() {
  const [state, setState] = useState<AppState>("home");
  const [formData, setFormData] = useState({
    name: "",
    activity: "",
    place: "",
  });
  const [quotes, setQuotes] = useState<AIQuote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedQuotes, setSavedQuotes] = useState<AIQuote[]>([]);
  const [generatingMessage, setGeneratingMessage] = useState("Weaving your story...");
  const [showSaved, setShowSaved] = useState(false);

  const messages = [
    "Consulting the muse...",
    "Finding the perfect words...",
    "Capturing the essence of your journey...",
    "Almost there...",
  ];

  const toggleSave = (quote: AIQuote) => {
    setSavedQuotes(prev => {
      const isSaved = prev.some(q => q.text === quote.text);
      if (isSaved) {
        return prev.filter(q => q.text !== quote.text);
      }
      return [...prev, quote];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.activity || !formData.place) return;

    setState("generating");
    const interval = setInterval(() => {
      setGeneratingMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 2000);

    try {
      const generatedQuotes = await generateQuotes(formData.name, formData.activity, formData.place);
      setQuotes(generatedQuotes);
      setCurrentIndex(0);
      setState("countdown");
    } finally {
      clearInterval(interval);
    }
  };

  const nextQuote = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex < quotes.length) {
        return nextIndex;
      } else {
        setState("home");
        setFormData({ name: "", activity: "", place: "" });
        return 0;
      }
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0A0A0C] font-sans antialiased text-slate-100 selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {state === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex h-dvh items-start justify-center overflow-y-auto overflow-x-hidden px-6 py-6 md:items-center md:overflow-hidden md:py-0 relative"
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="my-auto max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-10" /> {/* Spacer */}
                  <Avatar />
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSaved(true)}
                    className="p-3 bg-white/5 rounded-full border border-white/10 relative"
                  >
                    <Bookmark size={20} className="text-emerald-400" />
                    {savedQuotes.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-[#0A0A0C] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0C]">
                        {savedQuotes.length}
                      </span>
                    )}
                  </motion.button>
                </div>
                
                <div className="text-center space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500/60">
                    Moments Woven
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-white font-serif italic">
                    input your details to get your quote
                  </h1>
                  <p className="text-slate-400 text-sm font-medium tracking-wide">
                    Let AI weave 10 unique quotes into your countdown.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80 ml-1">
                      First Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John"
                        className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80 ml-1">
                      Favourite Activity
                    </label>
                    <div className="relative group">
                      <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                      <input
                        required
                        value={formData.activity}
                        onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                        placeholder="Painting, Coding, Hiking..."
                        className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80 ml-1">
                      Favourite Place
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                      <input
                        required
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                        placeholder="Beach, Mountains, Library..."
                        className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-600 text-slate-100"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#10b981] text-[#0A0A0C] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Generate Magic
                  </motion.button>
                </form>

                <footer className="page-footer" aria-label="Site credits">
                  <p>
                    <a href="https://icons8.com/" target="_blank" rel="noreferrer">Ai icon by Icons8</a>
                  </p>
                  <p>&copy; 2026 Moments Woven. All rights reserved.</p>
                </footer>
              </div>
            </div>
          </motion.div>
        )}

        {state === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0C] relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col items-center">
              <Avatar isThinking />
              <motion.div
                key={generatingMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-12 text-xs font-bold uppercase tracking-[0.4em] text-emerald-400 text-center px-4"
              >
                {generatingMessage}
              </motion.div>
              <div className="mt-4 flex gap-1">
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 bg-emerald-500 rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-emerald-500 rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-emerald-500 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        {state === "countdown" && quotes.length > 0 && (
          <QuoteView
            key={currentIndex}
            quote={quotes[currentIndex]}
            onNext={nextQuote}
            isLast={currentIndex === quotes.length - 1}
            onSave={() => toggleSave(quotes[currentIndex])}
            isSaved={savedQuotes.some(q => q.text === quotes[currentIndex].text)}
            onOpenSaved={() => setShowSaved(true)}
          />
        )}
      </AnimatePresence>

      {/* Saved Quotes Modal */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#121214] border border-white/10 w-full max-w-2xl rounded-4xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <div>
                  <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                    <Bookmark size={24} className="text-emerald-400" />
                    Archive of Reflections
                  </h2>
                  <p className="text-xs text-slate-500 font-mono tracking-widest mt-1 uppercase">Stored Wisdom Sequence</p>
                </div>
                <button 
                  onClick={() => setShowSaved(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {savedQuotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                    <Heart size={48} className="opacity-20 mb-4" />
                    <p className="text-sm italic font-serif">No echoes captured yet...</p>
                  </div>
                ) : (
                  savedQuotes.map((q, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className="group bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl p-6 transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-3">
                          <div className="inline-block px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 rounded text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                            {q.type}
                          </div>
                          <p className="text-slate-200 font-serif leading-relaxed italic text-lg">"{q.text}"</p>
                        </div>
                        <button 
                          onClick={() => toggleSave(q)}
                          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Remove from archive"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
