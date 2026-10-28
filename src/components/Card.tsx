import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  title: string;
  description: string;
};

export default function Card({ title, description }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
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
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
});
