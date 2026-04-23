import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  scrollable = false,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
}) => {
  return (
    <SafeAreaView style={[styles.safe, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {scrollable ? (
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
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.view, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
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
