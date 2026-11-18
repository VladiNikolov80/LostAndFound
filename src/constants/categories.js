// Категориите на обявите. `id` се пази в базата, `label` се показва.
export const CATEGORIES = [
  { id: 'keys', label: 'Ключове' },
  { id: 'wallets', label: 'Портфейли' },
  { id: 'phones', label: 'Телефони' },
  { id: 'documents', label: 'Документи' },
  { id: 'bags', label: 'Чанти' },
  { id: 'animals', label: 'Животни' },
  { id: 'other', label: 'Друго' },
];

export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || 'Друго';
}
