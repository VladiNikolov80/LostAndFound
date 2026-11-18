import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TypeBadge from './TypeBadge';
import { colors } from '../constants/colors';
import { getCategoryLabel } from '../constants/categories';
import { formatDate } from '../utils/formatDate';

// Една обява в списъка. Цялата карта е бутон към детайлите.
export default function ItemCard({ item, onPress }) {
  const isLost = item.type === 'lost';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Място за снимката – ще я добавим със стъпката за камерата */}
      <View style={[styles.thumb, { backgroundColor: isLost ? colors.lostSoft : colors.foundSoft }]}>
        <Ionicons name="image-outline" size={28} color={isLost ? colors.lost : colors.found} />
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <TypeBadge type={item.type} status={item.status} />
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {getCategoryLabel(item.category)} · {item.place}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.muted,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  meta: {
    fontSize: 13,
    color: colors.muted,
  },
});
