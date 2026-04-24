import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[BuildMart ErrorBoundary]', error.message, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Ionicons name="warning-outline" size={40} color="#F2960D" />
          </View>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            An unexpected error occurred. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <View style={styles.devBox}>
              <Text style={styles.devText} numberOfLines={4}>
                {this.state.error.message}
              </Text>
            </View>
          )}
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={this.handleReset}
          >
            <Ionicons name="refresh-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D2E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(242,150,13,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  devBox: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    alignSelf: 'stretch',
  },
  devText: {
    fontSize: 11,
    color: '#FCA5A5',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2960D',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    gap: 8,
    shadowColor: '#F2960D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPressed: { opacity: 0.82 },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
