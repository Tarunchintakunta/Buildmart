/**
 * BuildMart Design System
 * Based on the provided design specifications
 */

export const Colors = {
  // Backgrounds
  background: {
    primary: '#111827', // bg-gray-900
    secondary: '#1F2937', // bg-gray-800
    tertiary: '#374151', // bg-gray-700
    card: '#1F2937', // bg-gray-800
    cardLight: '#F9FAFB', // For light cards on dark backgrounds
  },
  
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF', // text-gray-400
    tertiary: '#6B7280', // text-gray-500
    placeholder: '#6B7280',
  },
  
  // Accent Colors
  accent: {
    orange: '#F97316', // Primary accent
    orangeLight: 'rgba(249, 115, 22, 0.2)',
    blue: '#3B82F6',
    green: '#10B981',
    red: '#EF4444',
    purple: '#8B5CF6',
    amber: '#F59E0B',
  },
  
  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Borders
  border: {
    primary: '#374151', // border-gray-700
    secondary: '#4B5563', // border-gray-600
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Light Theme (matching Stitch onboarding designs)
export const LightTheme = {
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  navy: '#1A1D2E',
  navyLight: '#252838',
  amber: '#F2960D',
  amberBg: '#FEF3C7',
  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderSelected: '#1A1D2E',
  success: '#10B981',
  info: '#3B82F6',
  white: '#FFFFFF',
};

// Component Styles
export const ComponentStyles = {
  // Buttons
  button: {
    primary: {
      backgroundColor: Colors.accent.orange,
      borderRadius: BorderRadius.lg,
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    secondary: {
      backgroundColor: Colors.background.tertiary,
      borderRadius: BorderRadius.lg,
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    disabled: {
      backgroundColor: Colors.background.tertiary,
      opacity: 0.5,
    },
  },
  
  // Cards
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.card,
  },
  
  // Inputs
  input: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text.primary,
  },
  
  // Search Bar
  searchBar: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
};
