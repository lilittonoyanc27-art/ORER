import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  FastForward, 
  Rewind, 
  MapPin,
  CheckCircle2, 
  XCircle, 
  Trophy,
  RotateCcw,
  Star,
  Sparkles,
  Zap,
  Timer,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeWord {
  id: string;
  spanish: string;
  armenian: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  offset: number; 
}

const TIME_WORDS: TimeWord[] = [
  { id: 'anteayer', spanish: 'Anteayer', armenian: 'Երեկ չէ առաջին օրը', icon: <Rewind className="w-6 h-6" />, color: 'bg-indigo-900', hoverColor: 'hover:bg-indigo-800', offset: -2 },
  { id: 'ayer', spanish: 'Ayer', armenian: 'Երեկ', icon: <ArrowLeft className="w-6 h-6" />, color: 'bg-orange-600', hoverColor: 'hover:bg-orange-500', offset: -1 },
  { id: 'hoy', spanish: 'Hoy', armenian: 'Այսօր', icon: <MapPin className="w-6 h-6" />, color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-300', offset: 0 },
  { id: 'manana', spanish: 'Mañana', armenian: 'Վաղը', icon: <ArrowRight className="w-6 h-6" />, color: 'bg-pink-500', hoverColor: 'hover:bg-pink-400', offset: 1 },
  { id: 'pasado_manana', spanish: 'Pasado mañana', armenian: 'Վաղը չէ մյուս օրը', icon: <FastForward className="w-6 h-6" />, color: 'bg-sky-400', hoverColor: 'hover:bg-sky-300', offset: 2 },
];

interface Level {
  question: string;
  correctId: string;
  type: 'translation' | 'logic';
}

const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  
  // Translation levels
  TIME_WORDS.forEach(word => {
    levels.push({
      question: `Գտիր «${word.armenian}» բառի իսպաներեն տարբերակը:`,
      correctId: word.id,
      type: 'translation'
    });
  });

  // Logic levels
  levels.push({ question: "Ի՞նչ օր է այսօր:", correctId: 'hoy', type: 'logic' });
  levels.push({ question: "Ի՞նչ օր էր երեկ:", correctId: 'ayer', type: 'logic' });
  levels.push({ question: "Ի՞նչ օր կլինի վաղը:", correctId: 'manana', type: 'logic' });
  levels.push({ question: "Ի՞նչ օր էր երեկ չէ առաջին օրը:", correctId: 'anteayer', type: 'logic' });
  levels.push({ question: "Ի՞նչ օր կլինի վաղը չէ մյուս օրը:", correctId: 'pasado_manana', type: 'logic' });
  
  // Relative logic
  levels.push({ question: "Ayer-ից առաջ ո՞ր օրն էր:", correctId: 'anteayer', type: 'logic' });
  levels.push({ question: "Mañana-ից հետո ո՞ր օրն է:", correctId: 'pasado_manana', type: 'logic' });
  levels.push({ question: "Hoy-ից 2 օր առաջ ո՞ր օրն էր:", correctId: 'anteayer', type: 'logic' });
  levels.push({ question: "Hoy-ից 2 օր հետո ո՞ր օրն է:", correctId: 'pasado_manana', type: 'logic' });
  levels.push({ question: "Ayer-ից հետո ո՞ր օրն է:", correctId: 'hoy', type: 'logic' });
  levels.push({ question: "Mañana-ից առաջ ո՞ր օրն էր:", correctId: 'hoy', type: 'logic' });
  levels.push({ question: "Anteayer-ից 2 օր հետո ո՞ր օրն է:", correctId: 'hoy', type: 'logic' });
  levels.push({ question: "Pasado mañana-ից 2 օր առաջ ո՞ր օրն էր:", correctId: 'hoy', type: 'logic' });
  levels.push({ question: "Ayer-ից 2 օր հետո ո՞ր օրն է:", correctId: 'manana', type: 'logic' });

  return levels.sort(() => Math.random() - 0.5).slice(0, 20);
};

