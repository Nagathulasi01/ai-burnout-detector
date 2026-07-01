/**
 * Notification Service for Burnout AI
 * Uses browser Notification API to send reminders
 */

// Initialize notification service
export function initializeNotifications() {
  // Request permission if not already granted
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// Send a notification
export function sendNotification(title, options = {}) {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported in this browser");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%230ea5e9' width='100' height='100'/><path fill='white' d='M50 20c-16.6 0-30 13.4-30 30 0 8 3 15.3 8 20.9v14.1c0 2.8 2.2 5 5 5h34c2.8 0 5-2.2 5-5V70.9c5-5.6 8-12.9 8-20.9 0-16.6-13.4-30-30-30zm0 8c12.1 0 22 9.9 22 22s-9.9 22-22 22-22-9.9-22-22 9.9-22 22-22z'/></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%230ea5e9'/></svg>",
      ...options,
    });
  }
}

// Get stored reminder settings
export function getReminderSettings() {
  try {
    const stored = localStorage.getItem("burnoutReminders");
    if (!stored) {
      return getDefaultReminders();
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error loading reminder settings:", e);
    return getDefaultReminders();
  }
}

// Save reminder settings
export function saveReminderSettings(reminders) {
  localStorage.setItem("burnoutReminders", JSON.stringify(reminders));
}

// Get default reminder settings
export function getDefaultReminders() {
  return {
    dailyCheckIn: {
      enabled: false,
      time: "09:00", // 9 AM
      title: "Daily Check-In Reminder",
      message: "Time for your wellness check-in! How are you feeling today?",
    },
    breakReminder: {
      enabled: false,
      interval: 60, // minutes
      title: "Break Time",
      message: "You've been working for a while. Take a 5-minute break!",
    },
    sleepWindDown: {
      enabled: false,
      time: "22:00", // 10 PM
      title: "Sleep Wind-Down",
      message: "Time to prepare for sleep. Put away your devices and relax.",
    },
    weeklyBurnoutReview: {
      enabled: false,
      day: "Sunday",
      time: "18:00", // 6 PM
      title: "Weekly Burnout Review",
      message: "Take 10 minutes to complete your weekly burnout assessment.",
    },
  };
}

// Check and trigger reminders (call this periodically or on app load)
export function checkReminders() {
  const reminders = getReminderSettings();
  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, "0");
  const currentMinute = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${currentHour}:${currentMinute}`;
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });

  // Check daily check-in
  if (
    reminders.dailyCheckIn.enabled &&
    currentTime === reminders.dailyCheckIn.time
  ) {
    const lastTriggered = localStorage.getItem("lastDailyCheckIn");
    if (lastTriggered !== new Date().toDateString()) {
      sendNotification(reminders.dailyCheckIn.title, {
        body: reminders.dailyCheckIn.message,
        tag: "dailyCheckIn",
      });
      localStorage.setItem("lastDailyCheckIn", new Date().toDateString());
    }
  }

  // Check sleep wind-down
  if (
    reminders.sleepWindDown.enabled &&
    currentTime === reminders.sleepWindDown.time
  ) {
    const lastTriggered = localStorage.getItem("lastSleepWindDown");
    if (lastTriggered !== new Date().toDateString()) {
      sendNotification(reminders.sleepWindDown.title, {
        body: reminders.sleepWindDown.message,
        tag: "sleepWindDown",
      });
      localStorage.setItem("lastSleepWindDown", new Date().toDateString());
    }
  }

  // Check weekly burnout review
  if (
    reminders.weeklyBurnoutReview.enabled &&
    dayName === reminders.weeklyBurnoutReview.day &&
    currentTime === reminders.weeklyBurnoutReview.time
  ) {
    const lastTriggered = localStorage.getItem("lastWeeklyReview");
    if (lastTriggered !== new Date().toDateString()) {
      sendNotification(reminders.weeklyBurnoutReview.title, {
        body: reminders.weeklyBurnoutReview.message,
        tag: "weeklyReview",
      });
      localStorage.setItem("lastWeeklyReview", new Date().toDateString());
    }
  }

  // Break reminder uses interval - check if break time has passed
  if (reminders.breakReminder.enabled) {
    const lastBreakTime = localStorage.getItem("lastBreakReminder");
    const now = Date.now();
    const intervalMs = reminders.breakReminder.interval * 60 * 1000;

    if (!lastBreakTime || now - parseInt(lastBreakTime) >= intervalMs) {
      sendNotification(reminders.breakReminder.title, {
        body: reminders.breakReminder.message,
        tag: "breakReminder",
      });
      localStorage.setItem("lastBreakReminder", String(now));
    }
  }
}

// Set up periodic reminder checks
let reminderCheckInterval = null;

export function startReminderService() {
  // Check reminders every minute
  if (!reminderCheckInterval) {
    reminderCheckInterval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute

    // Also check immediately on start
    checkReminders();
  }
}

export function stopReminderService() {
  if (reminderCheckInterval) {
    clearInterval(reminderCheckInterval);
    reminderCheckInterval = null;
  }
}
