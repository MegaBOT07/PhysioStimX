export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  RegisterPatient: undefined;
  Home: undefined;
  SessionSelection: undefined;
  NormalSession: undefined;
  CustomSession: undefined;
  Feedback: { sessionMode: 'Normal' | 'Custom'; sessionId: string };
  Analytics: undefined;
  BleConnection: undefined;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  goal: string;
  notes: string;
};

export type SessionRecord = {
  id: string;
  patientId: string;
  mode: 'Normal' | 'Custom';
  intensity: number;
  durationMin: number;
  createdAt: string;
  feedback?: string;
  rating?: number;
};
