import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BleConnection'>;

const DEVICES = [
  { name: 'PhysioStimX-A1', signal: -42, fw: 'v4.2.1' },
  { name: 'PhysioStimX-B3', signal: -68, fw: 'v4.1.0' },
  { name: 'PhysioStimX-C7', signal: -85, fw: 'v3.9.2' },
];

function signalBars(rssi: number) {
  if (rssi > -50) return 3;
  if (rssi > -70) return 2;
  return 1;
}

export function BleConnectionScreen({ navigation }: Props) {
  const { bleConnected, setBleConnected } = useAppContext();
  const [scanning, setScanning] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [scanning, pulseAnim]);

  const scan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  const connect = (idx: number) => {
    setSelectedIdx(idx);
    setBleConnected(true);
  };

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Device Connection</Text>
        <Pressable hitSlop={12}>
          <MaterialCommunityIcons name="help-circle-outline" size={24} color={colors.muted} />
        </Pressable>
      </View>

      {/* Scanning visual */}
      <View style={styles.scanArea}>
        <View style={styles.ringOuter}>
          {scanning && (
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
              ]}
            />
          )}
          <View style={styles.ringMid}>
            <View style={styles.bleCircle}>
              <MaterialCommunityIcons name="bluetooth" size={40} color={colors.accent} />
            </View>
          </View>
        </View>
        <Text style={styles.scanStatus}>
          {scanning ? 'Scanning for devices...' : bleConnected ? 'Device Connected' : 'Ready to Scan'}
        </Text>
        <Text style={styles.scanHint}>
          {scanning
            ? 'Searching for nearby PhysioStimX units'
            : 'Ensure your device is powered on and in range'}
        </Text>
      </View>

      {/* Device list */}
      <View style={styles.listWrap}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Available Devices</Text>
          <Pressable onPress={scan} disabled={scanning} hitSlop={8}>
            <MaterialCommunityIcons
              name="refresh"
              size={20}
              color={scanning ? colors.border : colors.accent}
            />
          </Pressable>
        </View>

        {DEVICES.map((dev, i) => {
          const bars = signalBars(dev.signal);
          const isConnected = bleConnected && selectedIdx === i;
          return (
            <Pressable
              key={dev.name}
              style={[styles.deviceCard, isConnected && styles.deviceCardActive]}
              onPress={() => connect(i)}
            >
              <View style={styles.deviceIcon}>
                <MaterialCommunityIcons name="access-point" size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>{dev.name}</Text>
                <Text style={styles.deviceMeta}>
                  Signal: {dev.signal} dBm · FW {dev.fw}
                </Text>
              </View>
              <View style={styles.signalBars}>
                {[1, 2, 3].map((n) => (
                  <View
                    key={n}
                    style={[
                      styles.bar,
                      { height: 6 + n * 4 },
                      n <= bars ? styles.barFilled : styles.barEmpty,
                    ]}
                  />
                ))}
              </View>
              {isConnected ? (
                <View style={styles.connectedBadge}>
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              ) : (
                <ActionButton
                  title="Connect"
                  variant="outline"
                  onPress={() => connect(i)}
                  style={{ paddingHorizontal: 14, paddingVertical: 6 }}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Footer action */}
      <View style={styles.footer}>
        <ActionButton title={scanning ? 'Scanning...' : 'Scan for Devices'} onPress={scan} disabled={scanning} />
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
    marginBottom: 16,
  },
  headerTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 18,
  },
  scanArea: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  ringOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  ringMid: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bleCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanStatus: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
  },
  scanHint: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  listWrap: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listTitle: {
    color: colors.text,
    fontFamily: fontFamily.semibold,
    fontSize: 15,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
  },
  deviceCardActive: {
    borderColor: colors.accent,
  },
  deviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,208,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  deviceMeta: {
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    marginTop: 2,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: 6,
  },
  bar: {
    width: 4,
    borderRadius: 1,
  },
  barFilled: {
    backgroundColor: colors.accent,
  },
  barEmpty: {
    backgroundColor: colors.border,
  },
  connectedBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  connectedText: {
    color: colors.success,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
});
