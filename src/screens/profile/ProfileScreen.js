import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, displayName, logout } = useAuth();

  return (
    <PlaceholderScreen title={displayName || 'Профил'} note={user?.email}>
      <PrimaryButton title="Изход" variant="secondary" onPress={logout} />
    </PlaceholderScreen>
  );
}
