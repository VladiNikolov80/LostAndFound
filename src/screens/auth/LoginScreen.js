import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { getAuthErrorMessage, isValidEmail } from '../../utils/authErrors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Въведи имейл.';
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = 'Имейлът не е валиден.';
    }
    if (!password) {
      newErrors.password = 'Въведи парола.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // Не навигираме ръчно: RootNavigator сам показва приложението, щом има потребител.
    } catch (err) {
      setServerError(getAuthErrorMessage(err.code));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Вход" subtitle="Влез, за да видиш и публикуваш обяви.">
      <FormInput
        label="Имейл"
        value={email}
        onChangeText={setEmail}
        placeholder="ime@primer.bg"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
      />
      <FormInput
        label="Парола"
        value={password}
        onChangeText={setPassword}
        placeholder="Твоята парола"
        secureTextEntry
        error={errors.password}
      />

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <PrimaryButton title="Влез" onPress={handleLogin} loading={submitting} />
      <PrimaryButton
        title="Нямам акаунт — регистрация"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  serverError: {
    color: colors.lost,
    fontSize: 14,
    textAlign: 'center',
  },
});
