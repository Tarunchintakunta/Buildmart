import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

// Mock worker data
const MOCK_WORKER = {
  id: 'w1',
  name: 'Ramu Yadav',
  phone: '9876543301',
  email: 'ramu@email.com',
  skills: ['Coolie', 'Helper'],
  experience: 5,
  dailyRate: 600,
  hourlyRate: 100,
  rating: 4.5,
  totalJobs: 120,
  totalEarnings: 72000,
  status: 'waiting',
  isVerified: true,
  bio: 'Experienced in loading and unloading heavy materials. Reliable and punctual worker with 5 years of experience in construction sites.',
  address: 'Madiwala Village, Bangalore',
  joinedAt: 'January 2024',
  completedAgreements: 8,
  reviews: [
    { customer: 'Rajesh Constructions', rating: 5, comment: 'Excellent work, very reliable', date: '2024-02-10' },
    { customer: 'Priya Patel', rating: 4, comment: 'Good helper, on time', date: '2024-02-05' },
    { customer: 'BuildRight Pvt Ltd', rating: 5, comment: 'Hardworking and professional', date: '2024-01-28' },
  ],
};

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const worker = MOCK_WORKER;

  const isContractor = user?.role === 'contractor';
  const isCustomer = user?.role === 'customer';
  const canHire = (isContractor || isCustomer) && worker.status === 'waiting' && worker.isVerified;

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Worker Profile</Text>
      </View>

      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={s.profileSection}>
          <View style={s.avatarWrapper}>
            <Ionicons name="person" size={48} color={T.textMuted} />
            {worker.isVerified && (
              <View style={s.verifiedBadge}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </View>
          <Text style={s.workerName}>{worker.name}</Text>
          <View
            style={[
              s.statusBadge,
              {
                backgroundColor:
                  worker.status === 'waiting'
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(242,150,13,0.15)',
              },
            ]}
          >
            <Text
              style={{
                color: worker.status === 'waiting' ? '#10B981' : T.amber,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              {worker.status === 'waiting' ? 'Available for Work' : 'Currently Working'}
            </Text>
          </View>
        </View>

        {/* Skills */}
        <View style={s.skillsSection}>
          <View style={s.skillsRow}>
            {worker.skills.map((skill, index) => (
              <View key={index} style={s.skillBadge}>
                <Text style={s.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={[s.statCard, { marginRight: 8 }]}>
            <View style={s.ratingRow}>
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text style={[s.statValue, { marginLeft: 4 }]}>{worker.rating}</Text>
            </View>
            <Text style={s.statLabel}>Rating</Text>
          </View>
          <View style={[s.statCard, { marginHorizontal: 4 }]}>
            <Text style={s.statValue}>{worker.totalJobs}</Text>
            <Text style={s.statLabel}>Jobs Done</Text>
          </View>
          <View style={[s.statCard, { marginLeft: 8 }]}>
            <Text style={s.statValue}>{worker.experience}y</Text>
            <Text style={s.statLabel}>Experience</Text>
          </View>
        </View>

        {/* Rates */}
        <View style={s.sectionPadding}>
          <View style={s.ratesCard}>
            <View style={s.ratesRow}>
              <View style={s.rateItem}>
                <Text style={s.rateLabel}>Hourly Rate</Text>
                <Text style={s.rateValue}>₹{worker.hourlyRate}</Text>
              </View>
              <View style={s.rateDivider} />
              <View style={s.rateItem}>
                <Text style={s.rateLabel}>Daily Rate</Text>
                <Text style={s.rateValue}>₹{worker.dailyRate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={s.sectionPadding}>
          <Text style={s.sectionTitle}>About</Text>
          <View style={s.infoCard}>
            <Text style={s.bioText}>{worker.bio}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={s.sectionPadding}>
          <Text style={s.sectionTitle}>Contact</Text>
          <View style={s.infoCard}>
            <View style={[s.contactRow, { marginBottom: 12 }]}>
              <Ionicons name="call" size={18} color={T.textMuted} />
              <Text style={s.contactText}>{worker.phone}</Text>
            </View>
            <View style={[s.contactRow, { marginBottom: 12 }]}>
              <Ionicons name="mail" size={18} color={T.textMuted} />
              <Text style={s.contactText}>{worker.email}</Text>
            </View>
            <View style={s.contactRow}>
              <Ionicons name="location" size={18} color={T.textMuted} />
              <Text style={s.contactText}>{worker.address}</Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={s.reviewsSection}>
          <Text style={s.sectionTitle}>Reviews</Text>
          {worker.reviews.map((review, index) => (
            <View key={index} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <Text style={s.reviewCustomer}>{review.customer}</Text>
                <View style={s.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color="#F59E0B"
                    />
                  ))}
                </View>
              </View>
              <Text style={s.reviewComment}>{review.comment}</Text>
              <Text style={s.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {canHire && (
        <View style={s.bottomBar}>
          <View style={s.bottomRow}>
            <TouchableOpacity
              style={s.callBtn}
              onPress={() => {/* Call worker */}}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text style={s.btnText}>Call</Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity
              style={s.bookBtn}
              onPress={() => router.push(`/(app)/hire?workerId=${worker.id}`)}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={s.btnText}>
                {isContractor ? 'Create Agreement' : 'Book Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = {
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,

  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },

  headerTitle: {
    color: T.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginLeft: 16,
  },

  scrollView: {
    flex: 1,
  } as const,

  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center' as const,
  },

  avatarWrapper: {
    width: 96,
    height: 96,
    backgroundColor: T.bg,
    borderRadius: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  verifiedBadge: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 999,
    padding: 8,
  },

  workerName: {
    color: T.text,
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 16,
  },

  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
  },

  skillsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  skillsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
  },

  skillBadge: {
    backgroundColor: T.amberBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    margin: 4,
  },

  skillText: {
    color: T.amber,
    fontWeight: '500' as const,
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },

  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  statValue: {
    color: T.text,
    fontSize: 24,
    fontWeight: '700' as const,
  },

  statLabel: {
    color: T.textMuted,
    fontSize: 13,
    marginTop: 4,
  },

  sectionPadding: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  ratesCard: {
    backgroundColor: T.navy,
    borderRadius: 16,
    padding: 16,
  },

  ratesRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },

  rateItem: {
    alignItems: 'center' as const,
  },

  rateLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },

  rateValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700' as const,
  },

  rateDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  sectionTitle: {
    color: T.text,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
  },

  infoCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },

  bioText: {
    color: T.textSecondary,
    lineHeight: 24,
    fontSize: 15,
  },

  contactRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  contactText: {
    color: T.textSecondary,
    marginLeft: 12,
    fontSize: 15,
  },

  reviewsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  reviewCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: T.border,
  },

  reviewHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },

  reviewCustomer: {
    color: T.text,
    fontWeight: '500' as const,
    fontSize: 15,
  },

  starsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  reviewComment: {
    color: T.textSecondary,
    fontSize: 14,
  },

  reviewDate: {
    color: T.textMuted,
    fontSize: 13,
    marginTop: 8,
  },

  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  bottomRow: {
    flexDirection: 'row' as const,
  },

  callBtn: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  bookBtn: {
    flex: 1,
    backgroundColor: T.amber,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  btnText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 15,
    marginLeft: 8,
  },
};
