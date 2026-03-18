import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Analytics'>;

const CHART_BARS = [35, 55, 70, 45, 80, 60, 50];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function AnalyticsScreen({ navigation }: Props) {
  const { sessions, patients } = useAppContext();
  const avgIntensity = sessions.length
    ? Math.round(sessions.reduce((s, x) => s + x.intensity, 0) / sessions.length)
    : 0;
  const avgRating = sessions.length
    ? (sessions.reduce((s, x) => s + (x.rating ?? 0), 0) / sessions.length).toFixed(1)
    : '—';

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Patient Analytics</Text>
        <Pressable hitSlop={12}>
          <MaterialCommunityIcons name="download-outline" size={24} color={colors.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stat grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="account-group-outline" label="Total Patients" value={String(patients.length)} color={colors.accent} />
          <StatCard icon="pulse" label="Total Sessions" value={String(sessions.length)} color="#22c55e" />
          <StatCard icon="lightning-bolt" label="Avg Intensity" value={`${avgIntensity}%`} color="#eab308" />
          <StatCard icon="star-outline" label="Avg Rating" value={avgRating} color="#f97316" />
        </View>

        {/* Weekly chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chart-bar" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Weekly Activity</Text>
          </View>
          <View style={styles.chartArea}>
            {CHART_BARS.map((h, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.chartBar, { height: h }]} />
                <Text style={styles.chartLabel}>{DAYS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Session list */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Session History</Text>
          </View>
          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-pulse-outline" size={36} color={colors.muted} />
              <Text style={styles.emptyText}>No sessions recorded yet</Text>
            </View>
          ) : (
            sessions.map((item) => (
              <View key={item.id} style={styles.sessionRow}>
                <View style={styles.sessionIcon}>
                  <MaterialCommunityIcons
                    name={item.mode === 'Normal' ? 'pulse' : 'tune-variant'}
                    size={18}
                    color={colors.accent}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionTitle}>{item.mode} Stimulation</Text>
                  <Text style={styles.sessionMeta}>
                    {item.durationMin} min · {item.intensity}%
                  </Text>
                </View>
                <View style={styles.ratingBadge}>
                  <MaterialCommunityIcons name="star" size={12} color="#eab308" />
                  <Text style={styles.ratingText}>{item.rating ?? '—'}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Doctor notes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="stethoscope" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Physiotherapist Notes</Text>
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Patient is responding well to treatment. Continue current protocol with gradual intensity increases. Next review in 2 sessions.
            </Text>
            <Text style={styles.noteAuthor}>— Dr. PhysioStimX</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav
        active={3}
        tabs={[
          { icon: 'home', label: 'Home', onPress: () => navigation.navigate('Home') },
          { icon: 'account-group', label: 'Patients', onPress: () => navigation.navigate('RegisterPatient') },
          { icon: 'pulse', label: 'Sessions', onPress: () => navigation.navigate('SessionSelection') },
          { icon: 'chart-bar', label: 'Analytics' },
          { icon: 'cog-outline', label: 'Settings' },
        ]}
      />
    </View>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 6,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 28,
  },
  statLabel: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 14,
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
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
  },
  chartCol: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  chartBar: {
    width: 20,
    borderRadius: 4,
    backgroundColor: colors.accent,
    opacity: 0.7,
  },
  chartLabel: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,96,107,0.25)',
  },
  sessionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(234,179,8,0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: {
    color: '#eab308',
    fontFamily: fontFamily.semibold,
    fontSize: 12,
  },
  noteBox: {
    backgroundColor: colors.panelAlt,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: 14,
    gap: 8,
  },
  noteText: {
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  noteAuthor: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
});
