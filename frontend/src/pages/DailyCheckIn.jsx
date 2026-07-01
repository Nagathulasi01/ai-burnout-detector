import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DailyCheckIn() {
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [aiInsight, setAiInsight] = useState("");
  const [recentCheckins, setRecentCheckins] = useState([]);

  const loadRecentCheckins = async () => {
    const userEmail = localStorage.getItem("burnoutEmail") || "";

    const { data, error } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.log("Could not load recent check-ins:", error);
      return;
    }

    setRecentCheckins(data || []);
  };

  const handleSubmit = async () => {
    if (!mood) {
      alert("Please select your mood");
      return;
    }

    let insight = "You seem stable today. Keep maintaining your routine.";

    if (stress >= 8 && sleep <= 4) {
      insight =
        "High stress with poor sleep may increase burnout risk. Try a lighter schedule and sleep recovery tonight.";
    } else if (stress >= 7) {
      insight =
        "Your stress is high today. Take short breaks and avoid overloading yourself.";
    } else if (energy <= 3) {
      insight =
        "Your energy looks low. Prioritize rest, hydration, and simple tasks today.";
    } else if (sleep <= 4) {
      insight =
        "Low sleep quality may affect your mood and focus. Try reducing screen time before bed.";
    }

    const { data, error } = await supabase
      .from("daily_checkins")
      .insert([
        {
          user_name: localStorage.getItem("burnoutUser") || "Student",
          user_email: localStorage.getItem("burnoutEmail") || "",
          mood,
          stress_level: stress,
          energy_level: energy,
          sleep_quality: sleep,
          ai_insight: insight,
        },
      ])
      .select();

    console.log("Daily check-in saved:", data);
    console.log("Daily check-in error:", error);

    if (error) {
      alert("Could not save check-in. Check console.");
      return;
    }

    setAiInsight(insight);
    loadRecentCheckins();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-bold">Daily Check-In</h1>

        <p className="mb-8 text-slate-400">
          Track your wellness in under 30 seconds.
        </p>

        <div className="mb-6">
          <h2 className="mb-3 font-semibold">How are you feeling today?</h2>

          <div className="flex gap-3 text-3xl">
            {["😊", "😐", "😔", "😣", "😴"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setMood(emoji)}
                className={`rounded-2xl p-3 transition ${
                  mood === emoji
                    ? "scale-110 bg-cyan-500/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Slider label="Stress Level" value={stress} setValue={setStress} />
        <Slider label="Energy Level" value={energy} setValue={setEnergy} />
        <Slider label="Sleep Quality" value={sleep} setValue={setSleep} />

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 w-full rounded-2xl bg-cyan-500 py-4 font-bold transition hover:bg-cyan-400"
        >
          Save Check-In
        </button>

        {aiInsight && (
          <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <p className="mb-2 text-sm font-semibold text-cyan-300">
              AI Personalized Insight
            </p>

            <p className="text-sm leading-relaxed text-slate-200">
              {aiInsight}
            </p>
          </div>
        )}

        {recentCheckins.length > 0 && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-sm font-semibold text-slate-300">
              Recent Wellness Trend
            </p>

            <div className="space-y-3">
              {recentCheckins.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-900/60 p-4 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.mood}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>Stress: {item.stress_level}</div>
                    <div>Energy: {item.energy_level}</div>
                    <div>Sleep: {item.sleep_quality}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, setValue }) {
  return (
    <div className="mb-6">
      <label className="mb-2 block font-semibold">
        {label}: {value}
      </label>

      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}