import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { formatDate } from '../utils/formatDate';

// Поле за избор на дата.
// На Android отваря системния прозорец за дата, а на iPhone показва компактния избор.
// maximumDate не позволява да се избере дата в бъдещето.
export default function DateField({ label, value, onChange, error }) {
  const today = new Date();

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      maximumDate: today,
      onValueChange: (event, date) => onChange(date),
    });
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {Platform.OS === 'android' ? (
        <Pressable onPress={openAndroidPicker} style={[styles.field, error && styles.fieldError]}>
          <Ionicons name="calendar-outline" size={20} color={colors.ink} />
          <Text style={styles.value}>{formatDate(value)}</Text>
        </Pressable>
      ) : (
        <View style={[styles.field, error && styles.fieldError]}>
          <Ionicons name="calendar-outline" size={20} color={colors.ink} />
          <DateTimePicker
            value={value}
            mode="date"
            display="compact"
            locale="bg-BG"
            maximumDate={today}
            onValueChange={(event, date) => onChange(date)}
          />
        </View>
      )}

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
  field: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldError: {
    borderColor: colors.lost,
  },
  value: {
    fontSize: 16,
    color: colors.ink,
  },
  error: {
    fontSize: 13,
    color: colors.lost,
  },
});
