import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ItemsList from '../../components/ItemsList';
import useItemsLoader from '../../hooks/useItemsLoader';
import { getItems } from '../../services/itemsService';
import { colors } from '../../constants/colors';

const FILTERS = [
  { id: 'all', label: 'Всички' },
  { id: 'lost', label: 'Изгубени' },
  { id: 'found', label: 'Намерени' },
];

export default function ItemsListScreen({ navigation }) {
  const { items, loading, refreshing, error, refresh } = useItemsLoader(getItems);
  const [filter, setFilter] = useState('all');

  const visibleItems = filter === 'all' ? items : items.filter((item) => item.type === filter);

  const filterBar = (
    <View style={styles.filters}>
      {FILTERS.map((f) => {
        const selected = f.id === filter;
        return (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[styles.filter, selected && styles.filterSelected]}
          >
            <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{f.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ItemsList
      items={visibleItems}
      loading={loading}
      refreshing={refreshing}
      error={error}
      onRefresh={refresh}
      onItemPress={(itemId) => navigation.navigate('ItemDetails', { itemId })}
      emptyMessage={items.length ? 'Няма обяви от този тип.' : 'Още няма обяви. Публикувай първата!'}
      header={filterBar}
    />
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  filter: {
    flex: 1,
    minHeight: 40,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSelected: {
    backgroundColor: colors.surface,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  filterTextSelected: {
    color: colors.ink,
    fontWeight: '700',
  },
});
