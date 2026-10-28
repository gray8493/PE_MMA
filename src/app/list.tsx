import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { colors, fontSize, spacing } from '@/theme';

export default function ListScreen() {
  const { user, authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [authLoading, user]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <Screen testID="list-screen">
      <AppHeader
        title={user.email ?? ''}
        right={
          <PrimaryButton
            label="Logout"
            variant="secondary"
            testID="logout-button"
            onPress={() => {
              logout();
            }}
          />
        }
      />
      <View style={styles.body}>
        <Text style={styles.title}>List screen</Text>
        <Text style={styles.text}>
          The books list, filters, search and summary will be built next.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: 'center',
  },
});
