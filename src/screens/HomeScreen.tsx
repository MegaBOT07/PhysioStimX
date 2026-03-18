import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { BottomNav } from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { bleConnected, patients, sessions, selectedPatientId, selectPatient } = useAppContext();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>
            PhysioStim<Text style={styles.brandAccent}>x</Text>
          </Text>
          <Text style={styles.brandSub}>Clinical EMS Platform</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('BleConnection')} style={styles.statusPill}>
          <View style={[styles.dot, { backgroundColor: bleConnected ? colors.success : colors.danger }]} />
          <Text style={styles.statusText}>{bleConnected ? 'Connected' : 'Disconnected'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroInner}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="heart-pulse" size={40} color={colors.accent} />
            </View>
            {/* Waveform bars */}
            <View style={styles.waveRow}>
              {[14, 22, 32, 26, 18, 28, 20, 14, 24, 30, 22, 16].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: h, opacity: 0.3 + (i % 4) * 0.18 },
                  ]}
                />
              ))}
            </View>
          </View>
          <Text style={styles.heroTitle}>Ready for Stimulation</Text>
          <Text style={styles.heroDesc}>Configure and start new EMS treatment session for your patients</Text>
          <ActionButton title="Start New Session" onPress={() => navigation.navigate('SessionSelection')} />
        </View>

        {/* BLE Setup card */}
        {!bleConnected && (
          <Pressable style={styles.bleCard} onPress={() => navigation.navigate('BleConnection')}>
            <View style={styles.bleIconWrap}>
              <MaterialCommunityIcons name="bluetooth" size={24} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bleTitle}>Connect Device</Text>
              <Text style={styles.bleSub}>Pair your PhysioStimX unit to begin treatment</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
          </Pressable>
        )}

        {/* Patients section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Patients</Text>
          <Pressable onPress={() => navigation.navigate('RegisterPatient')}>
            <MaterialCommunityIcons name="plus-circle-outline" size={22} color={colors.accent} />
          </Pressable>
        </View>

        {patients.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="account-group-outline" size={32} color={colors.muted} />
            <Text style={styles.emptyText}>No patients registered. Tap + to add one.</Text>
          </View>
        ) : (
          patients.map((patient) => {
            const isActive = selectedPatientId === patient.id;
            return (
              <Pressable
                key={patient.id}
                onPress={() => selectPatient(patient.id)}
                style={[styles.patientCard, isActive && styles.patientCardActive]}
              >
                <View style={[styles.patientAvatar, isActive && styles.patientAvatarActive]}>
                  <Text style={styles.avatarLetter}>{patient.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientGoal}>{patient.goal}</Text>
                </View>
                <View style={styles.ageBadge}>
                  <Text style={styles.ageText}>{patient.age}y</Text>
                </View>
              </Pressable>
            );
          })
        )}

        {/* Recent Sessions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <Pressable onPress={() => navigation.navigate('Analytics')}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="clipboard-pulse-outline" size={32} color={colors.muted} />
            <Text style={styles.emptyText}>No sessions yet. Start one from above.</Text>
          </View>
        ) : (
          sessions.slice(0, 4).map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionIcon}>
                <MaterialCommunityIcons
                  name={session.mode === 'Normal' ? 'pulse' : 'tune-variant'}
                  size={18}
                  color={colors.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{session.mode} Stimulation</Text>
                <Text style={styles.sessionMeta}>
                  {session.durationMin} min · {session.intensity}% intensity
                </Text>
              </View>
              <View style={styles.intensityBadge}>
                <Text style={styles.intensityText}>{session.intensity}%</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        active={0}
        tabs={[
          { icon: 'home', label: 'Home' },
          { icon: 'account-group', label: 'Patients', onPress: () => navigation.navigate('RegisterPatient') },
          { icon: 'pulse', label: 'Sessions', onPress: () => navigation.navigate('SessionSelection') },
          { icon: 'chart-bar', label: 'Analytics', onPress: () => navigation.navigate('Analytics') },
          { icon: 'cog-outline', label: 'Settings' },
        ]}
      />
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
    paddingBottom: 12,
  },
  brand: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 22,
  },
  brandAccent: {
    color: colors.accent,
  },
  brandSub: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.panel,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 24,
    gap: 14,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 36,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 20,
  },
  heroDesc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  bleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    padding: 16,
  },
  bleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,208,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bleTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
  bleSub: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
  },
  viewAll: {
    color: colors.accent,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 28,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    textAlign: 'center',
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
  },
  patientCardActive: {
    borderColor: colors.accent,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarActive: {
    backgroundColor: 'rgba(0,208,255,0.15)',
    borderColor: colors.accent,
  },
  avatarLetter: {
    color: colors.accent,
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  patientName: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },
  patientGoal: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  ageBadge: {
    backgroundColor: colors.panelAlt,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ageText: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
  },
  sessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,208,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTitle: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  sessionMeta: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  intensityBadge: {
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  intensityText: {
    color: colors.accent,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
});
