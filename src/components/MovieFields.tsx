import { StyleSheet, View } from 'react-native';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import {
  GENRES,
  STATUSES,
  type MovieFormErrors,
  type MovieFormValues,
} from '@/lib/movies';
import { spacing } from '@/theme';

type Props = {
  values: MovieFormValues;
  errors: MovieFormErrors;
  onChange: (field: keyof MovieFormValues, value: string) => void;
  // Keeps testIDs unique: the Add form and the Edit form can both be mounted.
  idPrefix: string;
};

export default function MovieFields({ values, errors, onChange, idPrefix }: Props) {
  return (
    <View style={styles.fields}>
      <TextField
        label="Title"
        testID={`${idPrefix}-title`}
        value={values.title}
        onChangeText={(value) => onChange('title', value)}
        error={errors.title}
      />
      <TextField
        label="Director"
        testID={`${idPrefix}-director`}
        value={values.director}
        onChangeText={(value) => onChange('director', value)}
        error={errors.director}
      />
      <SelectField
        label="Genre"
        testID={`${idPrefix}-genre`}
        value={values.genre}
        emptyLabel="Choose genre"
        options={GENRES}
        onChange={(value) => onChange('genre', value)}
        error={errors.genre}
      />
      <SelectField
        label="Status"
        testID={`${idPrefix}-status`}
        value={values.status}
        emptyLabel="Choose status"
        options={STATUSES}
        onChange={(value) => onChange('status', value)}
        error={errors.status}
      />
      <TextField
        label="Rating (optional)"
        testID={`${idPrefix}-rating`}
        value={values.rating}
        onChangeText={(value) => onChange('rating', value)}
        keyboardType="number-pad"
        error={errors.rating}
      />
      <TextField
        label="Notes (optional)"
        testID={`${idPrefix}-notes`}
        value={values.notes}
        onChangeText={(value) => onChange('notes', value)}
        multiline
        error={errors.notes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: spacing.md,
  },
});
