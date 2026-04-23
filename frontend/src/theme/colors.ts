export const Colors = {
  // Brand
  primary: '#1A1D2E',      // Navy
  accent: '#F2960D',       // Amber
  background: '#F5F6FA',   // Light gray
  surface: '#FFFFFF',      // White

  // Text
  textPrimary: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Borders
  border: '#E5E7EB',
  borderSelected: '#1A1D2E',

  // Misc
  white: '#FFFFFF',
  navyLight: '#252838',
  amberBg: '#FEF3C7',

  // Role colors
  roles: {
    customer: '#3B82F6',
    worker: '#F59E0B',
    shopkeeper: '#10B981',
    contractor: '#8B5CF6',
    driver: '#EF4444',
    admin: '#6366F1',
  },
};

export const LightTheme = {
  bg: Colors.background,
  surface: Colors.surface,
  navy: Colors.primary,
  navyLight: Colors.navyLight,
  amber: Colors.accent,
  amberBg: Colors.amberBg,
  text: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  textMuted: Colors.textMuted,
  border: Colors.border,
  borderSelected: Colors.borderSelected,
  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
  info: Colors.info,
  white: Colors.white,
};

export default Colors;
