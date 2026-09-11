import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { getWeekRange, shiftWeek, formatKazakhDate } from '../../utils/dateUtils';

export const WeekSelector: React.FC = () => {
  const { currentWeekStart, setCurrentWeekStart } = useFamilyStore();
  const { weekStart, weekEnd } = getWeekRange(currentWeekStart);
  const realCurrentWeekStart = getWeekRange().weekStart;
  const isCurrentWeek = currentWeekStart === realCurrentWeekStart;

  const handlePrevWeek = () => {
    setCurrentWeekStart(shiftWeek(currentWeekStart, -1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(shiftWeek(currentWeekStart, 1));
  };

  const handleResetToCurrent = () => {
    setCurrentWeekStart(realCurrentWeekStart);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-amber-100 shadow-xs mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevWeek}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-amber-50 active:bg-amber-100 border border-slate-200 transition-colors flex items-center justify-center"
          title="Алдыңғы апта"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
          <Calendar className="w-4 h-4 text-amber-700" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            {formatKazakhDate(weekStart)} — {formatKazakhDate(weekEnd, true)}
          </span>
        </div>

        <button
          onClick={handleNextWeek}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-amber-50 active:bg-amber-100 border border-slate-200 transition-colors flex items-center justify-center"
          title="Келесі апта"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {!isCurrentWeek ? (
          <button
            onClick={handleResetToCurrent}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            Осы аптаға оралу
          </button>
        ) : (
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            Ағымдағы апта
          </span>
        )}
      </div>
    </div>
  );
};
