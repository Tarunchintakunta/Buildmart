import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/hooks/useAuth';
import { useAppStore } from '../../src/store/app.store';
import { LightTheme as T } from '../../src/theme/colors';

type Lang = 'en' | 'hi' | 'te';

const LANGUAGES: { code: Lang; flag: string; label: string; native: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English', native: 'EN' },
  { code: 'hi', flag: '🇮🇳', label: 'हिंदी', native: 'HI' },
  { code: 'te', flag: '🇮🇳', label: 'తెలుగు', native: 'TE' },
];

const LANG_LABEL: Record<Lang, string> = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
};

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { language, setLanguage } = useAppStore();

  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [langModal, setLangModal] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleLanguageSelect = async (lang: Lang) => {
    await setLanguage(lang);
    setLangModal(false);
    showToast('Language changed!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)' as any);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Text style={s.sectionLabel}>ACCOUNT</Text>
          <View style={s.sectionCard}>
            {[
              { icon: 'person-outline' as const, label: 'Edit Profile', color: '#3B82F6', onPress: () => router.push('/(app)/edit-profile' as any) },
              { icon: 'location-outline' as const, label: 'Addresses', color: '#F59E0B', onPress: () => router.push('/(app)/addresses' as any) },
              { icon: 'card-outline' as const, label: 'Payment Methods', color: '#8B5CF6', onPress: () => router.push('/(app)/payment-methods' as any) },
            ].map((item, i, arr) => (
              <Pressable
                key={item.label}
                style={[s.row, i < arr.length - 1 && s.rowBorder]}
                onPress={item.onPress}
              >
                <View style={[s.rowIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={s.rowLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Text style={s.sectionLabel}>PREFERENCES</Text>
          <View style={s.sectionCard}>
            {/* Language */}
            <Pressable style={[s.row, s.rowBorder]} onPress={() => setLangModal(true)}>
              <View style={[s.rowIcon, { backgroundColor: '#3B82F618' }]}>
                <Ionicons name="language-outline" size={18} color="#3B82F6" />
              </View>
              <Text style={s.rowLabel}>Language</Text>
              <Text style={s.rowValue}>{LANG_LABEL[language]}</Text>
              <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
            </Pressable>

            {/* Theme (locked) */}
            <Pressable style={[s.row, s.rowBorder]}>
              <View style={[s.rowIcon, { backgroundColor: '#6B728018' }]}>
                <Ionicons name="sunny-outline" size={18} color="#6B7280" />
              </View>
              <Text style={s.rowLabel}>Theme</Text>
              <Text style={s.rowValue}>Light</Text>
              <View style={s.lockBadge}>
                <Ionicons name="lock-closed" size={11} color={T.textMuted} />
              </View>
            </Pressable>

            {/* Notifications toggle */}
            <View style={[s.row, s.rowBorder]}>
              <View style={[s.rowIcon, { backgroundColor: '#10B98118' }]}>
                <Ionicons name="notifications-outline" size={18} color="#10B981" />
              </View>
              <Text style={s.rowLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: T.border, true: T.success }}
                thumbColor={T.white}
              />
            </View>

            {/* Location toggle */}
            <View style={s.row}>
              <View style={[s.rowIcon, { backgroundColor: '#F59E0B18' }]}>
                <Ionicons name="location-outline" size={18} color="#F59E0B" />
              </View>
              <Text style={s.rowLabel}>Location</Text>
              <Switch
                value={location}
                onValueChange={setLocation}
                trackColor={{ false: T.border, true: T.success }}
                thumbColor={T.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Text style={s.sectionLabel}>SUPPORT</Text>
          <View style={s.sectionCard}>
            {[
              { icon: 'help-circle-outline' as const, label: 'Help & Support', color: '#3B82F6', onPress: () => router.push('/(app)/help-support' as any) },
              { icon: 'star-outline' as const, label: 'Rate the App', color: '#F59E0B', onPress: () => {} },
              { icon: 'information-circle-outline' as const, label: 'About BuildMart', color: '#6366F1', onPress: () => {} },
              { icon: 'document-text-outline' as const, label: 'Terms & Privacy', color: '#6B7280', onPress: () => {} },
            ].map((item, i, arr) => (
              <Pressable
                key={item.label}
                style={[s.row, i < arr.length - 1 && s.rowBorder]}
                onPress={item.onPress}
              >
                <View style={[s.rowIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={s.rowLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <Text style={s.sectionLabel}>ACCOUNT</Text>
          <View style={s.sectionCard}>
            <Pressable style={[s.row, s.rowBorder]} onPress={handleLogout}>
              <View style={[s.rowIcon, { backgroundColor: '#EF444418' }]}>
                <Ionicons name="log-out-outline" size={18} color={T.error} />
              </View>
              <Text style={[s.rowLabel, s.dangerText]}>Logout</Text>
              <Ionicons name="chevron-forward" size={18} color={T.error} />
            </Pressable>
            <Pressable style={s.row}>
              <View style={[s.rowIcon, { backgroundColor: '#EF444418' }]}>
                <Ionicons name="trash-outline" size={18} color={T.error} />
              </View>
              <Text style={[s.rowLabel, s.dangerText]}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={18} color={T.error} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Version */}
        <Text style={s.version}>BuildMart v1.0.0 · Hyderabad</Text>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal
        visible={langModal}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Select Language</Text>
            <Text style={s.modalSub}>Choose your preferred language</Text>

            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                style={[s.langOption, language === lang.code && s.langOptionActive]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={s.langFlag}>{lang.flag}</Text>
                <View style={s.langInfo}>
                  <Text style={[s.langLabel, language === lang.code && s.langLabelActive]}>
                    {lang.label}
                  </Text>
                  <Text style={s.langNative}>{lang.native}</Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={22} color={T.success} />
                )}
              </Pressable>
            ))}

            <Pressable style={s.modalCancel} onPress={() => setLangModal(false)}>
              <Text style={s.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {!!toast && (
        <View style={s.toast}>
          <Ionicons name="checkmark-circle" size={18} color={T.white} />
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  scroll: { padding: 16, paddingBottom: 60, gap: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: T.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
  },
  rowValue: {
    fontSize: 14,
    color: T.textSecondary,
    marginRight: 4,
  },
  lockBadge: {
    backgroundColor: T.bg,
    borderRadius: 6,
    padding: 4,
  },
  dangerText: { color: T.error },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: T.textMuted,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: T.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 44,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: T.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: T.text, marginBottom: 4 },
  modalSub: { fontSize: 14, color: T.textSecondary, marginBottom: 20 },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: T.bg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langOptionActive: {
    borderColor: T.success,
    backgroundColor: '#10B98108',
  },
  langFlag: { fontSize: 26 },
  langInfo: { flex: 1 },
  langLabel: { fontSize: 16, fontWeight: '700', color: T.text },
  langLabelActive: { color: T.success },
  langNative: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  modalCancel: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: T.bg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: T.textSecondary },
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 32,
    right: 32,
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: { fontSize: 14, fontWeight: '700', color: T.white, flex: 1 },
});
