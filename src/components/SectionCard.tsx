import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  children: ReactNode;
  noPadding?: boolean;
};

export function SectionCard({ children, noPadding }: Props) {
  return <View style={[styles.card, noPadding && styles.noPad]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    padding: 16,
    gap: 12
  },
  noPad: {
    padding: 0
  }
});
