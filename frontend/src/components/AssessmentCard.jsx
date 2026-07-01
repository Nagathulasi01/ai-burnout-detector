/* eslint-disable */
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft, AlertCircle } from "lucide-react";

export default function AssessmentCard({ 
  currentIdx, 
  questions, 
  answers, 
  handleAnswer, 
  setCurrentIdx, 
  handleSubmit 
}) {
  const currentQuestion = questions[currentIdx];
  const answerOptions = [
    { value: 0, label: "Never", emoji: "🧘" },
    { value: 1, label: "Rarely", emoji: "🌱" },
    { value: 2, label: "Sometimes", emoji: "⚖️" },
    { value: 3, label: "Often", emoji: "🌧️" },
    { value: 4, label: "Always", emoji: "🌪️" },
  ];

  // Find missing questions (unanswered questions)
  const missingQuestions = questions.filter(q => answers[q.id] === undefined);
  const totalAnswered = Object.keys(answers).length;
  const isAllAnswered = totalAnswered === questions.length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex w-full flex-col"
      >
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-300">
            {currentQuestion.id}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
            <currentQuestion.icon className="h-3 w-3 text-cyan-400" />
            {currentQuestion.category}
          </span>
        </div>

        <h2 className="mb-10 text-2xl sm:text-3xl font-medium leading-relaxed text-white">
          {currentQuestion.text}
        </h2>

        <div className="grid gap-3 sm:grid-cols-5">
          {answerOptions.map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-300
                  ${isSelected 
                    ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  {opt.emoji}
                </span>
                <span className={`text-sm font-medium ${isSelected ? "text-cyan-400" : "text-slate-400"}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-2xl border border-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:opacity-50 disabled:hover:text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            {currentIdx === questions.length - 1 ? (
              isAllAnswered ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-105"
                >
                  Complete Assessment
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/30 px-3 py-2 text-sm font-medium text-orange-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {missingQuestions.length} question{missingQuestions.length > 1 ? 's' : ''} missing
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                Select an answer to continue
              </div>
            )}
          </div>

          {/* Show missing questions when on final question and not all answered */}
          {currentIdx === questions.length - 1 && !isAllAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4"
            >
              <p className="text-sm font-semibold text-orange-300 mb-3">Questions to answer:</p>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {missingQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(q.id - 1)}
                    className="text-left px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition text-sm text-orange-200 truncate"
                  >
                    Question {q.id}: {q.text.substring(0, 40)}...
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
