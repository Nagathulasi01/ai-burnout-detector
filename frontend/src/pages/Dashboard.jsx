import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus } from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import ProgressGraph from "../components/ProgressGraph";
import InsightCard from "../components/InsightCard";

function Dashboard() {
  const navigate = useNavigate();
  const [userName] = useState(() => localStorage.getItem("burnoutUser") || "");
  const [assessments] = useState(() => JSON.parse(localStorage.getItem("burnoutAssessments") || "[]"));

  useEffect(() => {
    const user = localStorage.getItem("burnoutUser");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const scoreLevel = (score) => {
    if (score <= 20) return { label: "Low", color: "text-emerald-400", badge: "bg-emerald-500/20" };
    if (score <= 40) return { label: "Moderate", color: "text-blue-400", badge: "bg-blue-500/20" };
    if (score <= 60) return { label: "High", color: "text-yellow-400", badge: "bg-yellow-500/20" };
    if (score <= 80) return { label: "Very High", color: "text-orange-400", badge: "bg-orange-500/20" };
    return { label: "Critical", color: "text-red-400", badge: "bg-red-500/20" };
  };

  const metrics = {
    total: assessments.length,
    average: assessments.length
      ? Math.round(assessments.reduce((sum, assessment) => sum + assessment.score, 0) / assessments.length)
      : 0,
    latest: assessments.length ? assessments[assessments.length - 1] : null,
  };

  const latestLevel = metrics.latest ? scoreLevel(metrics.latest.score) : null;

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Burnout AI</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition"
            >
              Overview
            </button>
            <button
              onClick={() => navigate("/assessment")}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 border border-white/10"
            >
              <Plus className="h-4 w-4" />
              New Assessment
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-cyan-400 mb-2">Command Center</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Welcome back, {userName.split(" ")[0]}</h2>
          <p className="mt-2 text-slate-400">
            Monitor your wellbeing trends and AI-driven recovery insights.
          </p>
        </div>

        {/* Modular Stats */}
        <div className="mb-8">
          <DashboardStats metrics={metrics} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Main Left Column */}
          <div className="space-y-8">
            <ProgressGraph assessments={assessments} />

            {/* History Table */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
              <h3 className="mb-6 text-lg font-semibold text-white">Assessment History</h3>
              {assessments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-white/10 rounded-2xl">
                  No assessments yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-xs uppercase text-slate-300">
                      <tr>
                        <th className="rounded-tl-lg px-4 py-3">Date</th>
                        <th className="px-4 py-3">Risk Level</th>
                        <th className="rounded-tr-lg px-4 py-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.slice().reverse().map((a, i) => {
                        const level = scoreLevel(a.score);
                        return (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              {new Date(a.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border border-white/5 ${level.badge} ${level.color}`}>
                                {level.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right font-medium text-white">
                              {a.score}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            <InsightCard score={metrics.latest?.score} level={latestLevel?.label || "Unknown"} />
            
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-emerald-400 mb-4">Recommended Actions</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs shrink-0 mt-0.5">1</span>
                  Schedule regular 5-minute mental disconnects.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs shrink-0 mt-0.5">2</span>
                  Maintain consistent sleep boundaries.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs shrink-0 mt-0.5">3</span>
                  Hydrate and limit caffeine past 2 PM.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;