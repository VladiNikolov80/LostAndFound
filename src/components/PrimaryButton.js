import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

export default function PrimaryButton({ title, onPress, variant = 'primary', loading = false, disabled = false }) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        (pressed || isDisabled) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.ink} />
      ) : (
        <Text style={[styles.text, !isPrimary && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dimmed: {
    opacity: 0.7,
  },
  text: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.ink,
  },
});
