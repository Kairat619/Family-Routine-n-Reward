export type Child = {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
  active: boolean;
};

export type Task = {
  id: string;
  categoryId: string;
  name: string;
  sortOrder: number;
  active: boolean;
};

export type TaskCompletion = {
  id: string; // `${date}_${childId}_${taskId}`
  date: string; // YYYY-MM-DD
  childId: string;
  taskId: string;
  completed: boolean;
  completedAt?: string;
  updatedAt?: string;
};

export type SettingsMap = {
  FULL_REWARD: number;
  HALF_REWARD: number;
  FULL_COMPLETION_THRESHOLD: number;
  HALF_COMPLETION_THRESHOLD: number;
  CURRENCY: string;
  CURRENCY_SYMBOL: string;
  WEEK_STARTS_ON: string;
  FAMILY_REWARD_NAME: string;
  FAMILY_REWARD_DESC: string;
};

export type WeeklyReward = {
  id: string;
  weekStart: string;
  weekEnd: string;
  childId: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  rewardAmount: number;
  rewardStatus: 'pending' | 'earned_full' | 'earned_half' | 'zero' | 'paid';
  calculatedAt: string;
};

export type FamilyReward = {
  id: string;
  weekStart: string;
  weekEnd: string;
  rewardName: string;
  description: string;
  requiredPercentage: number;
  earned: boolean;
  earnedAt?: string;
  notes?: string;
};

export type WeeklyChildSummary = {
  child: Child;
  totalRequiredTasks: number;
  completedTasks: number;
  completionPercentage: number;
  rewardAmount: number;
  status: 'earned_full' | 'earned_half' | 'zero';
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
  } | null;
};
