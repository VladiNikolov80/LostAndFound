import { useCallback } from 'react';

import ItemsList from '../../components/ItemsList';
import useItemsLoader from '../../hooks/useItemsLoader';
import { useAuth } from '../../context/AuthContext';
import { getMyItems } from '../../services/itemsService';

export default function MyItemsScreen({ navigation }) {
  const { user } = useAuth();
  const loadMyItems = useCallback(() => getMyItems(user.uid), [user.uid]);
  const { items, loading, refreshing, error, refresh } = useItemsLoader(loadMyItems);

  return (
    <ItemsList
      items={items}
      loading={loading}
      refreshing={refreshing}
      error={error}
      onRefresh={refresh}
      onItemPress={(itemId) => navigation.navigate('ItemDetails', { itemId })}
      emptyMessage="Още нямаш обяви. Натисни „Нова“ отдолу, за да публикуваш."
    />
  );
}
