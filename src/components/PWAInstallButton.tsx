import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-900/30 transition-all active:scale-95 border border-blue-400/30"
        title="Install UdyamNotice App on your device for instant offline access"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">1</span>
                  <p>In Safari, tap the <strong className="text-white">Share</strong> icon (box with upward arrow) at the bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">2</span>
                  <p>Scroll down the menu and tap <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">3</span>
                  <p>Tap <strong className="text-white">Add</strong> in the top-right corner to launch UdyamNotice as a standalone legal utility.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-semibold text-white transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback install trigger for browsers
  return (
    <button
      onClick={() => {
        alert("To install UdyamNotice: Click your browser's menu (three dots icon in Chrome or Edge) and select 'Install UdyamNotice' or 'Add to Home Screen'.");
      }}
      className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700/80 transition"
      title="Install as Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-blue-400" />
      <span>Install App</span>
    </button>
  );
};
