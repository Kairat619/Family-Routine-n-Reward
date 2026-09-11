import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFamilyStore } from './store/useFamilyStore';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ChildPage } from './pages/ChildPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const { initialize, error } = useFamilyStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-b from-amber-50/40 via-orange-50/20 to-slate-50 text-slate-800 flex flex-col selection:bg-amber-200">
        {/* Top Navigation */}
        <Navbar />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4 w-full">
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => useFamilyStore.setState({ error: null })}
                className="p-1 rounded-lg hover:bg-rose-100 text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/child" element={<ChildPage />} />
            <Route path="/weekly" element={<WeeklyPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
