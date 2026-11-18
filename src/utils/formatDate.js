// Firestore Timestamp → „18.11.2026“
export function formatDate(timestamp) {
  if (!timestamp?.toDate) {
    return '';
  }
  const date = timestamp.toDate();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}
