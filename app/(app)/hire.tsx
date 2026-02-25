import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useWalletStore } from '../../src/store/useStore';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const DURATION_OPTIONS = [
  { id: 1, label: '1 Hour' },
  { id: 2, label: '2 Hours' },
  { id: 3, label: '3 Hours' },
  { id: 4, label: '4 Hours' },
  { id: 6, label: '6 Hours' },
  { id: 8, label: 'Full Day' },
];

// Mock worker data - in real app would fetch based on workerId
const MOCK_WORKER = {
  id: 'w1',
  name: 'Ramu Yadav',
  skills: ['Coolie', 'Helper'],
  hourlyRate: 100,
  dailyRate: 600,
  rating: 4.5,
  totalJobs: 120,
  isVerified: true,
  distance: '2.3 km',
};

export default function HireScreen() {
  const router = useRouter();
  const { workerId } = useLocalSearchParams();
  const { user } = useAuth();
  const wallet = useWalletStore((state) => state.wallet);

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const worker = MOCK_WORKER;
  const totalCost = selectedDuration >= 8
    ? worker.dailyRate
    : worker.hourlyRate * selectedDuration;

  const walletBalance = wallet?.balance ?? 25000;
  const hasEnoughBalance = walletBalance >= totalCost;

  const handleHire = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe the work to be done');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter the work address');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time');
      return;
    }
    if (!hasEnoughBalance) {
      Alert.alert(
        'Insufficient Balance',
        'You do not have enough balance. Please add funds to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Funds', onPress: () => {} },
        ]
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Request Sent!',
        'Your hiring request has been sent to the worker. You will be notified when they respond.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Hire Worker</Text>
      </View>

      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* Worker Info */}
        <View style={s.sectionWrap}>
          <View style={s.workerCard}>
            <View style={s.workerRow}>
              <View style={s.avatar}>
                <Ionicons name="person" size={32} color={T.textMuted} />
                {worker.isVerified && (
                  <View style={s.verifiedBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={s.workerInfo}>
                <Text style={s.workerName}>{worker.name}</Text>
                <View style={s.skillsRow}>
                  {worker.skills.map((skill, index) => (
                    <View key={index} style={s.skillPill}>
                      <Text style={s.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.statsRow}>
                  <Ionicons name="star" size={14} color={T.amber} />
                  <Text style={s.ratingText}>{worker.rating}</Text>
                  <Text style={s.dot}>•</Text>
                  <Text style={s.statText}>{worker.totalJobs} jobs</Text>
                  <Text style={s.dot}>•</Text>
                  <Text style={s.statText}>{worker.distance}</Text>
                </View>
              </View>
            </View>

            <View style={s.rateDivider}>
              <View style={s.rateItem}>
                <Text style={s.rateLabel}>Hourly Rate</Text>
                <Text style={s.rateValue}>{'\u20B9'}{worker.hourlyRate}</Text>
              </View>
              <View style={s.rateItem}>
                <Text style={s.rateLabel}>Daily Rate</Text>
                <Text style={s.rateValue}>{'\u20B9'}{worker.dailyRate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Description */}
        <View style={s.fieldWrap}>
          <Text style={s.label}>Work Description *</Text>
          <TextInput
            style={[s.textInput, { minHeight: 100 }]}
            placeholder="Describe what you need help with..."
            placeholderTextColor={T.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Work Address */}
        <View style={s.fieldWrap}>
          <Text style={s.label}>Work Address *</Text>
          <TextInput
            style={[s.textInput, { minHeight: 60 }]}
            placeholder="Enter the address where work will be done"
            placeholderTextColor={T.textMuted}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Date & Time */}
        <View style={s.fieldWrap}>
          <View style={s.dateTimeRow}>
            <View style={s.dateTimeCol}>
              <Text style={s.label}>Date *</Text>
              <TextInput
                style={s.textInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={T.textMuted}
                value={selectedDate}
                onChangeText={setSelectedDate}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={s.dateTimeCol}>
              <Text style={s.label}>Time *</Text>
              <TextInput
                style={s.textInput}
                placeholder="HH:MM"
                placeholderTextColor={T.textMuted}
                value={selectedTime}
                onChangeText={setSelectedTime}
              />
            </View>
          </View>
        </View>

        {/* Duration */}
        <View style={s.fieldWrap}>
          <Text style={s.label}>Duration</Text>
          <View style={s.durationRow}>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  s.durationPill,
                  selectedDuration === option.id ? s.durationActive : s.durationInactive,
                ]}
                onPress={() => setSelectedDuration(option.id)}
              >
                <Text
                  style={[
                    s.durationText,
                    selectedDuration === option.id
                      ? s.durationTextActive
                      : s.durationTextInactive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cost Summary */}
        <View style={s.fieldWrap}>
          <View style={s.costCard}>
            <Text style={s.costTitle}>Cost Summary</Text>

            <View style={s.costRow}>
              <Text style={s.costLabel}>
                {selectedDuration >= 8 ? 'Daily Rate' : `Hourly Rate x ${selectedDuration}`}
              </Text>
              <Text style={s.costValue}>
                {selectedDuration >= 8
                  ? `\u20B9${worker.dailyRate}`
                  : `\u20B9${worker.hourlyRate} x ${selectedDuration}`}
              </Text>
            </View>

            <View style={s.costTotalRow}>
              <Text style={s.costTotalLabel}>Total</Text>
              <Text style={s.costTotalValue}>
                {'\u20B9'}{totalCost.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance */}
        <View style={s.walletWrap}>
          <View
            style={[
              s.walletCard,
              hasEnoughBalance ? s.walletSufficient : s.walletInsufficient,
            ]}
          >
            <View style={s.walletLeft}>
              <Ionicons
                name="wallet"
                size={24}
                color={hasEnoughBalance ? '#22C55E' : '#EF4444'}
              />
              <View style={{ marginLeft: 12 }}>
                <Text
                  style={{
                    color: hasEnoughBalance ? '#22C55E' : '#EF4444',
                    fontSize: 14,
                  }}
                >
                  Wallet Balance
                </Text>
                <Text style={s.walletAmount}>
                  {'\u20B9'}{walletBalance.toLocaleString()}
                </Text>
              </View>
            </View>
            {!hasEnoughBalance && (
              <TouchableOpacity style={s.addFundsBtn}>
                <Text style={s.addFundsText}>Add Funds</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info Note */}
        <View style={s.infoWrap}>
          <View style={s.infoCard}>
            <View style={s.infoRow}>
              <Ionicons name="information-circle" size={20} color={T.info} />
              <Text style={s.infoText}>
                Payment will be held in escrow until the work is completed to your
                satisfaction. You can cancel up to 30 minutes before the scheduled time.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={s.submitWrap}>
        <TouchableOpacity
          style={[
            s.submitBtn,
            hasEnoughBalance && !isSubmitting ? s.submitActive : s.submitDisabled,
          ]}
          onPress={handleHire}
          disabled={!hasEnoughBalance || isSubmitting}
        >
          {isSubmitting ? (
            <Text style={s.submitText}>Sending Request...</Text>
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
              <Text style={[s.submitText, { marginLeft: 8 }]}>
                Send Hiring Request {'\u2022'} {'\u20B9'}{totalCost.toLocaleString()}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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

  sectionWrap: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  workerCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },

  workerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  verifiedBadge: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    backgroundColor: '#22C55E',
    borderRadius: 10,
    padding: 2,
  },

  workerInfo: {
    flex: 1,
    marginLeft: 16,
  },

  workerName: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 18,
  },

  skillsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 4,
  },

  skillPill: {
    backgroundColor: T.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },

  skillText: {
    color: T.textSecondary,
    fontSize: 12,
  },

  statsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
  },

  ratingText: {
    color: T.text,
    marginLeft: 4,
    fontSize: 14,
  },

  dot: {
    color: T.textMuted,
    marginHorizontal: 8,
  },

  statText: {
    color: T.textSecondary,
    fontSize: 14,
  },

  rateDivider: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  rateItem: {
    alignItems: 'center' as const,
  },

  rateLabel: {
    color: T.textSecondary,
    fontSize: 14,
  },

  rateValue: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 18,
  },

  fieldWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  label: {
    color: T.text,
    fontWeight: '600' as const,
    marginBottom: 8,
    fontSize: 15,
  },

  textInput: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: T.text,
    fontSize: 15,
  },

  dateTimeRow: {
    flexDirection: 'row' as const,
  },

  dateTimeCol: {
    flex: 1,
  } as const,

  durationRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },

  durationPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  durationActive: {
    backgroundColor: T.navy,
  },

  durationInactive: {
    backgroundColor: T.bg,
  },

  durationText: {
    fontWeight: '500' as const,
    fontSize: 14,
  },

  durationTextActive: {
    color: '#FFFFFF',
  },

  durationTextInactive: {
    color: T.textSecondary,
  },

  costCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },

  costTitle: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 18,
    marginBottom: 12,
  },

  costRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },

  costLabel: {
    color: T.textSecondary,
    fontSize: 14,
  },

  costValue: {
    color: T.text,
    fontSize: 14,
  },

  costTotalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  costTotalLabel: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 16,
  },

  costTotalValue: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 20,
  },

  walletWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  walletCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },

  walletSufficient: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },

  walletInsufficient: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },

  walletLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  walletAmount: {
    color: T.text,
    fontWeight: '700' as const,
    fontSize: 18,
  },

  addFundsBtn: {
    backgroundColor: T.amber,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  addFundsText: {
    color: '#FFFFFF',
    fontWeight: '500' as const,
    fontSize: 14,
  },

  infoWrap: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  infoCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },

  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },

  infoText: {
    color: T.textSecondary,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  submitWrap: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },

  submitBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  submitActive: {
    backgroundColor: T.amber,
  },

  submitDisabled: {
    backgroundColor: T.border,
  },

  submitText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 18,
  },
};
