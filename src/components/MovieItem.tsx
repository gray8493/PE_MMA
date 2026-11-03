import { Pressable, StyleSheet, Text, View } from 'react-native';
import FavoriteToggle from '@/components/FavoriteToggle';
import type { Movie } from '@/lib/movies';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  movie: Movie;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export default function MovieItem({ movie, onOpen, onToggleFavorite }: Props) {
  return (
    <View testID="movie-item" style={styles.item}>
      <Pressable
        testID="movie-open"
        accessibilityRole="button"
        onPress={onOpen}
        style={styles.body}
      >
        <Text testID="movie-title" style={styles.title}>
          {movie.title}
        </Text>
        <Text testID="movie-director" style={styles.director}>
          {movie.director}
        </Text>
        <View style={styles.tags}>
          <Text testID="movie-genre" style={styles.tag}>
            {movie.genre}
          </Text>
          <Text testID="movie-status" style={styles.tag}>
            {movie.status}
          </Text>
        </View>
      </Pressable>
      <FavoriteToggle
        on={movie.favorite}
        onPress={onToggleFavorite}
        testID="favorite-toggle"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  director: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    fontSize: fontSize.sm,
    color: colors.primaryDark,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
