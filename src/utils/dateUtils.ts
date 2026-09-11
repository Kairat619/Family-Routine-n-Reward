export const KAZAKH_DAYS = [
  'Жексенбі', // 0
  'Дүйсенбі', // 1
  'Сейсенбі', // 2
  'Сәрсенбі', // 3
  'Бейсенбі', // 4
  'Жұма',     // 5
  'Сенбі',    // 6
];

export const KAZAKH_DAYS_ORDERED = [
  { key: 'mon', name: 'Дүйсенбі', short: 'Дс', index: 1 },
  { key: 'tue', name: 'Сейсенбі', short: 'Сс', index: 2 },
  { key: 'wed', name: 'Сәрсенбі', short: 'Ср', index: 3 },
  { key: 'thu', name: 'Бейсенбі', short: 'Бс', index: 4 },
  { key: 'fri', name: 'Жұма', short: 'Жм', index: 5 },
  { key: 'sat', name: 'Сенбі', short: 'Сб', index: 6 },
  { key: 'sun', name: 'Жексенбі', short: 'Жс', index: 0 },
];

export const KAZAKH_MONTHS = [
  'қаңтар',
  'ақпан',
  'наурыз',
  'сәуір',
  'мамыр',
  'маусым',
  'шілде',
  'тамыз',
  'қыркүйек',
  'қазан',
  'қараша',
  'желтоқсан',
];

/**
 * Returns ISO date string YYYY-MM-DD
 */
export function toISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD into a Date object at noon local time to avoid timezone edge jumps
 */
export function parseISODate(isoString: string): Date {
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Returns formatted date in Kazakh, e.g. "Бейсенбі, 10 қыркүйек"
 */
export function formatKazakhDate(isoString: string, includeYear = false): string {
  const date = parseISODate(isoString);
  const dayName = KAZAKH_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = KAZAKH_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  if (includeYear) {
    return `${dayName}, ${dayNum} ${monthName} ${year} ж.`;
  }
  return `${dayName}, ${dayNum} ${monthName}`;
}

/**
 * Calculate week boundaries: Monday -> Sunday
 */
export function getWeekRange(dateOrIso: Date | string = new Date()): {
  weekStart: string; // Monday YYYY-MM-DD
  weekEnd: string;   // Sunday YYYY-MM-DD
  days: { date: string; dayName: string; shortName: string; isToday: boolean }[];
} {
  const date = typeof dateOrIso === 'string' ? parseISODate(dateOrIso) : new Date(dateOrIso);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday... 6 is Saturday
  
  // Distance from Monday (1)
  // If Sunday (0), distance is -6
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(12, 0, 0, 0);

  const todayIso = toISODate(new Date());

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = toISODate(d);
    const dayIndex = d.getDay();
    const orderedInfo = KAZAKH_DAYS_ORDERED.find((item) => item.index === dayIndex) || KAZAKH_DAYS_ORDERED[0];

    days.push({
      date: iso,
      dayName: orderedInfo.name,
      shortName: orderedInfo.short,
      isToday: iso === todayIso,
    });
  }

  const weekStart = days[0].date;
  const weekEnd = days[6].date;

  return { weekStart, weekEnd, days };
}

/**
 * Move week backward or forward by delta
 */
export function shiftWeek(currentWeekStart: string, deltaWeeks: number): string {
  const date = parseISODate(currentWeekStart);
  date.setDate(date.getDate() + deltaWeeks * 7);
  return getWeekRange(date).weekStart;
}

/**
 * Format currency in Kazakh: "4 000 ₸"
 */
export function formatCurrency(amount: number, symbol = '₸'): string {
  const formattedNumber = new Intl.NumberFormat('ru-RU').format(Math.round(amount));
  return `${formattedNumber} ${symbol}`;
}
