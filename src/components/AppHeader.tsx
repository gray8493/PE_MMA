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
      <Text style={[styles.title, left && right ? styles.center : null]} numberOfLines={1}>
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
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  center: {
    textAlign: 'center',
  },
});
