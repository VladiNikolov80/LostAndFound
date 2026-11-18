import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';

const itemsRef = collection(db, 'items');

// Превръща документ от Firestore в обикновен обект с id.
function toItem(snapshot) {
  return { id: snapshot.id, ...snapshot.data() };
}

// GET: всички обяви, най-новите първи
export async function getItems() {
  const q = query(itemsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toItem);
}

// GET: само обявите на един потребител.
// Сортираме в приложението, за да не трябва отделен индекс във Firestore.
export async function getMyItems(ownerId) {
  const q = query(itemsRef, where('ownerId', '==', ownerId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(toItem)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

// GET: една обява по id
export async function getItemById(id) {
  const snapshot = await getDoc(doc(db, 'items', id));
  if (!snapshot.exists()) {
    return null;
  }
  return toItem(snapshot);
}

// POST: нова обява
export async function createItem(data, user, ownerName) {
  const docRef = await addDoc(itemsRef, {
    ...data,
    status: 'active',
    ownerId: user.uid,
    ownerName: ownerName || user.email,
    ownerEmail: user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// PATCH: променя само подадените полета
export function updateItem(id, data) {
  return updateDoc(doc(db, 'items', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// PATCH: отбелязва обявата като „Върнато“ (или я активира отново)
export function setItemStatus(id, status) {
  return updateItem(id, { status });
}

// DELETE: първо коментарите под обявата, после самата обява.
// (Firestore не трие подколекциите сам, когато изтриеш документа.)
export async function deleteItem(id) {
  const comments = await getDocs(collection(db, 'items', id, 'comments'));
  await Promise.all(comments.docs.map((c) => deleteDoc(c.ref)));
  await deleteDoc(doc(db, 'items', id));
}
