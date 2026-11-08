// Превежда кодовете за грешки на Firebase в разбираеми съобщения.
export function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Този имейл вече е регистриран.';
    case 'auth/invalid-email':
      return 'Невалиден имейл адрес.';
    case 'auth/weak-password':
      return 'Паролата трябва да е поне 6 символа.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Грешен имейл или парола.';
    case 'auth/too-many-requests':
      return 'Твърде много опити. Опитай пак след малко.';
    case 'auth/network-request-failed':
      return 'Няма връзка с интернет.';
    default:
      return 'Нещо се обърка. Опитай отново.';
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}
