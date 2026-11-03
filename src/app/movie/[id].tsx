import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import FavoriteToggle from '@/components/FavoriteToggle';
import MovieFields from '@/components/MovieFields';
import PrimaryButton from '@/components/PrimaryButton';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useMovies } from '@/context/MoviesContext';
import {
  cleanMovieError,
  deleteMovie,
  DUPLICATE_MOVIE,
  EMPTY_MOVIE_FORM,
  fromRouteId,
  hasErrors,
  isSameMovie,
  movieToFormValues,
  saveMovie,
  setMovieFavorite,
  toRouteId,
  validateMovie,
  type Movie,
  type MovieFormErrors,
  type MovieFormValues,
} from '@/lib/movies';
import { useRedirectWhen } from '@/lib/useRedirectWhen';
import { colors, fontSize, radius, spacing } from '@/theme';

function goToList() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/list');
  }
}

function DetailRow({
  label,
  value,
  testID,
}: {
  label: string;
  value: string;
  testID: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text testID={testID} style={styles.rowValue}>
        {value}
      </Text>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { id: routeId } = useLocalSearchParams<{ id: string }>();
  const id = fromRouteId(routeId);
  const { user, authLoading } = useAuth();
  const { movies, moviesLoading } = useMovies();

  const [lastMovie, setLastMovie] = useState<Movie | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<MovieFormValues>(EMPTY_MOVIE_FORM);
  const [errors, setErrors] = useState<MovieFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const found = movies.find((movie) => movie.id === id);

  // While a rename or delete is running the row has already left the local
  // list, so the last known copy stays on screen until it finishes.
  if (found && found !== lastMovie) {
    setLastMovie(found);
  }

  useRedirectWhen(!authLoading && !user, '/');

  if (authLoading || !user || moviesLoading) {
    return null;
  }

  const movie = found ?? (busy ? lastMovie : undefined);

  if (!movie) {
    return (
      <Screen testID="detail-screen">
        <AppHeader title="Movie" />
        <View style={styles.content}>
          <Text testID="detail-missing" style={styles.missing}>
            Movie not found
          </Text>
          <PrimaryButton
            label="Back to list"
            variant="secondary"
            testID="detail-back"
            onPress={goToList}
          />
        </View>
      </Screen>
    );
  }

  const current = movie;

  function startEditing() {
    setValues(movieToFormValues(current));
    setErrors({});
    setSubmitted(false);
    setError(null);
    setEditing(true);
  }

  function handleChange(field: keyof MovieFormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    setError(null);
    if (submitted) {
      setErrors(validateMovie(next));
    }
  }

  async function handleSave() {
    setSubmitted(true);
    setError(null);
    const nextErrors = validateMovie(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      return;
    }
    if (
      movies.some((item) => item.id !== current.id && isSameMovie(item, values))
    ) {
      setError(DUPLICATE_MOVIE);
      return;
    }
    setBusy(true);
    try {
      const savedId = await saveMovie(current, values);
      setEditing(false);
      if (savedId !== current.id) {
        router.setParams({ id: toRouteId(savedId) });
      }
    } catch (err) {
      setError(cleanMovieError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteMovie(current.id);
      setConfirming(false);
      goToList();
    } catch (err) {
      setConfirming(false);
      setError(cleanMovieError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleFavorite() {
    setError(null);
    try {
      await setMovieFavorite(current.id, !current.favorite);
    } catch (err) {
      setError(cleanMovieError(err));
    }
  }

  return (
    <Screen testID="detail-screen">
      <AppHeader
        title={editing ? 'Edit movie' : 'Movie details'}
        right={
          editing ? undefined : (
            <PrimaryButton
              label="Back"
              variant="secondary"
              testID="detail-back"
              onPress={goToList}
            />
          )
        }
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {editing ? (
            <MovieFields
              values={values}
              errors={errors}
              onChange={handleChange}
              idPrefix="edit"
            />
          ) : (
            <View style={styles.card}>
              <DetailRow label="Title" value={current.title} testID="detail-title" />
              <DetailRow
                label="Director"
                value={current.director}
                testID="detail-director"
              />
              <DetailRow label="Genre" value={current.genre} testID="detail-genre" />
              <DetailRow label="Status" value={current.status} testID="detail-status" />
              <DetailRow
                label="Rating"
                value={current.rating === null ? 'Not rated' : String(current.rating)}
                testID="detail-rating"
              />
              <DetailRow
                label="Notes"
                value={current.notes || 'No notes'}
                testID="detail-notes"
              />
              <View style={styles.favoriteRow}>
                <Text style={styles.rowLabel}>Favorite</Text>
                <FavoriteToggle
                  on={current.favorite}
                  onPress={handleToggleFavorite}
                  testID="detail-favorite"
                />
              </View>
            </View>
          )}
          {error ? (
            <Text testID="error-movie" style={styles.error}>
              {error}
            </Text>
          ) : null}
          <View style={styles.actions}>
            {editing ? (
              <>
                <View style={styles.action}>
                  <PrimaryButton
                    label="Cancel"
                    variant="secondary"
                    testID="edit-cancel"
                    onPress={() => {
                      setError(null);
                      setEditing(false);
                    }}
                  />
                </View>
                <View style={styles.action}>
                  <PrimaryButton
                    label="Save"
                    testID="edit-save"
                    busy={busy}
                    onPress={handleSave}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.action}>
                  <PrimaryButton
                    label="Edit"
                    variant="secondary"
                    testID="detail-edit"
                    onPress={startEditing}
                  />
                </View>
                <View style={styles.action}>
                  <PrimaryButton
                    label="Delete"
                    variant="danger"
                    testID="detail-delete"
                    onPress={() => setConfirming(true)}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmDialog
        visible={confirming}
        title="Delete movie"
        message={`Delete "${current.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    gap: 2,
  },
  rowLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.muted,
  },
  rowValue: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
  missing: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: 'center',
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
});
