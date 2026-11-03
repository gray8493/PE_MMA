import { StyleSheet, Switch, Text, View } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import { EMPTY_FILTERS, GENRES, STATUSES, type MovieFilters } from '@/lib/movies';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
};

export default function MovieFiltersBar({ filters, onChange }: Props) {
  return (
    <View style={styles.card}>
      <TextField
        label="Search"
        testID="filter-search"
        placeholder="Title or director"
        value={filters.search}
        onChangeText={(search) => onChange({ ...filters, search })}
        autoCapitalize="none"
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <SelectField
            label="Genre"
            testID="filter-genre"
            value={filters.genre}
            emptyLabel="All"
            options={GENRES}
            onChange={(genre) => onChange({ ...filters, genre })}
          />
        </View>
        <View style={styles.half}>
          <SelectField
            label="Status"
            testID="filter-status"
            value={filters.status}
            emptyLabel="All"
            options={STATUSES}
            onChange={(status) => onChange({ ...filters, status })}
          />
        </View>
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Favorites only</Text>
        <Switch
          testID="filter-favorites"
          value={filters.favoritesOnly}
          onValueChange={(favoritesOnly) =>
            onChange({ ...filters, favoritesOnly })
          }
        />
      </View>
      <PrimaryButton
        label="Clear"
        variant="secondary"
        testID="filter-clear"
        onPress={() => onChange(EMPTY_FILTERS)}
      />
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
    minWidth: 0,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  switchLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
});
