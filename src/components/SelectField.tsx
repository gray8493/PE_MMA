import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  label: string;
  value: string;
  // Shown for the empty value, and offered as the first choice in the list.
  emptyLabel: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string | null;
  testID: string;
};

export default function SelectField({
  label,
  value,
  emptyLabel,
  options,
  onChange,
  error,
  testID,
}: Props) {
  const [open, setOpen] = useState(false);
  const choices = [{ value: '', label: emptyLabel }].concat(
    options.map((option) => ({ value: option, label: option })),
  );

  function choose(next: string) {
    setOpen(false);
    onChange(next);
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[styles.control, error ? styles.controlError : null]}
      >
        <Text
          style={[styles.value, value ? null : styles.placeholder]}
          numberOfLines={1}
        >
          {value || emptyLabel}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      {error ? (
        <Text testID={`${testID}-error`} style={styles.error}>
          {error}
        </Text>
      ) : null}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView>
              {choices.map((choice) => (
                <Pressable
                  key={choice.label}
                  testID={`${testID}-option-${choice.value || 'empty'}`}
                  accessibilityRole="button"
                  onPress={() => choose(choice.value)}
                  style={[
                    styles.option,
                    choice.value === value ? styles.optionActive : null,
                  ]}
                >
                  <Text style={styles.optionText}>{choice.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  controlError: {
    borderColor: colors.danger,
  },
  value: {
    flexShrink: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  placeholder: {
    color: colors.muted,
  },
  chevron: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    maxHeight: '80%',
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  option: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
});
