import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ReminderSettings from "../components/ReminderSettings";

export default function Reminders() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("burnoutUser");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white font-sans selection:bg-cyan-500/30 pb-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Header */}
        <header className="mb-10 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10"
          >
            <ChevronLeft className="h-5 w-5 text-slate-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Reminders & Notifications</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your wellness reminders</p>
          </div>
        </header>

        {/* Settings Container */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <ReminderSettings />
        </div>
      </div>
    </div>
  );
}
