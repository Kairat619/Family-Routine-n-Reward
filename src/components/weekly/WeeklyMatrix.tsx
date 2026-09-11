import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { getWeekRange } from '../../utils/dateUtils';
import { Check, Circle } from 'lucide-react';

export const WeeklyMatrix: React.FC = () => {
  const {
    children,
    categories,
    tasks,
    completions,
    currentWeekStart,
    selectedChildId,
    setSelectedChildId,
    toggleTask,
  } = useFamilyStore();

  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');

  const { days } = getWeekRange(currentWeekStart);
  const activeChildren = children.filter((c) => c.active);
  const currentChild = activeChildren.find((c) => c.id === selectedChildId) || activeChildren[0];

  const activeCategories = categories.filter((c) => c.active);
  const filteredTasks = tasks.filter((t) => {
    if (!t.active) return false;
    if (filterCategoryId !== 'all' && t.categoryId !== filterCategoryId) return false;
    return true;
  });

  if (!currentChild) {
    return (
      <div className="p-6 text-center text-slate-500 bg-white rounded-3xl border border-amber-100">
        Балалар табылмады. Баптаулар бөлімінен бала қосыңыз.
      </div>
    );
  }

  return (
    <div id="weekly-matrix-container" className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-100 shadow-xs">
      {/* Child Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 mr-1">Бала таңдау:</span>
        {activeChildren.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChildId(child.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              selectedChildId === child.id
                ? 'bg-amber-500 text-white shadow-xs scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{child.avatarEmoji}</span>
            <span>{child.name}</span>
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
        <button
          onClick={() => setFilterCategoryId('all')}
          className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
            filterCategoryId === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Барлығы
        </button>
        {activeCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategoryId(cat.id)}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
              filterCategoryId === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Weekly Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-amber-50/70 border-b border-slate-200">
              <th className="py-3 px-3 sm:px-4 font-bold text-slate-800 min-w-[160px] sm:min-w-[220px]">
                Тапсырма
              </th>
              {days.map((day) => (
                <th
                  key={day.date}
                  className={`py-2.5 px-2 text-center min-w-[48px] sm:min-w-[64px] ${
                    day.isToday ? 'bg-amber-100/90 font-extrabold text-amber-950' : 'text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{day.shortName}</div>
                  <div className="text-[10px] text-slate-500">{day.date.slice(8, 10)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const category = categories.find((c) => c.id === task.categoryId);

              return (
                <tr key={task.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {category?.name || ''}
                      </span>
                      <span className="truncate">{task.name}</span>
                    </div>
                  </td>

                  {days.map((day) => {
                    const deterministicId = `${day.date}_${currentChild.id}_${task.id}`;
                    const record = completions.find((c) => c.id === deterministicId);
                    const isDone = !!record?.completed;

                    return (
                      <td
                        key={day.date}
                        onClick={() => toggleTask(task.id, currentChild.id, day.date)}
                        className={`py-2 px-1 text-center cursor-pointer transition-colors ${
                          day.isToday ? 'bg-amber-50/30' : ''
                        } hover:bg-amber-100/50`}
                        title={`${task.name} (${day.dayName}, ${day.date})`}
                      >
                        <div className="flex items-center justify-center">
                          {isDone ? (
                            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-xl border border-slate-200 text-slate-300 flex items-center justify-center hover:border-amber-400 hover:text-amber-500 transition-colors">
                              <Circle className="w-3.5 h-3.5 stroke-1" />
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Орындалды (басып өзгертуге болады)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border border-slate-300 inline-block" /> Орындалмаған
          </span>
        </div>
        <span>Жалпы {filteredTasks.length} тапсырма</span>
      </div>
    </div>
  );
};
