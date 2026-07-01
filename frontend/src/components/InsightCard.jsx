/* eslint-disable */
import { Brain, ShieldCheck, Activity, Target } from "lucide-react";

export default function InsightCard({ score, level }) {
  // Mock Explainable AI logic
  const confidenceScore = score ? Math.min(98, score + 20) : 0;
  
  const getFactors = (scoreLevel) => {
    switch (scoreLevel) {
      case "Critical":
        return ["Prolonged high stress", "Lack of restorative sleep", "Emotional exhaustion"];
      case "Very High":
        return ["High work volume", "Decreased motivation", "Inconsistent sleep"];
      case "High":
        return ["Rising task pressure", "Occasional detachment", "Physical tension"];
      case "Moderate":
        return ["Intermittent stress", "Mild fatigue", "Manageable workload"];
      default:
        return ["Healthy boundaries", "Adequate rest", "Stable emotional state"];
    }
  };

  const factors = getFactors(level);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute -right-10 -top-10 opacity-5">
        <Brain className="h-48 w-48" />
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg shadow-blue-500/20">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Burnout Insight Engine</h3>
            <p className="text-sm text-cyan-300">Explainable AI Analysis</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 shadow-inner shadow-white/5">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Activity className="h-4 w-4 text-cyan-400" />
              Why this result?
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Based on your recent assessment patterns, your risk profile is classified as <strong className="text-white">{level}</strong>. This indicates a strong correlation between your daily stress factors and emotional reserves.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 shadow-inner shadow-white/5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Target className="h-4 w-4 text-purple-400" />
              Top Contributing Factors
            </h4>
            <ul className="space-y-3">
              {factors.map((factor, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></div>
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/50 p-4 shadow-inner shadow-white/5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              AI Confidence Score
            </div>
            <div className="font-bold text-white">{confidenceScore}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
