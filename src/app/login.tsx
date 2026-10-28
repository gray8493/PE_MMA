import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import {
  cleanFirebaseError,
  validateEmail,
  validateLoginPassword,
} from '@/lib/validation';
import { colors, fontSize, spacing } from '@/theme';

export default function LoginScreen() {
  const { user, authLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/list');
    }
  }, [authLoading, user]);

  function runValidation(nextEmail: string, nextPassword: string) {
    setErrors({
      email: validateEmail(nextEmail) ?? undefined,
      password: validateLoginPassword(nextPassword) ?? undefined,
    });
  }

  async function handleSubmit() {
    setSubmitted(true);
    setAuthError(null);
    const nextErrors = {
      email: validateEmail(email) ?? undefined,
      password: validateLoginPassword(password) ?? undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/list');
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
      <AppHeader title="Login" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextField
            label="Email"
            testID="login-email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (submitted) {
                runValidation(value, password);
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={submitted ? (errors.email ?? null) : null}
          />
          <TextField
            label="Password"
            testID="login-password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (submitted) {
                runValidation(email, value);
              }
            }}
            secureTextEntry
            autoCapitalize="none"
            error={submitted ? (errors.password ?? null) : null}
          />
          {authError ? (
            <Text testID="error-auth" style={styles.authError}>
              {authError}
            </Text>
          ) : null}
          <PrimaryButton
            label="Login"
            testID="login-submit"
            busy={busy}
            onPress={handleSubmit}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Do not have an account? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.switchLink}>Register</Text>
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
