import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { getAuthErrorMessage, isValidEmail } from '../../utils/authErrors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors = {};

    if (name.trim().length < 2) {
      newErrors.name = 'Името трябва да е поне 2 символа.';
    }

    if (!email.trim()) {
      newErrors.email = 'Въведи имейл.';
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = 'Имейлът не е валиден.';
    }

    // Паролата има няколко правила: задължителна, поне 6 символа, да съвпада с повторението.
    if (!password) {
      newErrors.password = 'Въведи парола.';
    } else if (password.length < 6) {
      newErrors.password = 'Паролата трябва да е поне 6 символа.';
    }
    if (repeatPassword !== password) {
      newErrors.repeatPassword = 'Паролите не съвпадат.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setServerError(getAuthErrorMessage(err.code));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Регистрация" subtitle="Създай акаунт, за да публикуваш обяви.">
      <FormInput
        label="Име"
        value={name}
        onChangeText={setName}
        placeholder="Как да те виждат другите"
        autoComplete="name"
        error={errors.name}
      />
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
        placeholder="Поне 6 символа"
        secureTextEntry
        error={errors.password}
      />
      <FormInput
        label="Повтори паролата"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        placeholder="Същата парола"
        secureTextEntry
        error={errors.repeatPassword}
      />

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <PrimaryButton title="Регистрирай се" onPress={handleRegister} loading={submitting} />
      <PrimaryButton
        title="Вече имам акаунт"
        variant="secondary"
        onPress={() => navigation.goBack()}
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
