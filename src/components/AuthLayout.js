import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';

// Обща рамка за Вход и Регистрация:
// SafeAreaView пази от изрезката и часовника, а KeyboardAvoidingView + ScrollView
// не позволяват клавиатурата да закрие полетата.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>Lost & Found</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.form}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.lost,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
  },
  form: {
    marginTop: 28,
    gap: 16,
  },
});
