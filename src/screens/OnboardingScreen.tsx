import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    icon: 'medical-bag' as const,
    title: 'Welcome to PhysioStimx Treatment',
    desc: 'Advanced electrical muscle stimulation platform designed for clinical professionals. Manage patients, sessions, and analytics seamlessly.',
  },
  {
    icon: 'pulse' as const,
    title: 'Multi-Channel Stimulation',
    desc: 'Run normal or fully-custom 8-channel EMS programmes with real-time intensity and timing control.',
  },
  {
    icon: 'chart-timeline-variant' as const,
    title: 'Patient Analytics & History',
    desc: 'Track treatment progress with session reports, feedback scores, and longitudinal analytics per-patient.',
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [page, setPage] = useState(0);
  const slide = slides[page];

  const next = () => {
    if (page < slides.length - 1) {
      setPage(page + 1);
    } else {
      navigation.replace('RegisterPatient');
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        {page > 0 ? (
          <Pressable onPress={() => setPage(page - 1)} hitSlop={12}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Pressable hitSlop={12}>
          <MaterialCommunityIcons name="information-outline" size={24} color={colors.muted} />
        </Pressable>
      </View>

      {/* Hero Illustration */}
      <View style={styles.heroArea}>
        <View style={styles.heroCard}>
          <View style={styles.heroRingOuter}>
            <View style={styles.heroRingInner}>
              <MaterialCommunityIcons name={slide.icon} size={56} color={colors.accent} />
            </View>
          </View>
          {/* Waveform bars */}
          <View style={styles.waveRow}>
            {[12, 20, 32, 24, 16, 28, 20, 12].map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: h, opacity: 0.3 + (i % 3) * 0.2 }]} />
            ))}
          </View>
          <View style={styles.emsBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color={colors.accent} />
            <Text style={styles.emsBadgeText}>EMS ACTIVE</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <ActionButton title={page < slides.length - 1 ? 'Next Step' : 'Get Started'} onPress={next} />
        <Pressable onPress={() => navigation.replace('RegisterPatient')} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip Introduction</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 52,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  heroArea: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  heroCard: {
    width: '100%',
    backgroundColor: colors.panel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  heroRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRingInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 36,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  emsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,208,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.2)',
  },
  emsBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 32,
  },
  desc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,208,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.accent,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skipText: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
});
