import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyItemsScreen from '../screens/profile/MyItemsScreen';
import ItemDetailsScreen from '../screens/items/ItemDetailsScreen';
import EditItemScreen from '../screens/items/EditItemScreen';

const Stack = createNativeStackNavigator();

// Stack вътре в таба „Моите“: моите обяви → Детайли → Редакция
export default function MyItemsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyItemsList" component={MyItemsScreen} options={{ title: 'Моите обяви' }} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Обява' }} />
      <Stack.Screen name="EditItem" component={EditItemScreen} options={{ title: 'Редакция' }} />
    </Stack.Navigator>
  );
}
