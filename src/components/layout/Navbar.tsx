import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, CalendarDays, Award, Settings, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useFamilyStore } from '../../store/useFamilyStore';

export const Navbar: React.FC = () => {
  const { isGasConnected, isSaving, refreshData } = useFamilyStore();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-amber-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl font-bold shadow-sm shadow-orange-200 group-hover:scale-105 transition-transform">
              ⭐
            </div>
            <div>
              <span className="font-['Fredoka',sans-serif] text-xl font-semibold text-slate-900 tracking-tight block leading-tight">
                Отбасылық күн тәртібі
              </span>
              <span className="text-[11px] font-medium text-amber-700 block">
                Family Routine & Reward
              </span>
            </div>
          </NavLink>

          {/* Status & Sync button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => refreshData()}
              disabled={isSaving}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Деректерді жаңарту"
            >
              <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin text-amber-600' : ''}`} />
            </button>

            {isGasConnected ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sheets қосылған</span>
              </div>
            ) : (
              <NavLink
                to="/settings"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Жергілікті режим (Байланыстыру)</span>
              </NavLink>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Home className="w-4 h-4" />
              Басты бет
            </NavLink>

            <NavLink
              to="/child"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <User className="w-4 h-4" />
              Балалар көрінісі
            </NavLink>

            <NavLink
              to="/weekly"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <CalendarDays className="w-4 h-4" />
              Апталық кесте
            </NavLink>

            <NavLink
              to="/rewards"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Award className="w-4 h-4" />
              Сыйақылар
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              Баптаулар
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation for Kids & Mobile Users */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-amber-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
              isActive ? 'text-amber-700 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          Басты бет
        </NavLink>

        <NavLink
          to="/child"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
              isActive ? 'text-amber-700 font-bold' : 'text-slate-500'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          Балалар
        </NavLink>

        <NavLink
          to="/weekly"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
              isActive ? 'text-amber-700 font-bold' : 'text-slate-500'
            }`
          }
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          Апталық
        </NavLink>

        <NavLink
          to="/rewards"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
              isActive ? 'text-amber-700 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Award className="w-5 h-5 mb-0.5" />
          Сыйақы
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
              isActive ? 'text-amber-700 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Settings className="w-5 h-5 mb-0.5" />
          Баптау
        </NavLink>
      </nav>
    </header>
  );
};
