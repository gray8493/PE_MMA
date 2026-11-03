import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/theme';

type Props = {
  title: string;
  right?: ReactNode;
  left?: ReactNode;
};

export default function AppHeader({ title, right, left }: Props) {
  return (
    <View style={styles.header}>
      {left ? <View style={styles.side}>{left}</View> : null}
      <Text style={[styles.title, left && right ? styles.center : null]}>
        {title}
      </Text>
      {right ? <View style={styles.side}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
  },
  side: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    minWidth: 0,
  },
  center: {
    textAlign: 'center',
  },
});
