import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  return (
    <PlaceholderScreen title="Вход" note="Формата за вход идва със следващата стъпка (Firebase).">
      <PrimaryButton title="Влез (тест)" onPress={login} />
      <PrimaryButton
        title="Нямам акаунт — регистрация"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
      />
    </PlaceholderScreen>
  );
}
