import React from 'react';
import { Task } from '../../types';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Check } from 'lucide-react';

interface ChildTaskItemProps {
  task: Task;
  childId: string;
  date: string;
}

export const ChildTaskItem: React.FC<ChildTaskItemProps> = ({ task, childId, date }) => {
  const { completions, toggleTask } = useFamilyStore();
  const deterministicId = `${date}_${childId}_${task.id}`;
  const record = completions.find((c) => c.id === deterministicId);
  const isCompleted = !!record?.completed;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleTask(task.id, childId, date);
  };

  return (
    <button
      id={`task-item-${task.id}`}
      type="button"
      onClick={handleToggle}
      className={`w-full min-h-[52px] px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-left transition-all border ${
        isCompleted
          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
          : 'bg-white border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/30'
      } active:scale-[0.98] select-none`}
    >
      <div className="flex items-center gap-3">
        {/* Custom large touch checkbox */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 bg-slate-50'
          }`}
        >
          {isCompleted && <Check className="w-5 h-5 stroke-[3]" />}
        </div>

        <div>
          <span
            className={`text-sm sm:text-base font-semibold block transition-colors ${
              isCompleted ? 'line-through text-emerald-800/80' : 'text-slate-900'
            }`}
          >
            {task.name}
          </span>
        </div>
      </div>

      <div className="shrink-0">
        {isCompleted ? (
          <span className="px-2.5 py-1 rounded-full bg-emerald-200/60 text-emerald-900 text-xs font-bold">
            Орындалды ✓
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
            Күтілуде
          </span>
        )}
      </div>
    </button>
  );
};
