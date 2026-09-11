import React from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { WeekSelector } from '../components/layout/WeekSelector';
import { FamilyRewardCard } from '../components/dashboard/FamilyRewardCard';
import { formatCurrency } from '../utils/dateUtils';
import { Trophy, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const { children, currentWeekStart, settings, getChildWeeklyStats, isLoading } = useFamilyStore();
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-['Fredoka',sans-serif] font-bold text-slate-900">
          Сыйақылар және марапаттар
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Апталық қорытынды бойынша жеке ақшалай сыйақылар мен ортақ отбасылық сыйлық
        </p>
      </div>

      {/* Week Selector */}
      <WeekSelector />

      {/* Prominent Family Reward Card */}
      <FamilyRewardCard />

      {/* Individual Weekly Reward Cards */}
      <div>
        <h2 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🏆 Балалардың апталық жеке сыйақылары</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChildren.map((child) => {
            const stats = getChildWeeklyStats(child.id, currentWeekStart);
            const isFull = stats.completionPercentage >= settings.FULL_COMPLETION_THRESHOLD;
            const isHalf = stats.completionPercentage >= settings.HALF_COMPLETION_THRESHOLD;

            return (
              <div
                key={child.id}
                id={`weekly-reward-card-${child.id}`}
                className={`rounded-3xl p-5 sm:p-6 border transition-all ${
                  isFull
                    ? 'bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-md'
                    : isHalf
                    ? 'bg-linear-to-br from-amber-50 to-orange-50 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xs ${child.avatarColor}`}
                    >
                      {child.avatarEmoji}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                        АПТАЛЫҚ СЫЙАҚЫ
                      </span>
                      <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-900">
                        {child.name}
                      </h3>
                    </div>
                  </div>

                  {isFull && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-xs animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      МӘРЕ! 100%
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>Орындалды:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {stats.completedTasks} / {stats.totalRequiredTasks} ({stats.completionPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-emerald-500' : isHalf ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${stats.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Reward Amount Display */}
                <div className="p-4 rounded-2xl bg-white/90 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Есептелген сыйақы:</span>
                    <span
                      className={`text-2xl font-['Fredoka',sans-serif] font-bold ${
                        isFull ? 'text-emerald-700' : isHalf ? 'text-amber-700' : 'text-slate-500'
                      }`}
                    >
                      {formatCurrency(stats.rewardAmount)}
                    </span>
                  </div>

                  <div>
                    {isFull ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Толық көлемде
                      </span>
                    ) : isHalf ? (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl">
                        Жартылай көлем
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                        Табалдырықтан төмен
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-['Fredoka',sans-serif] text-base sm:text-lg font-bold text-slate-900">
            Сыйақы ережелері мен табалдырықтар
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <span className="font-bold text-emerald-800 block text-sm mb-1">
              100% толық орындау (≥ {settings.FULL_COMPLETION_THRESHOLD}%)
            </span>
            <p className="text-slate-600 mb-2">Барлық апталық тапсырмаларды мінсіз орындаған жағдайда:</p>
            <span className="font-extrabold text-emerald-700 text-base">
              {formatCurrency(settings.FULL_REWARD)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
            <span className="font-bold text-amber-800 block text-sm mb-1">
              50% жартылай орындау (≥ {settings.HALF_COMPLETION_THRESHOLD}%)
            </span>
            <p className="text-slate-600 mb-2">Тапсырмалардың жартысынан көбі орындалған жағдайда:</p>
            <span className="font-extrabold text-amber-700 text-base">
              {formatCurrency(settings.HALF_REWARD)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-700 block text-sm mb-1">
              50%-дан төмен (&lt; {settings.HALF_COMPLETION_THRESHOLD}%)
            </span>
            <p className="text-slate-600 mb-2">Міндеттердің жартысына жетпеген жағдайда:</p>
            <span className="font-extrabold text-slate-500 text-base">0 ₸</span>
          </div>
        </div>
      </div>
    </div>
  );
};
