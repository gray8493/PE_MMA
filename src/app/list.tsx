import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AddMovieForm from '@/components/AddMovieForm';
import AppHeader from '@/components/AppHeader';
import MovieFiltersBar from '@/components/MovieFiltersBar';
import MovieItem from '@/components/MovieItem';
import MovieSummary from '@/components/MovieSummary';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useMovies } from '@/context/MoviesContext';
import {
  cleanMovieError,
  EMPTY_FILTERS,
  filterMovies,
  setMovieFavorite,
  toRouteId,
  type Movie,
  type MovieFilters,
} from '@/lib/movies';
import { useRedirectWhen } from '@/lib/useRedirectWhen';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function ListScreen() {
  const { user, authLoading, logout } = useAuth();
  const { movies, moviesLoading, moviesError } = useMovies();
  const [filters, setFilters] = useState<MovieFilters>(EMPTY_FILTERS);
  const [actionError, setActionError] = useState<string | null>(null);

  useRedirectWhen(!authLoading && !user, '/');

  const visible = useMemo(() => filterMovies(movies, filters), [movies, filters]);

  if (authLoading || !user) {
    return null;
  }

  async function toggleFavorite(movie: Movie) {
    setActionError(null);
    try {
      await setMovieFavorite(movie.id, !movie.favorite);
    } catch (err) {
      setActionError(cleanMovieError(err));
    }
  }

  const listError = moviesError ?? actionError;

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
      <FlatList
        testID="movie-list"
        data={visible}
        keyExtractor={(movie) => movie.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <AddMovieForm userId={user.uid} />
            <MovieFiltersBar filters={filters} onChange={setFilters} />
            <MovieSummary movies={visible} />
            {listError ? (
              <Text testID="error-list" style={styles.error}>
                {listError}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          moviesLoading ? (
            <Text testID="movies-loading" style={styles.empty}>
              Loading movies…
            </Text>
          ) : (
            <Text testID="movies-empty" style={styles.empty}>
              No movies found
            </Text>
          )
        }
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onOpen={() =>
              router.push({
                pathname: '/movie/[id]',
                params: { id: toRouteId(item.id) },
              })
            }
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  empty: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
});
