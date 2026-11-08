import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';

// Динамичен екран: редактира обявата с подаденото itemId.
export default function EditItemScreen({ route, navigation }) {
  const { itemId } = route.params;

  return (
    <PlaceholderScreen title="Редакция" note={`Редактираш обява ${itemId}`}>
      <PrimaryButton title="Запази (тест)" onPress={() => navigation.goBack()} />
    </PlaceholderScreen>
  );
}
