import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';

export default function MyItemsScreen({ navigation }) {
  return (
    <PlaceholderScreen title="Моите обяви" note="Тук ще са само твоите обяви.">
      {/* ВРЕМЕННО: тестово ID */}
      <PrimaryButton
        title="Отвори моя примерна обява"
        onPress={() => navigation.navigate('ItemDetails', { itemId: 'my-456' })}
      />
    </PlaceholderScreen>
  );
}
