import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import {
  cleanFirebaseError,
  validateConfirmPassword,
  validateEmail,
  validateRegisterPassword,
} from '@/lib/validation';
import { colors, fontSize, spacing } from '@/theme';

const REDIRECT_DELAY_MS = 2200;

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterScreen() {
  const { user, authLoading, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  function runValidation(
    nextEmail: string,
    nextPassword: string,
    nextConfirm: string,
  ) {
    setErrors({
      email: validateEmail(nextEmail) ?? undefined,
      password: validateRegisterPassword(nextPassword) ?? undefined,
      confirmPassword:
        validateConfirmPassword(nextConfirm, nextPassword) ?? undefined,
    });
  }

  async function handleSubmit() {
    setSubmitted(true);
    setAuthError(null);
    setSuccess(null);
    const nextErrors: FieldErrors = {
      email: validateEmail(email) ?? undefined,
      password: validateRegisterPassword(password) ?? undefined,
      confirmPassword: validateConfirmPassword(confirmPassword, password) ?? undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword) {
      return;
    }
    setBusy(true);
    try {
      await signUp(email.trim(), password);
      setSuccess('Registration successful');
      redirectTimer.current = setTimeout(() => {
        router.replace('/list');
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      setAuthError(cleanFirebaseError(err));
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || user) {
    return null;
  }

  return (
    <Screen>
      <AppHeader title="Register" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextField
            label="Email"
            testID="register-email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (submitted) {
                runValidation(value, password, confirmPassword);
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={submitted ? (errors.email ?? null) : null}
          />
          <TextField
            label="Password"
            testID="register-password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (submitted) {
                runValidation(email, value, confirmPassword);
              }
            }}
            secureTextEntry
            autoCapitalize="none"
            error={submitted ? (errors.password ?? null) : null}
          />
          <TextField
            label="Confirm password"
            testID="register-confirm-password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              if (submitted) {
                runValidation(email, password, value);
              }
            }}
            secureTextEntry
            autoCapitalize="none"
            error={submitted ? (errors.confirmPassword ?? null) : null}
          />
          {authError ? (
            <Text testID="error-auth" style={styles.authError}>
              {authError}
            </Text>
          ) : null}
          {success ? (
            <Text testID="form-success" style={styles.formSuccess}>
              {success}
            </Text>
          ) : null}
          <PrimaryButton
            label="Register"
            testID="register-submit"
            busy={busy}
            onPress={handleSubmit}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.switchLink}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  authError: {
    fontSize: fontSize.sm,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: 8,
    padding: spacing.md,
  },
  formSuccess: {
    fontSize: fontSize.sm,
    color: colors.success,
    backgroundColor: colors.successSoft,
    borderRadius: 8,
    padding: spacing.md,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchText: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  switchLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
});
