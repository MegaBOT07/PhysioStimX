import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'ghost' | 'danger' | 'outline';
  disabled?: boolean;
  style?: Record<string, unknown>;
};

export function ActionButton({ title, onPress, variant = 'solid', disabled = false, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'solid' && styles.solid,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'solid' && styles.textDark,
          variant === 'outline' && styles.textAccent,
          variant === 'ghost' && styles.textMuted
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  solid: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  danger: {
    backgroundColor: colors.danger
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent
  },
  text: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 16
  },
  textDark: {
    color: colors.bg
  },
  textAccent: {
    color: colors.accent
  },
  textMuted: {
    color: colors.muted
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9
  },
  disabled: {
    opacity: 0.4
  }
});
