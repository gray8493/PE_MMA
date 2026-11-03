import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme';

type Props = {
  on: boolean;
  onPress: () => void;
  testID: string;
};

export default function FavoriteToggle({ on, onPress, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={on ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ selected: on }}
      hitSlop={8}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={[styles.star, on ? styles.on : null]}>{on ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 28,
    color: colors.muted,
  },
  on: {
    color: colors.star,
  },
});
