import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { LightTheme } from '../../src/theme/colors';

const T = LightTheme;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SKILLS = [
  'Mason', 'Plastering', 'Tiling', 'Electrician', 'Wiring',
  'Plumber', 'Pipe Fitting', 'Carpenter', 'Furniture', 'Painter',
  'Texture Work', 'Welder', 'Fabrication', 'Helper', 'Waterproofing',
];

const HYD_ZONES = [
  'All Hyderabad', 'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kukatpally',
  'Secunderabad', 'Uppal', 'LB Nagar', 'Ameerpet', 'Miyapur', 'Kondapur',
  'Madhapur', 'HITEC City', 'Dilsukhnagar', 'Tolichowki',
];

export default function AvailabilityScreen() {
  const router = useRouter();

  const [isAvailable, setIsAvailable] = useState(true);
  const [dailyRate, setDailyRate] = useState('800');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [startHour, setStartHour] = useState('08:00');
  const [endHour, setEndHour] = useState('18:00');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Mason', 'Plastering', 'Tiling']);
  const [selectedZones, setSelectedZones] = useState<string[]>(['All Hyderabad']);
  const [saving, setSaving] = useState(false);

  function toggleDay(day: string) {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  function toggleSkill(skill: string) {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }

  function toggleZone(zone: string) {
    if (zone === 'All Hyderabad') {
      setSelectedZones(['All Hyderabad']);
      return;
    }
    setSelectedZones(prev => {
      const withoutAll = prev.filter(z => z !== 'All Hyderabad');
      if (withoutAll.includes(zone)) return withoutAll.filter(z => z !== zone);
      return [...withoutAll, zone];
    });
  }

  function handleSave() {
    if (!dailyRate || parseInt(dailyRate) < 200) {
      Alert.alert('Invalid Rate', 'Please enter a daily rate of at least ₹200');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Saved!', 'Your availability settings have been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 800);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>My Availability</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Big toggle */}
        <Animated.View entering={FadeInDown.springify()} style={[styles.toggleCard, isAvailable ? styles.toggleCardGreen : styles.toggleCardGrey]}>
          <View style={styles.toggleLeft}>
            <View style={[styles.toggleIcon, { backgroundColor: isAvailable ? '#ECFDF5' : T.bg }]}>
              <Ionicons
                name={isAvailable ? 'checkmark-circle' : 'pause-circle'}
                size={36}
                color={isAvailable ? T.success : T.textMuted}
              />
            </View>
            <View style={styles.toggleTextGroup}>
              <Text style={[styles.toggleTitle, { color: isAvailable ? T.success : T.textSecondary }]}>
                {isAvailable ? "I'm Available for Work" : "I'm Currently Busy"}
              </Text>
              <Text style={styles.toggleSubtitle}>
                {isAvailable ? 'Workers can find and hire you' : 'You are hidden from job searches'}
              </Text>
            </View>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: T.border, true: '#A7F3D0' }}
            thumbColor={isAvailable ? T.success : T.textMuted}
            ios_backgroundColor={T.border}
          />
        </Animated.View>

        {/* Daily Rate */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Rate</Text>
          <View style={styles.rateInputRow}>
            <View style={styles.ratePrefix}>
              <Text style={styles.ratePrefixText}>₹</Text>
            </View>
            <TextInput
              style={styles.rateInput}
              value={dailyRate}
              onChangeText={setDailyRate}
              keyboardType="numeric"
              placeholder="Enter daily rate"
              placeholderTextColor={T.textMuted}
            />
            <View style={styles.rateSuffix}>
              <Text style={styles.rateSuffixText}>/day</Text>
            </View>
          </View>
          <Text style={styles.rateHint}>Market rate for Mason in Hyderabad: ₹700–₹1000/day</Text>
        </Animated.View>

        {/* Work Schedule */}
        <Animated.View entering={FadeInLeft.delay(120).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Work Schedule</Text>
          <Text style={styles.sectionSubtitle}>Working days (Mon–Sat)</Text>
          <View style={styles.daysRow}>
            {DAYS.map(day => {
              const active = workingDays.includes(day);
              return (
                <Pressable
                  key={day}
                  style={[styles.dayChip, active ? styles.dayChipActive : styles.dayChipInactive]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayText, active ? styles.dayTextActive : styles.dayTextInactive]}>
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>Working hours</Text>
          <View style={styles.hoursRow}>
            <View style={styles.hourInput}>
              <Text style={styles.hourLabel}>Start Time</Text>
              <View style={styles.hourInputBox}>
                <Ionicons name="time-outline" size={16} color={T.textMuted} />
                <TextInput
                  style={styles.hourText}
                  value={startHour}
                  onChangeText={setStartHour}
                  placeholder="08:00"
                  placeholderTextColor={T.textMuted}
                />
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color={T.textMuted} style={styles.hourArrow} />
            <View style={styles.hourInput}>
              <Text style={styles.hourLabel}>End Time</Text>
              <View style={styles.hourInputBox}>
                <Ionicons name="time-outline" size={16} color={T.textMuted} />
                <TextInput
                  style={styles.hourText}
                  value={endHour}
                  onChangeText={setEndHour}
                  placeholder="18:00"
                  placeholderTextColor={T.textMuted}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Skills */}
        <Animated.View entering={FadeInLeft.delay(160).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.sectionSubtitle}>Select your skills (multi-select)</Text>
          <View style={styles.chipsGrid}>
            {SKILLS.map(skill => {
              const active = selectedSkills.includes(skill);
              return (
                <Pressable
                  key={skill}
                  style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  onPress={() => toggleSkill(skill)}
                >
                  {active && <Ionicons name="checkmark" size={13} color={T.amber} />}
                  <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    {skill}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Location Preferences */}
        <Animated.View entering={FadeInLeft.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Location Preferences</Text>
          <Text style={styles.sectionSubtitle}>Areas you can work in</Text>
          <View style={styles.chipsGrid}>
            {HYD_ZONES.map(zone => {
              const active = selectedZones.includes(zone);
              return (
                <Pressable
                  key={zone}
                  style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  onPress={() => toggleZone(zone)}
                >
                  {active && <Ionicons name="location" size={12} color={T.amber} />}
                  <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    {zone}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Availability'}</Text>
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

  scroll: { padding: 16, paddingBottom: 24 },

  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1.5,
  },
  toggleCardGreen: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  toggleCardGrey: { backgroundColor: T.surface, borderColor: T.border },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  toggleIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  toggleTextGroup: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  toggleSubtitle: { fontSize: 13, color: T.textSecondary },

  section: {
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: T.navy, marginBottom: 12 },
  sectionSubtitle: { fontSize: 13, color: T.textSecondary, marginBottom: 10 },

  rateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: T.border,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 8,
  },
  ratePrefix: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: T.bg,
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  ratePrefixText: { fontSize: 22, fontWeight: '800', color: T.amber },
  rateInput: { flex: 1, fontSize: 24, fontWeight: '800', color: T.navy, paddingHorizontal: 14 },
  rateSuffix: {
    paddingHorizontal: 14,
    backgroundColor: T.bg,
    borderLeftWidth: 1,
    borderLeftColor: T.border,
    paddingVertical: 14,
  },
  rateSuffixText: { fontSize: 14, color: T.textSecondary },
  rateHint: { fontSize: 12, color: T.textMuted },

  daysRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  dayChip: {
    width: 46, height: 46, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
  },
  dayChipActive: { backgroundColor: T.navy, borderColor: T.navy },
  dayChipInactive: { backgroundColor: T.bg, borderColor: T.border },
  dayText: { fontSize: 13, fontWeight: '700' },
  dayTextActive: { color: '#fff' },
  dayTextInactive: { color: T.textSecondary },

  hoursRow: { flexDirection: 'row', alignItems: 'center' },
  hourInput: { flex: 1 },
  hourLabel: { fontSize: 12, color: T.textMuted, marginBottom: 6 },
  hourInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: T.bg,
  },
  hourText: { fontSize: 16, fontWeight: '600', color: T.navy },
  hourArrow: { marginHorizontal: 12, marginTop: 18 },

  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipActive: { backgroundColor: '#FFFBEB', borderColor: T.amber },
  chipInactive: { backgroundColor: T.bg, borderColor: T.border },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: T.amber },
  chipTextInactive: { color: T.textSecondary },

  bottomBar: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.navy, paddingVertical: 16, borderRadius: 14, gap: 10,
  },
  saveBtnPressed: { opacity: 0.85 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
