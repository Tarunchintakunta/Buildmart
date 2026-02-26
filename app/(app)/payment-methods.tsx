import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type PaymentMethod = {
  id: string;
  type: 'upi' | 'bank' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
};

const INITIAL_METHODS: PaymentMethod[] = [
  { id: '1', type: 'upi', name: 'PhonePe', details: 'user@ybl', isDefault: true },
  { id: '2', type: 'upi', name: 'Google Pay', details: 'user@okicici', isDefault: false },
  { id: '3', type: 'bank', name: 'SBI Savings', details: 'Account ending 4567', isDefault: false },
  { id: '4', type: 'wallet', name: 'Wallet Balance', details: 'Rs.25,000', isDefault: false },
];

const TYPE_CONFIG = {
  upi: { icon: 'phone-portrait-outline' as const, color: '#10B981', bg: '#D1FAE5' },
  bank: { icon: 'business-outline' as const, color: '#3B82F6', bg: '#DBEAFE' },
  wallet: { icon: 'wallet-outline' as const, color: '#F2960D', bg: '#FEF3C7' },
};

const ADD_OPTIONS = [
  { icon: 'phone-portrait-outline' as const, label: 'Add UPI ID', sub: 'Pay using any UPI app' },
  { icon: 'business-outline' as const, label: 'Link Bank Account', sub: 'Direct bank transfer' },
  { icon: 'card-outline' as const, label: 'Add Card', sub: 'Credit or debit card' },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleRemove = (id: string) => {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault) {
      Alert.alert('Cannot Remove', 'Please set another method as default first.');
      return;
    }
    Alert.alert('Remove', `Remove ${method?.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setMethods((prev) => prev.filter((m) => m.id !== id)) },
    ]);
  };

  const handleAddOption = (label: string) => {
    // TODO: Navigate to respective add flow
    Alert.alert('Coming Soon', `${label} will be available soon.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Payment Methods</Text>
        <TouchableOpacity style={s.addHeaderBtn}>
          <Ionicons name="add" size={20} color={T.info} />
          <Text style={s.addHeaderText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Payment Method Cards */}
        {methods.map((method) => {
          const config = TYPE_CONFIG[method.type];
          return (
            <View key={method.id} style={s.card}>
              <View style={s.cardTop}>
                {/* Icon Circle */}
                <View style={[s.iconCircle, { backgroundColor: config.bg }]}>
                  <Ionicons name={config.icon} size={20} color={config.color} />
                </View>

                {/* Info */}
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={s.nameRow}>
                    <Text style={s.methodName}>{method.name}</Text>
                    {method.isDefault && (
                      <View style={s.defaultBadge}>
                        <Text style={s.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.methodDetails}>{method.details}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={s.cardActions}>
                {!method.isDefault && (
                  <TouchableOpacity
                    style={s.actionBtn}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color={T.info} />
                    <Text style={s.actionSetDefault}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={s.actionBtn}
                  onPress={() => handleRemove(method.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={s.actionRemove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Add Payment Method Section */}
        <Text style={s.sectionTitle}>Add Payment Method</Text>
        {ADD_OPTIONS.map((opt, idx) => (
          <TouchableOpacity
            key={opt.label}
            style={[s.addCard, idx === ADD_OPTIONS.length - 1 && { marginBottom: 0 }]}
            onPress={() => handleAddOption(opt.label)}
          >
            <View style={s.addCardLeft}>
              <View style={s.addIconCircle}>
                <Ionicons name={opt.icon} size={20} color={T.navy} />
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={s.addLabel}>{opt.label}</Text>
                <Text style={s.addSub}>{opt.sub}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={T.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  addHeaderBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#EFF6FF' },
  addHeaderText: { fontSize: 14, fontWeight: '600' as const, color: T.info },
  card: { backgroundColor: T.surface, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row' as const, alignItems: 'center' as const },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center' as const, alignItems: 'center' as const },
  nameRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  methodName: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  methodDetails: { fontSize: 13, color: T.textSecondary, marginTop: 2 },
  defaultBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  defaultBadgeText: { fontSize: 10, fontWeight: '700' as const, color: '#10B981', letterSpacing: 0.5 },
  cardActions: { flexDirection: 'row' as const, gap: 16, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: T.border },
  actionBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 },
  actionSetDefault: { fontSize: 13, fontWeight: '600' as const, color: T.info },
  actionRemove: { fontSize: 13, fontWeight: '600' as const, color: '#EF4444' },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, color: T.text, marginTop: 24, marginBottom: 14 },
  addCard: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, backgroundColor: T.surface, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 10 },
  addCardLeft: { flexDirection: 'row' as const, alignItems: 'center' as const },
  addIconCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: T.bg, justifyContent: 'center' as const, alignItems: 'center' as const },
  addLabel: { fontSize: 15, fontWeight: '600' as const, color: T.text },
  addSub: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
};
