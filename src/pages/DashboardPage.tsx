import React from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { WeekSelector } from '../components/layout/WeekSelector';
import { FamilyRewardCard } from '../components/dashboard/FamilyRewardCard';
import { ChildProgressCard } from '../components/dashboard/ChildProgressCard';
import { formatKazakhDate, toISODate } from '../utils/dateUtils';
import { Calendar, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { children, isLoading } = useFamilyStore();
  const todayIso = toISODate();
  const activeChildren = children.filter((c) => c.active);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-semibold text-sm">Жүктелуде...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner: Today's date and greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md shadow-amber-200">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-100 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Бүгінгі күн</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Fredoka',sans-serif] font-bold">
            {formatKazakhDate(todayIso, true)}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            Балалардың күнделікті міндеттері мен апталық сыйақылары
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur border border-white/20">
          <Sparkles className="w-5 h-5 text-amber-200" />
          <div className="text-xs font-bold leading-tight">
            <span>{activeChildren.length} бала</span>
            <span className="block text-[10px] text-amber-100 font-normal">жүйеде белсенді</span>
          </div>
        </div>
      </div>

      {/* Week Selector */}
      <WeekSelector />

      {/* Team / Family Reward Card */}
      <FamilyRewardCard />

      {/* Children Progress Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-900">
            Балалардың көрсеткіштері
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Тапсырмаларды орындау үшін баланы таңдаңыз
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChildren.map((child) => (
            <ChildProgressCard key={child.id} child={child} />
          ))}
        </div>
      </div>
    </div>
  );
};
