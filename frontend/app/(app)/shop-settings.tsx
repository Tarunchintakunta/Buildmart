import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

const SPRING_SNAPPY = { damping: 18, stiffness: 280, mass: 0.8 };

export default function ShopSettingsScreen() {
  const router = useRouter();

  const [shopName, setShopName] = useState('Hyderabad Building Supplies');
  const [gstNumber, setGstNumber] = useState('36AABCH1234A1Z5');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('Plot 45, KPHB Colony Phase 1, Kukatpally, Hyderabad – 500072');
  const [openingHours, setOpeningHours] = useState('9:00 AM – 8:00 PM');
  const [whatsapp, setWhatsapp] = useState('9876543210');
  const [monSatOpen, setMonSatOpen] = useState(true);
  const [acceptOnlineOrders, setAcceptOnlineOrders] = useState(true);
  const [deliveryRadius, setDeliveryRadius] = useState(5);

  const handleSave = () => {
    if (!shopName.trim()) {
      Alert.alert('Error', 'Shop name is required.');
      return;
    }
    Alert.alert('Saved!', 'Your shop settings have been updated successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const cycleDeliveryRadius = () => {
    const options = [3, 5, 10, 15, 20];
    const current = options.indexOf(deliveryRadius);
    setDeliveryRadius(options[(current + 1) % options.length]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Shop Settings</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Shop Avatar */}
        <Animated.View
          entering={ZoomIn.delay(100).springify().damping(SPRING_SNAPPY.damping).stiffness(SPRING_SNAPPY.stiffness)}
          style={s.avatarSection}
        >
          <View style={s.avatarCircle}>
            <Text style={s.avatarLetter}>H</Text>
          </View>
          <Pressable
            style={({ pressed }) => [s.changePhotoBtn, pressed && { opacity: 0.8 }]}
          >
            <Ionicons name="camera" size={14} color={T.amber} />
            <Text style={s.changePhotoText}>Change Logo</Text>
          </Pressable>
          <Text style={s.avatarShopName}>{shopName}</Text>
        </Animated.View>

        {/* Basic Info Section */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={s.formSection}>
          <Text style={s.sectionLabel}>SHOP DETAILS</Text>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Shop Name</Text>
            <TextInput
              style={s.input}
              value={shopName}
              onChangeText={setShopName}
              placeholder="Enter shop name"
              placeholderTextColor={T.textMuted}
            />
            <View style={s.inputUnderline} />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>GST Number</Text>
            <TextInput
              style={s.input}
              value={gstNumber}
              onChangeText={setGstNumber}
              placeholder="22AAAAA0000A1Z5"
              placeholderTextColor={T.textMuted}
              autoCapitalize="characters"
            />
            <View style={s.inputUnderline} />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Phone Number</Text>
            <TextInput
              style={s.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={T.textMuted}
              keyboardType="phone-pad"
            />
            <View style={s.inputUnderline} />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>WhatsApp Number</Text>
            <TextInput
              style={s.input}
              value={whatsapp}
              onChangeText={setWhatsapp}
              placeholder="Enter WhatsApp number"
              placeholderTextColor={T.textMuted}
              keyboardType="phone-pad"
            />
            <View style={s.inputUnderline} />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Shop Address</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter full address"
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={s.inputUnderline} />
          </View>
        </Animated.View>

        {/* Operating Hours Section */}
        <Animated.View entering={FadeInDown.delay(240).springify()} style={s.formSection}>
          <Text style={s.sectionLabel}>OPERATING HOURS</Text>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Hours</Text>
            <TextInput
              style={s.input}
              value={openingHours}
              onChangeText={setOpeningHours}
              placeholder="e.g. 9:00 AM – 8:00 PM"
              placeholderTextColor={T.textMuted}
            />
            <View style={s.inputUnderline} />
          </View>

          <View style={s.switchRow}>
            <View style={s.switchLeft}>
              <Text style={s.switchLabel}>Mon–Sat Open</Text>
              <Text style={s.switchSub}>Toggle Mon–Sat schedule</Text>
            </View>
            <Switch
              value={monSatOpen}
              onValueChange={setMonSatOpen}
              trackColor={{ false: T.border, true: T.success }}
              thumbColor={T.white}
            />
          </View>
        </Animated.View>

        {/* Order Settings Section */}
        <Animated.View entering={FadeInDown.delay(320).springify()} style={s.formSection}>
          <Text style={s.sectionLabel}>ORDER SETTINGS</Text>

          <View style={s.switchRow}>
            <View style={s.switchLeft}>
              <Text style={s.switchLabel}>Accept Online Orders</Text>
              <Text style={s.switchSub}>Customers can place orders online</Text>
            </View>
            <Switch
              value={acceptOnlineOrders}
              onValueChange={setAcceptOnlineOrders}
              trackColor={{ false: T.border, true: T.success }}
              thumbColor={T.white}
            />
          </View>

          <View style={s.deliveryRadiusRow}>
            <View style={s.switchLeft}>
              <Text style={s.switchLabel}>Delivery Radius</Text>
              <Text style={s.switchSub}>Tap to cycle between options</Text>
            </View>
            <Pressable
              style={({ pressed }) => [s.radiusBadge, pressed && { opacity: 0.8 }]}
              onPress={cycleDeliveryRadius}
            >
              <Text style={s.radiusValue}>{deliveryRadius} km</Text>
              <Ionicons name="chevron-forward" size={14} color={T.amber} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={s.saveSection}>
          <Pressable
            style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.88 }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={20} color={T.white} />
            <Text style={s.saveBtnText}>Save Changes</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.navy,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: T.amberBg,
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: T.white,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.amber,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.amber,
  },
  avatarShopName: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
    marginTop: 4,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 16,
    marginLeft: 2,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSecondary,
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    color: T.text,
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  inputMultiline: {
    minHeight: 64,
    lineHeight: 22,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: T.navy,
    marginTop: 4,
    opacity: 0.25,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    marginBottom: 4,
  },
  switchLeft: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
  },
  switchSub: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
  },
  deliveryRadiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  radiusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.amberBg,
    borderWidth: 1,
    borderColor: T.amber,
  },
  radiusValue: {
    fontSize: 14,
    fontWeight: '700',
    color: T.amber,
  },
  saveSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.white,
  },
});
