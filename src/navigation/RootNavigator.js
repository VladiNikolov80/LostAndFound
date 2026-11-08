import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

// Невписан потребител вижда само екраните за вход и регистрация.
export default function RootNavigator() {
  const { user, loading } = useAuth();

  // Докато Firebase проверява за запомнен потребител, показваме само индикатор,
  // за да не премигва екранът за вход при автоматичния вход.
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
