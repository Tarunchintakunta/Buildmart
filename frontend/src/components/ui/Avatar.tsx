import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../theme/colors';
import type { UserRole } from '../../types';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: AvatarSize;
  role?: UserRole;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 9,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
};

const ringMap: Record<AvatarSize, number> = {
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3.5,
};

function getInitials(name?: string): string {
  if (!name || name.trim() === '') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase();
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  role,
  style,
}) => {
  const diameter = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const ringWidth = ringMap[size];
  const ringColor = role ? Colors.roles[role] : undefined;

  return (
    <View
      style={[
        styles.outer,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          borderWidth: ringColor ? ringWidth : 0,
          borderColor: ringColor ?? 'transparent',
        },
        style,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { borderRadius: diameter / 2 }]}
          accessibilityLabel={name ? `${name} avatar` : 'User avatar'}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            { borderRadius: diameter / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  initials: {
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Avatar;
