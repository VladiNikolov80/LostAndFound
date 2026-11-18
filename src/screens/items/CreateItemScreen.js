import { useState } from 'react';

import ItemForm from '../../components/ItemForm';
import { useAuth } from '../../context/AuthContext';
import { createItem } from '../../services/itemsService';

export default function CreateItemScreen({ navigation }) {
  const { user, displayName } = useAuth();
  // Сменяме key след успешен запис, за да се изчисти формата.
  const [formKey, setFormKey] = useState(0);

  async function handleCreate(values) {
    const itemId = await createItem(values, user, displayName);
    setFormKey((k) => k + 1);
    // Отиваме в таба „Обяви“ и отваряме новата обява.
    // initial: false оставя списъка под нея, за да работи бутонът „назад“.
    navigation.navigate('ItemsTab', { screen: 'ItemDetails', params: { itemId }, initial: false });
  }

  return <ItemForm key={formKey} submitLabel="Публикувай обявата" onSubmit={handleCreate} />;
}
