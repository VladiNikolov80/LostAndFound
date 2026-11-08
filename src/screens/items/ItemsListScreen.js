import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';

export default function ItemsListScreen({ navigation }) {
  return (
    <PlaceholderScreen title="Обяви" note="Тук ще е списъкът от Firestore с pull-to-refresh.">
      {/* ВРЕМЕННО: тестово ID, докато обявите не идват от базата */}
      <PrimaryButton
        title="Отвори примерна обява"
        onPress={() => navigation.navigate('ItemDetails', { itemId: 'test-123' })}
      />
    </PlaceholderScreen>
  );
}
