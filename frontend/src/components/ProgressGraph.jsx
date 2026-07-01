/* eslint-disable */
import { motion } from "framer-motion";

export default function ProgressGraph({ assessments }) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-slate-400">
        No assessment data yet to show trends.
      </div>
    );
  }

  // Take the last 7 assessments for the graph
  const recentData = assessments.slice(-7);
  const maxScore = 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Burnout Trend</h3>
        <p className="text-sm text-slate-400">Your score trajectory over recent checks</p>
      </div>

      <div className="relative h-48 w-full flex items-end gap-2 sm:gap-6 justify-between pt-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 font-medium pb-8 w-8">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Graph bars */}
        <div className="flex flex-1 items-end justify-between ml-10 h-full pb-8 relative border-b border-white/10">
          {recentData.map((assessment, idx) => {
            const heightPercent = (assessment.score / maxScore) * 100;
            // Determine color based on score
            let color = "from-emerald-400 to-emerald-600";
            if (assessment.score > 30) color = "from-sky-400 to-blue-600";
            if (assessment.score > 60) color = "from-yellow-400 to-orange-500";
            if (assessment.score > 80) color = "from-red-400 to-rose-600";

            return (
              <div key={assessment.id} className="group relative flex flex-col items-center w-full max-w-[40px]">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 pointer-events-none">
                  {assessment.score}%
                </div>
                
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                  className={`w-full max-w-[32px] rounded-t-lg bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-all`}
                />
                
                {/* Label */}
                <span className="absolute -bottom-6 text-[10px] text-slate-500 font-medium whitespace-nowrap">
                  {new Date(assessment.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
