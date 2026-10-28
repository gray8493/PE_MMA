import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  testID?: string;
};

export default function TextField({
  label,
  error,
  testID,
  ...inputProps
}: Props) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID={testID}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.muted}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
