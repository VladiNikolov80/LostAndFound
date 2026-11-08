import PlaceholderScreen from '../../components/PlaceholderScreen';
import PrimaryButton from '../../components/PrimaryButton';

// Динамичен екран: получава itemId като параметър на маршрута.
export default function ItemDetailsScreen({ route, navigation }) {
  const { itemId } = route.params;

  return (
    <PlaceholderScreen title="Детайли на обява" note={`itemId: ${itemId}`}>
      <PrimaryButton
        title="Редактирай"
        onPress={() => navigation.navigate('EditItem', { itemId })}
      />
    </PlaceholderScreen>
  );
}
