export const EMAIL_REQUIRED = 'Email is required';
export const EMAIL_INVALID = 'Please enter a valid email address';
export const PASSWORD_REQUIRED = 'Password is required';
export const PASSWORD_TOO_SHORT = 'Password must be at least 6 characters';
export const CONFIRM_REQUIRED = 'Confirm password is required';
export const PASSWORDS_MISMATCH = 'Passwords do not match';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (email.length === 0) {
    return EMAIL_REQUIRED;
  }
  if (!EMAIL_PATTERN.test(email)) {
    return EMAIL_INVALID;
  }
  return null;
}

export function validateRegisterPassword(value: string): string | null {
  if (value.length === 0) {
    return PASSWORD_REQUIRED;
  }
  if (value.length < 6) {
    return PASSWORD_TOO_SHORT;
  }
  return null;
}

export function validateLoginPassword(value: string): string | null {
  if (value.length === 0) {
    return PASSWORD_REQUIRED;
  }
  return null;
}

export function validateConfirmPassword(
  value: string,
  password: string,
): string | null {
  if (value.length === 0) {
    return CONFIRM_REQUIRED;
  }
  if (value !== password) {
    return PASSWORDS_MISMATCH;
  }
  return null;
}

export function cleanFirebaseError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email address is already in use';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password';
    case 'auth/invalid-email':
      return EMAIL_INVALID;
    case 'auth/weak-password':
      return PASSWORD_TOO_SHORT;
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return err instanceof Error ? err.message : String(err);
  }
}
