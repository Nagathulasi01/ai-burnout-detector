/* eslint-disable */
import { Flame, Brain, ShieldCheck, BatteryCharging } from "lucide-react";

export default function DashboardStats({ metrics }) {
  // Extract or simulate these based on total metrics.average
  const avg = metrics.average || 0;
  
  const stats = [
    {
      title: "Burnout Risk",
      value: `${avg}%`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/20",
      border: "border-orange-500/20"
    },
    {
      title: "Emotional Exhaustion",
      value: avg > 50 ? "High" : "Low",
      icon: Brain,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
      border: "border-purple-500/20"
    },
    {
      title: "Stress Stability",
      value: avg > 60 ? "Volatile" : "Stable",
      icon: ShieldCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      border: "border-blue-500/20"
    },
    {
      title: "Recovery Readiness",
      value: avg > 70 ? "Critical" : "Optimal",
      icon: BatteryCharging,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/20"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div key={idx} className={`rounded-3xl border border-white/5 bg-slate-950/40 p-6 backdrop-blur-md transition-all hover:border-white/20`}>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/5 backdrop-blur-xl shadow-inner shadow-white/10">
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <p className="text-sm font-medium text-slate-400">{stat.title}</p>
          <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
