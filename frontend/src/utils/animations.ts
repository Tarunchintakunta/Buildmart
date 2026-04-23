/**
 * BuildMart Animation Utilities
 * Built on react-native-reanimated 4.x
 *
 * Usage:
 *   import { spring, timing, stagger } from '../utils/animations';
 */

import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';

// ─── Preset spring configs ──────────────────────────────────────────────────
export const SPRING_SNAPPY: WithSpringConfig = {
  damping: 18,
  stiffness: 280,
  mass: 0.8,
};

export const SPRING_BOUNCY: WithSpringConfig = {
  damping: 12,
  stiffness: 200,
  mass: 0.9,
};

export const SPRING_GENTLE: WithSpringConfig = {
  damping: 26,
  stiffness: 160,
  mass: 1,
};

// ─── Preset timing configs ──────────────────────────────────────────────────
export const TIMING_FAST: WithTimingConfig = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

export const TIMING_MED: WithTimingConfig = {
  duration: 250,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_SLOW: WithTimingConfig = {
  duration: 400,
  easing: Easing.out(Easing.cubic),
};

// ─── Button / card press ────────────────────────────────────────────────────
/** Scale down then back to 1 on press — snappy feel */
export function pressIn(scale: ReturnType<typeof withSpring>) {
  'worklet';
  return withSpring(0.95, SPRING_SNAPPY);
}

export function pressOut() {
  'worklet';
  return withSpring(1, SPRING_BOUNCY);
}

// ─── Fade helpers ───────────────────────────────────────────────────────────
export function fadeIn(delay = 0) {
  'worklet';
  return delay > 0
    ? withDelay(delay, withTiming(1, TIMING_MED))
    : withTiming(1, TIMING_MED);
}

export function fadeOut(delay = 0) {
  'worklet';
  return delay > 0
    ? withDelay(delay, withTiming(0, TIMING_FAST))
    : withTiming(0, TIMING_FAST);
}

// ─── Slide-up helpers ───────────────────────────────────────────────────────
export function slideUp(from = 24, delay = 0) {
  'worklet';
  return delay > 0
    ? withDelay(delay, withSpring(0, SPRING_GENTLE))
    : withSpring(0, SPRING_GENTLE);
}

// ─── Pulse (for skeletons) ──────────────────────────────────────────────────
export function pulse() {
  'worklet';
  return withRepeat(
    withSequence(
      withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.sine) }),
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sine) }),
    ),
    -1,
    false,
  );
}

// ─── Stagger delay calculator ────────────────────────────────────────────────
/** Returns delay in ms for index-based stagger */
export function staggerDelay(index: number, step = 60, base = 0): number {
  return base + index * step;
}

// ─── Number counter (for wallet balance) ─────────────────────────────────────
export function counterTiming(duration = 800): WithTimingConfig {
  return { duration, easing: Easing.out(Easing.exp) };
}
