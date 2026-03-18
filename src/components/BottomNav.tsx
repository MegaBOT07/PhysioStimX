import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

type Tab = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
};

type Props = {
  active: number;
  tabs: Tab[];
};

export function BottomNav({ active, tabs }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab, i) => {
        const isActive = i === active;
        return (
          <Pressable key={tab.label} style={styles.tab} onPress={tab.onPress}>
            <MaterialCommunityIcons
              name={tab.icon}
              size={22}
              color={isActive ? colors.accent : colors.muted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            {isActive && <View style={styles.dot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.panel,
    paddingTop: 8,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
    color: colors.muted,
  },
  labelActive: {
    color: colors.accent,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 2,
  },
});
