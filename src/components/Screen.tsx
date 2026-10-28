import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';

type Props = {
  children: ReactNode;
  testID?: string;
};

export default function Screen({ children, testID }: Props) {
  return (
    <SafeAreaView style={styles.screen} testID={testID}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  inner: {
    flex: 1,
  },
});
