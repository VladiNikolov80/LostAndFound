import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <PlaceholderScreen title="Профил" note={`Вписан като: ${user?.displayName}`}>
      <PrimaryButton title="Изход" variant="secondary" onPress={logout} />
    </PlaceholderScreen>
  );
}
