import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import Reminders from "./pages/Reminders";
import DailyCheckIn from "./pages/DailyCheckIn";
import ChatAssistant from "./components/ChatAssistant";
import MobileNavigation from "./components/MobileNavigation";
import InstallPrompt from "./components/InstallPrompt";
import UpdatePrompt from "./components/UpdatePrompt";
import { initializeNotifications, startReminderService } from "./utils/notificationService";
import { registerServiceWorker, onOnlineStatusChange, isOnline } from "./utils/pwaUtils";

function App() {
  const [isOnlineStatus, setIsOnlineStatus] = useState(navigator.onLine);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Initialize notifications and reminder service
    initializeNotifications();
    startReminderService();
    
    // Register service worker
    registerServiceWorker(() => {
      // Show update prompt when new version is available
      setShowUpdatePrompt(true);
    });
    
    // Listen to online/offline status changes
    const unsubscribe = onOnlineStatusChange((online) => {
      setIsOnlineStatus(online);
      console.log(online ? 'Online' : 'Offline');
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      {/* Offline indicator banner */}
      {!isOnlineStatus && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-orange-600 text-white px-4 py-2 text-center text-sm font-medium md:bottom-auto md:top-0">
          📡 You're offline. Data will sync when you're back online.
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/daily-checkin" element={<DailyCheckIn />} />
      </Routes>
      
      {/* PWA Components */}
      <ChatAssistant />
      <MobileNavigation />
      <InstallPrompt />
      {showUpdatePrompt && <UpdatePrompt onDismiss={() => setShowUpdatePrompt(false)} />}
    </Router>
  );
}

export default App;