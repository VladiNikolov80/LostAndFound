import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import DateField from './DateField';
import FormInput from './FormInput';
import PrimaryButton from './PrimaryButton';
import { colors } from '../constants/colors';
import { CATEGORIES } from '../constants/categories';
import { toDate } from '../utils/formatDate';

const EMPTY_VALUES = {
  type: 'lost',
  title: '',
  category: '',
  description: '',
  place: '',
  reward: false,
};

// Общата форма за „Нова обява“ и „Редакция“.
// onSubmit получава проверените стойности и връща Promise.
export default function ItemForm({ initialValues, submitLabel, onSubmit }) {
  // Височината на заглавната лента горе. KeyboardAvoidingView я ползва,
  // за да изчисли точно колко да отмести формата нагоре.
  const headerHeight = useHeaderHeight();
  const [values, setValues] = useState(() => ({
    ...EMPTY_VALUES,
    ...initialValues,
    // При редакция датата идва от Firestore като Timestamp, при нова обява е днес.
    eventDate: toDate(initialValues?.eventDate) || new Date(),
  }));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    const title = values.title.trim();

    // Заглавието има няколко правила: задължително, поне 3 и най-много 60 символа.
    if (!title) {
      newErrors.title = 'Въведи заглавие.';
    } else if (title.length < 3) {
      newErrors.title = 'Заглавието трябва да е поне 3 символа.';
    } else if (title.length > 60) {
      newErrors.title = 'Заглавието може да е най-много 60 символа.';
    }

    if (!values.category) {
      newErrors.category = 'Избери категория.';
    }

    if (values.description.trim().length < 10) {
      newErrors.description = 'Описанието трябва да е поне 10 символа.';
    }

    if (!values.place.trim()) {
      newErrors.place = 'Напиши къде е изгубено или намерено.';
    }

    // Датата не може да е в бъдещето (сравняваме с края на днешния ден).
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    if (!values.eventDate) {
      newErrors.eventDate = 'Избери дата.';
    } else if (values.eventDate > endOfToday) {
      newErrors.eventDate = 'Датата не може да е в бъдещето.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        type: values.type,
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        place: values.place.trim(),
        eventDate: values.eventDate,
        // Възнаграждение има смисъл само при изгубени вещи.
        reward: values.type === 'lost' ? values.reward : false,
      });
    } catch (err) {
      console.log('Грешка при запис:', err);
      setServerError('Обявата не можа да се запише. Опитай отново.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Android: приложението е edge-to-edge и прозорецът не се смалява сам при клавиатура,
    // затова KeyboardAvoidingView добавя отдолу място, колкото е клавиатурата.
    // iPhone: ScrollView сам отмества съдържанието (automaticallyAdjustKeyboardInsets).
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.label}>Какво публикуваш?</Text>
        <View style={styles.typeRow}>
          <TypeOption
            label="Изгубих нещо"
            selected={values.type === 'lost'}
            color={colors.lost}
            softColor={colors.lostSoft}
            onPress={() => setField('type', 'lost')}
          />
          <TypeOption
            label="Намерих нещо"
            selected={values.type === 'found'}
            color={colors.found}
            softColor={colors.foundSoft}
            onPress={() => setField('type', 'found')}
          />
        </View>

        <FormInput
          label="Заглавие"
          value={values.title}
          onChangeText={(text) => setField('title', text)}
          placeholder="Напр. Черен кожен портфейл"
          maxLength={80}
          error={errors.title}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((category) => {
              const selected = values.category === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => setField('category', category.id)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}
        </View>

        <FormInput
          label="Описание"
          value={values.description}
          onChangeText={(text) => setField('description', text)}
          placeholder="Цвят, марка, отличителни белези…"
          multiline
          numberOfLines={4}
          style={styles.multiline}
          error={errors.description}
        />

        <DateField
          label={values.type === 'lost' ? 'Кога го изгуби?' : 'Кога го намери?'}
          value={values.eventDate}
          onChange={(date) => setField('eventDate', date)}
          error={errors.eventDate}
        />

        <FormInput
          label="Място"
          value={values.place}
          onChangeText={(text) => setField('place', text)}
          placeholder="Напр. бул. Витоша, до НДК"
          error={errors.place}
        />

        {values.type === 'lost' ? (
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.label}>Предлагам възнаграждение</Text>
              <Text style={styles.hint}>Ще се вижда в обявата.</Text>
            </View>
            <Switch
              value={values.reward}
              onValueChange={(value) => setField('reward', value)}
              trackColor={{ true: colors.lost, false: colors.border }}
            />
          </View>
        ) : null}

        {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

        <PrimaryButton title={submitLabel} onPress={handleSubmit} loading={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TypeOption({ label, selected, color, softColor, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.typeOption,
        selected && { borderColor: color, backgroundColor: softColor, borderWidth: 2 },
      ]}
    >
      <Text style={[styles.typeText, selected && { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 18,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -10,
  },
  typeOption: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  chipTextSelected: {
    color: colors.surface,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  hint: {
    fontSize: 13,
    color: colors.muted,
  },
  multiline: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 13,
    color: colors.lost,
  },
  serverError: {
    color: colors.lost,
    fontSize: 14,
    textAlign: 'center',
  },
});
