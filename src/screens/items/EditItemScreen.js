import { useEffect, useState } from 'react';

import ItemForm from '../../components/ItemForm';
import LoadingScreen from '../../components/LoadingScreen';
import MessageView from '../../components/MessageView';
import { useAuth } from '../../context/AuthContext';
import { getItemById, updateItem } from '../../services/itemsService';

// Динамичен екран: зарежда обявата по itemId и попълва формата с нея.
export default function EditItemScreen({ route, navigation }) {
  const { itemId } = route.params;
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        const data = await getItemById(itemId);
        if (!isActive) return;
        if (!data) {
          setError('Тази обява вече не съществува.');
        } else if (data.ownerId !== user.uid) {
          setError('Можеш да редактираш само своите обяви.');
        } else {
          setItem(data);
        }
      } catch (err) {
        console.log('Грешка при зареждане:', err);
        if (isActive) setError('Обявата не можа да се зареди.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    load();
    // Ако напуснем екрана преди Firestore да отговори, не обновяваме state.
    return () => {
      isActive = false;
    };
  }, [itemId, user.uid]);

  async function handleSave(values) {
    await updateItem(itemId, values);
    navigation.goBack();
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <MessageView message={error} />;
  }

  return <ItemForm initialValues={item} submitLabel="Запази промените" onSubmit={handleSave} />;
}
