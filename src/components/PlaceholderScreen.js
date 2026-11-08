import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

// Временна обвивка за екраните, докато ги изграждаме по мокъпа.
export default function PlaceholderScreen({ title, note, children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <View style={styles.actions}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  note: {
    marginTop: 8,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
});
