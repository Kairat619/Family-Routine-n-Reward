/**
 * Full production-ready Google Apps Script code to paste into Google Sheets Extensions -> Apps Script
 */
export const GOOGLE_APPS_SCRIPT_SOURCE = `/**
 * =========================================================================
 * Family Routine & Reward - Google Apps Script Backend
 * Kids Daily Routine & Reward Management System
 * =========================================================================
 * 
 * ОРНАТУ НҰСҚАУЛЫҒЫ:
 * 1. Жаңа Google Таблица ашыңыз (Google Sheets).
 * 2. Жоғарғы мәзірден Кеңейтімдер -> Apps Script (Extensions -> Apps Script) басыңыз.
 * 3. Осы файлдағы барлық кодты Apps Script редакциясына көшіріп қойыңыз (Code.gs).
 * 4. Функциялар тізімінен 'setupDatabase' функциясын таңдап, 'Іске қосу' (Run) басыңыз.
 * 5. Рұқсаттар сұралса - рұқсат беріңіз. Барлық қажетті парақтар (Children, Tasks, т.б.) автоматты түрде жасалады.
 * 6. 'Жариялау' -> 'Жаңа орналастыру' (Deploy -> New deployment) таңдаңыз:
 *    - Түрі: Веб-қосымша (Web app)
 *    - Кім атынан орындалады: Мен (Execute as: Me)
 *    - Қолжетімділік: Барлығы (Who has access: Anyone)
 * 7. Пайда болған Web App URL сілтемесін көшіріп, осы жүйенің Баптаулар (Settings) бөліміне қойыңыз.
 */

// Бастапқы мәліметтер
var INITIAL_DATA = {
  children: [
    { id: 'child_arshan', name: 'Аршан', avatarColor: 'bg-blue-500 text-white', avatarEmoji: '👦', active: true },
    { id: 'child_sharapat', name: 'Шарапат', avatarColor: 'bg-rose-500 text-white', avatarEmoji: '👧', active: true },
    { id: 'child_nurkadyr', name: 'Нұр Қадыр', avatarColor: 'bg-amber-500 text-white', avatarEmoji: '👦', active: true },
    { id: 'child_alikhan', name: 'Алихан', avatarColor: 'bg-emerald-500 text-white', avatarEmoji: '🧒', active: true }
  ],
  categories: [
    { id: 'cat_sabak', name: 'Сабақ', icon: 'BookOpen', sortOrder: 1, active: true },
    { id: 'cat_enbek', name: 'Еңбек', icon: 'Sparkles', sortOrder: 2, active: true },
    { id: 'cat_sport', name: 'Спорт', icon: 'Dumbbell', sortOrder: 3, active: true },
    { id: 'cat_din', name: 'Дін', icon: 'Moon', sortOrder: 4, active: true },
    { id: 'cat_tartip', name: 'Тәртіп', icon: 'Clock', sortOrder: 5, active: true }
  ],
  tasks: [
    // Сабақ
    { id: 'task_math', categoryId: 'cat_sabak', name: 'Математика', sortOrder: 1, active: true },
    { id: 'task_english', categoryId: 'cat_sabak', name: 'Ағылшын тілі', sortOrder: 2, active: true },
    { id: 'task_russian', categoryId: 'cat_sabak', name: 'Орыс тілі', sortOrder: 3, active: true },
    { id: 'task_reading', categoryId: 'cat_sabak', name: 'Кітап оқу', sortOrder: 4, active: true },
    { id: 'task_homework', categoryId: 'cat_sabak', name: 'Үй тапсырмасын орындау', sortOrder: 5, active: true },
    // Еңбек
    { id: 'task_sweep', categoryId: 'cat_enbek', name: 'Үй сыпыру', sortOrder: 1, active: true },
    { id: 'task_bed_make', categoryId: 'cat_enbek', name: 'Төсек салу', sortOrder: 2, active: true },
    { id: 'task_bed_tidy', categoryId: 'cat_enbek', name: 'Төсек жинау', sortOrder: 3, active: true },
    { id: 'task_water', categoryId: 'cat_enbek', name: 'Су әкелу', sortOrder: 4, active: true },
    { id: 'task_cleaning', categoryId: 'cat_enbek', name: 'Тазалық жасау', sortOrder: 5, active: true },
    { id: 'task_trash', categoryId: 'cat_enbek', name: 'Қоқыс шығару', sortOrder: 6, active: true },
    { id: 'task_tidy_belongings', categoryId: 'cat_enbek', name: 'Өз заттарын жинау', sortOrder: 7, active: true },
    // Спорт
    { id: 'task_pushups', categoryId: 'cat_sport', name: 'Отжимание', sortOrder: 1, active: true },
    { id: 'task_squats', categoryId: 'cat_sport', name: 'Отырып-тұру', sortOrder: 2, active: true },
    { id: 'task_abs', categoryId: 'cat_sport', name: 'Пресс жасау', sortOrder: 3, active: true },
    { id: 'task_pullups', categoryId: 'cat_sport', name: 'Турникке тартылу', sortOrder: 4, active: true },
    // Дін
    { id: 'task_dhikr', categoryId: 'cat_din', name: 'Зікір айту', sortOrder: 1, active: true },
    { id: 'task_quran_read', categoryId: 'cat_din', name: 'Құран оқу', sortOrder: 2, active: true },
    { id: 'task_quran_learn', categoryId: 'cat_din', name: 'Құран оқуды үйрену', sortOrder: 3, active: true },
    // Тәртіп
    { id: 'task_sleep_time', categoryId: 'cat_tartip', name: 'Уақытында жату', sortOrder: 1, active: true },
    { id: 'task_wake_time', categoryId: 'cat_tartip', name: 'Уақытында тұру', sortOrder: 2, active: true },
    { id: 'task_eat_time', categoryId: 'cat_tartip', name: 'Тамақты уақытында ішу', sortOrder: 3, active: true },
    { id: 'task_study_time', categoryId: 'cat_tartip', name: 'Сабақты уақытында орындау', sortOrder: 4, active: true },
    { id: 'task_clothes_place', categoryId: 'cat_tartip', name: 'Киімін, заттарын орнына қою', sortOrder: 5, active: true },
    { id: 'task_elders_respect', categoryId: 'cat_tartip', name: 'Үлкендердің айтқанын уақытында орындау', sortOrder: 6, active: true }
  ],
  settings: [
    ['FULL_REWARD', '4000'],
    ['HALF_REWARD', '2000'],
    ['FULL_COMPLETION_THRESHOLD', '100'],
    ['HALF_COMPLETION_THRESHOLD', '50'],
    ['CURRENCY', 'KZT'],
    ['CURRENCY_SYMBOL', '₸'],
    ['WEEK_STARTS_ON', 'Monday'],
    ['FAMILY_REWARD_NAME', 'Исмайыл Донерге бару'],
    ['FAMILY_REWARD_DESC', 'Барлық 4 бала тапсырмаларын 100% орындаса']
  ]
};

/**
 * Базаны автоматты дайындау функциясы
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var now = new Date().toISOString();

  // 1. Children
  var chSheet = getOrCreateSheet(ss, 'Children');
  if (chSheet.getLastRow() === 0) {
    chSheet.appendRow(['id', 'name', 'avatarColor', 'avatarEmoji', 'active', 'createdAt', 'updatedAt']);
    INITIAL_DATA.children.forEach(function(c) {
      chSheet.appendRow([c.id, c.name, c.avatarColor, c.avatarEmoji, c.active, now, now]);
    });
  }

  // 2. Categories
  var catSheet = getOrCreateSheet(ss, 'Categories');
  if (catSheet.getLastRow() === 0) {
    catSheet.appendRow(['id', 'name', 'icon', 'sortOrder', 'active']);
    INITIAL_DATA.categories.forEach(function(cat) {
      catSheet.appendRow([cat.id, cat.name, cat.icon, cat.sortOrder, cat.active]);
    });
  }

  // 3. Tasks
  var tSheet = getOrCreateSheet(ss, 'Tasks');
  if (tSheet.getLastRow() === 0) {
    tSheet.appendRow(['id', 'categoryId', 'name', 'sortOrder', 'active']);
    INITIAL_DATA.tasks.forEach(function(t) {
      tSheet.appendRow([t.id, t.categoryId, t.name, t.sortOrder, t.active]);
    });
  }

  // 4. TaskCompletions
  var compSheet = getOrCreateSheet(ss, 'TaskCompletions');
  if (compSheet.getLastRow() === 0) {
    compSheet.appendRow(['id', 'date', 'childId', 'taskId', 'completed', 'completedAt', 'updatedAt']);
  }

  // 5. WeeklyRewards
  var wrSheet = getOrCreateSheet(ss, 'WeeklyRewards');
  if (wrSheet.getLastRow() === 0) {
    wrSheet.appendRow(['id', 'weekStart', 'weekEnd', 'childId', 'totalTasks', 'completedTasks', 'completionPercentage', 'rewardAmount', 'rewardStatus', 'calculatedAt']);
  }

  // 6. FamilyRewards
  var frSheet = getOrCreateSheet(ss, 'FamilyRewards');
  if (frSheet.getLastRow() === 0) {
    frSheet.appendRow(['id', 'weekStart', 'weekEnd', 'rewardName', 'description', 'requiredPercentage', 'earned', 'earnedAt', 'notes']);
  }

  // 7. Settings
  var sSheet = getOrCreateSheet(ss, 'Settings');
  if (sSheet.getLastRow() === 0) {
    sSheet.appendRow(['key', 'value']);
    INITIAL_DATA.settings.forEach(function(item) {
      sSheet.appendRow([item[0], item[1]]);
    });
  }

  return { success: true, message: 'Database setup complete!' };
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Web App API өңдеуі
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'ping';
    var result;

    switch (action) {
      case 'ping':
        result = { success: true, data: { status: 'ok', serverTime: new Date().toISOString() } };
        break;
      case 'bootstrap':
      case 'getAllData':
        result = handleGetAllData(params.weekStart, params.date);
        break;
      case 'getChildren':
        result = { success: true, data: getTableRows('Children') };
        break;
      case 'getCategories':
        result = { success: true, data: getTableRows('Categories') };
        break;
      case 'getTasks':
        result = { success: true, data: getTableRows('Tasks') };
        break;
      case 'getSettings':
        result = { success: true, data: getSettingsMap() };
        break;
      case 'getCompletions':
        result = { success: true, data: getCompletionsData(params.weekStart, params.weekEnd, params.date, params.childId) };
        break;
      default:
        result = { success: false, error: { code: 'UNKNOWN_ACTION', message: 'Unknown action: ' + action } };
    }

    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: { code: 'SERVER_ERROR', message: err.toString() } });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 15 секунд күту (concurrency safety)
    lock.waitLock(15000);

    var body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (ex) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    var action = body.action || '';
    var result;

    switch (action) {
      case 'setupDatabase':
        result = setupDatabase();
        break;
      case 'toggleTaskCompletion':
        result = handleToggleCompletion(body);
        break;
      case 'saveChild':
        result = handleSaveChild(body);
        break;
      case 'saveTask':
        result = handleSaveTask(body);
        break;
      case 'saveSettings':
        result = handleSaveSettings(body);
        break;
      case 'saveFamilyReward':
        result = handleSaveFamilyReward(body);
        break;
      default:
        result = { success: false, error: { code: 'UNKNOWN_POST_ACTION', message: 'Action not supported: ' + action } };
    }

    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: { code: 'MUTATION_ERROR', message: err.toString() } });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTableRows(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && row[0] !== 0) continue; // skip empty
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      if (val === 'TRUE' || val === true) val = true;
      if (val === 'FALSE' || val === false) val = false;
      obj[headers[j]] = val;
    }
    rows.push(obj);
  }
  return rows;
}

function getSettingsMap() {
  var rows = getTableRows('Settings');
  var map = {};
  rows.forEach(function(r) {
    if (r.key) {
      var num = Number(r.value);
      map[r.key] = isNaN(num) ? r.value : num;
    }
  });
  return map;
}

function getCompletionsData(weekStart, weekEnd, date, childId) {
  var rows = getTableRows('TaskCompletions');
  if (!weekStart && !weekEnd && !date && !childId) return rows;
  return rows.filter(function(r) {
    if (date && r.date !== date) return false;
    if (childId && r.childId !== childId) return false;
    if (weekStart && r.date < weekStart) return false;
    if (weekEnd && r.date > weekEnd) return false;
    return true;
  });
}

function handleGetAllData(weekStart, date) {
  return {
    success: true,
    data: {
      children: getTableRows('Children'),
      categories: getTableRows('Categories'),
      tasks: getTableRows('Tasks'),
      settings: getSettingsMap(),
      completions: getCompletionsData(weekStart, null, null, null),
      familyRewards: getTableRows('FamilyRewards'),
      weeklyRewards: getTableRows('WeeklyRewards')
    }
  };
}

function handleToggleCompletion(body) {
  var date = body.date;
  var childId = body.childId;
  var taskId = body.taskId;
  var completed = body.completed === true || body.completed === 'true';
  
  if (!date || !childId || !taskId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'Missing date, childId, or taskId' } };
  }

  var deterministicId = date + '_' + childId + '_' + taskId;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('TaskCompletions');
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName('TaskCompletions');
  }

  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === deterministicId) {
      rowIndex = i + 1;
      break;
    }
  }

  var now = new Date().toISOString();
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 5).setValue(completed);
    sheet.getRange(rowIndex, 6).setValue(completed ? now : '');
    sheet.getRange(rowIndex, 7).setValue(now);
  } else {
    sheet.appendRow([deterministicId, date, childId, taskId, completed, completed ? now : '', now]);
  }

  return {
    success: true,
    data: {
      id: deterministicId,
      date: date,
      childId: childId,
      taskId: taskId,
      completed: completed,
      completedAt: completed ? now : null
    }
  };
}

function handleSaveChild(body) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Children');
  var id = body.id || ('child_' + new Date().getTime());
  var name = body.name || '';
  var avatarColor = body.avatarColor || 'bg-indigo-500 text-white';
  var avatarEmoji = body.avatarEmoji || '👦';
  var active = body.active !== false && body.active !== 'false';
  var now = new Date().toISOString();

  var data = sheet.getDataRange().getValues();
  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 2).setValue(name);
      sheet.getRange(i + 1, 3).setValue(avatarColor);
      sheet.getRange(i + 1, 4).setValue(avatarEmoji);
      sheet.getRange(i + 1, 5).setValue(active);
      sheet.getRange(i + 1, 7).setValue(now);
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([id, name, avatarColor, avatarEmoji, active, now, now]);
  }

  return { success: true, data: { id: id, name: name, avatarColor: avatarColor, avatarEmoji: avatarEmoji, active: active } };
}

function handleSaveTask(body) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Tasks');
  var id = body.id || ('task_' + new Date().getTime());
  var categoryId = body.categoryId;
  var name = body.name;
  var sortOrder = Number(body.sortOrder) || 1;
  var active = body.active !== false && body.active !== 'false';

  var data = sheet.getDataRange().getValues();
  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 2).setValue(categoryId);
      sheet.getRange(i + 1, 3).setValue(name);
      sheet.getRange(i + 1, 4).setValue(sortOrder);
      sheet.getRange(i + 1, 5).setValue(active);
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([id, categoryId, name, sortOrder, active]);
  }

  return { success: true, data: { id: id, categoryId: categoryId, name: name, sortOrder: sortOrder, active: active } };
}

function handleSaveSettings(body) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Settings');
  var settings = body.settings || body;
  
  var data = sheet.getDataRange().getValues();
  var keyRowMap = {};
  for (var i = 1; i < data.length; i++) {
    keyRowMap[data[i][0]] = i + 1;
  }

  Object.keys(settings).forEach(function(key) {
    if (key === 'action') return;
    var val = String(settings[key]);
    if (keyRowMap[key]) {
      sheet.getRange(keyRowMap[key], 2).setValue(val);
    } else {
      sheet.appendRow([key, val]);
    }
  });

  return { success: true, data: getSettingsMap() };
}

function handleSaveFamilyReward(body) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('FamilyRewards');
  var id = body.id || (body.weekStart + '_family');
  var weekStart = body.weekStart;
  var weekEnd = body.weekEnd;
  var rewardName = body.rewardName;
  var description = body.description || '';
  var requiredPercentage = Number(body.requiredPercentage) || 100;
  var earned = body.earned === true || body.earned === 'true';
  var now = new Date().toISOString();

  var data = sheet.getDataRange().getValues();
  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 4).setValue(rewardName);
      sheet.getRange(i + 1, 5).setValue(description);
      sheet.getRange(i + 1, 6).setValue(requiredPercentage);
      sheet.getRange(i + 1, 7).setValue(earned);
      if (earned) sheet.getRange(i + 1, 8).setValue(now);
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([id, weekStart, weekEnd, rewardName, description, requiredPercentage, earned, earned ? now : '', body.notes || '']);
  }

  return { success: true, data: { id: id, rewardName: rewardName, earned: earned } };
}
`;
