import * as Location from 'expo-location';

// Взема текущото място от GPS и го превръща в адрес (reverse geocoding).
// Връща { address, coords } или хвърля грешка с разбираемо съобщение.
export async function getCurrentPlace() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Разреши достъп до местоположението от настройките на телефона.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const coords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  let address = '';
  try {
    const [result] = await Location.reverseGeocodeAsync(coords);
    address = formatAddress(result);
  } catch (err) {
    console.log('Адресът не можа да се намери:', err);
  }

  // Ако няма адрес, показваме поне координатите.
  if (!address) {
    address = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
  }

  return { address, coords };
}

function formatAddress(result) {
  if (!result) {
    return '';
  }
  const street = result.street
    ? `${result.street}${result.streetNumber ? ` ${result.streetNumber}` : ''}`
    : result.name;
  // Махаме повторенията, например когато кварталът и градът се казват еднакво.
  const parts = [street, result.district, result.city].filter(Boolean);
  return [...new Set(parts)].join(', ');
}
