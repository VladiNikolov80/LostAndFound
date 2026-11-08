import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();

  return (
    <PlaceholderScreen title="Регистрация" note="Формата за регистрация идва със следващата стъпка.">
      <PrimaryButton title="Регистрирай се (тест)" onPress={login} />
      <PrimaryButton
        title="Вече имам акаунт"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
    </PlaceholderScreen>
  );
}
