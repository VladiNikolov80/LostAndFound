import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import ItemCard from './ItemCard';
import LoadingScreen from './LoadingScreen';
import MessageView from './MessageView';
import { colors } from '../constants/colors';

// Общ списък за „Обяви“ и „Моите обяви“:
// зареждане → индикатор, грешка → съобщение с „Опитай пак“, празно → съобщение,
// и дърпане надолу (pull-to-refresh) за опресняване.
export default function ItemsList({
  items,
  loading,
  refreshing,
  error,
  onRefresh,
  onItemPress,
  emptyMessage,
  header,
}) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <MessageView message={error} onRetry={onRefresh} />;
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ItemCard item={item} onPress={() => onItemPress(item.id)} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={header}
      ListEmptyComponent={<MessageView icon="search-outline" message={emptyMessage} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  separator: {
    height: 12,
  },
});
