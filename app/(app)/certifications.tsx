import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Badge = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  earned: boolean;
  earnedDate?: string;
};

type Certification = {
  id: string;
  name: string;
  issuedBy: string;
  expiryDate: string;
  status: 'Active' | 'Expired';
};

const BADGES: Badge[] = [
  { id: 'b1', name: 'Verified Worker', icon: 'shield-checkmark', color: '#3B82F6', earned: true, earnedDate: 'Jan 2024' },
  { id: 'b2', name: '100 Jobs', icon: 'trophy', color: '#F59E0B', earned: true, earnedDate: 'Sep 2025' },
  { id: 'b3', name: '5-Star Rating', icon: 'star', color: '#10B981', earned: true, earnedDate: 'Nov 2025' },
  { id: 'b4', name: 'Punctual', icon: 'time', color: '#8B5CF6', earned: false },
  { id: 'b5', name: 'Top Rated', icon: 'ribbon', color: '#EF4444', earned: false },
];

const CERTIFICATIONS: Certification[] = [
  { id: 'c1', name: 'Safety Training Certificate', issuedBy: 'National Safety Council', expiryDate: 'Dec 2026', status: 'Active' },
  { id: 'c2', name: 'Electrical License', issuedBy: 'State Licensing Board', expiryDate: 'Mar 2025', status: 'Expired' },
];

export default function CertificationsScreen() {
  const router = useRouter();
  const [badges] = useState<Badge[]>(BADGES);
  const [certifications] = useState<Certification[]>(CERTIFICATIONS);

  const handleUpload = () => {
    Alert.alert('Upload Certificate', 'Select a document to upload as your certificate.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose File', onPress: () => Alert.alert('Success', 'Certificate uploaded successfully.') },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Certifications & Badges</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Badges Section */}
        <Text style={s.sectionTitle}>Badges</Text>
        <View style={s.badgesGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={s.badgeItem}>
              <View
                style={[
                  s.badgeCircle,
                  {
                    backgroundColor: badge.earned ? badge.color + '1A' : '#E5E7EB',
                    borderColor: badge.earned ? badge.color : '#D1D5DB',
                  },
                ]}
              >
                <Ionicons
                  name={badge.icon}
                  size={28}
                  color={badge.earned ? badge.color : '#9CA3AF'}
                />
              </View>
              <Text
                style={[
                  s.badgeName,
                  !badge.earned && { color: T.textMuted },
                ]}
              >
                {badge.name}
              </Text>
              {badge.earned && badge.earnedDate ? (
                <Text style={s.badgeDate}>{badge.earnedDate}</Text>
              ) : (
                <Text style={s.badgeLocked}>Not Earned</Text>
              )}
            </View>
          ))}
        </View>

        {/* Certifications Section */}
        <Text style={[s.sectionTitle, { marginTop: 28 }]}>Certifications</Text>
        {certifications.map((cert) => {
          const isActive = cert.status === 'Active';
          return (
            <View key={cert.id} style={s.certCard}>
              <View style={s.certRow}>
                <View style={s.certIconCircle}>
                  <Ionicons name="document-text-outline" size={22} color={T.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.certName}>{cert.name}</Text>
                  <Text style={s.certIssuer}>Issued by: {cert.issuedBy}</Text>
                </View>
                <View
                  style={[
                    s.statusBadge,
                    { backgroundColor: isActive ? '#10B981' + '1A' : '#EF4444' + '1A' },
                  ]}
                >
                  <Text
                    style={[
                      s.statusText,
                      { color: isActive ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {cert.status}
                  </Text>
                </View>
              </View>
              <View style={s.certFooter}>
                <Ionicons name="calendar-outline" size={14} color={T.textSecondary} />
                <Text style={s.certExpiry}>Expires: {cert.expiryDate}</Text>
              </View>
            </View>
          );
        })}

        {/* Upload Button */}
        <TouchableOpacity
          style={s.uploadButton}
          activeOpacity={0.8}
          onPress={handleUpload}
        >
          <Ionicons name="cloud-upload-outline" size={22} color={T.white} />
          <Text style={s.uploadButtonText}>Upload Certificate</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  badgesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    justifyContent: 'flex-start' as const,
  },
  badgeItem: {
    width: '30%' as any,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.text,
    textAlign: 'center' as const,
  },
  badgeDate: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: T.textSecondary,
    marginTop: 2,
  },
  badgeLocked: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: T.textMuted,
    marginTop: 2,
  },
  certCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  certRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  certIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.amber + '1A',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  certName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 2,
  },
  certIssuer: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  certFooter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  certExpiry: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  uploadButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
