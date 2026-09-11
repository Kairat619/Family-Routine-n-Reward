import React from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { CategoryTaskGroup } from '../components/child/CategoryTaskGroup';
import { formatKazakhDate, toISODate, parseISODate, formatCurrency } from '../utils/dateUtils';
import { Trophy, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const ChildPage: React.FC = () => {
  const {
    children,
    categories,
    tasks,
    selectedChildId,
    setSelectedChildId,
    selectedDate,
    setSelectedDate,
    currentWeekStart,
    getChildDailyStats,
    getChildWeeklyStats,
    isLoading,
  } = useFamilyStore();

  const activeChildren = children.filter((c) => c.active);
  const currentChild = activeChildren.find((c) => c.id === selectedChildId) || activeChildren[0];

  const todayIso = toISODate();
  const isToday = selectedDate === todayIso;

  const handlePrevDay = () => {
    const d = parseISODate(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(toISODate(d));
  };

  const handleNextDay = () => {
    const d = parseISODate(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(toISODate(d));
  };

  const handleToday = () => {
    setSelectedDate(todayIso);
  };

  if (isLoading || !currentChild) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-semibold text-sm">Жүктелуде...</p>
      </div>
    );
  }

  const daily = getChildDailyStats(currentChild.id, selectedDate);
  const weekly = getChildWeeklyStats(currentChild.id, currentWeekStart);
  const activeCategories = categories.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-5 pb-10">
      {/* Child Selector Carousel / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {activeChildren.map((child) => {
          const isSelected = child.id === currentChild.id;
          return (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 select-none ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <span className="text-xl">{child.avatarEmoji}</span>
              <span className="text-sm sm:text-base">{child.name}</span>
            </button>
          );
        })}
      </div>

      {/* Child Header Card with Daily & Weekly Stats */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xs ${currentChild.avatarColor}`}
            >
              {currentChild.avatarEmoji}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                Баланың тапсырмалары
              </div>
              <h1 className="text-2xl sm:text-3xl font-['Fredoka',sans-serif] font-bold text-slate-900">
                {currentChild.name}
              </h1>
            </div>
          </div>

          {/* Reward status pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">
                Апталық сыйақы
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                {formatCurrency(weekly.rewardAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center justify-between gap-2 bg-white/80 backdrop-blur p-2.5 rounded-2xl border border-amber-200/80 mb-3">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-amber-100 transition-colors"
            title="Алдыңғы күн"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
              {formatKazakhDate(selectedDate)}
            </span>
            {isToday && (
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                Бүгінгі күн
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!isToday && (
              <button
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors mr-1"
              >
                Бүгін
              </button>
            )}
            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-amber-100 transition-colors"
              title="Келесі күн"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar for selected date */}
        <div>
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Күндік орындалу: {daily.completed} / {daily.total}
            </span>
            <span className="text-amber-800 font-extrabold">{daily.percentage}%</span>
          </div>
          <div className="w-full h-3 bg-white/90 rounded-full overflow-hidden border border-amber-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                daily.percentage === 100
                  ? 'bg-emerald-500'
                  : daily.percentage >= 50
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${daily.percentage}%` }}
            />
          </div>
        </div>

        {/* Celebration if 100% daily */}
        {daily.percentage === 100 && daily.total > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500 text-white text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs">
            <Sparkles className="w-4 h-4" />
            Керемет жұмыс! Бүгінгі барлық тапсырма толық орындалды! 🎉
          </div>
        )}
      </div>

      {/* Task List Grouped by Category */}
      <div className="space-y-4">
        {activeCategories.map((category) => {
          const categoryTasks = tasks
            .filter((t) => t.active && t.categoryId === category.id)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          if (categoryTasks.length === 0) return null;

          return (
            <CategoryTaskGroup
              key={category.id}
              category={category}
              tasks={categoryTasks}
              childId={currentChild.id}
              date={selectedDate}
            />
          );
        })}
      </div>
    </div>
  );
};
