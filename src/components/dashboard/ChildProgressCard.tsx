import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Child } from '../../types';
import { useFamilyStore } from '../../store/useFamilyStore';
import { formatCurrency } from '../../utils/dateUtils';
import { ArrowRight, Trophy } from 'lucide-react';

interface ChildProgressCardProps {
  child: Child;
}

export const ChildProgressCard: React.FC<ChildProgressCardProps> = ({ child }) => {
  const navigate = useNavigate();
  const { currentWeekStart, selectedDate, getChildDailyStats, getChildWeeklyStats, setSelectedChildId } =
    useFamilyStore();

  const daily = getChildDailyStats(child.id, selectedDate);
  const weekly = getChildWeeklyStats(child.id, currentWeekStart);

  const handleSelectChild = () => {
    setSelectedChildId(child.id);
    navigate('/child');
  };

  return (
    <div
      id={`child-card-${child.id}`}
      onClick={handleSelectChild}
      className="group cursor-pointer bg-white rounded-3xl p-5 border border-amber-100/80 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header: Avatar, Name & Reward Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xs ${child.avatarColor}`}
            >
              {child.avatarEmoji}
            </div>
            <div>
              <h3 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                {child.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Бүгін: {daily.completed} / {daily.total} ({daily.percentage}%)
              </p>
            </div>
          </div>

          {/* Reward Pill */}
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${
                weekly.status === 'earned_full'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : weekly.status === 'earned_half'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {formatCurrency(weekly.rewardAmount)}
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Апталық сыйақы</div>
          </div>
        </div>

        {/* Today's Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span>Бүгінгі орындау</span>
            <span className="font-bold text-slate-900">{daily.percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
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

        {/* Weekly Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span>Апталық орындау</span>
            <span className="font-bold text-slate-900">
              {weekly.completedTasks} / {weekly.totalRequiredTasks} ({weekly.completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                weekly.completionPercentage === 100
                  ? 'bg-emerald-500'
                  : weekly.completionPercentage >= 50
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
              style={{ width: `${weekly.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
        <span>Тапсырмаларды көру</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
