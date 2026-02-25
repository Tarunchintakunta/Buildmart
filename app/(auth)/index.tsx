import { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

export default function SplashScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });

    // Logo entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Content fade in
    const contentTimer = setTimeout(() => {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Progress bar
    const progressTimer = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => router.replace('/(auth)/role-select'), 400);
      });
    }, 800);

    return () => {
      progress.removeListener(listenerId);
      clearTimeout(contentTimer);
      clearTimeout(progressTimer);
    };
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.navy }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        {/* Logo */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            alignItems: 'center',
          }}
        >
          <View style={styles.logoBox}>
            <Ionicons name="cart" size={44} color={T.white} />
          </View>

          <Text style={styles.title}>BuildMart</Text>
          <Text style={styles.subtitle}>Blueprint for your construction needs</Text>
        </Animated.View>

        {/* Loading Bar */}
        <Animated.View style={{ opacity: contentOpacity, width: '100%', marginTop: 48 }}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Initializing modules...</Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: barWidth }]} />
          </View>

          <Text style={styles.tagline}>PROFESSIONAL GRADE MANAGEMENT</Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark-outline" size={13} color="#4B5563" />
        <Text style={styles.footerText}>SECURE ENTERPRISE INFRASTRUCTURE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 38,
    fontWeight: '800' as const,
    color: T.white,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: T.textMuted,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  progressHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: 13,
    color: T.amber,
    fontWeight: '700' as const,
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%' as const,
    backgroundColor: T.amber,
    borderRadius: 3,
  },
  tagline: {
    fontSize: 10,
    color: '#4B5563',
    letterSpacing: 2.5,
    textAlign: 'center' as const,
    marginTop: 18,
    textTransform: 'uppercase' as const,
  },
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingBottom: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 9,
    color: '#4B5563',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
};
