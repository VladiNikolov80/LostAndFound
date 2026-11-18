import { File, UploadType } from 'expo-file-system';

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary';

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Качва една снимка от телефона в Cloudinary и връща нейния https адрес.
// В Firestore пазим само този адрес, не самата снимка.
//
// Ползваме File.upload() от expo-file-system: телефонът сам изпраща файла
// като multipart/form-data. (В Expo SDK 58 вграденият fetch вече не приема
// файл, подаден като { uri, type, name } във FormData.)
export async function uploadImage(uri) {
  const file = new File(uri);

  const result = await file.upload(UPLOAD_URL, {
    uploadType: UploadType.MULTIPART,
    fieldName: 'file',
    mimeType: 'image/jpeg',
    parameters: { upload_preset: CLOUDINARY_UPLOAD_PRESET },
  });

  let json = {};
  try {
    json = JSON.parse(result.body);
  } catch {
    // Отговорът не е JSON – ще върнем общо съобщение по-долу.
  }

  if (result.status < 200 || result.status >= 300 || !json.secure_url) {
    throw new Error(json.error?.message || `HTTP ${result.status}`);
  }

  return json.secure_url;
}

// Cloudinary може да смали снимката „в движение“: вмъкваме настройки в адреса.
// Така списъкът зарежда малки снимки, а не оригиналите.
export function resizedImageUrl(url, width) {
  if (!url?.includes('/image/upload/')) {
    return url;
  }
  return url.replace('/image/upload/', `/image/upload/w_${width},c_limit,q_auto/`);
}
