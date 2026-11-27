import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import LoadingScreen from '../../components/LoadingScreen';
import MessageView from '../../components/MessageView';
import useItemsLoader from '../../hooks/useItemsLoader';
import { colors } from '../../constants/colors';
import { getItems } from '../../services/itemsService';
import { buildMapHtml } from './mapHtml';

// Картата с всички активни обяви, които имат GPS място.
// Самата карта е уеб страница с Leaflet и OpenStreetMap (през CARTO) в WebView –
// така не ни трябва Google Maps API ключ.
export default function MapScreen({ navigation }) {
  const { items, loading, error, refresh } = useItemsLoader(getItems);

  // Само активните обяви с координати. Върнатите вещи не показваме на картата.
  const markers = useMemo(
    () =>
      items
        .filter((item) => item.location && item.status !== 'resolved')
        .map((item) => ({
          id: item.id,
          title: item.title,
          place: item.place,
          type: item.type,
          lat: item.location.latitude,
          lng: item.location.longitude,
        })),
    [items]
  );

  // Страницата се прави наново само когато се променят точките.
  const html = useMemo(() => buildMapHtml(markers), [markers]);

  // Страницата праща id на обявата, когато натиснеш „Отвори“ в балончето.
  function handleMessage(event) {
    const itemId = event.nativeEvent.data;
    navigation.navigate('ItemsTab', { screen: 'ItemDetails', params: { itemId }, initial: false });
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <MessageView message={error} onRetry={refresh} />;
  }

  const lostCount = markers.filter((m) => m.type === 'lost').length;
  const foundCount = markers.length - lostCount;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => <LoadingScreen />}
        renderError={() => (
          <MessageView message="Картата не можа да се зареди. Провери интернета." onRetry={refresh} />
        )}
      />

      {/* Легенда отгоре: колко обяви от всеки вид има на картата */}
      <View style={styles.legend} pointerEvents="none">
        <LegendDot color={colors.lost} label={`Изгубени · ${lostCount}`} />
        <LegendDot color={colors.found} label={`Намерени · ${foundCount}`} />
      </View>

      {markers.length === 0 ? (
        <View style={styles.empty} pointerEvents="none">
          <Text style={styles.emptyText}>
            Още няма обяви с GPS място. При нова обява натисни „Използвай текущото ми място“.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  empty: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
});
