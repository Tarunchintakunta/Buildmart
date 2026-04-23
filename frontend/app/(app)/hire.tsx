import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LightTheme } from '../../src/theme/colors';

const T = LightTheme;

const JOB_TYPES = ['Manual Work', 'Skilled Work', 'Specialized Work'];

const HYD_ZONES = [
  'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kukatpally',
  'Secunderabad', 'Uppal', 'LB Nagar', 'Ameerpet', 'Miyapur', 'Kondapur',
];

const MOCK_WORKERS: Record<string, { id: string; name: string; primaryRole: string; dailyRate: number; rating: number; totalJobs: number; isVerified: boolean }> = {
  w1: { id: 'w1', name: 'Ramu Yadav', primaryRole: 'Mason', dailyRate: 800, rating: 4.8, totalJobs: 142, isVerified: true },
  w2: { id: 'w2', name: 'Venkat Rao', primaryRole: 'Electrician', dailyRate: 1200, rating: 4.9, totalJobs: 218, isVerified: true },
  w3: { id: 'w3', name: 'Suresh Kumar', primaryRole: 'Plumber', dailyRate: 900, rating: 4.6, totalJobs: 95, isVerified: true },
  w4: { id: 'w4', name: 'Mohammed Khader', primaryRole: 'Carpenter', dailyRate: 1100, rating: 4.7, totalJobs: 176, isVerified: true },
  w5: { id: 'w5', name: 'Balaiah Naidu', primaryRole: 'Painter', dailyRate: 750, rating: 4.4, totalJobs: 63, isVerified: false },
  w6: { id: 'w6', name: 'Srinivas Reddy', primaryRole: 'Welder', dailyRate: 1300, rating: 4.9, totalJobs: 201, isVerified: true },
  w7: { id: 'w7', name: 'Ganesh Babu', primaryRole: 'Mason', dailyRate: 850, rating: 4.5, totalJobs: 88, isVerified: true },
  w8: { id: 'w8', name: 'Ramesh Goud', primaryRole: 'Plumber', dailyRate: 950, rating: 4.2, totalJobs: 54, isVerified: false },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const ROLE_COLORS: Record<string, string> = {
  Mason: '#8B5CF6', Electrician: '#F59E0B', Plumber: '#3B82F6',
  Carpenter: '#10B981', Painter: '#EC4899', Welder: '#EF4444',
};

export default function HireScreen() {
  const router = useRouter();
  const { workerId } = useLocalSearchParams<{ workerId: string }>();

  const worker = MOCK_WORKERS[workerId as string] || MOCK_WORKERS['w1'];
  const roleColor = ROLE_COLORS[worker.primaryRole] || T.navy;

  const [jobType, setJobType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [description, setDescription] = useState('');
  const [showJobTypePicker, setShowJobTypePicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const numDays = parseInt(days) || 0;
  const budget = numDays * worker.dailyRate;

  const isValid = jobType && startDate && numDays > 0 && location.trim().length > 0;

  function handleConfirm() {
    if (!isValid) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields before confirming.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Booking Confirmed!',
        `${worker.name} has been booked for ${days} day(s). ₹${budget.toLocaleString('en-IN')} is held in escrow.`,
        [{ text: 'Great!', onPress: () => router.push('/(app)/(tabs)/jobs') }],
      );
    }, 1200);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>Hire Worker</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Worker Card */}
        <Animated.View entering={FadeInDown.springify()} style={styles.workerCard}>
          <View style={[styles.workerAvatar, { backgroundColor: roleColor + '20' }]}>
            <Text style={[styles.workerAvatarText, { color: roleColor }]}>{getInitials(worker.name)}</Text>
          </View>
          <View style={styles.workerInfo}>
            <View style={styles.workerNameRow}>
              <Text style={styles.workerName}>{worker.name}</Text>
              {worker.isVerified && (
                <View style={styles.verifiedTag}>
                  <Ionicons name="shield-checkmark" size={12} color={T.success} />
                  <Text style={styles.verifiedTagText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.workerRole}>{worker.primaryRole}</Text>
            <View style={styles.workerStats}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.workerStatText}>{worker.rating} · {worker.totalJobs} jobs</Text>
            </View>
          </View>
          <View style={styles.workerRate}>
            <Text style={styles.workerRateValue}>₹{worker.dailyRate}</Text>
            <Text style={styles.workerRateUnit}>/day</Text>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Job Details</Text>

          {/* Job Type */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Job Type <Text style={styles.required}>*</Text></Text>
            <Pressable
              style={styles.select}
              onPress={() => setShowJobTypePicker(!showJobTypePicker)}
            >
              <Text style={[styles.selectText, !jobType && styles.selectPlaceholder]}>
                {jobType || 'Select job type'}
              </Text>
              <Ionicons name={showJobTypePicker ? 'chevron-up' : 'chevron-down'} size={18} color={T.textMuted} />
            </Pressable>
            {showJobTypePicker && (
              <View style={styles.dropdown}>
                {JOB_TYPES.map(type => (
                  <Pressable
                    key={type}
                    style={[styles.dropdownItem, jobType === type && styles.dropdownItemActive]}
                    onPress={() => { setJobType(type); setShowJobTypePicker(false); }}
                  >
                    <Text style={[styles.dropdownItemText, jobType === type && styles.dropdownItemTextActive]}>
                      {type}
                    </Text>
                    {jobType === type && <Ionicons name="checkmark" size={16} color={T.amber} />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Start Date */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Start Date <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputRow}>
              <Ionicons name="calendar-outline" size={18} color={T.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={T.textMuted}
                value={startDate}
                onChangeText={setStartDate}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Duration (days) <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputRow}>
              <Ionicons name="time-outline" size={18} color={T.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Number of days"
                placeholderTextColor={T.textMuted}
                value={days}
                onChangeText={setDays}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Zone */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Area / Zone</Text>
            <Pressable
              style={styles.select}
              onPress={() => setShowZonePicker(!showZonePicker)}
            >
              <Text style={[styles.selectText, !zone && styles.selectPlaceholder]}>
                {zone || 'Select Hyderabad zone'}
              </Text>
              <Ionicons name={showZonePicker ? 'chevron-up' : 'chevron-down'} size={18} color={T.textMuted} />
            </Pressable>
            {showZonePicker && (
              <View style={styles.dropdown}>
                {HYD_ZONES.map(z => (
                  <Pressable
                    key={z}
                    style={[styles.dropdownItem, zone === z && styles.dropdownItemActive]}
                    onPress={() => { setZone(z); setShowZonePicker(false); }}
                  >
                    <Text style={[styles.dropdownItemText, zone === z && styles.dropdownItemTextActive]}>{z}</Text>
                    {zone === z && <Ionicons name="checkmark" size={16} color={T.amber} />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Work Location */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Work Location (full address) <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={18} color={T.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Plot 42, Madhura Nagar, Hyderabad"
                placeholderTextColor={T.textMuted}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Description / Special Instructions</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the work in detail..."
              placeholderTextColor={T.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* Budget Box */}
        {numDays > 0 && (
          <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.budgetBox}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Estimated Budget</Text>
              <View style={styles.budgetCalc}>
                <Text style={styles.budgetCalcText}>
                  {days} days × ₹{worker.dailyRate.toLocaleString('en-IN')}/day
                </Text>
              </View>
            </View>
            <Text style={styles.budgetValue}>₹{budget.toLocaleString('en-IN')}</Text>
            <View style={styles.escrowNote}>
              <Ionicons name="lock-closed-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.escrowText}>
                Amount will be held in escrow until job completion
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Escrow info when no days yet */}
        {numDays === 0 && (
          <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.escrowInfo}>
            <Ionicons name="information-circle-outline" size={18} color={T.navy} />
            <Text style={styles.escrowInfoText}>
              Enter number of days to see the estimated budget. Payment is held in escrow until job is completed.
            </Text>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.confirmBtn,
            !isValid && styles.confirmBtnDisabled,
            pressed && isValid && styles.confirmBtnPressed,
          ]}
          onPress={handleConfirm}
          disabled={!isValid || loading}
        >
          {loading ? (
            <Text style={styles.confirmBtnText}>Processing...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={isValid ? '#fff' : T.textMuted} />
              <Text style={[styles.confirmBtnText, !isValid && styles.confirmBtnTextDisabled]}>
                Confirm Booking
              </Text>
            </>
          )}
        </Pressable>
      </View>
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

  scroll: { paddingBottom: 24 },

  // Worker card
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  workerAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  workerAvatarText: { fontSize: 18, fontWeight: '800' },
  workerInfo: { flex: 1, marginLeft: 14 },
  workerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  workerName: { fontSize: 16, fontWeight: '700', color: T.navy },
  verifiedTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedTagText: { fontSize: 11, color: T.success, fontWeight: '600' },
  workerRole: { fontSize: 13, color: T.textSecondary, marginBottom: 4 },
  workerStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workerStatText: { fontSize: 12, color: T.textMuted },
  workerRate: { alignItems: 'flex-end' },
  workerRateValue: { fontSize: 22, fontWeight: '800', color: T.amber },
  workerRateUnit: { fontSize: 12, color: T.textSecondary },

  // Form section
  formSection: {
    backgroundColor: T.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 16,
  },
  formSectionTitle: { fontSize: 16, fontWeight: '700', color: T.navy, marginBottom: 16 },

  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: T.textSecondary, marginBottom: 8 },
  required: { color: '#EF4444' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: T.bg,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: T.navy, paddingVertical: 12 },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: T.bg,
  },
  selectText: { fontSize: 15, color: T.navy },
  selectPlaceholder: { color: T.textMuted },

  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    backgroundColor: T.surface,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  dropdownItemActive: { backgroundColor: '#FFFBEB' },
  dropdownItemText: { fontSize: 14, color: T.textSecondary },
  dropdownItemTextActive: { color: T.amber, fontWeight: '600' },

  textArea: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: T.bg,
    fontSize: 15,
    color: T.navy,
    minHeight: 100,
  },

  // Budget box
  budgetBox: {
    backgroundColor: T.navy,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  budgetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  budgetLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  budgetCalc: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  budgetCalcText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  budgetValue: { fontSize: 36, fontWeight: '900', color: T.amber, marginBottom: 12 },
  escrowNote: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  escrowText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1, lineHeight: 18 },

  escrowInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  escrowInfoText: { fontSize: 13, color: '#1E40AF', flex: 1, lineHeight: 18 },

  // Bottom
  bottomBar: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border,
  },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.navy, paddingVertical: 16, borderRadius: 14, gap: 10,
  },
  confirmBtnDisabled: { backgroundColor: T.bg, borderWidth: 1, borderColor: T.border },
  confirmBtnPressed: { opacity: 0.85 },
  confirmBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  confirmBtnTextDisabled: { color: T.textMuted },
});
