import React from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { BookOpen, Sparkles, Dumbbell, Moon, Clock, CheckSquare } from 'lucide-react';

interface CategoryStatsProps {
  childId: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cat_sabak: <BookOpen className="w-4 h-4 text-blue-600" />,
  cat_enbek: <Sparkles className="w-4 h-4 text-amber-600" />,
  cat_sport: <Dumbbell className="w-4 h-4 text-emerald-600" />,
  cat_din: <Moon className="w-4 h-4 text-purple-600" />,
  cat_tartip: <Clock className="w-4 h-4 text-rose-600" />,
};

export const CategoryStats: React.FC<CategoryStatsProps> = ({ childId }) => {
  const { currentWeekStart, getChildWeeklyStats } = useFamilyStore();
  const stats = getChildWeeklyStats(childId, currentWeekStart);

  return (
    <div id="category-stats-card" className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs">
      <h3 className="font-['Fredoka',sans-serif] text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
        <span>Санаттар бойынша нәтиже</span>
        <span className="text-xs font-semibold text-slate-500">Апталық пайыз</span>
      </h3>

      <div className="space-y-3.5">
        {stats.categoryBreakdown.map((cat) => {
          const icon = CATEGORY_ICONS[cat.categoryId] || <CheckSquare className="w-4 h-4 text-slate-500" />;

          return (
            <div key={cat.categoryId}>
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-slate-800">{cat.categoryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">
                    {cat.completed} / {cat.total}
                  </span>
                  <span
                    className={`font-bold ${
                      cat.percentage === 100
                        ? 'text-emerald-600'
                        : cat.percentage >= 50
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.percentage === 100
                      ? 'bg-emerald-500'
                      : cat.percentage >= 50
                      ? 'bg-amber-500'
                      : 'bg-blue-400'
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
