import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Trophy,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  sentence: string;
  translation: string;
  correctAnswer: 'Mañana' | 'La mañana';
  explanation: string;
}

const QUESTIONS: Question[] = [
  { sentence: "____ voy a la escuela.", translation: "Վաղը ես դպրոց եմ գնալու:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Me levanto temprano por ____.", translation: "Ես շուտ եմ արթնանում առավոտյան:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "¿Vienes a mi casa ____?", translation: "Վաղը գալիս ես իմ տո՞ւն:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "El examen es ____.", translation: "Քննությունը վաղն է:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Bebo leche en ____.", translation: "Առավոտյան ես կաթ եմ խմում:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "____ es un día festivo.", translation: "Վաղը տոնական օր է:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Tengo clase de piano ____.", translation: "Վաղը դաշնամուրի դաս ունեմ:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Me gusta el aire de ____.", translation: "Ինձ դուր է գալիս առավոտվա օդը:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "____ por ____ iré al cine.", translation: "Վաղը առավոտյան ես կինո եմ գնալու:", correctAnswer: 'Mañana', explanation: "Mañana (Վաղը) por la mañana (առավոտյան)" },
  { sentence: "Hasta ____.", translation: "Մինչ վաղը:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Siempre leo el periódico por ____.", translation: "Ես միշտ թերթ եմ կարդում առավոտյան:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "____ compraré pan.", translation: "Վաղը ես հաց կգնեմ:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Son las diez de ____.", translation: "Առավոտյան ժամը տասն է:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "____ no trabajo.", translation: "Վաղը ես չեմ աշխատում:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "El sol brilla en ____.", translation: "Արևը փայլում է առավոտյան:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "¿Qué planes tienes para ____?", translation: "Ի՞նչ պլաններ ունես վաղվա համար:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Hago yoga por ____.", translation: "Առավոտյան ես յոգայով եմ զբաղվում:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "____ jugaremos al fútbol.", translation: "Վաղը մենք ֆուտբոլ կխաղանք:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
  { sentence: "Ella limpia la casa en ____.", translation: "Նա տունը մաքրում է առավոտյան:", correctAnswer: 'La mañana', explanation: "La mañana - Առավոտը" },
  { sentence: "____ será divertido.", translation: "Վաղը զվարճալի կլինի:", correctAnswer: 'Mañana', explanation: "Mañana - Վաղը" },
];

export default function MananaGameApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const reset = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-sky-100 px-6 py-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg -rotate-3">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-sky-600 leading-none">MAÑANA vs LA MAÑANA</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">ՎԱՂԸ թե՞ ԱՌԱՎՈՏԸ</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Progress */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">ՀԱՐՑ {currentIndex + 1} / {QUESTIONS.length}</span>
                <div className="flex gap-1 overflow-hidden max-w-[200px] md:max-w-none">
                  {QUESTIONS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-1.5 rounded-full transition-all shrink-0 ${i === currentIndex ? 'bg-sky-500 w-6' : i < currentIndex ? 'bg-sky-200' : 'bg-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white p-10 md:p-16 rounded-[48px] border-4 border-sky-100 shadow-xl text-center space-y-8 relative">
                <div className="absolute top-6 right-6">
                  <HelpCircle className="w-6 h-6 text-sky-100" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-tight">
                    {currentQuestion.sentence.split('____').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className={`inline-block min-w-[120px] border-b-4 mx-2 ${selectedAnswer ? (selectedAnswer === currentQuestion.correctAnswer ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500') : 'text-sky-300 border-sky-200'}`}>
                            {selectedAnswer || '...'}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p className="text-xl text-slate-400 font-medium italic">«{currentQuestion.translation}»</p>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Mañana', 'La mañana'].map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  
                  let btnClass = "bg-white border-2 border-slate-100 text-slate-700 hover:border-sky-300 hover:bg-sky-50";
                  if (selectedAnswer) {
                    if (isCorrect) btnClass = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200";
                    else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200";
                    else btnClass = "bg-white border-slate-100 text-slate-300 opacity-50";
                  }

                  return (
                    <button
                      key={option}
                      disabled={!!selectedAnswer}
                      onClick={() => handleAnswer(option)}
                      className={`p-8 rounded-3xl text-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${btnClass}`}
                    >
                      {option}
                      {selectedAnswer && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                      {selectedAnswer && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (only shown after answer) */}
              <AnimatePresence>
                {selectedAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-6 rounded-3xl border-2 text-center font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}
                  >
                    {currentQuestion.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[56px] border-4 border-sky-100 shadow-2xl text-center space-y-8"
            >
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-sky-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">ԳԵՐԱԶԱՆՑ Է</h3>
                <p className="text-slate-500 font-medium text-lg">Դուք ճիշտ պատասխանեցիք {score}-ին {QUESTIONS.length}-ից:</p>
              </div>
              
              <div className="text-7xl font-black text-sky-600 italic">
                {Math.round((score / QUESTIONS.length) * 100)}%
              </div>

              <button 
                onClick={reset}
                className="w-full bg-sky-600 text-white p-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-sky-700 transition-colors"
              >
                <RotateCcw className="w-6 h-6" /> ԿՐԿՆԵԼ ԽԱՂԸ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 pointer-events-none opacity-20">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
            ԳՈՌ ԵՎ ԳԱՅԱՆԵ <ArrowRight className="w-3 h-3" /> MAÑANA GAME
          </div>
        </div>
      </footer>
    </div>
  );
}
