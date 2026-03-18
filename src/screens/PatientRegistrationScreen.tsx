import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterPatient'>;

export function PatientRegistrationScreen({ navigation }: Props) {
  const { registerPatient } = useAppContext();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');

  const submit = () => {
    if (!name.trim() || !age.trim() || !goal.trim()) {
      Alert.alert('Missing details', 'Name, age, and treatment goal are required.');
      return;
    }

    const ageValue = Number(age);
    if (Number.isNaN(ageValue) || ageValue <= 0) {
      Alert.alert('Invalid age', 'Please enter a valid positive age.');
      return;
    }

    registerPatient({
      name: name.trim(),
      age: ageValue,
      goal: goal.trim(),
      notes: notes.trim()
    });

    navigation.replace('Home');
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Patient Registration</Text>
        <Pressable hitSlop={12}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.muted} />
        </Pressable>
      </View>

      {/* Step progress */}
      <View style={styles.stepRow}>
        <Text style={styles.stepLabel}>Step 1 of 4</Text>
        <Text style={styles.stepPercent}>25%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '25%' }]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <MaterialCommunityIcons name="account-plus-outline" size={20} color={colors.accent} />
            <Text style={styles.formTitle}>Personal Information</Text>
          </View>
          <Text style={styles.formDesc}>Enter the patient details for treatment records</Text>

          <Field
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter patient full name"
            icon="account-outline"
          />
          <Field
            label="Age"
            value={age}
            onChangeText={setAge}
            placeholder="Years"
            icon="calendar-outline"
            keyboardType="number-pad"
          />
          <Field
            label="Treatment Goal"
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g. Post-surgery rehabilitation"
            icon="target"
          />
          <Field
            label="Medical Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Relevant medical history, conditions, contraindications..."
            icon="note-text-outline"
            multiline
          />
        </View>

        <ActionButton title="Register Patient" onPress={submit} />
      </ScrollView>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  keyboardType?: 'default' | 'number-pad';
  multiline?: boolean;
};

function Field({ label, icon, multiline, ...props }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, multiline && styles.inputRowMultiline]}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.muted} style={{ marginTop: multiline ? 12 : 0 }} />
        <TextInput
          {...props}
          multiline={multiline}
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor="rgba(141,194,206,0.4)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 52,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 18,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  stepLabel: {
    color: colors.muted,
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  stepPercent: {
    color: colors.accent,
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,208,255,0.1)',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  formCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    gap: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
  },
  formDesc: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    marginTop: -8,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.panelAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: 100,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    paddingVertical: 12,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
