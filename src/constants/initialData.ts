import { Child, Category, Task, SettingsMap, FamilyReward } from '../types';

export const INITIAL_CHILDREN: Child[] = [
  {
    id: 'child_arshan',
    name: 'Аршан',
    avatarColor: 'bg-blue-500 text-white',
    avatarEmoji: '👦',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'child_sharapat',
    name: 'Шарапат',
    avatarColor: 'bg-rose-500 text-white',
    avatarEmoji: '👧',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'child_nurkadyr',
    name: 'Нұр Қадыр',
    avatarColor: 'bg-amber-500 text-white',
    avatarEmoji: '👦',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'child_alikhan',
    name: 'Алихан',
    avatarColor: 'bg-emerald-500 text-white',
    avatarEmoji: '🧒',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_sabak',
    name: 'Сабақ',
    icon: 'BookOpen',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'cat_enbek',
    name: 'Еңбек',
    icon: 'Sparkles',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'cat_sport',
    name: 'Спорт',
    icon: 'Dumbbell',
    sortOrder: 3,
    active: true,
  },
  {
    id: 'cat_din',
    name: 'Дін',
    icon: 'Moon',
    sortOrder: 4,
    active: true,
  },
  {
    id: 'cat_tartip',
    name: 'Тәртіп',
    icon: 'Clock',
    sortOrder: 5,
    active: true,
  },
];

export const INITIAL_TASKS: Task[] = [
  // 5.1 Сабақ
  { id: 'task_math', categoryId: 'cat_sabak', name: 'Математика', sortOrder: 1, active: true },
  { id: 'task_english', categoryId: 'cat_sabak', name: 'Ағылшын тілі', sortOrder: 2, active: true },
  { id: 'task_russian', categoryId: 'cat_sabak', name: 'Орыс тілі', sortOrder: 3, active: true },
  { id: 'task_reading', categoryId: 'cat_sabak', name: 'Кітап оқу', sortOrder: 4, active: true },
  { id: 'task_homework', categoryId: 'cat_sabak', name: 'Үй тапсырмасын орындау', sortOrder: 5, active: true },

  // 5.2 Еңбек
  { id: 'task_sweep', categoryId: 'cat_enbek', name: 'Үй сыпыру', sortOrder: 1, active: true },
  { id: 'task_bed_make', categoryId: 'cat_enbek', name: 'Төсек салу', sortOrder: 2, active: true },
  { id: 'task_bed_tidy', categoryId: 'cat_enbek', name: 'Төсек жинау', sortOrder: 3, active: true },
  { id: 'task_water', categoryId: 'cat_enbek', name: 'Су әкелу', sortOrder: 4, active: true },
  { id: 'task_cleaning', categoryId: 'cat_enbek', name: 'Тазалық жасау', sortOrder: 5, active: true },
  { id: 'task_trash', categoryId: 'cat_enbek', name: 'Қоқыс шығару', sortOrder: 6, active: true },
  { id: 'task_tidy_belongings', categoryId: 'cat_enbek', name: 'Өз заттарын жинау', sortOrder: 7, active: true },

  // 5.3 Спорт
  { id: 'task_pushups', categoryId: 'cat_sport', name: 'Отжимание', sortOrder: 1, active: true },
  { id: 'task_squats', categoryId: 'cat_sport', name: 'Отырып-тұру', sortOrder: 2, active: true },
  { id: 'task_abs', categoryId: 'cat_sport', name: 'Пресс жасау', sortOrder: 3, active: true },
  { id: 'task_pullups', categoryId: 'cat_sport', name: 'Турникке тартылу', sortOrder: 4, active: true },

  // 5.4 Дін
  { id: 'task_dhikr', categoryId: 'cat_din', name: 'Зікір айту', sortOrder: 1, active: true },
  { id: 'task_quran_read', categoryId: 'cat_din', name: 'Құран оқу', sortOrder: 2, active: true },
  { id: 'task_quran_learn', categoryId: 'cat_din', name: 'Құран оқуды үйрену', sortOrder: 3, active: true },

  // 5.5 Тәртіп
  { id: 'task_sleep_time', categoryId: 'cat_tartip', name: 'Уақытында жату', sortOrder: 1, active: true },
  { id: 'task_wake_time', categoryId: 'cat_tartip', name: 'Уақытында тұру', sortOrder: 2, active: true },
  { id: 'task_eat_time', categoryId: 'cat_tartip', name: 'Тамақты уақытында ішу', sortOrder: 3, active: true },
  { id: 'task_study_time', categoryId: 'cat_tartip', name: 'Сабақты уақытында орындау', sortOrder: 4, active: true },
  { id: 'task_clothes_place', categoryId: 'cat_tartip', name: 'Киімін, заттарын орнына қою', sortOrder: 5, active: true },
  { id: 'task_elders_respect', categoryId: 'cat_tartip', name: 'Үлкендердің айтқанын уақытында орындау', sortOrder: 6, active: true },
];

export const DEFAULT_SETTINGS: SettingsMap = {
  FULL_REWARD: 4000,
  HALF_REWARD: 2000,
  FULL_COMPLETION_THRESHOLD: 100,
  HALF_COMPLETION_THRESHOLD: 50,
  CURRENCY: 'KZT',
  CURRENCY_SYMBOL: '₸',
  WEEK_STARTS_ON: 'Monday',
  FAMILY_REWARD_NAME: 'Исмайыл Донерге бару',
  FAMILY_REWARD_DESC: 'Барлық 4 бала апталық тапсырмаларды 100% орындаса — барлығымыз бірге донер жеуге барамыз!',
};

export const DEFAULT_FAMILY_REWARD_TEMPLATE: Omit<FamilyReward, 'id' | 'weekStart' | 'weekEnd'> = {
  rewardName: 'Исмайыл Донерге бару',
  description: 'Барлық 4 бала апталық тапсырмаларды толық орындағанда берілетін ортақ сыйлық',
  requiredPercentage: 100,
  earned: false,
};
