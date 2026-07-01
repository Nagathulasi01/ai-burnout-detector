import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, Moon, CheckCircle2, AlertCircle } from "lucide-react";
import {
  getReminderSettings,
  saveReminderSettings,
  initializeNotifications,
} from "../utils/notificationService";

export default function ReminderSettings() {
  const [reminders, setReminders] = useState(null);
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = "Notification" in window;
    setNotificationSupported(supported);

    if (supported) {
      setNotificationGranted(window.Notification.permission === "granted");
    }

    // Load reminders
    const stored = getReminderSettings();
    setReminders(stored);
  }, []);

  const handleReminderToggle = (key) => {
    setReminders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
    setSaved(false);
  };

  const handleTimeChange = (key, newTime) => {
    setReminders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        time: newTime,
      },
    }));
    setSaved(false);
  };

  const handleIntervalChange = (key, newInterval) => {
    setReminders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        interval: parseInt(newInterval),
      },
    }));
    setSaved(false);
  };

  const handleDayChange = (key, newDay) => {
    setReminders((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        day: newDay,
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    if (reminders) {
      saveReminderSettings(reminders);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleEnableNotifications = () => {
    initializeNotifications();
    setTimeout(() => {
      setNotificationGranted(window.Notification.permission === "granted");
    }, 500);
  };

  if (!reminders) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading reminder settings...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Bell className="h-6 w-6 text-cyan-400" />
          Reminder Settings
        </h2>
        <p className="text-slate-400 text-sm">
          Set up reminders to support your wellness journey. Notifications will
          appear based on your preferences.
        </p>
      </div>

      {/* Notifications not supported warning */}
      {!notificationSupported && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex gap-3 items-start"
        >
          <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-orange-300 font-medium">Notifications Not Supported</p>
            <p className="text-orange-200/70 text-sm">
              Your browser doesn't support notifications. Reminders will still be
              tracked, but you won't receive alerts.
            </p>
          </div>
        </motion.div>
      )}

      {/* Notification permission not granted */}
      {notificationSupported && !notificationGranted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 items-start justify-between"
        >
          <div className="flex gap-3 items-start flex-1">
            <Bell className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-300 font-medium">Enable Notifications</p>
              <p className="text-blue-200/70 text-sm">
                Notifications are disabled. Enable them to receive reminders.
              </p>
            </div>
          </div>
          <button
            onClick={handleEnableNotifications}
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition"
          >
            Enable
          </button>
        </motion.div>
      )}

      {/* Success message */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3 items-center"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="text-emerald-300 text-sm font-medium">Reminders saved successfully!</p>
        </motion.div>
      )}

      {/* Reminders Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Daily Check-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                <Clock className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Daily Check-In</h3>
                <p className="text-xs text-slate-400">Morning wellness check</p>
              </div>
            </div>
            <button
              onClick={() => handleReminderToggle("dailyCheckIn")}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                reminders.dailyCheckIn.enabled ? "bg-cyan-500" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  reminders.dailyCheckIn.enabled ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>

          {reminders.dailyCheckIn.enabled && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <label className="text-xs text-slate-400 block mb-2">Time:</label>
              <input
                type="time"
                value={reminders.dailyCheckIn.time}
                onChange={(e) => handleTimeChange("dailyCheckIn", e.target.value)}
                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
          )}
        </motion.div>

        {/* Break Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Break Reminder</h3>
                <p className="text-xs text-slate-400">Regular work breaks</p>
              </div>
            </div>
            <button
              onClick={() => handleReminderToggle("breakReminder")}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                reminders.breakReminder.enabled ? "bg-emerald-500" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  reminders.breakReminder.enabled ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>

          {reminders.breakReminder.enabled && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <label className="text-xs text-slate-400 block mb-2">
                Interval (minutes):
              </label>
              <select
                value={reminders.breakReminder.interval}
                onChange={(e) => handleIntervalChange("breakReminder", e.target.value)}
                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
              >
                <option value={30}>Every 30 minutes</option>
                <option value={45}>Every 45 minutes</option>
                <option value={60}>Every 60 minutes</option>
                <option value={90}>Every 90 minutes</option>
              </select>
            </div>
          )}
        </motion.div>

        {/* Sleep Wind-Down */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                <Moon className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Sleep Wind-Down</h3>
                <p className="text-xs text-slate-400">Evening preparation</p>
              </div>
            </div>
            <button
              onClick={() => handleReminderToggle("sleepWindDown")}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                reminders.sleepWindDown.enabled ? "bg-purple-500" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  reminders.sleepWindDown.enabled ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>

          {reminders.sleepWindDown.enabled && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <label className="text-xs text-slate-400 block mb-2">Time:</label>
              <input
                type="time"
                value={reminders.sleepWindDown.time}
                onChange={(e) => handleTimeChange("sleepWindDown", e.target.value)}
                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
              />
            </div>
          )}
        </motion.div>

        {/* Weekly Burnout Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                <Clock className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Weekly Review</h3>
                <p className="text-xs text-slate-400">Assessment reminder</p>
              </div>
            </div>
            <button
              onClick={() => handleReminderToggle("weeklyBurnoutReview")}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                reminders.weeklyBurnoutReview.enabled ? "bg-orange-500" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  reminders.weeklyBurnoutReview.enabled ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>

          {reminders.weeklyBurnoutReview.enabled && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              <div>
                <label className="text-xs text-slate-400 block mb-2">Day:</label>
                <select
                  value={reminders.weeklyBurnoutReview.day}
                  onChange={(e) => handleDayChange("weeklyBurnoutReview", e.target.value)}
                  className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                >
                  <option>Sunday</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-2">Time:</label>
                <input
                  type="time"
                  value={reminders.weeklyBurnoutReview.time}
                  onChange={(e) => handleTimeChange("weeklyBurnoutReview", e.target.value)}
                  className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-center font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-105"
      >
        Save Reminder Settings
      </motion.button>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
      >
        <p className="text-xs text-slate-400">
          💡 <strong>Tip:</strong> Reminders are checked every minute. For break reminders,
          we track your last activity to ensure consistent intervals. All settings are saved
          locally on your device.
        </p>
      </motion.div>
    </div>
  );
}
