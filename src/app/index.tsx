import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import Card from '@/components/Card';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { colors, fontSize, spacing } from '@/theme';

const FEATURES = [
  {
    title: 'Track your books',
    description: 'Add every book you own or want to read in one private list.',
  },
  {
    title: 'Sort by status',
    description: 'Organize your books by To Read, Reading, and Finished.',
  },
  {
    title: 'Rate your favorites',
    description: 'Rate each book from 0 to 5 and star the ones you love.',
  },
];

export default function HomeScreen() {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/list');
    }
  }, [authLoading, user]);

  if (authLoading || user) {
    return null;
  }

  return (
    <Screen>
      <AppHeader
        title="BookShelf"
        right={
          <>
            <PrimaryButton
              label="Login"
              variant="secondary"
              testID="header-login"
              onPress={() => router.push('/login')}
            />
            <PrimaryButton
              label="Register"
              testID="header-register"
              onPress={() => router.push('/register')}
            />
          </>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text testID="home-title" style={styles.homeTitle}>
          BookShelf
        </Text>
        <Text style={styles.description}>
          A small mobile app where you keep your own private list of books you
          own or want to read, sorted into reading statuses and genres, with a
          favorite flag.
        </Text>
        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  homeTitle: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    gap: spacing.md,
  },
});
