import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Feedback'>;

const EMOJIS = [
  { emoji: '😫', label: 'Severe Pain' },
  { emoji: '😟', label: 'Uncomfortable' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '🙂', label: 'Comfortable' },
  { emoji: '😄', label: 'Excellent' },
];

export function FeedbackScreen({ navigation, route }: Props) {
  const { addFeedback } = useAppContext();
  const [emojiIdx, setEmojiIdx] = useState(3);
  const [stars, setStars] = useState(4);
  const [note, setNote] = useState('');

  const submit = () => {
    addFeedback(route.params.sessionId, stars, note.trim());
    navigation.replace('Analytics');
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Session Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Success hero */}
        <View style={styles.heroArea}>
          <View style={styles.heroCircle}>
            <MaterialCommunityIcons name="check" size={44} color={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Session Complete!</Text>
          <Text style={styles.heroDesc}>
            {route.params.sessionMode} stimulation session finished successfully
          </Text>
        </View>

        {/* Emoji comfort scale */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="emoticon-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Patient Comfort Level</Text>
          </View>
          <View style={styles.emojiRow}>
            {EMOJIS.map((item, i) => {
              const isActive = i === emojiIdx;
              return (
                <Pressable key={item.label} onPress={() => setEmojiIdx(i)} style={styles.emojiWrap}>
                  <View style={[styles.emojiCircle, isActive && styles.emojiCircleActive]}>
                    <Text style={styles.emojiChar}>{item.emoji}</Text>
                  </View>
                  <Text style={[styles.emojiLabel, isActive && styles.emojiLabelActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Star rating */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="star-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Treatment Effectiveness</Text>
          </View>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setStars(n)} hitSlop={6}>
                <MaterialCommunityIcons
                  name={n <= stars ? 'star' : 'star-outline'}
                  size={36}
                  color={n <= stars ? '#eab308' : colors.border}
                />
              </Pressable>
            ))}
          </View>
          <Text style={styles.ratingText}>{stars}/5 — {EMOJIS[Math.min(stars - 1, 4)].label}</Text>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="note-text-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>Clinical Notes</Text>
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="Observations, muscle response, pain threshold, recommendations..."
            placeholderTextColor="rgba(141,194,206,0.4)"
            style={styles.input}
          />
        </View>

        {/* Session summary footer */}
        <View style={styles.summaryRow}>
          <SummaryItem icon="flash" label="Mode" value={route.params.sessionMode} />
          <SummaryItem icon="timer-outline" label="Duration" value="3.5 min" />
          <SummaryItem icon="lightning-bolt" label="Intensity" value="65%" />
        </View>

        <ActionButton title="Submit Feedback" onPress={submit} />
      </ScrollView>
    </View>
  );
}

function SummaryItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <MaterialCommunityIcons name={icon as any} size={16} color={colors.accent} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
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
    paddingBottom: 32,
    gap: 16,
  },
  heroArea: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  heroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fontFamily.bold,
    fontSize: 22,
  },
  heroDesc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
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
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiWrap: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiCircleActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(0,208,255,0.08)',
  },
  emojiChar: {
    fontSize: 22,
  },
  emojiLabel: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 9,
    textAlign: 'center',
  },
  emojiLabelActive: {
    color: colors.accent,
    fontFamily: fontFamily.medium,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  ratingText: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    textAlign: 'center',
  },
  input: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelAlt,
    color: colors.text,
    padding: 14,
    textAlignVertical: 'top',
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
});
