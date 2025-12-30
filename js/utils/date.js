export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

export function isToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isSameDay(date, today);
}

/* ➕ ДОБАВЛЕНО */

export function daysDiff(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
}
