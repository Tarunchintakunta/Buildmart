import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type DaySchedule = {
  open: string;
  close: string;
  isOpen: boolean;
};

export default function ShopSettingsScreen() {
  const router = useRouter();

  const [shopName, setShopName] = useState('BuildMart Hardware Store');
  const [description, setDescription] = useState(
    'Your one-stop shop for all construction materials and hardware supplies.'
  );
  const [phone, setPhone] = useState('9876543401');
  const [email, setEmail] = useState('shop@buildmart.com');
  const [address, setAddress] = useState('123, MG Road, Koramangala, Bangalore - 560034');
  const [deliveryRadius, setDeliveryRadius] = useState('15');
  const [minOrder, setMinOrder] = useState('500');
  const [deliveryCharge, setDeliveryCharge] = useState('50');

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(
    DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          open: '09:00 AM',
          close: '09:00 PM',
          isOpen: day !== 'Sunday',
        },
      }),
      {} as Record<string, DaySchedule>
    )
  );

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const handleSave = () => {
    if (!shopName.trim()) {
      Alert.alert('Error', 'Shop name is required.');
      return;
    }
    Alert.alert('Success', 'Shop settings have been saved successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Shop Settings</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Shop Banner & Avatar */}
        <View style={s.bannerSection}>
          <View style={s.banner}>
            <Ionicons name="image-outline" size={32} color={T.textMuted} />
            <Text style={s.bannerText}>Shop Banner</Text>
          </View>
          <View style={s.avatarWrapper}>
            <View style={s.avatar}>
              <Ionicons name="storefront" size={32} color={T.navy} />
            </View>
            <TouchableOpacity style={s.cameraBtn}>
              <Ionicons name="camera" size={14} color={T.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop Details Section */}
        <View style={s.formContainer}>
          <Text style={s.sectionTitle}>SHOP DETAILS</Text>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Shop Name</Text>
            <TextInput
              style={s.input}
              value={shopName}
              onChangeText={setShopName}
              placeholder="Enter shop name"
              placeholderTextColor={T.textMuted}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Description</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your shop..."
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Phone</Text>
            <TextInput
              style={s.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={T.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={T.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Address</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter shop address"
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Opening Hours */}
          <Text style={[s.sectionTitle, { marginTop: 24 }]}>OPENING HOURS</Text>

          <View style={s.card}>
            {DAYS.map((day, index) => (
              <View
                key={day}
                style={[s.dayRow, index < DAYS.length - 1 && s.dayRowBorder]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.dayName}>{day}</Text>
                  {schedule[day].isOpen ? (
                    <Text style={s.dayTime}>
                      {schedule[day].open} - {schedule[day].close}
                    </Text>
                  ) : (
                    <Text style={[s.dayTime, { color: T.textMuted }]}>Closed</Text>
                  )}
                </View>
                <Switch
                  value={schedule[day].isOpen}
                  onValueChange={() => toggleDay(day)}
                  trackColor={{ false: T.border, true: T.success }}
                  thumbColor={T.white}
                />
              </View>
            ))}
          </View>

          {/* Delivery Settings */}
          <Text style={[s.sectionTitle, { marginTop: 24 }]}>DELIVERY SETTINGS</Text>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Delivery Radius (km)</Text>
            <TextInput
              style={s.input}
              value={deliveryRadius}
              onChangeText={setDeliveryRadius}
              placeholder="e.g. 15"
              placeholderTextColor={T.textMuted}
              keyboardType="number-pad"
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Minimum Order Amount (Rs.)</Text>
            <TextInput
              style={s.input}
              value={minOrder}
              onChangeText={setMinOrder}
              placeholder="e.g. 500"
              placeholderTextColor={T.textMuted}
              keyboardType="number-pad"
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>Delivery Charge (Rs.)</Text>
            <TextInput
              style={s.input}
              value={deliveryCharge}
              onChangeText={setDeliveryCharge}
              placeholder="e.g. 50"
              placeholderTextColor={T.textMuted}
              keyboardType="number-pad"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={s.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  bannerSection: {
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  banner: {
    width: '100%' as const,
    height: 140,
    backgroundColor: T.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  bannerText: {
    fontSize: 13,
    color: T.textMuted,
    marginTop: 6,
  },
  avatarWrapper: {
    marginTop: -40,
    position: 'relative' as const,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: T.surface,
  },
  cameraBtn: {
    position: 'absolute' as const,
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: T.surface,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: T.text,
  },
  inputMultiline: {
    minHeight: 90,
    paddingTop: 14,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden' as const,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dayRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  dayName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
  },
  dayTime: {
    fontSize: 13,
    color: T.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
