import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../theme/colors';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
  /** Fade content in on mount (default true) */
  fadeIn?: boolean;
  statusBarStyle?: 'dark-content' | 'light-content';
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  scrollable = false,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  fadeIn = true,
  statusBarStyle = 'dark-content',
}) => {
  const opacity = useSharedValue(fadeIn ? 0 : 1);

  useEffect(() => {
    if (fadeIn) {
      opacity.value = withTiming(1, {
        duration: 320,
        easing: Easing.out(Easing.quad),
      });
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const inner = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.view, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Colors.background}
      />
      <Animated.View style={[styles.animWrap, animStyle]}>{inner}</Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  animWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  view: {
    flex: 1,
  },
});

export default ScreenWrapper;
