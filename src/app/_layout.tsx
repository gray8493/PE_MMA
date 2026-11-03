import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { MoviesProvider } from '@/context/MoviesContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </MoviesProvider>
    </AuthProvider>
  );
}
