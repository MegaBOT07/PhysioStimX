import { createContext, useContext, useMemo, useState } from 'react';
import { Patient, SessionRecord } from '../types';

type AppContextValue = {
  patients: Patient[];
  sessions: SessionRecord[];
  selectedPatientId: string | null;
  bleConnected: boolean;
  registerPatient: (patient: Omit<Patient, 'id'>) => void;
  selectPatient: (patientId: string) => void;
  createSession: (mode: 'Normal' | 'Custom') => SessionRecord;
  addFeedback: (sessionId: string, rating: number, feedback: string) => void;
  setBleConnected: (connected: boolean) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const randomId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [bleConnected, setBleConnected] = useState(false);

  const registerPatient = (payload: Omit<Patient, 'id'>) => {
    const patient: Patient = { id: randomId(), ...payload };
    setPatients((prev) => [...prev, patient]);
    setSelectedPatientId(patient.id);
  };

  const selectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const createSession = (mode: 'Normal' | 'Custom') => {
    const record: SessionRecord = {
      id: randomId(),
      patientId: selectedPatientId ?? '',
      mode,
      intensity: mode === 'Normal' ? 65 : 70,
      durationMin: mode === 'Normal' ? 20 : 24,
      createdAt: new Date().toISOString()
    };
    setSessions((prev) => [record, ...prev]);
    return record;
  };

  const addFeedback = (sessionId: string, rating: number, feedback: string) => {
    setSessions((prev) =>
      prev.map((item) => (item.id === sessionId ? { ...item, rating, feedback } : item))
    );
  };

  const value = useMemo(
    () => ({
      patients,
      sessions,
      selectedPatientId,
      bleConnected,
      registerPatient,
      selectPatient,
      createSession,
      addFeedback,
      setBleConnected
    }),
    [patients, sessions, selectedPatientId, bleConnected]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
