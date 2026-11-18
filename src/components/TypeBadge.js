import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

// Етикет „Изгубено“ (оранжево), „Намерено“ (синьо) или „Върнато“ (сиво).
export default function TypeBadge({ type, status }) {
  let label = type === 'lost' ? 'Изгубено' : 'Намерено';
  let style = type === 'lost' ? styles.lost : styles.found;
  let textStyle = type === 'lost' ? styles.lostText : styles.foundText;

  if (status === 'resolved') {
    label = 'Върнато';
    style = styles.resolved;
    textStyle = styles.resolvedText;
  }

  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  lost: { backgroundColor: colors.lostSoft },
  lostText: { color: colors.lost },
  found: { backgroundColor: colors.foundSoft },
  foundText: { color: colors.found },
  resolved: { backgroundColor: colors.border },
  resolvedText: { color: colors.muted },
});
