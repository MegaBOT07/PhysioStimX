import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2400,
      useNativeDriver: false
    }).start(() => {
      navigation.replace('Onboarding');
    });
  }, [navigation, progress]);

  const widthInterp = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const percentText = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0', '100']
  });

  return (
    <View style={styles.root}>
      {/* Background blurs */}
      <View style={styles.blurTopRight} />
      <View style={styles.blurBottomLeft} />

      {/* Illustration */}
      <View style={styles.center}>
        <View style={styles.ringOuter}>
          <View style={styles.ringMid}>
            <View style={styles.ringInner}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="lightning-bolt" size={64} color={colors.accent} />
              </View>
              {/* Muscle fiber bars */}
              <View style={styles.fiberRow}>
                <View style={[styles.fiber, { height: 16, opacity: 0.2 }]} />
                <View style={[styles.fiber, { height: 24, opacity: 0.4 }]} />
                <View style={[styles.fiber, { height: 32, opacity: 1 }]} />
                <View style={[styles.fiber, { height: 24, opacity: 0.4 }]} />
                <View style={[styles.fiber, { height: 16, opacity: 0.2 }]} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.bottom}>
        <Text style={styles.title}>
          PhysioStim<Text style={styles.titleAccent}>x</Text>
        </Text>
        <Text style={styles.subtitle}>ADVANCED NEURO-MUSCULAR TECH</Text>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Initializing System...</Text>
            <AnimatedPercent value={percentText} />
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: widthInterp }]} />
          </View>
          <View style={styles.readyRow}>
            <MaterialCommunityIcons name="shield-check" size={14} color={colors.accent} />
            <Text style={styles.readyText}>CLINICAL GRADE STIMULATION READY</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>PROFESSIONAL MEDICAL INTERFACE V4.2.0</Text>
      </View>
    </View>
  );
}

function AnimatedPercent({ value }: { value: Animated.AnimatedInterpolation<string> }) {
  const [text, setText] = useState('0');
  useEffect(() => {
    const id = value.addListener(({ value: v }) => {
      setText(String(Math.round(Number(v))));
    });
    return () => value.removeListener(id);
  }, [value]);

  return (
    <Text style={styles.percentText}>
      {text}%
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between'
  },
  blurTopRight: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(0,208,255,0.05)'
  },
  blurBottomLeft: {
    position: 'absolute',
    bottom: -96,
    left: -96,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(0,208,255,0.05)'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32
  },
  ringOuter: {
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ringMid: {
    width: 224,
    height: 224,
    borderRadius: 112,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ringInner: {
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 2,
    borderColor: 'rgba(0,208,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(0,208,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,208,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fiberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 32,
    marginTop: 12
  },
  fiber: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.accent
  },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: 24
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontFamily: fontFamily.bold,
    textAlign: 'center',
    letterSpacing: -0.5
  },
  titleAccent: {
    color: colors.accent
  },
  subtitle: {
    color: 'rgba(0,208,255,0.6)',
    fontSize: 12,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 8,
    marginBottom: 32
  },
  progressSection: {
    gap: 10
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  progressLabel: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 14
  },
  percentText: {
    color: colors.accent,
    fontFamily: fontFamily.bold,
    fontSize: 18
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,208,255,0.1)',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.accent
  },
  readyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  readyText: {
    color: 'rgba(0,208,255,0.4)',
    fontFamily: fontFamily.regular,
    fontSize: 10,
    letterSpacing: 1.5
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,208,255,0.05)'
  },
  footerText: {
    color: 'rgba(0,208,255,0.3)',
    fontSize: 10,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
    letterSpacing: 3
  }
});
