import { StyleSheet, Text, View } from 'react-native';
import { statusBreakdown, type Movie } from '@/lib/movies';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function MovieSummary({ movies }: { movies: Movie[] }) {
  const favorites = movies.filter((movie) => movie.favorite).length;
  const rows = statusBreakdown(movies);

  return (
    <View testID="movie-summary" style={styles.card}>
      <View style={styles.totals}>
        <View style={styles.total}>
          <Text testID="movie-count" style={styles.number}>
            {movies.length}
          </Text>
          <Text style={styles.caption}>Movies</Text>
        </View>
        <View style={styles.total}>
          <Text testID="favorite-count" style={styles.number}>
            {favorites}
          </Text>
          <Text style={styles.caption}>Favorites</Text>
        </View>
      </View>
      {rows.length > 0 ? (
        <View testID="status-breakdown" style={styles.rows}>
          {rows.map((row) => (
            <View key={row.status} testID="status-row" style={styles.row}>
              <Text style={styles.rowName}>{row.status}</Text>
              <Text style={styles.rowCount}>{row.count}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  totals: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  total: {
    flex: 1,
    alignItems: 'center',
  },
  number: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.primary,
  },
  caption: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  rows: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowName: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  rowCount: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
});
