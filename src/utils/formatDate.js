// Firestore Timestamp или обикновен Date → „18.11.2026“
export function formatDate(value) {
  const date = toDate(value);
  if (!date) {
    return '';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

// Дата и час → „18.11.2026, 12:40“ (за коментарите)
export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) {
    return '';
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDate(date)}, ${hours}:${minutes}`;
}

// Firestore пази датите като Timestamp. Тази функция ги превръща в Date.
export function toDate(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}
