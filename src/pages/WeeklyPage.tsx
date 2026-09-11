import React from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { WeekSelector } from '../components/layout/WeekSelector';
import { WeeklyMatrix } from '../components/weekly/WeeklyMatrix';
import { CategoryStats } from '../components/weekly/CategoryStats';

export const WeeklyPage: React.FC = () => {
  const { children, selectedChildId, isLoading } = useFamilyStore();
  const activeChildren = children.filter((c) => c.active);
  const currentChild = activeChildren.find((c) => c.id === selectedChildId) || activeChildren[0];

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
          Апталық нәтижелер кестесі
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Әр баланың апта бойғы күндік орындаған тапсырмаларының толық мониторингі
        </p>
      </div>

      {/* Week Selector */}
      <WeekSelector />

      {/* Dedicated Weekly Matrix */}
      <WeeklyMatrix />

      {/* Category Performance Breakdown */}
      {currentChild && (
        <div className="mt-6">
          <CategoryStats childId={currentChild.id} />
        </div>
      )}
    </div>
  );
};
