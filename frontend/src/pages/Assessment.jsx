import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Zap, HeartPulse, Activity, ChevronRight, Timer, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import AssessmentCard from "../components/AssessmentCard";

// Using the updated categories as per user request: Emotional Exhaustion, Motivation, Detachment, Physical Stress, Lifestyle
const questions = [
  { id: 1, text: "I feel emotionally drained at the end of most days.", category: "Emotional Exhaustion", icon: HeartPulse },
  { id: 2, text: "I wake up feeling tired even after sleeping.", category: "Lifestyle", icon: Moon },
  { id: 3, text: "I feel overwhelmed by small responsibilities.", category: "Emotional Exhaustion", icon: Activity },
  { id: 4, text: "I find it difficult to relax even when I am free.", category: "Physical Stress", icon: Activity },
  { id: 5, text: "I have trouble sleeping because of stress or overthinking.", category: "Lifestyle", icon: Moon },
  { id: 6, text: "I feel less motivated to start or complete tasks.", category: "Motivation", icon: Zap },
  { id: 7, text: "I feel mentally exhausted even before the day ends.", category: "Emotional Exhaustion", icon: HeartPulse },
  { id: 8, text: "I feel disconnected from my studies, work, or daily routine.", category: "Detachment", icon: Zap },
  { id: 9, text: "I have become less interested in things I usually care about.", category: "Detachment", icon: Zap },
  { id: 10, text: "I notice more headaches, body tension, or physical discomfort than usual.", category: "Physical Stress", icon: Activity },
  { id: 11, text: "I depend more on breaks, scrolling, or distractions to escape stress.", category: "Motivation", icon: Zap },
  { id: 12, text: "I feel pressure from deadlines, expectations, or performance.", category: "Physical Stress", icon: Activity },
  { id: 13, text: "I feel my productivity is decreasing even when I try hard.", category: "Motivation", icon: Zap },
  { id: 14, text: "I feel emotionally sensitive, irritated, or easily frustrated.", category: "Emotional Exhaustion", icon: HeartPulse },
  { id: 15, text: "I feel I need support but find it hard to ask for help.", category: "Detachment", icon: HeartPulse },
];

const scoreLevel = (percent) => {
  if (percent <= 20) return { label: "Low", description: "You're managing stress well right now.", color: "text-emerald-300", glow: "shadow-emerald-500/50" };
  if (percent <= 40) return { label: "Moderate", description: "You have some stress signals. Keep checking in.", color: "text-sky-300", glow: "shadow-sky-500/50" };
  if (percent <= 60) return { label: "High", description: "Burnout risk is rising. Take time to reset.", color: "text-yellow-300", glow: "shadow-yellow-500/50" };
  if (percent <= 80) return { label: "Very High", description: "Your stress is significant. Focus on recovery steps.", color: "text-orange-300", glow: "shadow-orange-500/50" };
  return { label: "Critical", description: "High burnout risk. Please take meaningful action now.", color: "text-red-400", glow: "shadow-red-500/50" };
};

export default function Assessment() {
  const navigate = useNavigate();
  const [userName] = useState(() => localStorage.getItem("burnoutUser") || "");
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("burnoutUser");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);
  
  const handleAnswer = (value) => {
    const currentQuestion = questions[currentIdx];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: Number(value) }));
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 400);
  };

  const saveAssessment = (newAssessment) => {
    const stored = JSON.parse(localStorage.getItem("burnoutAssessments") || "[]");
    localStorage.setItem("burnoutAssessments", JSON.stringify([...stored, newAssessment]));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) return;
    const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const percent = Math.round((total / (questions.length * 4)) * 100);
    const summary = scoreLevel(percent);
    const assessmentData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      score: percent,
      level: summary.label,
      answers,
    };
    saveAssessment(assessmentData);

const { data, error } = await supabase
  .from("assessment_history")
  .insert([
    {
      user_name: userName || "Student",
      user_email: localStorage.getItem("burnoutEmail") || "",
      burnout_level: summary.label,
      burnout_score: percent,
      confidence_percentage: "85%",
      top_factors: ["Stress", "Emotional Exhaustion"],
      reasons: ["High emotional exhaustion detected"],
      solutions: ["Take proper breaks"],
    },
  ])
  .select();

console.log("Supabase insert data:", data);
console.log(
  "Supabase insert error:",
  error?.message,
  error?.details,
  error?.hint,
  error?.code
);

setResult({ percent, ...summary });
setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white font-sans selection:bg-cyan-500/30 pb-20 md:pb-8">
      {/* Background gradients and particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-10%] top-[-10%] h-[50vh] w-[50vw] rounded-full bg-blue-600/10 blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute right-[-10%] bottom-[-10%] h-[50vh] w-[50vw] rounded-full bg-purple-600/10 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Top Header */}
        <header className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10">
              <ChevronLeft className="h-5 w-5 text-slate-300" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Assessment</h1>
              <p className="text-sm text-slate-400">Psychological Wellness Check</p>
            </div>
          </div>
          
          {!submitted && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Timer className="h-4 w-4" />
                  ~3 mins
                </span>
                <span className="text-sm font-semibold text-cyan-400">{progress}% Completed</span>
              </div>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-white/5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Assessment Area */}
        <div className="relative flex min-h-[400px] flex-col justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          {submitted && result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center py-10"
            >
              <div className={`mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-900/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${result.glow}`}>
                <span className="text-5xl font-bold">{result.percent}%</span>
              </div>
              <h2 className={`mb-2 text-3xl font-bold ${result.color}`}>{result.label} Risk</h2>
              <p className="mb-8 text-lg text-slate-300 max-w-md">{result.description}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40"
              >
                View Detailed Analysis
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          ) : (
            <AssessmentCard 
              currentIdx={currentIdx}
              questions={questions}
              answers={answers}
              handleAnswer={handleAnswer}
              setCurrentIdx={setCurrentIdx}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
