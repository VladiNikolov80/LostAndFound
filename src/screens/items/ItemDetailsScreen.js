import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoadingScreen from '../../components/LoadingScreen';
import MessageView from '../../components/MessageView';
import PrimaryButton from '../../components/PrimaryButton';
import TypeBadge from '../../components/TypeBadge';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { getCategoryLabel } from '../../constants/categories';
import { deleteItem, getItemById, setItemStatus } from '../../services/itemsService';
import { resizedImageUrl } from '../../services/uploadImage';
import { formatDate } from '../../utils/formatDate';

// Динамичен екран: получава itemId като параметър и зарежда само тази обява.
export default function ItemDetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { width } = useWindowDimensions();
  const photoWidth = width - 40; // ширината на екрана минус отстъпите отляво и отдясно

  const load = useCallback(async () => {
    try {
      const data = await getItemById(itemId);
      if (!data) {
        setError('Тази обява не съществува.');
      } else {
        setItem(data);
        setError('');
      }
    } catch (err) {
      console.log('Грешка при зареждане:', err);
      setError('Обявата не можа да се зареди.');
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  // Зарежда отново при всяко връщане на екрана, например след редакция.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <MessageView message={error} onRetry={load} />;
  }

  const isOwner = item.ownerId === user.uid;
  const isResolved = item.status === 'resolved';

  async function handleToggleStatus() {
    setBusy(true);
    try {
      await setItemStatus(itemId, isResolved ? 'active' : 'resolved');
      await load();
    } catch (err) {
      console.log('Грешка при смяна на статуса:', err);
      Alert.alert('Грешка', 'Промяната не можа да се запише.');
    } finally {
      setBusy(false);
    }
  }

  function handleDelete() {
    Alert.alert('Изтриване', 'Сигурен ли си, че искаш да изтриеш тази обява?', [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await deleteItem(itemId);
            navigation.goBack();
          } catch (err) {
            console.log('Грешка при изтриване:', err);
            Alert.alert('Грешка', 'Обявата не можа да се изтрие.');
            setBusy(false);
          }
        },
      },
    ]);
  }

  // Отваря мястото в приложението за карти на телефона (Apple Maps / Google Maps).
  function openInMaps() {
    const { latitude, longitude } = item.location;
    const label = encodeURIComponent(item.title);
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
      default: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });
    Linking.openURL(url).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
    );
  }

  function handleContact() {
    const subject = encodeURIComponent(`Относно обявата: ${item.title}`);
    Linking.openURL(`mailto:${item.ownerEmail}?subject=${subject}`).catch(() =>
      Alert.alert('Няма приложение за поща', `Пиши на ${item.ownerEmail}`)
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {item.imageUrls?.length ? (
        // Снимките една до друга – плъзгаш наляво/надясно.
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.gallery}>
          {item.imageUrls.map((url) => (
            <Image
              key={url}
              source={{ uri: resizedImageUrl(url, 1000) }}
              style={[styles.photo, { width: photoWidth }]}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.photo, { backgroundColor: item.type === 'lost' ? colors.lostSoft : colors.foundSoft }]}>
          <Ionicons name="image-outline" size={48} color={item.type === 'lost' ? colors.lost : colors.found} />
          <Text style={styles.noPhoto}>Няма снимка</Text>
        </View>
      )}
      {item.imageUrls?.length > 1 ? (
        <Text style={styles.galleryHint}>{item.imageUrls.length} снимки – плъзни настрани</Text>
      ) : null}

      <TypeBadge type={item.type} status={item.status} />
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.infoRow}>
        <Info icon="pricetag-outline" label="Категория" value={getCategoryLabel(item.category)} />
        <Info
          icon="calendar-outline"
          label={item.type === 'lost' ? 'Изгубено на' : 'Намерено на'}
          value={formatDate(item.eventDate || item.createdAt)}
        />
      </View>
      <Info icon="location-outline" label="Място" value={item.place} />
      {item.location ? (
        <Pressable onPress={openInMaps} style={({ pressed }) => [styles.mapLink, pressed && styles.pressed]}>
          <Ionicons name="map-outline" size={18} color={colors.found} />
          <Text style={styles.mapLinkText}>Отвори в картите</Text>
        </Pressable>
      ) : null}

      {item.reward ? (
        <View style={styles.reward}>
          <Ionicons name="gift-outline" size={18} color={colors.lost} />
          <Text style={styles.rewardText}>Предлага се възнаграждение за намирането</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <Text style={styles.owner}>Публикувана от {isOwner ? 'теб' : item.ownerName}</Text>

      <View style={styles.actions}>
        {isOwner ? (
          <>
            <PrimaryButton
              title="Редактирай"
              onPress={() => navigation.navigate('EditItem', { itemId })}
              disabled={busy}
            />
            <PrimaryButton
              title={isResolved ? 'Активирай отново' : 'Маркирай като върнато'}
              variant="secondary"
              onPress={handleToggleStatus}
              loading={busy}
            />
            <PrimaryButton title="Изтрий" variant="secondary" onPress={handleDelete} disabled={busy} />
          </>
        ) : (
          <PrimaryButton
            title={item.type === 'lost' ? 'Намерих го — пиши на автора' : 'Мое е — пиши на автора'}
            onPress={handleContact}
          />
        )}
      </View>
    </ScrollView>
  );
}

function Info({ icon, label, value }) {
  return (
    <View style={styles.info}>
      <View style={styles.infoLabelRow}>
        <Ionicons name={icon} size={14} color={colors.muted} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  gallery: {
    borderRadius: 18,
  },
  photo: {
    height: 240,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.border,
  },
  noPhoto: {
    fontSize: 13,
    color: colors.muted,
  },
  galleryHint: {
    marginTop: -6,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  mapLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.found,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  info: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    gap: 4,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  section: {
    gap: 6,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.lostSoft,
  },
  rewardText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.lost,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  owner: {
    fontSize: 13,
    color: colors.muted,
  },
  actions: {
    gap: 10,
    marginTop: 6,
  },
});
