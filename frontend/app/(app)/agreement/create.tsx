import { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, StyleSheet, Pressable, Alert, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { LightTheme } from '../../../src/theme/colors';

const T = LightTheme;

const STEPS = ['Select Worker', 'Job Details', 'Preview & Send'];

const JOB_TYPES = ['Manual Work', 'Skilled Work', 'Specialized Work', 'Finishing Work', 'Structural Work'];

const HYD_ZONES = [
  'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kukatpally',
  'Secunderabad', 'Uppal', 'LB Nagar', 'Ameerpet', 'Miyapur', 'Kondapur',
  'Madhapur', 'HITEC City', 'Dilsukhnagar', 'Tolichowki',
];

const ROLE_COLORS: Record<string, string> = {
  Mason: '#8B5CF6', Electrician: '#F59E0B', Plumber: '#3B82F6',
  Carpenter: '#10B981', Painter: '#EC4899', Welder: '#EF4444',
};

const AVAILABLE_WORKERS = [
  { id: 'w1', name: 'Ramu Yadav', primaryRole: 'Mason', skills: ['Mason', 'Plastering', 'Tiling'], dailyRate: 800, rating: 4.8, totalJobs: 142, isVerified: true },
  { id: 'w3', name: 'Suresh Kumar', primaryRole: 'Plumber', skills: ['Plumber', 'Pipe Fitting', 'Waterproofing'], dailyRate: 900, rating: 4.6, totalJobs: 95, isVerified: true },
  { id: 'w4', name: 'Mohammed Khader', primaryRole: 'Carpenter', skills: ['Carpenter', 'Furniture', 'Modular Kitchens'], dailyRate: 1100, rating: 4.7, totalJobs: 176, isVerified: true },
  { id: 'w6', name: 'Srinivas Reddy', primaryRole: 'Welder', skills: ['Welder', 'Fabrication', 'Steel Work'], dailyRate: 1300, rating: 4.9, totalJobs: 201, isVerified: true },
  { id: 'w7', name: 'Ganesh Babu', primaryRole: 'Mason', skills: ['Mason', 'RCC Work', 'Brickwork'], dailyRate: 850, rating: 4.5, totalJobs: 88, isVerified: true },
];

type Worker = typeof AVAILABLE_WORKERS[0];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function ProgressBar({ step }: { step: number }) {
  return (
    <View style={styles.progressContainer}>
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <View key={i} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              done ? styles.progressDotDone : active ? styles.progressDotActive : styles.progressDotInactive,
            ]}>
              {done
                ? <Ionicons name="checkmark" size={14} color="#fff" />
                : <Text style={[styles.progressNum, active ? styles.progressNumActive : styles.progressNumInactive]}>{i + 1}</Text>
              }
            </View>
            <Text style={[styles.progressLabel, active && styles.progressLabelActive]}>{label}</Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.progressLine, done && styles.progressLineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// Step 1: Select Worker
function Step1({ onSelect, selected }: { onSelect: (w: Worker) => void; selected: Worker | null }) {
  const [search, setSearch] = useState('');

  const filtered = AVAILABLE_WORKERS.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.primaryRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Animated.View entering={FadeInRight.springify()} style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Choose a Worker</Text>
      <Text style={styles.stepSubheading}>Select the worker you want to create an agreement with</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={T.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or skill..."
          placeholderTextColor={T.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filtered.map((worker, index) => {
        const roleColor = ROLE_COLORS[worker.primaryRole] || T.navy;
        const isSelected = selected?.id === worker.id;
        return (
          <Animated.View key={worker.id} entering={FadeInDown.delay(index * 60).springify()}>
            <Pressable
              style={[styles.workerSelectCard, isSelected && styles.workerSelectCardActive]}
              onPress={() => onSelect(worker)}
            >
              <View style={[styles.wAvatar, { backgroundColor: roleColor + '20' }]}>
                <Text style={[styles.wAvatarText, { color: roleColor }]}>{getInitials(worker.name)}</Text>
              </View>
              <View style={styles.wInfo}>
                <View style={styles.wNameRow}>
                  <Text style={styles.wName}>{worker.name}</Text>
                  {worker.isVerified && (
                    <Ionicons name="shield-checkmark" size={14} color={T.success} />
                  )}
                </View>
                <Text style={styles.wRole}>{worker.primaryRole}</Text>
                <View style={styles.wMeta}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.wMetaText}>{worker.rating} · {worker.totalJobs} jobs</Text>
                </View>
              </View>
              <View style={styles.wRight}>
                <Text style={styles.wRate}>₹{worker.dailyRate}</Text>
                <Text style={styles.wRateUnit}>/day</Text>
                {isSelected && (
                  <View style={styles.selectedCheckmark}>
                    <Ionicons name="checkmark-circle" size={22} color={T.success} />
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

// Step 2: Job Details
function Step2({
  jobType, setJobType,
  location, setLocation,
  zone, setZone,
  startDate, setStartDate,
  duration, setDuration,
  dailyRate, setDailyRate,
  description, setDescription,
}: any) {
  const [showJobTypePicker, setShowJobTypePicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);

  return (
    <Animated.View entering={FadeInRight.springify()} style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Job Details</Text>
      <Text style={styles.stepSubheading}>Fill in the details for this agreement</Text>

      {/* Job Type */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Job Type <Text style={styles.req}>*</Text></Text>
        <Pressable style={styles.select} onPress={() => setShowJobTypePicker(!showJobTypePicker)}>
          <Text style={[styles.selectText, !jobType && styles.selectPlaceholder]}>
            {jobType || 'Select job type'}
          </Text>
          <Ionicons name={showJobTypePicker ? 'chevron-up' : 'chevron-down'} size={18} color={T.textMuted} />
        </Pressable>
        {showJobTypePicker && (
          <View style={styles.dropdown}>
            {JOB_TYPES.map(type => (
              <Pressable key={type} style={[styles.ddItem, jobType === type && styles.ddItemActive]}
                onPress={() => { setJobType(type); setShowJobTypePicker(false); }}>
                <Text style={[styles.ddText, jobType === type && styles.ddTextActive]}>{type}</Text>
                {jobType === type && <Ionicons name="checkmark" size={16} color={T.amber} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Zone */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Area / Zone</Text>
        <Pressable style={styles.select} onPress={() => setShowZonePicker(!showZonePicker)}>
          <Text style={[styles.selectText, !zone && styles.selectPlaceholder]}>
            {zone || 'Select Hyderabad zone'}
          </Text>
          <Ionicons name={showZonePicker ? 'chevron-up' : 'chevron-down'} size={18} color={T.textMuted} />
        </Pressable>
        {showZonePicker && (
          <View style={styles.dropdown}>
            {HYD_ZONES.map(z => (
              <Pressable key={z} style={[styles.ddItem, zone === z && styles.ddItemActive]}
                onPress={() => { setZone(z); setShowZonePicker(false); }}>
                <Text style={[styles.ddText, zone === z && styles.ddTextActive]}>{z}</Text>
                {zone === z && <Ionicons name="checkmark" size={16} color={T.amber} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Full Work Address <Text style={styles.req}>*</Text></Text>
        <View style={styles.inputBox}>
          <Ionicons name="location-outline" size={16} color={T.textMuted} />
          <TextInput style={styles.input} value={location} onChangeText={setLocation}
            placeholder="e.g. Plot 15, Road 2, Banjara Hills" placeholderTextColor={T.textMuted} />
        </View>
      </View>

      {/* Start Date */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Start Date <Text style={styles.req}>*</Text></Text>
        <View style={styles.inputBox}>
          <Ionicons name="calendar-outline" size={16} color={T.textMuted} />
          <TextInput style={styles.input} value={startDate} onChangeText={setStartDate}
            placeholder="DD/MM/YYYY" placeholderTextColor={T.textMuted} keyboardType="numeric" />
        </View>
      </View>

      {/* Duration */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Duration (days) <Text style={styles.req}>*</Text></Text>
        <View style={styles.inputBox}>
          <Ionicons name="time-outline" size={16} color={T.textMuted} />
          <TextInput style={styles.input} value={duration} onChangeText={setDuration}
            placeholder="e.g. 30" placeholderTextColor={T.textMuted} keyboardType="numeric" />
        </View>
      </View>

      {/* Daily Rate */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Daily Rate (₹) <Text style={styles.req}>*</Text></Text>
        <View style={styles.inputBox}>
          <Text style={styles.rupeePrefix}>₹</Text>
          <TextInput style={styles.input} value={dailyRate} onChangeText={setDailyRate}
            placeholder="e.g. 800" placeholderTextColor={T.textMuted} keyboardType="numeric" />
        </View>
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Scope / Description</Text>
        <TextInput style={styles.textArea} value={description} onChangeText={setDescription}
          placeholder="Describe the work scope in detail..."
          placeholderTextColor={T.textMuted} multiline numberOfLines={4} textAlignVertical="top" />
      </View>
    </Animated.View>
  );
}

// Step 3: Preview
function Step3({ worker, jobType, location, zone, startDate, duration, dailyRate, description }: any) {
  const numDays = parseInt(duration) || 0;
  const rate = parseInt(dailyRate) || 0;
  const total = numDays * rate;

  return (
    <Animated.View entering={FadeInRight.springify()} style={styles.stepContainer}>
      <Text style={styles.stepHeading}>Preview Agreement</Text>
      <Text style={styles.stepSubheading}>Review all details before sending to the worker</Text>

      {/* Worker */}
      {worker && (
        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>WORKER</Text>
          <View style={styles.previewWorkerRow}>
            <View style={[styles.previewAvatar, { backgroundColor: (ROLE_COLORS[worker.primaryRole] || T.navy) + '20' }]}>
              <Text style={[styles.previewAvatarText, { color: ROLE_COLORS[worker.primaryRole] || T.navy }]}>
                {getInitials(worker.name)}
              </Text>
            </View>
            <View>
              <Text style={styles.previewWorkerName}>{worker.name}</Text>
              <Text style={styles.previewWorkerRole}>{worker.primaryRole} · ₹{worker.dailyRate}/day</Text>
            </View>
          </View>
        </View>
      )}

      {/* Details */}
      <View style={styles.previewSection}>
        <Text style={styles.previewLabel}>JOB DETAILS</Text>
        <PreviewRow label="Job Type" value={jobType || '—'} />
        <PreviewRow label="Location" value={location || '—'} />
        <PreviewRow label="Zone" value={zone || '—'} />
        <PreviewRow label="Start Date" value={startDate || '—'} />
        <PreviewRow label="Duration" value={numDays ? `${numDays} days` : '—'} />
      </View>

      {/* Payment */}
      <View style={styles.previewPayBox}>
        <View style={styles.previewPayRow}>
          <Text style={styles.previewPayLabel}>Daily Rate</Text>
          <Text style={styles.previewPayVal}>₹{rate.toLocaleString('en-IN')}/day</Text>
        </View>
        <View style={styles.previewPayDivider} />
        <View style={styles.previewPayRow}>
          <Text style={styles.previewPayLabel}>Duration</Text>
          <Text style={styles.previewPayVal}>{numDays} days</Text>
        </View>
        <View style={styles.previewPayDivider} />
        <View style={[styles.previewPayRow, styles.previewPayTotal]}>
          <Text style={styles.previewTotalLabel}>Total Contract Value</Text>
          <Text style={styles.previewTotalVal}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {description ? (
        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>SCOPE</Text>
          <Text style={styles.previewScopeText}>{description}</Text>
        </View>
      ) : null}

      {/* Escrow note */}
      <View style={styles.escrowInfo}>
        <Ionicons name="lock-closed-outline" size={16} color={T.navy} />
        <Text style={styles.escrowInfoText}>
          Sending this agreement will notify the worker. Payment will be held in escrow until both parties sign and work is completed.
        </Text>
      </View>
    </Animated.View>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.previewDataRow}>
      <Text style={styles.previewDataLabel}>{label}</Text>
      <Text style={styles.previewDataValue}>{value}</Text>
    </View>
  );
}

export default function CreateAgreementScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  function canProceed() {
    if (step === 0) return selectedWorker !== null;
    if (step === 1) return jobType && location && startDate && parseInt(duration) > 0 && parseInt(dailyRate) > 0;
    return true;
  }

  function handleNext() {
    if (!canProceed()) {
      Alert.alert('Incomplete', step === 0 ? 'Please select a worker.' : 'Please fill in all required fields.');
      return;
    }
    if (step < 2) {
      if (step === 0 && selectedWorker) {
        setDailyRate(String(selectedWorker.dailyRate));
      }
      setStep(s => s + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);
    else router.back();
  }

  function handleSend() {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      Alert.alert(
        'Agreement Sent!',
        `Agreement sent to ${selectedWorker?.name}. They will be notified to review and sign.`,
        [{ text: 'Done', onPress: () => router.push('/(app)/(tabs)/agreements') }],
      );
    }, 1200);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>New Agreement</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <ProgressBar step={step} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {step === 0 && (
          <Step1
            selected={selectedWorker}
            onSelect={w => setSelectedWorker(w)}
          />
        )}
        {step === 1 && (
          <Step2
            jobType={jobType} setJobType={setJobType}
            location={location} setLocation={setLocation}
            zone={zone} setZone={setZone}
            startDate={startDate} setStartDate={setStartDate}
            duration={duration} setDuration={setDuration}
            dailyRate={dailyRate} setDailyRate={setDailyRate}
            description={description} setDescription={setDescription}
          />
        )}
        {step === 2 && (
          <Step3
            worker={selectedWorker}
            jobType={jobType} location={location} zone={zone}
            startDate={startDate} duration={duration}
            dailyRate={dailyRate} description={description}
          />
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomRow}>
          {step > 0 && (
            <Pressable style={styles.prevBtn} onPress={handleBack}>
              <Ionicons name="arrow-back" size={18} color={T.navy} />
              <Text style={styles.prevBtnText}>Back</Text>
            </Pressable>
          )}
          {step < 2 ? (
            <Pressable
              style={({ pressed }) => [styles.nextBtn, !canProceed() && styles.nextBtnDisabled, pressed && { opacity: 0.85 }, step > 0 ? styles.nextBtnFlex : styles.nextBtnFull]}
              onPress={handleNext}
            >
              <Text style={[styles.nextBtnText, !canProceed() && styles.nextBtnTextDisabled]}>
                {step === 0 ? 'Continue with Worker' : 'Preview Agreement'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={canProceed() ? '#fff' : T.textMuted} />
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.85 }]}
              onPress={handleSend}
              disabled={sending}
            >
              <Ionicons name="send-outline" size={18} color="#fff" />
              <Text style={styles.sendBtnText}>{sending ? 'Sending...' : 'Send to Worker'}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.navy },

  progressContainer: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center',
    paddingVertical: 16, paddingHorizontal: 24, backgroundColor: T.surface,
    borderBottomWidth: 1, borderBottomColor: T.border,
  },
  progressStep: { alignItems: 'center', position: 'relative', flex: 1 },
  progressDot: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  progressDotDone: { backgroundColor: T.navy },
  progressDotActive: { backgroundColor: T.amber },
  progressDotInactive: { backgroundColor: T.bg, borderWidth: 1.5, borderColor: T.border },
  progressNum: { fontSize: 13, fontWeight: '700' },
  progressNumActive: { color: '#fff' },
  progressNumInactive: { color: T.textMuted },
  progressLabel: { fontSize: 10, color: T.textMuted, textAlign: 'center', fontWeight: '600' },
  progressLabelActive: { color: T.amber },
  progressLine: {
    position: 'absolute', top: 15, left: '60%', right: '-60%',
    height: 2, backgroundColor: T.border, zIndex: -1,
  },
  progressLineDone: { backgroundColor: T.navy },

  scrollContent: { paddingBottom: 24 },
  stepContainer: { padding: 16 },
  stepHeading: { fontSize: 20, fontWeight: '800', color: T.navy, marginBottom: 6 },
  stepSubheading: { fontSize: 14, color: T.textSecondary, marginBottom: 20, lineHeight: 20 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: T.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: T.border, marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 15, color: T.navy, paddingVertical: 0 },

  workerSelectCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: T.border, marginBottom: 10,
  },
  workerSelectCardActive: { borderColor: T.amber, backgroundColor: '#FFFBEB' },
  wAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  wAvatarText: { fontSize: 16, fontWeight: '800' },
  wInfo: { flex: 1, marginLeft: 14 },
  wNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  wName: { fontSize: 15, fontWeight: '700', color: T.navy },
  wRole: { fontSize: 12, color: T.textSecondary, marginBottom: 4 },
  wMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wMetaText: { fontSize: 12, color: T.textMuted },
  wRight: { alignItems: 'flex-end' },
  wRate: { fontSize: 18, fontWeight: '800', color: T.amber },
  wRateUnit: { fontSize: 11, color: T.textSecondary },
  selectedCheckmark: { marginTop: 4 },

  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: T.textSecondary, marginBottom: 8 },
  req: { color: '#EF4444' },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: T.border, borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: T.surface,
  },
  rupeePrefix: { fontSize: 18, fontWeight: '700', color: T.amber },
  input: { flex: 1, fontSize: 15, color: T.navy, paddingVertical: 12 },
  select: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: T.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: T.surface,
  },
  selectText: { fontSize: 15, color: T.navy },
  selectPlaceholder: { color: T.textMuted },
  dropdown: { marginTop: 4, borderWidth: 1, borderColor: T.border, borderRadius: 12, backgroundColor: T.surface, overflow: 'hidden' },
  ddItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  ddItemActive: { backgroundColor: '#FFFBEB' },
  ddText: { fontSize: 14, color: T.textSecondary },
  ddTextActive: { color: T.amber, fontWeight: '600' },
  textArea: {
    borderWidth: 1, borderColor: T.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: T.surface,
    fontSize: 15, color: T.navy, minHeight: 100,
  },

  previewSection: {
    backgroundColor: T.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: T.border, marginBottom: 12,
  },
  previewLabel: { fontSize: 10, fontWeight: '800', color: T.textMuted, letterSpacing: 1.3, marginBottom: 12 },
  previewWorkerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  previewAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  previewAvatarText: { fontSize: 15, fontWeight: '800' },
  previewWorkerName: { fontSize: 16, fontWeight: '700', color: T.navy },
  previewWorkerRole: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  previewDataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  previewDataLabel: { fontSize: 13, color: T.textMuted },
  previewDataValue: { fontSize: 13, fontWeight: '700', color: T.navy, maxWidth: 200, textAlign: 'right' },
  previewPayBox: { borderWidth: 1, borderColor: T.border, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  previewPayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  previewPayDivider: { height: 1, backgroundColor: T.border },
  previewPayTotal: { backgroundColor: T.navy },
  previewPayLabel: { fontSize: 14, color: T.textSecondary },
  previewPayVal: { fontSize: 14, fontWeight: '700', color: T.navy },
  previewTotalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  previewTotalVal: { fontSize: 22, fontWeight: '900', color: T.amber },
  previewScopeText: { fontSize: 14, color: T.textSecondary, lineHeight: 22 },

  escrowInfo: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  escrowInfoText: { flex: 1, fontSize: 13, color: '#1E40AF', lineHeight: 20 },

  bottomBar: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border,
  },
  bottomRow: { flexDirection: 'row', gap: 10 },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.bg, paddingVertical: 14, paddingHorizontal: 18,
    borderRadius: 14, borderWidth: 1, borderColor: T.border, gap: 6,
  },
  prevBtnText: { fontSize: 14, fontWeight: '600', color: T.navy },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.navy, paddingVertical: 14, borderRadius: 14, gap: 8,
  },
  nextBtnFlex: { flex: 1 },
  nextBtnFull: { flex: 1 },
  nextBtnDisabled: { backgroundColor: T.bg, borderWidth: 1, borderColor: T.border },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  nextBtnTextDisabled: { color: T.textMuted },
  sendBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.amber, paddingVertical: 14, borderRadius: 14, gap: 8,
  },
  sendBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
