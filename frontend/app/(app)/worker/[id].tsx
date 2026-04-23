import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import { LightTheme } from '../../../src/theme/colors';

const T = LightTheme;

const ROLE_COLORS: Record<string, string> = {
  Mason: '#8B5CF6',
  Electrician: '#F59E0B',
  Plumber: '#3B82F6',
  Carpenter: '#10B981',
  Painter: '#EC4899',
  Welder: '#EF4444',
  Helper: '#6B7280',
};

const MOCK_WORKERS: Record<string, {
  id: string; name: string; primaryRole: string; skills: string[];
  dailyRate: number; rating: number; totalJobs: number; experience: number;
  status: 'available' | 'working'; isVerified: boolean; location: string;
  bio: string; phone: string; completedProjects: number;
}> = {
  w1: {
    id: 'w1', name: 'Ramu Yadav', primaryRole: 'Mason',
    skills: ['Mason', 'Plastering', 'Tiling', 'Brickwork', 'Flooring'],
    dailyRate: 800, rating: 4.8, totalJobs: 142, experience: 7,
    status: 'available', isVerified: true,
    location: 'Kukatpally, Hyderabad',
    bio: 'Experienced mason with 7 years in residential and commercial projects. Specializes in RCC work, brick masonry, and finishing. Worked with top contractors across Hyderabad. Punctual, professional, and detail-oriented.',
    phone: '+91 98765 43210', completedProjects: 12,
  },
  w2: {
    id: 'w2', name: 'Venkat Rao', primaryRole: 'Electrician',
    skills: ['Electrician', 'Wiring', 'Panel Work', 'AC Installation', 'CCTV'],
    dailyRate: 1200, rating: 4.9, totalJobs: 218, experience: 10,
    status: 'working', isVerified: true,
    location: 'Ameerpet, Hyderabad',
    bio: 'Licensed electrician with a decade of experience. Expert in commercial electrical installations, panel wiring, and smart home systems. Compliant with all safety standards. 200+ satisfied clients.',
    phone: '+91 98765 43211', completedProjects: 28,
  },
  w3: {
    id: 'w3', name: 'Suresh Kumar', primaryRole: 'Plumber',
    skills: ['Plumber', 'Pipe Fitting', 'Waterproofing', 'Sanitation', 'Drainage'],
    dailyRate: 900, rating: 4.6, totalJobs: 95, experience: 5,
    status: 'available', isVerified: true,
    location: 'Secunderabad, Hyderabad',
    bio: 'Skilled plumber specializing in residential and commercial plumbing. Expert in waterproofing basements and terraces, pipe fitting, and drainage systems. Known for clean, long-lasting work.',
    phone: '+91 98765 43212', completedProjects: 8,
  },
  w4: {
    id: 'w4', name: 'Mohammed Khader', primaryRole: 'Carpenter',
    skills: ['Carpenter', 'Furniture', 'Woodwork', 'Modular Kitchens', 'False Ceiling'],
    dailyRate: 1100, rating: 4.7, totalJobs: 176, experience: 9,
    status: 'available', isVerified: true,
    location: 'Tolichowki, Hyderabad',
    bio: 'Master carpenter with expertise in custom furniture, modular kitchens, and false ceilings. Works with all types of wood and laminates. Meticulous attention to detail and measurements.',
    phone: '+91 98765 43213', completedProjects: 19,
  },
  w5: {
    id: 'w5', name: 'Balaiah Naidu', primaryRole: 'Painter',
    skills: ['Painter', 'Texture Work', 'Waterproofing', 'Polish', 'Wall Putty'],
    dailyRate: 750, rating: 4.4, totalJobs: 63, experience: 4,
    status: 'working', isVerified: false,
    location: 'LB Nagar, Hyderabad',
    bio: 'Painter with experience in interior and exterior painting. Specializes in texture finishes, weather-resistant coatings, and wall putty application. Brings creativity to every project.',
    phone: '+91 98765 43214', completedProjects: 5,
  },
  w6: {
    id: 'w6', name: 'Srinivas Reddy', primaryRole: 'Welder',
    skills: ['Welder', 'Fabrication', 'Steel Work', 'Gate Fabrication', 'Railing'],
    dailyRate: 1300, rating: 4.9, totalJobs: 201, experience: 12,
    status: 'available', isVerified: true,
    location: 'Uppal, Hyderabad',
    bio: 'Expert welder and fabricator with 12 years of experience. Proficient in MIG, TIG, and arc welding. Specializes in structural steel, gate fabrication, and decorative railings for premium projects.',
    phone: '+91 98765 43215', completedProjects: 24,
  },
  w7: {
    id: 'w7', name: 'Ganesh Babu', primaryRole: 'Mason',
    skills: ['Mason', 'RCC Work', 'Brickwork', 'Block Work', 'Grouting'],
    dailyRate: 850, rating: 4.5, totalJobs: 88, experience: 6,
    status: 'available', isVerified: true,
    location: 'Dilsukhnagar, Hyderabad',
    bio: 'Dependable mason with 6 years specializing in structural masonry and RCC work. Has worked on multiple housing projects in Hyderabad. Known for quality output and adherence to deadlines.',
    phone: '+91 98765 43216', completedProjects: 10,
  },
  w8: {
    id: 'w8', name: 'Ramesh Goud', primaryRole: 'Plumber',
    skills: ['Plumber', 'Sanitary', 'Drainage', 'Boring', 'Tank Fitting'],
    dailyRate: 950, rating: 4.2, totalJobs: 54, experience: 3,
    status: 'available', isVerified: false,
    location: 'Miyapur, Hyderabad',
    bio: 'Up-and-coming plumber with 3 years of hands-on experience. Handles all types of sanitation and drainage work. Eager, hardworking, and always on time.',
    phone: '+91 98765 43217', completedProjects: 4,
  },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= full ? 'star' : half && i === full + 1 ? 'star-half' : 'star-outline'}
          size={16}
          color="#F59E0B"
        />
      ))}
      <Text style={styles.ratingLabel}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const worker = MOCK_WORKERS[id as string] || MOCK_WORKERS['w1'];
  const roleColor = ROLE_COLORS[worker.primaryRole] || T.navy;
  const isAvailable = worker.status === 'available';
  const canHire = (user?.role === 'contractor' || user?.role === 'customer');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>Worker Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Hero */}
        <Animated.View entering={FadeInDown.springify()} style={styles.hero}>
          <View style={[styles.bigAvatar, { backgroundColor: roleColor + '20' }]}>
            <Text style={[styles.bigAvatarText, { color: roleColor }]}>{getInitials(worker.name)}</Text>
            {worker.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.workerName}>{worker.name}</Text>
          {worker.isVerified ? (
            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark" size={14} color={T.success} />
              <Text style={styles.verifiedText}>Verified Worker</Text>
            </View>
          ) : (
            <View style={styles.unverifiedRow}>
              <Ionicons name="warning-outline" size={14} color={T.warning} />
              <Text style={styles.unverifiedText}>Not Yet Verified</Text>
            </View>
          )}

          {/* Status pill */}
          <View style={[styles.statusPill, isAvailable ? styles.pillGreen : styles.pillAmber]}>
            <View style={[styles.statusDot, { backgroundColor: isAvailable ? T.success : T.warning }]} />
            <Text style={[styles.statusPillText, { color: isAvailable ? T.success : T.warning }]}>
              {isAvailable ? 'Available for Work' : 'Currently Working'}
            </Text>
          </View>
        </Animated.View>

        {/* Stats row */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.statsGrid}>
          <View style={styles.statCell}>
            <StarRow rating={worker.rating} />
            <Text style={styles.statCellLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statCellValue}>{worker.totalJobs}</Text>
            <Text style={styles.statCellLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statCellValue}>{worker.experience}y</Text>
            <Text style={styles.statCellLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statCellValue}>{worker.completedProjects}</Text>
            <Text style={styles.statCellLabel}>Projects</Text>
          </View>
        </Animated.View>

        {/* Daily Rate Box */}
        <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.rateBox}>
          <View>
            <Text style={styles.rateBoxLabel}>Daily Rate</Text>
            <Text style={styles.rateBoxValue}>₹{worker.dailyRate}<Text style={styles.rateBoxUnit}>/day</Text></Text>
          </View>
          <View style={styles.rateBoxRight}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.rateLocation}>{worker.location}</Text>
          </View>
        </Animated.View>

        {/* Skills */}
        <Animated.View entering={FadeInLeft.delay(160).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsGrid}>
            {worker.skills.map(skill => (
              <View key={skill} style={[styles.skillBadge, { backgroundColor: (ROLE_COLORS[skill] || T.navy) + '15' }]}>
                <Text style={[styles.skillBadgeText, { color: ROLE_COLORS[skill] || T.navy }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInLeft.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.bioText}>{worker.bio}</Text>
          </View>
        </Animated.View>

        {/* Previous Work Photos */}
        <Animated.View entering={FadeInRight.delay(240).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Work</Text>
          <View style={styles.photosRow}>
            {[0, 1, 2].map(i => (
              <View key={i} style={styles.photoPlaceholder}>
                <Ionicons name="image-outline" size={28} color={T.textMuted} />
                <Text style={styles.photoText}>Photo {i + 1}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Contact */}
        <Animated.View entering={FadeInLeft.delay(280).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.card}>
            <View style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <Ionicons name="call-outline" size={18} color={T.navy} />
              </View>
              <Text style={styles.contactText}>{worker.phone}</Text>
            </View>
            <View style={[styles.contactRow, { marginTop: 12 }]}>
              <View style={styles.contactIcon}>
                <Ionicons name="location-outline" size={18} color={T.navy} />
              </View>
              <Text style={styles.contactText}>{worker.location}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom */}
      {canHire && (
        <View style={styles.bottomBar}>
          {isAvailable ? (
            <Pressable
              style={({ pressed }) => [styles.hireBtn, pressed && styles.hireBtnPressed]}
              onPress={() => router.push(`/(app)/hire?workerId=${worker.id}`)}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.hireBtnText}>Hire This Worker</Text>
            </Pressable>
          ) : (
            <View style={styles.busyBtn}>
              <Ionicons name="time-outline" size={20} color={T.textMuted} />
              <Text style={styles.busyBtnText}>Currently Working — Unavailable</Text>
            </View>
          )}
        </View>
      )}
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
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.navy },

  scrollContent: { paddingBottom: 24 },

  hero: { alignItems: 'center', paddingVertical: 28, backgroundColor: T.surface, marginBottom: 16 },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bigAvatarText: { fontSize: 30, fontWeight: '800' },
  verifiedBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: T.success,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: T.surface,
  },
  workerName: { fontSize: 24, fontWeight: '800', color: T.navy, marginBottom: 6 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  verifiedText: { fontSize: 13, color: T.success, fontWeight: '600' },
  unverifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  unverifiedText: { fontSize: 13, color: T.warning, fontWeight: '600' },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  pillGreen: { backgroundColor: '#ECFDF5' },
  pillAmber: { backgroundColor: '#FFFBEB' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusPillText: { fontSize: 13, fontWeight: '700' },

  statsGrid: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: T.border },
  statCellValue: { fontSize: 22, fontWeight: '800', color: T.navy },
  statCellLabel: { fontSize: 11, color: T.textMuted, marginTop: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingLabel: { fontSize: 13, color: T.textSecondary, marginLeft: 4, fontWeight: '700' },

  rateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.navy,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  rateBoxLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  rateBoxValue: { fontSize: 32, fontWeight: '900', color: T.amber },
  rateBoxUnit: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.7)' },
  rateBoxRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rateLocation: { fontSize: 13, color: 'rgba(255,255,255,0.7)', maxWidth: 120 },

  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: T.navy, marginBottom: 12 },

  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  skillBadgeText: { fontSize: 13, fontWeight: '600' },

  card: {
    backgroundColor: T.surface, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: T.border,
  },
  bioText: { fontSize: 14, lineHeight: 22, color: T.textSecondary },

  photosRow: { flexDirection: 'row', gap: 10 },
  photoPlaceholder: {
    flex: 1, height: 90, backgroundColor: T.surface,
    borderRadius: 12, borderWidth: 1, borderColor: T.border,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  photoText: { fontSize: 11, color: T.textMuted },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.border,
  },
  contactText: { fontSize: 14, color: T.textSecondary },

  bottomBar: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border,
  },
  hireBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.navy, paddingVertical: 16, borderRadius: 14, gap: 10,
  },
  hireBtnPressed: { opacity: 0.85 },
  hireBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  busyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.bg, paddingVertical: 16, borderRadius: 14, gap: 10,
    borderWidth: 1, borderColor: T.border,
  },
  busyBtnText: { fontSize: 15, fontWeight: '600', color: T.textMuted },
});
