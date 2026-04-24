import { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

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
  { id: 'b1', name: 'Verified Worker',  icon: 'shield-checkmark', color: '#3B82F6', earned: true,  earnedDate: 'Jan 2024' },
  { id: 'b2', name: '100 Jobs',         icon: 'trophy',           color: '#F59E0B', earned: true,  earnedDate: 'Sep 2025' },
  { id: 'b3', name: '5-Star Rating',    icon: 'star',             color: '#10B981', earned: true,  earnedDate: 'Nov 2025' },
  { id: 'b4', name: 'Punctual',         icon: 'time',             color: '#8B5CF6', earned: false },
  { id: 'b5', name: 'Top Rated',        icon: 'ribbon',           color: '#EF4444', earned: false },
];

const CERTIFICATIONS: Certification[] = [
  { id: 'c1', name: 'Safety Training Certificate', issuedBy: 'National Safety Council', expiryDate: 'Dec 2026', status: 'Active' },
  { id: 'c2', name: 'ITI Certificate',             issuedBy: 'NCVT, Hyderabad',         expiryDate: 'Mar 2025', status: 'Expired' },
  { id: 'c3', name: 'NSDC Skill Card',             issuedBy: 'Skill India, NSDC',        expiryDate: 'Jun 2027', status: 'Active' },
];

export default function CertificationsScreen() {
  const router = useRouter();
  const [badges] = useState<Badge[]>(BADGES);
  const [certifications] = useState<Certification[]>(CERTIFICATIONS);

  const handleUpload = () => {
    Alert.alert('Upload Certificate', 'Choose how you\'d like to upload your certificate.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Camera', onPress: () => Alert.alert('✅ Uploaded', 'Certificate uploaded successfully!') },
      { text: 'Gallery', onPress: () => Alert.alert('✅ Uploaded', 'Certificate uploaded successfully!') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(300)}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Certifications & Badges</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Badges */}
        <Animated.Text style={styles.sectionLabel} entering={FadeInDown.delay(80)}>
          BADGES EARNED
        </Animated.Text>
        <View style={styles.badgesGrid}>
          {badges.map((badge, i) => (
            <Animated.View
              key={badge.id}
              style={styles.badgeItem}
              entering={ZoomIn.delay(i * 70).springify().damping(14)}
            >
              <View style={[
                styles.badgeCircle,
                {
                  backgroundColor: badge.earned ? badge.color + '18' : '#F3F4F6',
                  borderColor: badge.earned ? badge.color : '#D1D5DB',
                },
              ]}>
                <Ionicons
                  name={badge.icon}
                  size={30}
                  color={badge.earned ? badge.color : '#9CA3AF'}
                />
              </View>
              <Text style={[styles.badgeName, !badge.earned && { color: T.textMuted }]}>
                {badge.name}
              </Text>
              {badge.earned && badge.earnedDate
                ? <Text style={styles.badgeDate}>{badge.earnedDate}</Text>
                : <Text style={styles.badgeLocked}>Not Earned</Text>}
            </Animated.View>
          ))}
        </View>

        {/* Certifications */}
        <Animated.Text style={[styles.sectionLabel, { marginTop: 28 }]} entering={FadeInDown.delay(300)}>
          CERTIFICATIONS
        </Animated.Text>
        {certifications.map((cert, i) => {
          const isActive = cert.status === 'Active';
          return (
            <Animated.View
              key={cert.id}
              style={styles.certCard}
              entering={FadeInLeft.delay(320 + i * 80).springify().damping(18).stiffness(180)}
            >
              <View style={styles.certRow}>
                <View style={styles.certIconCircle}>
                  <Ionicons name="document-text-outline" size={22} color={T.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>{cert.issuedBy}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2' },
                ]}>
                  <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#EF4444' }]}>
                    {cert.status}
                  </Text>
                </View>
              </View>
              <View style={styles.certFooter}>
                <Ionicons name="calendar-outline" size={14} color={T.textSecondary} />
                <Text style={styles.certExpiry}>Expires: {cert.expiryDate}</Text>
              </View>
            </Animated.View>
          );
        })}

        {/* Upload Button */}
        <Animated.View entering={FadeInDown.delay(560).springify()}>
          <Pressable
            style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.85 }]}
            onPress={handleUpload}
          >
            <Ionicons name="cloud-upload-outline" size={22} color={T.white} />
            <Text style={styles.uploadBtnText}>Upload New Certificate</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  scroll: { padding: 16, paddingBottom: 48 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: T.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, marginLeft: 2,
  },
  badgesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start',
  },
  badgeItem: { width: '30%', alignItems: 'center', marginBottom: 4 },
  badgeCircle: {
    width: 68, height: 68, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, marginBottom: 8,
  },
  badgeName: { fontSize: 12, fontWeight: '700', color: T.text, textAlign: 'center' },
  badgeDate: { fontSize: 11, color: T.textSecondary, marginTop: 2 },
  badgeLocked: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  certCard: {
    backgroundColor: T.surface, borderRadius: 14,
    borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12,
  },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  certIconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center',
  },
  certName: { fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 2 },
  certIssuer: { fontSize: 12, color: T.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  certFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border,
  },
  certExpiry: { fontSize: 13, color: T.textSecondary },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.amber, borderRadius: 14, paddingVertical: 16,
    marginTop: 16, gap: 8,
    shadowColor: T.amber, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  uploadBtnText: { fontSize: 16, fontWeight: '700', color: T.white },
});
