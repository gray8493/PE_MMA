import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  busy?: boolean;
  testID?: string;
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  busy = false,
  testID,
}: Props) {
  const inactive = disabled || busy;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        pressed && !inactive && styles.pressed,
        inactive && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'danger' && styles.dangerLabel,
        ]}
      >
        {busy ? 'Please wait…' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.card,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  secondaryLabel: {
    color: colors.primary,
  },
  dangerLabel: {
    color: colors.card,
  },
});
