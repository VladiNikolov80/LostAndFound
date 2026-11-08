import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ItemsStack from './ItemsStack';
import MyItemsStack from './MyItemsStack';
import MapScreen from '../screens/map/MapScreen';
import CreateItemScreen from '../screens/items/CreateItemScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

const icons = {
  ItemsTab: 'list',
  MapTab: 'map',
  CreateTab: 'add-circle',
  MyItemsTab: 'bookmark',
  ProfileTab: 'person',
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? icons[route.name] : `${icons[route.name]}-outline`}
            size={size}
            color={color}
          />
        ),
      })}
    >
      {/* Табовете със Stack вътре имат собствен header, затова тук го скриваме */}
      <Tab.Screen name="ItemsTab" component={ItemsStack} options={{ title: 'Обяви', headerShown: false }} />
      <Tab.Screen name="MapTab" component={MapScreen} options={{ title: 'Карта' }} />
      <Tab.Screen name="CreateTab" component={CreateItemScreen} options={{ title: 'Нова обява', tabBarLabel: 'Нова' }} />
      <Tab.Screen name="MyItemsTab" component={MyItemsStack} options={{ title: 'Моите', headerShown: false }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Профил' }} />
    </Tab.Navigator>
  );
}
