import React, { useState } from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { getAppsScriptUrl, setAppsScriptUrl, api } from '../services/api';
import { GOOGLE_APPS_SCRIPT_SOURCE } from '../services/googleAppsScriptCode';
import {
  Settings,
  Database,
  Users,
  CheckSquare,
  Award,
  Check,
  Copy,
  ExternalLink,
  Plus,
  RefreshCw,
  FileCode,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    children,
    categories,
    tasks,
    settings,
    saveSettings,
    saveChild,
    saveTask,
    refreshData,
    checkConnection,
    isSaving,
  } = useFamilyStore();

  const [gasUrlInput, setGasUrlInput] = useState(getAppsScriptUrl());
  const [pingStatus, setPingStatus] = useState<{ loading: boolean; message?: string; success?: boolean }>({
    loading: false,
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Reward settings form state
  const [rewardForm, setRewardForm] = useState({
    FULL_REWARD: settings.FULL_REWARD,
    HALF_REWARD: settings.HALF_REWARD,
    FULL_COMPLETION_THRESHOLD: settings.FULL_COMPLETION_THRESHOLD,
    HALF_COMPLETION_THRESHOLD: settings.HALF_COMPLETION_THRESHOLD,
    FAMILY_REWARD_NAME: settings.FAMILY_REWARD_NAME,
    FAMILY_REWARD_DESC: settings.FAMILY_REWARD_DESC,
  });

  // Child modal state
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildEmoji, setNewChildEmoji] = useState('👦');

  // Task modal state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState(categories[0]?.id || 'cat_sabak');

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'gas' | 'rewards' | 'children' | 'tasks'>('gas');

  const handleSaveGasUrl = async () => {
    setAppsScriptUrl(gasUrlInput);
    setPingStatus({ loading: true });
    const res = await checkConnection();
    setPingStatus({
      loading: false,
      success: res.success,
      message: res.message || (res.success ? 'Қосылды!' : 'Қосылу мүмкін болмады'),
    });
    if (res.success) {
      await refreshData();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SOURCE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSaveRewardSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(rewardForm);
    alert('Баптаулар сәтті сақталды!');
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    await saveChild({
      name: newChildName.trim(),
      avatarEmoji: newChildEmoji,
      avatarColor: 'bg-indigo-500 text-white',
      active: true,
    });
    setNewChildName('');
    setShowAddChildModal(false);
  };

  const handleToggleChildActive = async (childId: string, currentActive: boolean) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return;
    await saveChild({
      ...child,
      active: !currentActive,
    });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    await saveTask({
      name: newTaskName.trim(),
      categoryId: newTaskCategory,
      active: true,
    });
    setNewTaskName('');
    setShowAddTaskModal(false);
  };

  const handleToggleTaskActive = async (taskId: string, currentActive: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    await saveTask({
      ...task,
      active: !currentActive,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-['Fredoka',sans-serif] font-bold text-slate-900">
          Ата-ана бақылауы және баптаулар
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Google Sheets дерекқоры, сыйақы мөлшерлері, балалар мен тапсырмаларды басқару
        </p>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('gas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'gas'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          Google Sheets байланысы
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'rewards'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Сыйақы баптаулары
        </button>

        <button
          onClick={() => setActiveTab('children')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'children'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Балалар ({children.length})
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'tasks'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Тапсырмалар ({tasks.length})
        </button>
      </div>

      {/* TAB 1: GOOGLE SHEETS & APPS SCRIPT SETUP */}
      {activeTab === 'gas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
                  Google Apps Script Web App байланысы
                </h3>
                <p className="text-xs text-slate-500">
                  Барлық деректер сіздің жеке Google Таблицаңызда (Google Sheets) сақталады
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Google Apps Script Web App URL мекенжайы:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={gasUrlInput}
                  onChange={(e) => setGasUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveGasUrl}
                  disabled={pingStatus.loading || isSaving}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs"
                >
                  {pingStatus.loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Тексеру және сақтау
                </button>
              </div>

              {pingStatus.message && (
                <div
                  className={`p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    pingStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <span>{pingStatus.success ? '✅' : '❌'}</span>
                  <span>{pingStatus.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="bg-amber-50/70 rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-['Fredoka',sans-serif] text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
                <span>📋 Қадамдық орнату нұсқаулығы</span>
              </h4>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Код көшірілді!' : 'Apps Script кодын көшіру'}
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <li>
                Жаңа{' '}
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-amber-800 underline inline-flex items-center gap-1"
                >
                  Google Sheets парағын ашыңыз <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Жоғарғы мәзірден <b>Кеңейтімдер → Apps Script</b> (Extensions → Apps Script) басыңыз.
              </li>
              <li>
                Ашылған терезеге осы жүйенің дайын кодын көшіріп қойыңыз (Жоғарыдағы{' '}
                <b>«Apps Script кодын көшіру»</b> батырмасы).
              </li>
              <li>
                Жоғарыдағы функциялар тізімінен <b>setupDatabase</b> функциясын таңдап, <b>Іске қосу (Run)</b> басыңыз.
                Рұқсат сұралса - рұқсат беріңіз. (Барлық парақтар автоматты жасалады).
              </li>
              <li>
                <b>Жариялау → Жаңа орналастыру (Deploy → New deployment)</b> таңдаңыз:
                <div className="ml-5 mt-1 p-2.5 rounded-xl bg-white/80 border border-amber-200 text-xs space-y-1">
                  <div>• Түрі: <b>Веб-қосымша (Web app)</b></div>
                  <div>• Кім атынан: <b>Мен (Me)</b></div>
                  <div>• Қолжетімділік: <b>Барлығы (Anyone)</b></div>
                </div>
              </li>
              <li>
                Пайда болған <b>Web App URL</b> сілтемесін көшіріп, жоғарыдағы өріске қойып, «Тексеру және сақтау»
                батырмасын басыңыз!
              </li>
            </ol>

            {/* Expandable Apps Script Code View */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
              >
                <FileCode className="w-4 h-4" />
                {showCode ? 'Кодты жасыру' : 'Apps Script кодын қарау (Code.gs)'}
              </button>

              {showCode && (
                <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono max-h-72 overflow-y-auto">
                  <pre>{GOOGLE_APPS_SCRIPT_SOURCE}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REWARD SETTINGS */}
      {activeTab === 'rewards' && (
        <form onSubmit={handleSaveRewardSettings} className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
              Сыйақылар мен табалдырықтар баптауы
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                100% толық сыйақы сомасы (₸):
              </label>
              <input
                type="number"
                value={rewardForm.FULL_REWARD}
                onChange={(e) => setRewardForm({ ...rewardForm, FULL_REWARD: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                50% жартылай сыйақы сомасы (₸):
              </label>
              <input
                type="number"
                value={rewardForm.HALF_REWARD}
                onChange={(e) => setRewardForm({ ...rewardForm, HALF_REWARD: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Толық сыйақы табалдырығы (%):
              </label>
              <input
                type="number"
                value={rewardForm.FULL_COMPLETION_THRESHOLD}
                onChange={(e) => setRewardForm({ ...rewardForm, FULL_COMPLETION_THRESHOLD: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Жартылай сыйақы табалдырығы (%):
              </label>
              <input
                type="number"
                value={rewardForm.HALF_COMPLETION_THRESHOLD}
                onChange={(e) => setRewardForm({ ...rewardForm, HALF_COMPLETION_THRESHOLD: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h4 className="font-['Fredoka',sans-serif] text-base font-bold text-slate-900">
              Ортақ отбасылық сыйлық (Командалық сыйлық)
            </h4>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Сыйлық атауы:
              </label>
              <input
                type="text"
                value={rewardForm.FAMILY_REWARD_NAME}
                onChange={(e) => setRewardForm({ ...rewardForm, FAMILY_REWARD_NAME: e.target.value })}
                placeholder="Мысалы: Исмайыл Донерге бару"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Сыйлық сипаттамасы:
              </label>
              <input
                type="text"
                value={rewardForm.FAMILY_REWARD_DESC}
                onChange={(e) => setRewardForm({ ...rewardForm, FAMILY_REWARD_DESC: e.target.value })}
                placeholder="Мысалы: Барлық 4 бала тапсырмаларды 100% орындаса"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Баптауларды сақтау
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CHILDREN MANAGEMENT */}
      {activeTab === 'children' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h3 className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
                Балаларды басқару
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddChildModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Бала қосу
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{child.avatarEmoji}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{child.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        child.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {child.active ? 'Белсенді' : 'Өшірілген'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleChildActive(child.id, child.active)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    child.active
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {child.active ? 'Өшіру' : 'Қосу'}
                </button>
              </div>
            ))}
          </div>

          {/* Add Child Modal */}
          {showAddChildModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <form
                onSubmit={handleAddChild}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
              >
                <h4 className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
                  Жаңа бала қосу
                </h4>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Баланың аты:</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Мысалы: Арман"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Эмоджи таңдау:</label>
                  <div className="flex gap-2">
                    {['👦', '👧', '🧒', '👶', '🧑'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewChildEmoji(emoji)}
                        className={`text-2xl p-2 rounded-xl border ${
                          newChildEmoji === emoji ? 'bg-amber-100 border-amber-400' : 'border-slate-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddChildModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Бас тарту
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs"
                  >
                    Қосу
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TASKS MANAGEMENT */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-600" />
              <h3 className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
                Тапсырмаларды басқару ({tasks.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Тапсырма қосу
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const catTasks = tasks.filter((t) => t.categoryId === cat.id);
              return (
                <div key={cat.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40">
                  <h4 className="font-bold text-slate-900 text-sm mb-2.5 flex items-center justify-between">
                    <span>{cat.name}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {catTasks.filter((t) => t.active).length} белсенді
                    </span>
                  </h4>

                  <div className="space-y-2">
                    {catTasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm"
                      >
                        <span className={`font-semibold ${t.active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                          {t.name}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleTaskActive(t.id, t.active)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            t.active
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {t.active ? 'Өшіру' : 'Қосу'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Task Modal */}
          {showAddTaskModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <form
                onSubmit={handleAddTask}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
              >
                <h4 className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
                  Жаңа тапсырма қосу
                </h4>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Санаты:</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Тапсырма атауы:</label>
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Мысалы: Бассейнге бару"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Бас тарту
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs"
                  >
                    Қосу
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
