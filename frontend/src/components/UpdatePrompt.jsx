import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { reloadApp } from '../utils/pwaUtils';

export default function UpdatePrompt({ onDismiss }) {
  const handleUpdate = () => {
    // Reload the app to activate the new service worker
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm md:bottom-auto md:top-auto md:left-auto md:right-6 md:inset-auto md:w-96 md:bg-transparent md:backdrop-blur-none md:p-0">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-blue-400/30 rounded-xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header with icon */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-400/20 px-6 py-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-white">App Update Available</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            A new version of BurnoutAI is available. We've added improvements to enhance your wellness tracking experience.
          </p>

          {/* Features list */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-5">
            <p className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">What's New:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Performance improvements</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Better offline support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Bug fixes and improvements</span>
              </li>
            </ul>
          </div>

          {/* Info box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-5">
            <p className="text-xs text-amber-200">
              💡 Your wellness data is saved and will be available after the update.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-white/10 px-6 py-4 bg-white/2.5 flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg font-medium transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Not Now
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
