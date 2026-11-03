import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Used instead of Alert.alert, which does nothing on the web.
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View testID="confirm-dialog" style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <View style={styles.action}>
              <PrimaryButton
                label="Cancel"
                variant="secondary"
                testID="confirm-cancel"
                onPress={onCancel}
              />
            </View>
            <View style={styles.action}>
              <PrimaryButton
                label={confirmLabel}
                variant="danger"
                testID="confirm-ok"
                busy={busy}
                onPress={onConfirm}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  dialog: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
});
