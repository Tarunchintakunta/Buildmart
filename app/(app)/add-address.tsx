import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const LABEL_OPTIONS = ['Home', 'Office', 'Site'] as const;

export default function AddAddressScreen() {
  const router = useRouter();
  const [label, setLabel] = useState<string>('Home');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    // TODO: Save address logic
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Add Address</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Label Selection */}
        <Text style={s.fieldLabel}>Label</Text>
        <View style={s.pillRow}>
          {LABEL_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[s.pill, label === opt ? s.pillActive : s.pillInactive]}
              onPress={() => setLabel(opt)}
            >
              <Ionicons
                name={opt === 'Home' ? 'home-outline' : opt === 'Office' ? 'business-outline' : 'construct-outline'}
                size={16}
                color={label === opt ? T.white : T.textSecondary}
              />
              <Text style={[s.pillText, label === opt ? s.pillTextActive : s.pillTextInactive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Full Address */}
        <Text style={s.fieldLabel}>Full Address</Text>
        <TextInput
          style={[s.input, s.inputMultiline]}
          placeholder="Enter your full address"
          placeholderTextColor={T.textMuted}
          value={fullAddress}
          onChangeText={setFullAddress}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Landmark */}
        <Text style={s.fieldLabel}>Landmark</Text>
        <TextInput
          style={s.input}
          placeholder="Nearby landmark (optional)"
          placeholderTextColor={T.textMuted}
          value={landmark}
          onChangeText={setLandmark}
        />

        {/* City */}
        <Text style={s.fieldLabel}>City</Text>
        <TextInput
          style={s.input}
          placeholder="Enter city"
          placeholderTextColor={T.textMuted}
          value={city}
          onChangeText={setCity}
        />

        {/* State */}
        <Text style={s.fieldLabel}>State</Text>
        <TextInput
          style={s.input}
          placeholder="Enter state"
          placeholderTextColor={T.textMuted}
          value={state}
          onChangeText={setState}
        />

        {/* PIN Code */}
        <Text style={s.fieldLabel}>PIN Code</Text>
        <TextInput
          style={s.input}
          placeholder="Enter 6-digit PIN code"
          placeholderTextColor={T.textMuted}
          value={pinCode}
          onChangeText={setPinCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        {/* Use Current Location */}
        <TouchableOpacity style={s.locationBtn}>
          <Ionicons name="locate-outline" size={20} color={T.info} />
          <Text style={s.locationText}>Use Current Location</Text>
        </TouchableOpacity>

        {/* Set as Default */}
        <View style={s.defaultRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.defaultLabel}>Set as Default</Text>
            <Text style={s.defaultSub}>Use this address for all deliveries</Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: T.border, true: T.amber }}
            thumbColor={T.white}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
          <Text style={s.saveBtnText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  fieldLabel: { fontSize: 14, fontWeight: '600' as const, color: T.text, marginBottom: 8, marginTop: 18 },
  pillRow: { flexDirection: 'row' as const, gap: 10 },
  pill: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  pillActive: { backgroundColor: T.navy, borderColor: T.navy },
  pillInactive: { backgroundColor: T.bg, borderColor: T.border },
  pillText: { fontSize: 14, fontWeight: '600' as const },
  pillTextActive: { color: T.white },
  pillTextInactive: { color: T.textSecondary },
  input: { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: T.text },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' as const },
  locationBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, backgroundColor: '#EFF6FF', borderRadius: 12, paddingVertical: 14, marginTop: 20, borderWidth: 1, borderColor: '#DBEAFE' },
  locationText: { fontSize: 15, fontWeight: '600' as const, color: T.info },
  defaultRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginTop: 20 },
  defaultLabel: { fontSize: 15, fontWeight: '600' as const, color: T.text },
  defaultSub: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
  bottomBar: { backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border, padding: 16 },
  saveBtn: { backgroundColor: T.amber, borderRadius: 14, paddingVertical: 16, alignItems: 'center' as const, justifyContent: 'center' as const, shadowColor: T.amber, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  saveBtnText: { fontSize: 16, fontWeight: '700' as const, color: T.white },
};
