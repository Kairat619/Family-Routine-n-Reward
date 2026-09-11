import { create } from 'zustand';
import {
  Child,
  Category,
  Task,
  TaskCompletion,
  SettingsMap,
  FamilyReward,
  WeeklyChildSummary,
} from '../types';
import { api, getAppsScriptUrl } from '../services/api';
import { DEFAULT_SETTINGS } from '../constants/initialData';
import { toISODate, getWeekRange } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

interface FamilyState {
  children: Child[];
  categories: Category[];
  tasks: Task[];
  completions: TaskCompletion[];
  settings: SettingsMap;
  familyRewards: FamilyReward[];
  selectedChildId: string;
  selectedDate: string;
  currentWeekStart: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isGasConnected: boolean;

  // Actions
  initialize: () => Promise<void>;
  setSelectedChildId: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setCurrentWeekStart: (weekStart: string) => void;
  toggleTask: (taskId: string, childId?: string, date?: string) => Promise<boolean>;
  saveChild: (child: Partial<Child> & { name: string }) => Promise<void>;
  saveTask: (task: Partial<Task> & { categoryId: string; name: string }) => Promise<void>;
  saveSettings: (settings: Partial<SettingsMap>) => Promise<void>;
  saveFamilyReward: (reward: Partial<FamilyReward> & { weekStart: string; rewardName: string }) => Promise<void>;
  refreshData: () => Promise<void>;
  checkConnection: () => Promise<{ success: boolean; message?: string }>;

  // Computations
  getChildWeeklyStats: (childId: string, weekStart?: string) => WeeklyChildSummary;
  getChildDailyStats: (childId: string, date?: string) => { total: number; completed: number; percentage: number };
  getFamilyRewardStatus: (weekStart?: string) => {
    isEarned: boolean;
    rewardName: string;
    description: string;
    childrenStatus: { child: Child; percentage: number; isFull: boolean }[];
    completedKidsCount: number;
    totalKidsCount: number;
  };
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  children: [],
  categories: [],
  tasks: [],
  completions: [],
  settings: DEFAULT_SETTINGS,
  familyRewards: [],
  selectedChildId: 'child_arshan',
  selectedDate: toISODate(),
  currentWeekStart: getWeekRange().weekStart,
  isLoading: true,
  isSaving: false,
  error: null,
  isGasConnected: !!getAppsScriptUrl(),

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const [children, categories, tasks, settings, completions, familyRewards] = await Promise.all([
        api.getChildren(),
        api.getCategories(),
        api.getTasks(),
        api.getSettings(),
        api.getCompletions(),
        api.getFamilyRewards(),
      ]);

      const activeKids = children.filter((c) => c.active);
      const firstChildId = activeKids.length > 0 ? activeKids[0].id : (children[0]?.id || 'child_arshan');

