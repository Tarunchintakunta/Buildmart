import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import type { User, WorkerProfile } from '../../types';
import Avatar from '../ui/Avatar';
import StatusBadge from './StatusBadge';

export interface WorkerCardProps {
  worker: User;
  workerProfile: WorkerProfile;
  onHire?: () => void;
  onViewProfile?: () => void;
  showHireButton?: boolean;
  style?: ViewStyle;
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
}: WorkerCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onViewProfile}
      activeOpacity={0.95}
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
          {workerProfile.is_verified ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            </View>
          ) : null}
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
            {workerProfile.experience_years} yr{workerProfile.experience_years !== 1 ? 's' : ''} exp
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
      {workerProfile.skills.length > 0 ? (
        <View style={styles.skillsRow}>
          {workerProfile.skills.slice(0, 4).map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{SKILL_LABEL[skill] ?? skill}</Text>
            </View>
          ))}
          {workerProfile.skills.length > 4 ? (
            <View style={styles.skillChip}>
              <Text style={styles.skillText}>+{workerProfile.skills.length - 4}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Hire button */}
      {showHireButton && onHire ? (
        <TouchableOpacity
          style={[
            styles.hireBtn,
            workerProfile.status === 'working' && styles.hireBtnDisabled,
          ]}
          onPress={onHire}
          disabled={workerProfile.status === 'working'}
          accessibilityRole="button"
          accessibilityLabel={`Hire ${worker.full_name}`}
        >
          <Text style={styles.hireBtnText}>
            {workerProfile.status === 'working' ? 'Currently Working' : 'Hire Now'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
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
  infoBlock: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 3,
  },
  jobs: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  experience: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rightBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  rate: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  hireBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  hireBtnDisabled: {
    backgroundColor: Colors.border,
  },
  hireBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
