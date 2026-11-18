import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { resizedImageUrl } from '../services/uploadImage';

const MAX_PHOTOS = 3;

const PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  // По-ниско качество = по-малък файл и по-бързо качване.
  quality: 0.6,
};

// Снимки на вещта: от камерата или от галерията, най-много 3.
// photos е масив от адреси: локални (току-що избрани) или https (вече качени).
export default function PhotoPicker({ photos, onChange }) {
  const canAddMore = photos.length < MAX_PHOTOS;

  async function takePhoto() {
    // Камерата винаги иска разрешение от потребителя.
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Няма достъп до камерата', 'Разреши достъп до камерата от настройките на телефона.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (!result.canceled) {
      onChange([...photos, result.assets[0].uri]);
    }
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled) {
      onChange([...photos, result.assets[0].uri]);
    }
  }

  function removePhoto(index) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Снимки (до {MAX_PHOTOS})</Text>

      <View style={styles.row}>
        {photos.map((uri, index) => (
          <View key={uri} style={styles.thumbWrapper}>
            <Image source={{ uri: resizedImageUrl(uri, 300) }} style={styles.thumb} />
            <Pressable
              onPress={() => removePhoto(index)}
              style={styles.remove}
              accessibilityLabel="Махни снимката"
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color={colors.surface} />
            </Pressable>
          </View>
        ))}

        {canAddMore ? (
          <>
            <Pressable onPress={takePhoto} style={styles.addButton}>
              <Ionicons name="camera-outline" size={24} color={colors.ink} />
              <Text style={styles.addText}>Снимай</Text>
            </Pressable>
            <Pressable onPress={pickFromGallery} style={styles.addButton}>
              <Ionicons name="images-outline" size={24} color={colors.ink} />
              <Text style={styles.addText}>Галерия</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const SIZE = 88;

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  thumbWrapper: {
    width: SIZE,
    height: SIZE,
  },
  thumb: {
    width: SIZE,
    height: SIZE,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 23, 28, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: SIZE,
    height: SIZE,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
});
