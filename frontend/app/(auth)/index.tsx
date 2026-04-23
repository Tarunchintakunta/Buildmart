import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/auth.store';
import { Colors } from '../../src/theme/colors';

const { width } = Dimensions.get('window');
const SPLASH_DURATION = 2500;

export default function SplashScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    // Kick off initialization immediately
    initialize();

    // Fade in + scale up logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar from 0 to 100% over SPLASH_DURATION
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SPLASH_DURATION,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Wait until progress animation ends then navigate
    const timer = setTimeout(() => {
      if (user && token) {
        router.replace('/(app)/');
      } else {
        router.replace('/(auth)/login');
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Center content */}
      <Animated.View
        style={[
          styles.centerContent,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Ionicons name="hammer" size={48} color={Colors.accent} />
        </View>

        {/* Title */}
        <Text style={styles.title}>BuildMart</Text>
        <Text style={styles.subtitle}>Construction Marketplace</Text>
      </Animated.View>

      {/* Progress bar */}
      <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.tagline}>Hyderabad's #1 Construction Platform</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    alignItems: 'center',
    gap: 16,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.navyLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
});
