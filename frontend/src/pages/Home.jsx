import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [userName] = useState(() => localStorage.getItem("burnoutUser") || "");
  const [showMenu, setShowMenu] = useState(false);
  
  const [assessmentCount] = useState(() => {
    const data = JSON.parse(localStorage.getItem("burnoutAssessments") || "[]");
    return data.length;
  });
  
  const [lastScore] = useState(() => {
    const data = JSON.parse(localStorage.getItem("burnoutAssessments") || "[]");
    return data.length > 0 ? data[data.length - 1].score : null;
  });

  const tips = [
    "🌟 Early awareness is the first step to recovery. Notice your stress patterns today.",
    "💪 Self-care isn't selfish—it's essential. Take breaks when you need them.",
    "🧠 Your mental health matters. Seek support when burnout feels overwhelming.",
    "📊 Track your progress. Small improvements compound into big changes.",
    "🎯 Set boundaries. Saying no protects your energy and well-being.",
    "🌱 Recovery takes time. Be patient and compassionate with yourself.",
  ];

  const [currentTip, setCurrentTip] = useState(tips[0]);

  useEffect(() => {
    const user = localStorage.getItem("burnoutUser");
    if (!user) {
      navigate("/");
      return;
    }

    const tipIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[tipIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("burnoutUser");
    navigate("/");
  };

  const getScoreLevel = (score) => {
    if (score <= 20) return { level: "Low", color: "text-green-400", bg: "bg-green-500/20" };
    if (score <= 40) return { level: "Moderate", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (score <= 60) return { level: "High", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    if (score <= 80) return { level: "Very High", color: "text-orange-400", bg: "bg-orange-500/20" };
    return { level: "Critical", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const scoreLevel = lastScore !== null ? getScoreLevel(lastScore) : {
  level: "No assessment yet",
  color: "text-slate-400",
  bg: "bg-slate-500/20",
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      {/* Animated Background */}
      <div className="absolute left-10 top-20 h-44 w-44 animate-pulse rounded-full bg-blue-400/20 blur-3xl"></div>
      <div className="absolute bottom-16 right-10 h-60 w-60 animate-pulse rounded-full bg-purple-400/20 blur-3xl"></div>
      <div className="absolute right-1/3 top-10 h-32 w-32 animate-bounce rounded-full bg-cyan-300/10 blur-2xl"></div>

      {/* Navigation Bar */}
      <nav className="relative border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h1 className="text-xl font-bold text-white">BurnoutAI</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-white/20 md:block"
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => navigate("/reminders")}
              className="hidden rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-white/20 md:flex md:items-center md:gap-2"
              title="Manage reminders and notifications"
            >
              <Bell className="h-4 w-4" />
              <span>Reminders</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 transition hover:bg-white/20"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{userName.split(" ")[0]}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/20 bg-slate-900/95 backdrop-blur-md shadow-lg">
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setShowMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-white/10 md:hidden"
                  >
                    📊 View Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate("/reminders");
                      setShowMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-white/10 md:hidden flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Reminders
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                    className="block w-full border-t border-white/10 px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Hero Welcome Section */}
          <div className="mb-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl md:p-12">
            <p className="mb-2 text-sm font-semibold text-blue-200">Welcome back,</p>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Hey {userName.split(" ")[0]} 👋
            </h2>
            <p className="text-lg text-blue-100">
              Let's check in on your mental health and well-being today.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Main CTA & Status */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Assessment CTA */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 p-8 backdrop-blur-xl transition hover:border-white/20 md:p-12">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl group-hover:blur-2xl transition"></div>

                <div className="relative z-10">
                  <p className="mb-2 text-sm font-semibold text-blue-200">Ready to assess?</p>
                  <h3 className="mb-4 text-3xl font-bold text-white">Take Your Burnout Assessment</h3>
                  <p className="mb-8 text-blue-100">
                    Get personalized insights into your stress levels, identify burnout patterns, and receive actionable recovery steps.
                  </p>

                  <button
                    onClick={() => navigate("/assessment")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-indigo-950 transition hover:scale-105 active:scale-95"
                  >
                    Start Assessment →
                  </button>
                </div>
              </div>

              {/* Current Status Card */}
              {lastScore !== null && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <p className="mb-4 text-sm font-semibold text-blue-200">Your Latest Assessment</p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-blue-200">Burnout Score</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-white">{lastScore}</span>
                        <span className={`text-lg font-semibold ${scoreLevel.color}`}>
                          {scoreLevel.level}
                        </span>
                      </div>
                    </div>

                    <div className={`h-40 w-40 rounded-full ${scoreLevel.bg} flex items-center justify-center border-4 border-white/20`}>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white">{lastScore}%</div>
                        <div className={`text-xs ${scoreLevel.color} font-semibold`}>
                          {scoreLevel.level}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 w-full rounded-lg border border-white/20 bg-white/10 py-3 font-semibold text-blue-200 transition hover:bg-white/20"
                  >
                    View Full Analysis
                  </button>
                </div>
              )}

              {/* Motivational Tips Section */}
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-white/5 to-white/5 p-8 backdrop-blur-xl">
                <p className="mb-4 text-sm font-semibold text-amber-200">Daily Tip</p>
                <p className="text-lg text-blue-100">{currentTip}</p>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Assessments Completed */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-blue-200">Assessments Completed</p>
                  <span className="text-2xl">📋</span>
                </div>
                <div className="text-4xl font-bold text-white">{assessmentCount}</div>
                <p className="mt-2 text-xs text-blue-200">
                  {assessmentCount === 0
                    ? "Start your first assessment today!"
                    : `Last check-in was recently`}
                </p>
              </div>

              {/* Quick Access Cards */}
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-200">View Progress</p>
                    <p className="mt-1 text-sm text-blue-100">See your improvement</p>
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
              </button>

              <button
  onClick={() => navigate("/reminders")}
  className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 text-left"
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-blue-200">
        Manage Reminders
      </p>

      <p className="mt-1 text-sm text-blue-100">
        Setup wellness alerts
      </p>
    </div>

    <span className="text-2xl">🔔</span>
  </div>
</button>

<button
  onClick={() => navigate("/daily-checkin")}
  className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-6 backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-cyan-500/20 text-left"
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-cyan-200">
        Daily Check-In
      </p>

      <p className="mt-1 text-sm text-cyan-100">
        Track today's wellness in 30 seconds
      </p>
    </div>

    <span className="text-2xl">💙</span>
  </div>
</button>

              {/* Tips Rotation */}
              <div className="rounded-2xl border border-white/10 bg-green-500/10 p-6 backdrop-blur-xl">
                <p className="mb-2 text-sm font-semibold text-green-200">Pro Tip</p>
                <p className="text-sm text-green-100">
                  Take regular assessments to track your burnout patterns and recovery progress over time.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs text-blue-200">
                  ℹ️ This app is for awareness and academic use only. It is not a clinical diagnosis tool.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA for Mobile */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl md:hidden">
            <button
              onClick={() => navigate("/assessment")}
              className="w-full rounded-xl bg-white py-3 font-bold text-indigo-950 transition hover:scale-105"
            >
              Take Assessment Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;