      set({
        children,
        categories,
        tasks,
        settings,
        completions,
        familyRewards,
        selectedChildId: firstChildId,
        isLoading: false,
        isGasConnected: !!getAppsScriptUrl(),
      });
    } catch (err: unknown) {
      console.error('Initialize error', err);
      set({
        isLoading: false,
        error: 'Мәліметтерді жүктеу кезінде қате пайда болды. Жергілікті деректер пайдаланылуда.',
      });
    }
  },

  refreshData: async () => {
    const { currentWeekStart } = get();
    const { weekEnd } = getWeekRange(currentWeekStart);
    set({ isSaving: true });
    try {
      const [children, categories, tasks, settings, completions, familyRewards] = await Promise.all([
        api.getChildren(),
        api.getCategories(),
        api.getTasks(),
        api.getSettings(),
        api.getCompletions(currentWeekStart, weekEnd),
        api.getFamilyRewards(),
      ]);

      set({
        children,
        categories,
        tasks,
        settings,
        completions,
        familyRewards,
        isSaving: false,
        isGasConnected: !!getAppsScriptUrl(),
      });
    } catch (err) {
      console.error('Refresh error', err);
      set({ isSaving: false });
    }
  },

  checkConnection: async () => {
    const result = await api.ping();
    set({ isGasConnected: result.success });
    return result;
  },

  setSelectedChildId: (id: string) => set({ selectedChildId: id }),
  setSelectedDate: (date: string) => set({ selectedDate: date }),
  setCurrentWeekStart: (weekStart: string) => set({ currentWeekStart: weekStart }),

  toggleTask: async (taskId: string, targetChildId?: string, targetDate?: string) => {
    const state = get();
    const childId = targetChildId || state.selectedChildId;
    const date = targetDate || state.selectedDate;
    const deterministicId = `${date}_${childId}_${taskId}`;

    const existing = state.completions.find((c) => c.id === deterministicId);
    const newCompleted = !existing?.completed;

    // Optimistic update
    const previousCompletions = [...state.completions];
    const now = new Date().toISOString();
    const optimisticRecord: TaskCompletion = {
      id: deterministicId,
      date,
      childId,
      taskId,
      completed: newCompleted,
      completedAt: newCompleted ? now : undefined,
      updatedAt: now,
    };

    const idx = previousCompletions.findIndex((c) => c.id === deterministicId);
    let updatedList: TaskCompletion[];
    if (idx >= 0) {
      updatedList = [...previousCompletions];
      updatedList[idx] = optimisticRecord;
    } else {
      updatedList = [...previousCompletions, optimisticRecord];
    }

    set({ completions: updatedList });

    // Confetti effect if completed!
    if (newCompleted) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'],
        });
      } catch {
        // ignore if canvas not supported
      }
    }

    try {
      await api.toggleTaskCompletion(date, childId, taskId, newCompleted);
      return true;
    } catch (err) {
      console.error('Failed to sync completion, rolling back:', err);
      // Rollback
      set({
        completions: previousCompletions,
        error: 'Тапсырманы сақтау мүмкін болмады. Интернет байланысын тексеріңіз.',
      });
      return false;
    }
  },

  saveChild: async (child) => {
    set({ isSaving: true });
    try {
      const saved = await api.saveChild(child);
      const list = [...get().children];
      const idx = list.findIndex((c) => c.id === saved.id);
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
      set({ children: list, isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: 'Баланы сақтау кезінде қате орын алды' });
    }
  },

  saveTask: async (task) => {
    set({ isSaving: true });
    try {
      const saved = await api.saveTask(task);
      const list = [...get().tasks];
      const idx = list.findIndex((t) => t.id === saved.id);
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
      set({ tasks: list, isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: 'Тапсырманы сақтау кезінде қате орын алды' });
    }
  },

  saveSettings: async (newSettings) => {
    set({ isSaving: true });
    try {
      const updated = await api.saveSettings(newSettings);
      set({ settings: updated, isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: 'Баптауларды сақтау кезінде қате орын алды' });
    }
  },

  saveFamilyReward: async (reward) => {
    set({ isSaving: true });
    try {
      const saved = await api.saveFamilyReward(reward);
      const list = [...get().familyRewards];
      const idx = list.findIndex((r) => r.id === saved.id);
      if (idx >= 0) list[idx] = saved;
      else list.push(saved);
      set({ familyRewards: list, isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: 'Отбасылық сыйлықты сақтау кезінде қате орын алды' });
    }
  },

  // Calculations
  getChildDailyStats: (childId: string, dateParam?: string) => {
    const { tasks, completions, selectedDate } = get();
    const date = dateParam || selectedDate;
    const activeTasks = tasks.filter((t) => t.active);
    const total = activeTasks.length;

    let completed = 0;
    activeTasks.forEach((t) => {
      const comp = completions.find(
        (c) => c.date === date && c.childId === childId && c.taskId === t.id && c.completed
      );
      if (comp) completed++;
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  },

  getChildWeeklyStats: (childId: string, weekStartParam?: string): WeeklyChildSummary => {
    const { children, categories, tasks, completions, settings, currentWeekStart } = get();
    const weekStart = weekStartParam || currentWeekStart;
    const { days } = getWeekRange(weekStart);

    const child = children.find((c) => c.id === childId) || {
      id: childId,
      name: 'Белгісіз бала',
      avatarColor: 'bg-gray-400 text-white',
      avatarEmoji: '👦',
      active: true,
      createdAt: '',
      updatedAt: '',
    };

    const activeTasks = tasks.filter((t) => t.active);
    // Weekly required: active tasks * 7 days of the week
    const totalRequiredTasks = activeTasks.length * 7;

    // Count how many completions this child has in this week's 7 days
    const weekDates = new Set(days.map((d) => d.date));
    let completedCount = 0;

    // Category breakdown accumulator
    const catMap = new Map<string, { total: number; completed: number }>();
    categories.forEach((cat) => catMap.set(cat.id, { total: 0, completed: 0 }));

    activeTasks.forEach((task) => {
      const curr = catMap.get(task.categoryId) || { total: 0, completed: 0 };
      curr.total += 7; // 7 days in week
      catMap.set(task.categoryId, curr);
    });

    completions.forEach((comp) => {
      if (comp.childId === childId && comp.completed && weekDates.has(comp.date)) {
        const task = activeTasks.find((t) => t.id === comp.taskId);
        if (task) {
          completedCount++;
          const curr = catMap.get(task.categoryId);
          if (curr) {
            curr.completed++;
          }
        }
      }
    });

    const completionPercentage =
      totalRequiredTasks > 0 ? Math.min(100, Math.round((completedCount / totalRequiredTasks) * 100)) : 0;

    // Reward calculation using Settings
    let rewardAmount = 0;
    let status: 'earned_full' | 'earned_half' | 'zero' = 'zero';

    if (completionPercentage >= settings.FULL_COMPLETION_THRESHOLD) {
      rewardAmount = settings.FULL_REWARD;
      status = 'earned_full';
    } else if (completionPercentage >= settings.HALF_COMPLETION_THRESHOLD) {
      rewardAmount = settings.HALF_REWARD;
      status = 'earned_half';
    } else {
      rewardAmount = 0;
      status = 'zero';
    }

    const categoryBreakdown = categories
      .filter((cat) => cat.active)
      .map((cat) => {
        const data = catMap.get(cat.id) || { total: 0, completed: 0 };
        const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          total: data.total,
          completed: data.completed,
          percentage: pct,
        };
      });

    return {
      child,
      totalRequiredTasks,
      completedTasks: completedCount,
      completionPercentage,
      rewardAmount,
      status,
      categoryBreakdown,
    };
  },

  getFamilyRewardStatus: (weekStartParam?: string) => {
    const { children, settings, familyRewards, currentWeekStart, getChildWeeklyStats } = get();
    const weekStart = weekStartParam || currentWeekStart;
    const activeKids = children.filter((c) => c.active);

    const savedReward = familyRewards.find((r) => r.weekStart === weekStart);
    const rewardName = savedReward?.rewardName || settings.FAMILY_REWARD_NAME || 'Исмайыл Донерге бару';
    const description = savedReward?.description || settings.FAMILY_REWARD_DESC || '';

    const childrenStatus = activeKids.map((kid) => {
      const stats = getChildWeeklyStats(kid.id, weekStart);
      return {
        child: kid,
        percentage: stats.completionPercentage,
        isFull: stats.completionPercentage >= settings.FULL_COMPLETION_THRESHOLD,
      };
    });

    const completedKidsCount = childrenStatus.filter((s) => s.isFull).length;
    const totalKidsCount = activeKids.length;
    const isEarned = totalKidsCount > 0 && completedKidsCount === totalKidsCount;

    return {
      isEarned,
      rewardName,
      description,
      childrenStatus,
      completedKidsCount,
      totalKidsCount,
    };
  },
}));
