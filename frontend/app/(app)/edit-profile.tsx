import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '../../src/hooks/useAuth';
import { LightTheme as T } from '../../src/theme/colors';

const SKILLS_OPTIONS = [
  'Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter',
  'Welder', 'Tiler', 'Helper', 'Supervisor', 'Driver',
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || 'Hyderabad');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Mason', 'Carpenter']);
  const [dailyRate, setDailyRate] = useState('800');
  const [experienceYears, setExperienceYears] = useState('5');
  const [saving, setSaving] = useState(false);

  const isWorker = user?.role === 'worker';

  const initials = (user?.full_name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Full name is required.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Edit Profile</Text>
        <Pressable onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={T.amber} />
          ) : (
            <Text style={s.saveBtn}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <Animated.View entering={ZoomIn.delay(0).duration(400)} style={s.avatarSection}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <Pressable style={s.editAvatarBtn}>
              <Ionicons name="camera" size={16} color={T.white} />
            </Pressable>
          </View>
          <Text style={s.changePhotoLabel}>Change Photo</Text>
          {user?.role && (
            <View style={s.rolePill}>
              <Text style={s.rolePillText}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={s.form}>

          {/* Full Name */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Full Name</Text>
            <TextInput
              style={s.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={T.textMuted}
            />
          </View>

          {/* Phone (read-only) */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Phone Number</Text>
            <View style={s.inputDisabledWrap}>
              <TextInput
                style={[s.input, s.inputDisabled]}
                value={`+91 ${user?.phone || '—'}`}
                editable={false}
              />
              <View style={s.lockIcon}>
                <Ionicons name="lock-closed-outline" size={14} color={T.textMuted} />
              </View>
            </View>
            <Text style={s.helperText}>Phone number cannot be changed</Text>
          </View>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={T.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* City */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>City</Text>
            <TextInput
              style={s.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              placeholderTextColor={T.textMuted}
            />
          </View>

          {/* Role (read-only) */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Role</Text>
            <View style={[s.input, s.roleField]}>
              <Text style={s.roleFieldText}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}
              </Text>
            </View>
          </View>

          {/* Worker-specific fields */}
          {isWorker && (
            <>
              <Animated.View entering={FadeInDown.delay(200).duration(400)} style={s.fieldGroup}>
                <Text style={s.label}>Skills</Text>
                <View style={s.skillsGrid}>
                  {SKILLS_OPTIONS.map((skill) => {
                    const selected = selectedSkills.includes(skill);
                    return (
                      <Pressable
                        key={skill}
                        style={[s.skillChip, selected && s.skillChipActive]}
                        onPress={() => toggleSkill(skill)}
                      >
                        <Text style={[s.skillText, selected && s.skillTextActive]}>
                          {skill}
                        </Text>
                        {selected && (
                          <Ionicons name="checkmark" size={12} color={T.white} style={{ marginLeft: 4 }} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(260).duration(400)} style={s.fieldRow}>
                <View style={[s.fieldGroup, { flex: 1 }]}>
                  <Text style={s.label}>Daily Rate (₹)</Text>
                  <TextInput
                    style={s.input}
                    value={dailyRate}
                    onChangeText={setDailyRate}
                    placeholder="e.g. 800"
                    placeholderTextColor={T.textMuted}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={[s.fieldGroup, { flex: 1 }]}>
                  <Text style={s.label}>Experience (years)</Text>
                  <TextInput
                    style={s.input}
                    value={experienceYears}
                    onChangeText={setExperienceYears}
                    placeholder="e.g. 5"
                    placeholderTextColor={T.textMuted}
                    keyboardType="number-pad"
                  />
                </View>
              </Animated.View>
            </>
          )}

          {/* Save Button */}
          <Animated.View entering={FadeInDown.delay(320).duration(400)}>
            <Pressable style={s.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color={T.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={T.white} />
                  <Text style={s.saveButtonText}>Save Changes</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  saveBtn: { fontSize: 16, fontWeight: '700', color: T.amber },
  scroll: { paddingBottom: 60 },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  avatarWrap: { position: 'relative', marginBottom: 10 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: T.navy + '18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: T.border,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: T.navy },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.amber,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: T.surface,
  },
  changePhotoLabel: { fontSize: 14, fontWeight: '600', color: T.amber, marginBottom: 8 },
  rolePill: {
    backgroundColor: T.navy + '14',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  rolePillText: { fontSize: 13, fontWeight: '700', color: T.navy },
  form: { padding: 20, gap: 4 },
  fieldGroup: { marginBottom: 18 },
  fieldRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: T.text, marginBottom: 8 },
  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: T.text,
  },
  inputDisabledWrap: { position: 'relative' },
  inputDisabled: { color: T.textMuted, backgroundColor: T.bg, paddingRight: 44 },
  lockIcon: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  helperText: { fontSize: 12, color: T.textMuted, marginTop: 4, marginLeft: 4 },
  roleField: {
    justifyContent: 'center',
    backgroundColor: T.bg,
  },
  roleFieldText: { fontSize: 15, color: T.textMuted, fontWeight: '500' },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  skillChipActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  skillText: { fontSize: 13, fontWeight: '600', color: T.textSecondary },
  skillTextActive: { color: T.white },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: T.navy,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: T.white },
});
