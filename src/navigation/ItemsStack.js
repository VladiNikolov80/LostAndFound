import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ItemsListScreen from '../screens/items/ItemsListScreen';
import ItemDetailsScreen from '../screens/items/ItemDetailsScreen';
import EditItemScreen from '../screens/items/EditItemScreen';

const Stack = createNativeStackNavigator();

// Stack вътре в таба „Обяви“: Списък → Детайли (itemId) → Редакция (itemId)
export default function ItemsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ItemsList" component={ItemsListScreen} options={{ title: 'Обяви' }} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Обява' }} />
      <Stack.Screen name="EditItem" component={EditItemScreen} options={{ title: 'Редакция' }} />
    </Stack.Navigator>
  );
}
