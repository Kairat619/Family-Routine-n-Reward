import React from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Sparkles, Trophy, CheckCircle2, Clock } from 'lucide-react';

export const FamilyRewardCard: React.FC = () => {
  const { currentWeekStart, getFamilyRewardStatus } = useFamilyStore();
  const status = getFamilyRewardStatus(currentWeekStart);

  return (
    <div
      id="family-reward-card"
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all border ${
        status.isEarned
          ? 'bg-linear-to-br from-amber-500 via-orange-500 to-amber-600 text-white border-amber-300 shadow-xl shadow-amber-200'
          : 'bg-white text-slate-800 border-amber-200 shadow-sm'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold text-lg inline-flex items-center justify-center">
              🏆
            </span>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider block ${
                  status.isEarned ? 'text-amber-100' : 'text-amber-700'
                }`}
              >
                Командалық сыйлық
              </span>
              <h3 className="text-xl sm:text-2xl font-['Fredoka',sans-serif] font-bold leading-tight">
                {status.rewardName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status.isEarned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-amber-700 font-extrabold text-xs sm:text-sm shadow-md animate-bounce">
                <Sparkles className="w-4 h-4 text-amber-500" />
                ЖЕҢІС! ҰТЫП АЛДЫҚ!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                {status.completedKidsCount} / {status.totalKidsCount} бала орындады
              </span>
            )}
          </div>
        </div>

        {status.description && (
          <p
            className={`text-xs sm:text-sm mb-4 ${
              status.isEarned ? 'text-amber-100' : 'text-slate-600'
            }`}
          >
            {status.description}
          </p>
        )}

        {/* Children weekly requirement status list */}
        <div className="space-y-2 pt-2 border-t border-black/5">
          <div
            className={`text-xs font-bold ${
              status.isEarned ? 'text-amber-100' : 'text-slate-500'
            }`}
          >
            Балалардың орындау нәтижесі:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {status.childrenStatus.map((item) => (
              <div
                key={item.child.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${
                  status.isEarned
                    ? 'bg-black/10 text-white'
                    : 'bg-slate-50 text-slate-800 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item.child.avatarEmoji}</span>
                  <span>{item.child.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isFull ? (
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        status.isEarned ? 'text-white' : 'text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      100%
                    </span>
                  ) : (
                    <span
                      className={`font-semibold ${
                        status.isEarned ? 'text-amber-200' : 'text-slate-600'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Celebration Banner when 100% is reached */}
        {status.isEarned && (
          <div className="mt-4 p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/30 text-center">
            <p className="text-sm font-bold flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-200" />
              Барлық 4 бала апталық тапсырмаларды 100% орындады! Донерге барамыз! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
