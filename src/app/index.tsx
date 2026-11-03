import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import Card from '@/components/Card';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useRedirectWhen } from '@/lib/useRedirectWhen';
import { colors, fontSize, spacing } from '@/theme';

const FEATURES = [
  {
    title: 'Track what you watch',
    description: 'Keep every movie you want to see in one private watchlist.',
  },
  {
    title: 'Sort by status',
    description: 'Organize your movies by Plan to Watch, Watching and Watched.',
  },
  {
    title: 'Rate your favorites',
    description: 'Rate each movie from 0 to 5 and star the ones you love.',
  },
];

export default function HomeScreen() {
  const { user, authLoading, registering } = useAuth();

  useRedirectWhen(!authLoading && Boolean(user) && !registering, '/list');

  if (authLoading || user) {
    return null;
  }

  return (
    <Screen>
      <AppHeader
        title="CineList"
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
          CineList
        </Text>
        <Text style={styles.description}>
          A small mobile app where you keep your own private movie watchlist,
          with genres, watch statuses, ratings, notes and a favorite flag.
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