export default function TimeJumpGameApp() {
  const [view, setView] = useState<'intro' | 'game' | 'result'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levels, setLevels] = useState<Level[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const startGame = useCallback(() => {
    setLevels(generateLevels());
    setCurrentLevel(0);
    setScore(0);
    setTimeLeft(10);
    setView('game');
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === 'game' && timeLeft > 0 && !feedback) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && view === 'game' && !feedback) {
      setFeedback('wrong');
      setTimeout(() => {
        nextLevel();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft, feedback]);

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setFeedback(null);
      setSelectedId(null);
      setTimeLeft(10);
    } else {
      setView('result');
    }
  };

  const handleJump = (id: string) => {
    if (feedback) return;
    setSelectedId(id);
    
    if (id === levels[currentLevel].correctId) {
      setFeedback('correct');
      setScore(s => s + timeLeft * 10);
      setTimeout(() => {
        nextLevel();
      }, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelectedId(null);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">TIME JUMP</h1>
        </div>
        
        {view === 'game' && (
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="font-black tabular-nums">{score}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase opacity-60">LEVEL</span>
              <span className="font-black">{currentLevel + 1}/20</span>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-block p-6 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl"
                >
                  <Clock className="w-16 h-16 text-white" />
                </motion.div>
                <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none drop-shadow-2xl">ԺԱՄԱՆԱԿԻ <br/>ԹՌԻՉՔ</h2>
                <p className="text-white/80 font-bold uppercase text-sm tracking-[0.3em]">ՍՈՎՈՐԻՐ ԻՍՊԱՆԵՐԵՆ ՕՐԵՐԸ</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {TIME_WORDS.map(w => (
                  <div key={w.id} className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">
                    {w.spanish}
                  </div>
                ))}
              </div>

              <button 
                onClick={startGame}
                className="group relative px-12 py-6 bg-white text-indigo-600 rounded-[32px] font-black uppercase tracking-widest text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ՍԿՍԵԼ ԹՌԻՉՔԸ <MousePointer2 className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </motion.div>
          )}

          {view === 'game' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-12"
            >
              {/* Question Area */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-300 animate-pulse' : 'text-white'}`} />
                  <span className={`font-black text-2xl tabular-nums ${timeLeft <= 5 ? 'text-red-300' : 'text-white'}`}>
                    0:{timeLeft < 10 ? '0' : ''}{timeLeft}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-center leading-tight drop-shadow-lg max-w-3xl mx-auto">
                  {levels[currentLevel].question}
                </h2>
              </div>

              {/* Timeline Slider */}
              <div className="relative w-full py-12">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2 hidden md:block" />
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {TIME_WORDS.map((word) => (
                    <motion.button
                      key={word.id}
                      whileHover={{ y: -10, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJump(word.id)}
                      className={`
                        relative p-6 rounded-[32px] border-4 transition-all flex flex-col items-center gap-4 shadow-2xl
                        ${selectedId === word.id 
                          ? (feedback === 'correct' ? 'bg-green-500 border-white scale-110 z-20' : 'bg-red-500 border-white animate-shake') 
                          : `${word.color} ${word.hoverColor} border-white/20`}
                      `}
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        {word.icon}
                      </div>
                      <div className="text-center">
                        <span className="block text-lg font-black uppercase italic leading-none">{word.spanish}</span>
                      </div>
                      
                      {feedback === 'correct' && selectedId === word.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feedback Message */}
              <div className="h-8 flex justify-center">
                <AnimatePresence>
                  {feedback === 'wrong' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-200 font-black uppercase tracking-widest text-sm"
                    >
                      ՍԽԱԼ Է, ՓՈՐՁԻՐ ՆՈՐԻՑ:
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-[48px] flex items-center justify-center mx-auto border border-white/30 shadow-2xl">
                <Trophy className="w-16 h-16 text-yellow-300" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-6xl font-black uppercase italic tracking-tighter leading-none">ՀԱՂԹԱՆԱԿ</h3>
                <p className="text-white/80 font-bold text-xl uppercase tracking-widest">ԴՈՒ ԺԱՄԱՆԱԿԻ ՎԱՐՊԵՏ ԵՍ</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20 inline-block px-12">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">ՄԻԱՎՈՐՆԵՐ</p>
                <p className="text-7xl font-black italic text-yellow-300">{score}</p>
              </div>

              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={startGame}
                className="px-12 py-6 bg-white text-indigo-600 rounded-[32px] font-black uppercase tracking-widest text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
              >
                <RotateCcw className="w-6 h-6" /> ԿՐԿՆԵԼ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
