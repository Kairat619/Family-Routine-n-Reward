import {
  Child,
  Category,
  Task,
  TaskCompletion,
  SettingsMap,
  FamilyReward,
  ApiResponse,
} from '../types';
import {
  INITIAL_CHILDREN,
  INITIAL_CATEGORIES,
  INITIAL_TASKS,
  DEFAULT_SETTINGS,
} from '../constants/initialData';

const LOCAL_STORAGE_KEYS = {
  GAS_URL: 'family_routine_gas_url',
  CHILDREN: 'family_routine_children',
  CATEGORIES: 'family_routine_categories',
  TASKS: 'family_routine_tasks',
  COMPLETIONS: 'family_routine_completions',
  SETTINGS: 'family_routine_settings',
  FAMILY_REWARDS: 'family_routine_family_rewards',
};

// Helper to get configured Apps Script URL
export function getAppsScriptUrl(): string {
  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_APPS_SCRIPT_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }
  return localStorage.getItem(LOCAL_STORAGE_KEYS.GAS_URL) || '';
}

export function setAppsScriptUrl(url: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.GAS_URL, url.trim());
}

// Local storage fallback helpers
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

// Low-level fetcher for Google Apps Script Web App
async function callGas<T>(
  action: string,
  method: 'GET' | 'POST' = 'GET',
  payload: Record<string, unknown> = {}
): Promise<ApiResponse<T>> {
  const url = getAppsScriptUrl();
  if (!url) {
    throw new Error('GAS_URL_NOT_CONFIGURED');
  }

  try {
    if (method === 'GET') {
      const query = new URLSearchParams({ action, ...payload } as Record<string, string>).toString();
      const fullUrl = `${url}${url.includes('?') ? '&' : '?'}${query}`;
      const res = await fetch(fullUrl, {
        method: 'GET',
        redirect: 'follow',
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      return (await res.json()) as ApiResponse<T>;
    } else {
      // POST: use text/plain to avoid CORS preflight rejection by Google Apps Script
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, ...payload }),
        redirect: 'follow',
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      return (await res.json()) as ApiResponse<T>;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      data: null,
      error: { code: 'NETWORK_ERROR', message },
    };
  }
}

