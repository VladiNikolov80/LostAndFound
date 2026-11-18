import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Зарежда списък с обяви всеки път, когато екранът се покаже
// (например след като създадеш или изтриеш обява и се върнеш).
// loadFn е функцията, която взема данните, например getItems.
export default function useItemsLoader(loadFn) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      }
      try {
        const data = await loadFn();
        setItems(data);
        setError('');
      } catch (err) {
        console.log('Грешка при зареждане на обявите:', err);
        setError('Обявите не можаха да се заредят. Провери интернета.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadFn]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { items, loading, refreshing, error, refresh: () => load(true) };
}
