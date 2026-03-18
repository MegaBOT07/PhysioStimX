import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { BottomNav } from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NormalSession'>;

export function NormalSessionScreen({ navigation }: Props) {
  const { createSession } = useAppContext();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(iv);
  }, [running]);

  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [running, pulseAnim]);

  const finish = () => {
    const session = createSession('Normal');
    navigation.replace('Feedback', { sessionMode: 'Normal', sessionId: session.id });
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Normal Session</Text>
        <View style={styles.activeBadge}>
          <View style={[styles.activeDot, !running && { backgroundColor: colors.border }]} />
          <Text style={[styles.activeText, !running && { color: colors.muted }]}>
            {running ? 'ACTIVE' : 'READY'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Pulse illustration */}
        <View style={styles.pulseArea}>
          <View style={styles.pulseOuter}>
            {running && (
              <Animated.View
                style={[
                  styles.pulseRing,
                  { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
                ]}
              />
            )}
            <View style={styles.pulseInner}>
              <MaterialCommunityIcons name="lightning-bolt" size={48} color={colors.accent} />
            </View>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Session Time</Text>
          <Text style={styles.timerValue}>{mm}:{ss}</Text>
          <View style={styles.phaseRow}>
            <View style={[styles.phaseDot, running && { backgroundColor: colors.accent }]} />
            <Text style={styles.phaseText}>{running ? 'Pulse Phase' : 'Waiting to start'}</Text>
          </View>
        </View>

        {/* Channel sequence */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="swap-horizontal-bold" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Channel Sequence</Text>
          </View>
          <View style={styles.channelRow}>
            {['CH1', 'CH2', 'CH3', 'CH4'].map((ch, i) => (
              <View key={ch} style={styles.channelItem}>
                <View style={[styles.channelDot, running && i === (Math.floor(elapsed / 3) % 4) && styles.channelDotActive]} />
                <Text style={styles.channelLabel}>{ch}</Text>
                {i < 3 && <MaterialCommunityIcons name="chevron-right" size={14} color={colors.border} />}
              </View>
            ))}
          </View>
        </View>

        {/* Parameters */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="tune" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Parameters</Text>
          </View>
          <ParamRow label="Pulse Duration" value="3.5 min" />
          <ParamRow label="Rest Interval" value="1.0 min" />
          <ParamRow label="Intensity" value="65%" accent />
        </View>

        {/* Action */}
        {!running ? (
          <ActionButton title="Start Stimulation" onPress={() => setRunning(true)} />
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

function ParamRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.paramRow}>
      <Text style={styles.paramLabel}>{label}</Text>
      <Text style={[styles.paramValue, accent && { color: colors.accent }]}>{value}</Text>
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
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,208,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  activeText: {
    color: colors.accent,
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    letterSpacing: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  pulseArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pulseOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  pulseInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  timerLabel: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timerValue: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 48,
    letterSpacing: 2,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  phaseText: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 13,
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
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  channelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  channelDotActive: {
    backgroundColor: colors.accent,
  },
  channelLabel: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,96,107,0.3)',
  },
  paramLabel: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  paramValue: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
});