export const api = {
  isConfigured(): boolean {
    return !!getAppsScriptUrl();
  },

  async ping(): Promise<{ success: boolean; latencyMs?: number; message?: string }> {
    const url = getAppsScriptUrl();
    if (!url) return { success: false, message: 'Google Apps Script URL енгізілмеген' };
    const start = performance.now();
    const res = await callGas<{ status: string }>('ping');
    const latencyMs = Math.round(performance.now() - start);
    if (res.success) {
      return { success: true, latencyMs, message: 'Байланыс сәтті орнатылды!' };
    }
    return { success: false, message: res.error?.message || 'Қосылу қатесі' };
  },

  // 1. Children
  async getChildren(): Promise<Child[]> {
    if (api.isConfigured()) {
      const res = await callGas<Child[]>('getChildren');
      if (res.success && res.data && res.data.length > 0) {
        setLocalItem(LOCAL_STORAGE_KEYS.CHILDREN, res.data);
        return res.data;
      }
    }
    return getLocalItem<Child[]>(LOCAL_STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN);
  },

  async saveChild(child: Partial<Child> & { name: string }): Promise<Child> {
    const localChildren = getLocalItem<Child[]>(LOCAL_STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN);
    const id = child.id || `child_${Date.now()}`;
    const now = new Date().toISOString();
    const updatedChild: Child = {
      id,
      name: child.name,
      avatarColor: child.avatarColor || 'bg-blue-500 text-white',
      avatarEmoji: child.avatarEmoji || '👦',
      active: child.active ?? true,
      createdAt: child.createdAt || now,
      updatedAt: now,
    };

    const index = localChildren.findIndex((c) => c.id === id);
    let newChildren: Child[];
    if (index >= 0) {
      newChildren = [...localChildren];
      newChildren[index] = { ...newChildren[index], ...updatedChild };
    } else {
      newChildren = [...localChildren, updatedChild];
    }
    setLocalItem(LOCAL_STORAGE_KEYS.CHILDREN, newChildren);

    if (api.isConfigured()) {
      await callGas<Child>('saveChild', 'POST', updatedChild);
    }

    return updatedChild;
  },

  // 2. Categories
  async getCategories(): Promise<Category[]> {
    if (api.isConfigured()) {
      const res = await callGas<Category[]>('getCategories');
      if (res.success && res.data && res.data.length > 0) {
        setLocalItem(LOCAL_STORAGE_KEYS.CATEGORIES, res.data);
        return res.data;
      }
    }
    return getLocalItem<Category[]>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // 3. Tasks
  async getTasks(): Promise<Task[]> {
    if (api.isConfigured()) {
      const res = await callGas<Task[]>('getTasks');
      if (res.success && res.data && res.data.length > 0) {
        setLocalItem(LOCAL_STORAGE_KEYS.TASKS, res.data);
        return res.data;
      }
    }
    return getLocalItem<Task[]>(LOCAL_STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },

  async saveTask(task: Partial<Task> & { categoryId: string; name: string }): Promise<Task> {
    const localTasks = getLocalItem<Task[]>(LOCAL_STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const id = task.id || `task_${Date.now()}`;
    const updatedTask: Task = {
      id,
      categoryId: task.categoryId,
      name: task.name,
      sortOrder: task.sortOrder || localTasks.length + 1,
      active: task.active ?? true,
    };

    const index = localTasks.findIndex((t) => t.id === id);
    let newTasks: Task[];
    if (index >= 0) {
      newTasks = [...localTasks];
      newTasks[index] = { ...newTasks[index], ...updatedTask };
    } else {
      newTasks = [...localTasks, updatedTask];
    }
    setLocalItem(LOCAL_STORAGE_KEYS.TASKS, newTasks);

    if (api.isConfigured()) {
      await callGas<Task>('saveTask', 'POST', updatedTask);
    }

    return updatedTask;
  },

  // 4. Completions
  async getCompletions(weekStart?: string, weekEnd?: string): Promise<TaskCompletion[]> {
    if (api.isConfigured()) {
      const res = await callGas<TaskCompletion[]>('getCompletions', 'GET', { weekStart, weekEnd });
      if (res.success && res.data) {
        // Merge with local storage
        const currentLocal = getLocalItem<TaskCompletion[]>(LOCAL_STORAGE_KEYS.COMPLETIONS, []);
        const map = new Map<string, TaskCompletion>();
        currentLocal.forEach((c) => map.set(c.id, c));
        res.data.forEach((c) => map.set(c.id, c));
        const merged = Array.from(map.values());
        setLocalItem(LOCAL_STORAGE_KEYS.COMPLETIONS, merged);
        return merged;
      }
    }
    return getLocalItem<TaskCompletion[]>(LOCAL_STORAGE_KEYS.COMPLETIONS, []);
  },

  async toggleTaskCompletion(
    date: string,
    childId: string,
    taskId: string,
    completed: boolean
  ): Promise<TaskCompletion> {
    const deterministicId = `${date}_${childId}_${taskId}`;
    const now = new Date().toISOString();
    const record: TaskCompletion = {
      id: deterministicId,
      date,
      childId,
      taskId,
      completed,
      completedAt: completed ? now : undefined,
      updatedAt: now,
    };

    // Update locally first for instantaneous responsiveness
    const local = getLocalItem<TaskCompletion[]>(LOCAL_STORAGE_KEYS.COMPLETIONS, []);
    const idx = local.findIndex((c) => c.id === deterministicId);
    let updated: TaskCompletion[];
    if (idx >= 0) {
      updated = [...local];
      updated[idx] = record;
    } else {
      updated = [...local, record];
    }
    setLocalItem(LOCAL_STORAGE_KEYS.COMPLETIONS, updated);

    // Sync to Google Apps Script if configured
    if (api.isConfigured()) {
      const res = await callGas<TaskCompletion>('toggleTaskCompletion', 'POST', {
        date,
        childId,
        taskId,
        completed,
      });
      if (!res.success) {
        throw new Error(res.error?.message || 'Google Sheets-ке сақтау қатесі');
      }
    }

    return record;
  },

  // 5. Settings
  async getSettings(): Promise<SettingsMap> {
    if (api.isConfigured()) {
      const res = await callGas<SettingsMap>('getSettings');
      if (res.success && res.data && Object.keys(res.data).length > 0) {
        setLocalItem(LOCAL_STORAGE_KEYS.SETTINGS, res.data);
        return { ...DEFAULT_SETTINGS, ...res.data };
      }
    }
    return getLocalItem<SettingsMap>(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async saveSettings(settings: Partial<SettingsMap>): Promise<SettingsMap> {
    const current = getLocalItem<SettingsMap>(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const updated = { ...current, ...settings };
    setLocalItem(LOCAL_STORAGE_KEYS.SETTINGS, updated);

    if (api.isConfigured()) {
      await callGas<SettingsMap>('saveSettings', 'POST', { settings: updated });
    }

    return updated;
  },

  // 6. Family Rewards
  async getFamilyRewards(): Promise<FamilyReward[]> {
    if (api.isConfigured()) {
      const res = await callGas<FamilyReward[]>('getFamilyRewards');
      if (res.success && res.data && res.data.length > 0) {
        setLocalItem(LOCAL_STORAGE_KEYS.FAMILY_REWARDS, res.data);
        return res.data;
      }
    }
    return getLocalItem<FamilyReward[]>(LOCAL_STORAGE_KEYS.FAMILY_REWARDS, []);
  },

  async saveFamilyReward(reward: Partial<FamilyReward> & { weekStart: string; rewardName: string }): Promise<FamilyReward> {
    const localRewards = getLocalItem<FamilyReward[]>(LOCAL_STORAGE_KEYS.FAMILY_REWARDS, []);
    const id = reward.id || `${reward.weekStart}_family`;
    const updatedReward: FamilyReward = {
      id,
      weekStart: reward.weekStart,
      weekEnd: reward.weekEnd || '',
      rewardName: reward.rewardName,
      description: reward.description || '',
      requiredPercentage: reward.requiredPercentage ?? 100,
      earned: reward.earned ?? false,
      earnedAt: reward.earned ? new Date().toISOString() : undefined,
      notes: reward.notes || '',
    };

    const idx = localRewards.findIndex((r) => r.id === id);
    let list: FamilyReward[];
    if (idx >= 0) {
      list = [...localRewards];
      list[idx] = updatedReward;
    } else {
      list = [...localRewards, updatedReward];
    }
    setLocalItem(LOCAL_STORAGE_KEYS.FAMILY_REWARDS, list);

    if (api.isConfigured()) {
      await callGas<FamilyReward>('saveFamilyReward', 'POST', updatedReward);
    }

    return updatedReward;
  },

  // Reset demo / seed data helper
  resetToDefaultSeed(): void {
    setLocalItem(LOCAL_STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN);
    setLocalItem(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setLocalItem(LOCAL_STORAGE_KEYS.TASKS, INITIAL_TASKS);
    setLocalItem(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
};
