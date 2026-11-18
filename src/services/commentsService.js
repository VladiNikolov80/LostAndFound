import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export const MAX_COMMENT_LENGTH = 500;

// Коментарите са подколекция на обявата: items/{itemId}/comments/{commentId}
function commentsRef(itemId) {
  return collection(db, 'items', itemId, 'comments');
}

// Слуша коментарите в реално време (onSnapshot): всеки нов коментар
// се появява веднага, без да опресняваш екрана.
// Връща функция, която спира слушането (вика се, когато напуснем екрана).
export function subscribeToComments(itemId, onChange, onError) {
  const q = query(commentsRef(itemId), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const comments = snapshot.docs.map((d) => ({
        id: d.id,
        // 'estimate': току-що написаният коментар още няма час от сървъра,
        // затова показваме приблизителния час от телефона.
        ...d.data({ serverTimestamps: 'estimate' }),
      }));
      onChange(comments);
    },
    onError
  );
}

// POST: нов коментар
export function addComment(itemId, text, user, authorName) {
  return addDoc(commentsRef(itemId), {
    text,
    authorId: user.uid,
    authorName: authorName || user.email,
    createdAt: serverTimestamp(),
  });
}

// DELETE: един коментар
export function deleteComment(itemId, commentId) {
  return deleteDoc(doc(db, 'items', itemId, 'comments', commentId));
}
