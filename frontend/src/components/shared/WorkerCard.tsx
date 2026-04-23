import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInRight,
} from 'react-native-reanimated';
import Colors from '../../theme/colors';
import type { User, WorkerProfile } from '../../types';
import Avatar from '../ui/Avatar';
import StatusBadge from './StatusBadge';
import { SPRING_SNAPPY, SPRING_BOUNCY } from '../../utils/animations';

export interface WorkerCardProps {
  worker: User;
  workerProfile: WorkerProfile;
  onHire?: () => void;
  onViewProfile?: () => void;
  showHireButton?: boolean;
  style?: ViewStyle;
  index?: number;
}

const SKILL_LABEL: Record<string, string> = {
  coolie: 'Coolie',
  mason: 'Mason',
  electrician: 'Electrician',
  plumber: 'Plumber',
  carpenter: 'Carpenter',
  painter: 'Painter',
  welder: 'Welder',
  helper: 'Helper',
};

export default function WorkerCard({
  worker,
  workerProfile,
  onHire,
  onViewProfile,
  showHireButton = true,
  style,
  index = 0,
}: WorkerCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_SNAPPY);
  }, [scale]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BOUNCY);
  }, [scale]);

  const isAvailable = workerProfile.status !== 'working';

  return (
    <Animated.View
      style={[styles.card, style, animStyle]}
      entering={FadeInRight.delay(index * 80)
        .springify()
        .damping(18)
        .stiffness(180)}
    >
      <Pressable
        onPress={onViewProfile}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`View profile of ${worker.full_name}`}
      >
        {/* Top row: avatar + info */}
        <View style={styles.topRow}>
          <View style={styles.avatarWrap}>
            <Avatar
              name={worker.full_name}
              imageUrl={worker.avatar_url}
              size="md"
              role="worker"
            />
            {workerProfile.is_verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              </View>
            )}
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.name} numberOfLines={1}>
              {worker.full_name}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color={Colors.accent} />
              <Text style={styles.rating}>{workerProfile.rating.toFixed(1)}</Text>
              <Text style={styles.jobs}>· {workerProfile.total_jobs} jobs</Text>
            </View>
            <Text style={styles.experience}>
              {workerProfile.experience_years} yr{workerProfile.experience_years !== 1 ? 's' : ''}{' '}
              exp
            </Text>
          </View>

          <View style={styles.rightBlock}>
            <StatusBadge
              status={workerProfile.status === 'working' ? 'working' : 'waiting'}
              size="sm"
            />
            <Text style={styles.rate}>₹{workerProfile.daily_rate}/day</Text>
          </View>
        </View>

        {/* Skills chips */}
        {workerProfile.skills.length > 0 && (
          <View style={styles.skillsRow}>
            {workerProfile.skills.slice(0, 4).map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{SKILL_LABEL[skill] ?? skill}</Text>
              </View>
            ))}
            {workerProfile.skills.length > 4 && (
              <View style={styles.skillChip}>
                <Text style={styles.skillText}>+{workerProfile.skills.length - 4}</Text>
              </View>
            )}
          </View>
        )}

        {/* Hire button */}
        {showHireButton && onHire && (
          <Pressable
            style={({ pressed }) => [
              styles.hireBtn,
              !isAvailable && styles.hireBtnDisabled,
              pressed && isAvailable && styles.hireBtnPressed,
            ]}
            onPress={onHire}
            disabled={!isAvailable}
            accessibilityRole="button"
            accessibilityLabel={`Hire ${worker.full_name}`}
          >
            <Text style={styles.hireBtnText}>
              {isAvailable ? 'Hire Now' : 'Currently Working'}
            </Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  pressable: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  infoBlock: { flex: 1, marginRight: 8 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  rating: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginLeft: 3 },
  jobs: { fontSize: 12, color: Colors.textMuted, marginLeft: 4 },
  experience: { fontSize: 12, color: Colors.textSecondary },
  rightBlock: { alignItems: 'flex-end', gap: 6 },
  rate: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginTop: 4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skillChip: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  hireBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  hireBtnDisabled: { backgroundColor: Colors.border },
  hireBtnPressed: { opacity: 0.85 },
  hireBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
