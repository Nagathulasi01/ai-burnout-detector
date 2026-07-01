import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event for later use
      setDeferredPrompt(e);
      // Update UI to show install button (only show if not installed)
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA app installed');
      setShowPrompt(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    handleInstall,
    handleDismiss,
    isInstalled,
    isSupported: !!deferredPrompt || isInstalled
  };
}

export default function InstallPrompt() {
  const { showPrompt, handleInstall, handleDismiss } = useInstallPrompt();

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/80 border-t border-blue-400/30 backdrop-blur-sm md:bottom-auto md:top-20 md:left-auto md:right-6 md:rounded-lg md:w-96 md:shadow-xl md:border">
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <h3 className="font-semibold text-white text-base sm:text-lg">Install BurnoutAI</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close install prompt"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4">
          Install the app on your home screen for quick access and offline support. Always have wellness guidance at your fingertips.
        </p>

        {/* Benefits */}
        <ul className="space-y-2 mb-5">
          <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            <span>Works offline</span>
          </li>
          <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            <span>Faster loading</span>
          </li>
          <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            <span>No ads or bloat</span>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/10 hover:bg-white/20 text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <span className="hidden sm:inline">Not Now</span>
            <span className="sm:hidden">Later</span>
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-gray-400 mt-3">
          💡 <strong>Tip:</strong> You can always install from your browser menu.
        </p>
      </div>
    </div>
  );
}
