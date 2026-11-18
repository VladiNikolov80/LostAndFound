import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from './PrimaryButton';
import { colors } from '../constants/colors';

// Показва съобщение в средата на екрана: за грешка или за празен списък.
// Ако има onRetry, показва и бутон „Опитай пак“.
export default function MessageView({ icon = 'alert-circle-outline', message, onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={colors.muted} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <PrimaryButton title="Опитай пак" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
});
