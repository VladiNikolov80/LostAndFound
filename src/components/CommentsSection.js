import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import {
  addComment,
  deleteComment,
  MAX_COMMENT_LENGTH,
  subscribeToComments,
} from '../services/commentsService';
import { formatDateTime } from '../utils/formatDate';

// Публичните коментари под обявата + поле за нов коментар.
// itemOwnerId: авторът на обявата може да трие всички коментари под нея.
export default function CommentsSection({ itemId, itemOwnerId }) {
  const { user, displayName } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToComments(
      itemId,
      (data) => {
        setComments(data);
        setError('');
        setLoading(false);
      },
      (err) => {
        console.log('Грешка при зареждане на коментарите:', err);
        setError('Коментарите не можаха да се заредят.');
        setLoading(false);
      }
    );
    // Спираме да слушаме, когато напуснем екрана.
    return unsubscribe;
  }, [itemId]);

  async function handleSend() {
    const trimmed = text.trim();
    setSendError('');
    if (!trimmed) {
      setSendError('Напиши коментар.');
      return;
    }
    if (trimmed.length > MAX_COMMENT_LENGTH) {
      setSendError(`Коментарът може да е най-много ${MAX_COMMENT_LENGTH} символа.`);
      return;
    }

    setSending(true);
    try {
      await addComment(itemId, trimmed, user, displayName);
      setText('');
    } catch (err) {
      console.log('Грешка при изпращане:', err);
      setSendError('Коментарът не можа да се изпрати. Опитай пак.');
    } finally {
      setSending(false);
    }
  }

  function handleDelete(comment) {
    Alert.alert('Изтриване', 'Да изтрия ли този коментар?', [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: () =>
          deleteComment(itemId, comment.id).catch((err) => {
            console.log('Грешка при изтриване:', err);
            Alert.alert('Грешка', 'Коментарът не можа да се изтрие.');
          }),
      },
    ]);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Коментари{comments.length ? ` (${comments.length})` : ''}
      </Text>

      {loading ? <ActivityIndicator color={colors.ink} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && comments.length === 0 ? (
        <Text style={styles.empty}>Още няма коментари. Виждал ли си тази вещ? Напиши!</Text>
      ) : null}

      {comments.map((comment) => {
        const isMine = comment.authorId === user.uid;
        const isItemOwner = comment.authorId === itemOwnerId;
        const canDelete = isMine || itemOwnerId === user.uid;

        return (
          <View key={comment.id} style={[styles.comment, isItemOwner && styles.ownerComment]}>
            <View style={styles.commentHeader}>
              <Text style={styles.author}>
                {isMine ? 'Ти' : comment.authorName}
                {isItemOwner ? ' · автор на обявата' : ''}
              </Text>
              <Text style={styles.time}>{formatDateTime(comment.createdAt)}</Text>
            </View>
            <Text style={styles.text}>{comment.text}</Text>
            {canDelete ? (
              <Pressable
                onPress={() => handleDelete(comment)}
                style={styles.deleteButton}
                hitSlop={8}
                accessibilityLabel="Изтрий коментара"
              >
                <Ionicons name="trash-outline" size={16} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>
        );
      })}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Напиши коментар…"
          placeholderTextColor={colors.muted}
          multiline
          maxLength={MAX_COMMENT_LENGTH + 20}
        />
        <Pressable
          onPress={handleSend}
          disabled={sending}
          style={({ pressed }) => [styles.sendButton, (pressed || sending) && styles.dimmed]}
          accessibilityLabel="Изпрати коментара"
        >
          {sending ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Ionicons name="send" size={18} color={colors.surface} />
          )}
        </Pressable>
      </View>
      {sendError ? <Text style={styles.error}>{sendError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
    marginTop: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  empty: {
    fontSize: 14,
    color: colors.muted,
  },
  comment: {
    padding: 12,
    paddingRight: 40,
    borderRadius: 14,
    backgroundColor: colors.surface,
    gap: 4,
  },
  ownerComment: {
    borderWidth: 1,
    borderColor: colors.foundSoft,
    backgroundColor: '#F5F8FF',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  author: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  time: {
    fontSize: 12,
    color: colors.muted,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 15,
    color: colors.ink,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.6,
  },
  error: {
    fontSize: 13,
    color: colors.lost,
  },
});
