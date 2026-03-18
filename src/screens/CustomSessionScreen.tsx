import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { BottomNav } from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomSession'>;

const defaultChannels = [true, true, false, false, true, false, true, true];

export function CustomSessionScreen({ navigation }: Props) {
  const { createSession } = useAppContext();
  const [channels, setChannels] = useState(defaultChannels);
  const [highIntensity, setHighIntensity] = useState(false);
  const [running, setRunning] = useState(false);

  const activeCount = useMemo(() => channels.filter(Boolean).length, [channels]);

  const toggleChannel = (index: number) => {
    setChannels((prev) => prev.map((item, i) => (i === index ? !item : item)));
  };

  const finish = () => {
    const session = createSession('Custom');
    navigation.replace('Feedback', { sessionMode: 'Custom', sessionId: session.id });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Custom Session</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{activeCount}/8</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Wave visualization */}
        <View style={styles.waveCard}>
          <View style={styles.waveRow}>
            {[14, 22, 36, 28, 18, 30, 24, 16, 32, 20, 26, 14].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: h },
                  channels[i % 8] ? { backgroundColor: colors.accent, opacity: 0.4 + (i % 3) * 0.2 } : { backgroundColor: colors.border, opacity: 0.3 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.waveLabel}>Custom Waveform Preview</Text>
        </View>

        {/* Channel Grid */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="grid" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Channel Configuration</Text>
          </View>
          <Text style={styles.cardDesc}>{activeCount} of 8 channels active</Text>

          <View style={styles.grid}>
            {channels.map((enabled, index) => (
              <Pressable
                key={index}
                onPress={() => toggleChannel(index)}
                style={[styles.channelChip, enabled && styles.channelChipActive]}
              >
                <View style={[styles.channelIndicator, enabled && styles.channelIndicatorActive]} />
                <Text style={[styles.channelLabel, enabled && styles.channelLabelActive]}>CH {index + 1}</Text>
                <MaterialCommunityIcons
                  name={enabled ? 'check-circle' : 'circle-outline'}
                  size={16}
                  color={enabled ? colors.accent : colors.border}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Parameters */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="tune" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Stimulation Parameters</Text>
          </View>

          <View style={styles.paramRow}>
            <View>
              <Text style={styles.paramLabel}>Intensity Mode</Text>
              <Text style={styles.paramSub}>{highIntensity ? 'High intensity — clinical use' : 'Comfort mode — standard therapy'}</Text>
            </View>
            <Switch
              value={highIntensity}
              onValueChange={setHighIntensity}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>

          <ParamDisplay label="Pulse Width" value={highIntensity ? '400 μs' : '250 μs'} />
          <ParamDisplay label="Frequency" value={highIntensity ? '80 Hz' : '50 Hz'} />
          <ParamDisplay label="Rest Interval" value="1.0 min" />
        </View>

        {/* Action */}
        {!running ? (
          <ActionButton title="Start Custom Session" onPress={() => setRunning(true)} disabled={activeCount === 0} />
        ) : (
          <ActionButton title="Stop Session" variant="danger" onPress={finish} />
        )}
      </ScrollView>

      <BottomNav
        active={2}
        tabs={[
          { icon: 'home', label: 'Home', onPress: () => navigation.navigate('Home') },
          { icon: 'account-group', label: 'Patients' },
          { icon: 'pulse', label: 'Sessions' },
          { icon: 'chart-bar', label: 'Analytics', onPress: () => navigation.navigate('Analytics') },
          { icon: 'cog-outline', label: 'Settings' },
        ]}
      />
    </View>
  );
}

function ParamDisplay({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.paramDisplayRow}>
      <Text style={styles.paramDisplayLabel}>{label}</Text>
      <Text style={styles.paramDisplayValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 8,
  },
  headerTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 18,
  },
  counterBadge: {
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: {
    color: colors.accent,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  waveCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 40,
  },
  waveBar: {
    width: 8,
    borderRadius: 4,
  },
  waveLabel: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 15,
  },
  cardDesc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    marginTop: -4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  channelChip: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelAlt,
    padding: 12,
  },
  channelChipActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(0,208,255,0.08)',
  },
  channelIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  channelIndicatorActive: {
    backgroundColor: colors.accent,
  },
  channelLabel: {
    flex: 1,
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  channelLabelActive: {
    color: colors.text,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramLabel: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  paramSub: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  paramDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,96,107,0.3)',
  },
  paramDisplayLabel: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  paramDisplayValue: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
});
