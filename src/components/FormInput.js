import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../constants/colors';

// Поле с етикет отгоре и съобщение за грешка отдолу.
export default function FormInput({ label, error, style, ...inputProps }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.input, style, error && styles.inputError]}
        placeholderTextColor={colors.muted}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.ink,
  },
  inputError: {
    borderColor: colors.lost,
  },
  error: {
    fontSize: 13,
    color: colors.lost,
  },
});
