import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from '../components/BottomNav';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionSelection'>;

export function SessionSelectionScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Session Selection</Text>
        <Pressable hitSlop={12}>
          <MaterialCommunityIcons name="information-outline" size={24} color={colors.muted} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.pageTitle}>Choose Treatment Mode</Text>
        <Text style={styles.pageDesc}>
          Select the stimulation protocol for this treatment session
        </Text>

        {/* Normal card */}
        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('NormalSession')}
        >
          <View style={styles.cardTop}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="pulse" size={32} color={colors.accent} />
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>RECOMMENDED</Text>
              </View>
            </View>
          </View>
          <Text style={styles.cardTitle}>Normal Stimulation</Text>
          <Text style={styles.cardDesc}>
            Pre-configured 4-channel sequence with calibrated pulse/rest timing. Ideal for standard rehabilitation protocols.
          </Text>
          <View style={styles.cardFeatures}>
            <Feature icon="timer-outline" label="3.5 min pulse" />
            <Feature icon="lightning-bolt" label="4 channels" />
            <Feature icon="shield-check-outline" label="Auto-calibrated" />
          </View>
          <View style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>Select Protocol</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.bg} />
          </View>
        </Pressable>

        {/* Custom card */}
        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('CustomSession')}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.25)' }]}>
              <MaterialCommunityIcons name="tune-variant" size={32} color={colors.warning} />
            </View>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: 'rgba(234,179,8,0.1)' }]}>
                <Text style={[styles.badgeText, { color: colors.warning }]}>ADVANCED</Text>
              </View>
            </View>
          </View>
          <Text style={styles.cardTitle}>Custom Stimulation</Text>
          <Text style={styles.cardDesc}>
            Full control over 8 channels with manual intensity, timing, and sequence configuration.
          </Text>
          <View style={styles.cardFeatures}>
            <Feature icon="grid" label="8 channels" />
            <Feature icon="sliders" label="Manual control" />
            <Feature icon="cog-outline" label="Custom timing" />
          </View>
          <View style={[styles.selectBtn, { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.accent }]}>
            <Text style={[styles.selectBtnText, { color: colors.accent }]}>Configure Session</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.accent} />
          </View>
        </Pressable>
      </View>

      <BottomNav
        active={2}
        tabs={[
          { icon: 'home', label: 'Home', onPress: () => navigation.navigate('Home') },
          { icon: 'account-group', label: 'Patients', onPress: () => navigation.navigate('RegisterPatient') },
          { icon: 'pulse', label: 'Sessions' },
          { icon: 'chart-bar', label: 'Analytics', onPress: () => navigation.navigate('Analytics') },
          { icon: 'cog-outline', label: 'Settings' },
        ]}
      />
    </View>
  );
}

function Feature({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.feature}>
      <MaterialCommunityIcons name={icon as any} size={14} color={colors.accent} />
      <Text style={styles.featureText}>{label}</Text>
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
  body: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 14,
    paddingTop: 8,
  },
  pageTitle: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 24,
  },
  pageDesc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.accent,
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    letterSpacing: 1,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 18,
  },
  cardDesc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  cardFeatures: {
    flexDirection: 'row',
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  selectBtnText: {
    color: colors.bg,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
});
