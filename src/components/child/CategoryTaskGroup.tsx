import React from 'react';
import { Category, Task } from '../../types';
import { ChildTaskItem } from './ChildTaskItem';
import { useFamilyStore } from '../../store/useFamilyStore';
import { BookOpen, Sparkles, Dumbbell, Moon, Clock, CheckSquare } from 'lucide-react';

interface CategoryTaskGroupProps {
  category: Category;
  tasks: Task[];
  childId: string;
  date: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5 text-blue-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-600" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-emerald-600" />,
  Moon: <Moon className="w-5 h-5 text-purple-600" />,
  Clock: <Clock className="w-5 h-5 text-rose-600" />,
};

export const CategoryTaskGroup: React.FC<CategoryTaskGroupProps> = ({
  category,
  tasks,
  childId,
  date,
}) => {
  const { completions } = useFamilyStore();

  const completedCount = tasks.filter((t) => {
    const record = completions.find((c) => c.id === `${date}_${childId}_${t.id}`);
    return !!record?.completed;
  }).length;

  const totalCount = tasks.length;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  const icon = CATEGORY_ICONS[category.icon] || <CheckSquare className="w-5 h-5 text-amber-600" />;

  return (
    <div
      id={`category-group-${category.id}`}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 shadow-xs mb-4"
    >
      {/* Category Header */}
      <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100/80 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h4 className="font-['Fredoka',sans-serif] text-base sm:text-lg font-bold text-slate-900">
              {category.name}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isAllDone
                ? 'bg-emerald-100 text-emerald-800'
                : completedCount > 0
                ? 'bg-amber-100 text-amber-900'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {completedCount} / {totalCount}
          </span>
        </div>
      </div>

      {/* Task items list */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <ChildTaskItem key={task.id} task={task} childId={childId} date={date} />
        ))}
      </div>
    </div>
  );
};
