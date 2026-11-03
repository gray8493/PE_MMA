import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MovieFields from '@/components/MovieFields';
import PrimaryButton from '@/components/PrimaryButton';
import { useMovies } from '@/context/MoviesContext';
import {
  addMovie,
  cleanMovieError,
  DUPLICATE_MOVIE,
  EMPTY_MOVIE_FORM,
  hasErrors,
  isSameMovie,
  validateMovie,
  type MovieFormErrors,
  type MovieFormValues,
} from '@/lib/movies';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function AddMovieForm({ userId }: { userId: string }) {
  const { movies } = useMovies();
  const [values, setValues] = useState<MovieFormValues>(EMPTY_MOVIE_FORM);
  const [errors, setErrors] = useState<MovieFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleChange(field: keyof MovieFormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    setSuccess(null);
    setSaveError(null);
    if (submitted) {
      setErrors(validateMovie(next));
    }
  }

  async function handleSubmit() {
    setSubmitted(true);
    setSaveError(null);
    setSuccess(null);
    const nextErrors = validateMovie(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      return;
    }
    // Checked first so a duplicate never appears in the list, not even briefly.
    if (movies.some((movie) => isSameMovie(movie, values))) {
      setSaveError(DUPLICATE_MOVIE);
      return;
    }
    setBusy(true);
    try {
      await addMovie(userId, values);
      setValues(EMPTY_MOVIE_FORM);
      setSubmitted(false);
      setSuccess('Movie added');
    } catch (err) {
      setSaveError(cleanMovieError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View testID="movie-form" style={styles.form}>
      <Text style={styles.heading}>Add a movie</Text>
      <MovieFields
        values={values}
        errors={errors}
        onChange={handleChange}
        idPrefix="add"
      />
      {saveError ? (
        <Text testID="error-movie" style={styles.error}>
          {saveError}
        </Text>
      ) : null}
      {success ? (
        <Text testID="movie-success" style={styles.success}>
          {success}
        </Text>
      ) : null}
      <PrimaryButton
        label="Add movie"
        testID="movie-submit"
        busy={busy}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  success: {
    fontSize: fontSize.sm,
    color: colors.success,
    backgroundColor: colors.successSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
    textAlign: 'center',
  },
});
