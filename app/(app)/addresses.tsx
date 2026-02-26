import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

interface Address {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    fullAddress: '42, Rajendra Nagar, Sector 5, Near City Mall',
    city: 'Hyderabad',
    pincode: '500081',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    fullAddress: '3rd Floor, Skyline Towers, HITEC City Road',
    city: 'Hyderabad',
    pincode: '500032',
    isDefault: false,
  },
  {
    id: '3',
    label: 'Site',
    fullAddress: 'Plot 17, Green Valley Layout, Kompally',
    city: 'Secunderabad',
    pincode: '500014',
    isDefault: false,
  },
];

const LABEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Office: 'business-outline',
  Site: 'construct-outline',
};

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to remove this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)),
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Addresses</Text>
        <TouchableOpacity
          style={s.addButton}
          onPress={() => router.push('/(app)/add-address')}
        >
          <Ionicons name="add" size={18} color={T.white} />
          <Text style={s.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Cards */}
        {addresses.map((address) => (
          <View key={address.id} style={s.card}>
            {/* Top Row: Label + Default Badge */}
            <View style={s.cardTopRow}>
              <View style={s.labelBadge}>
                <Ionicons
                  name={LABEL_ICONS[address.label] || 'location-outline'}
                  size={14}
                  color={T.amber}
                />
                <Text style={s.labelText}>{address.label}</Text>
              </View>
              {address.isDefault && (
                <View style={s.defaultBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  <Text style={s.defaultText}>Default</Text>
                </View>
              )}
            </View>

            {/* Address Details */}
            <Text style={s.fullAddress}>{address.fullAddress}</Text>
            <Text style={s.cityPin}>
              {address.city} - {address.pincode}
            </Text>

            {/* Action Buttons */}
            <View style={s.actionRow}>
              {!address.isDefault && (
                <TouchableOpacity
                  style={s.setDefaultButton}
                  onPress={() => handleSetDefault(address.id)}
                >
                  <Ionicons name="flag-outline" size={15} color={T.textSecondary} />
                  <Text style={s.setDefaultText}>Set Default</Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={s.editButton}
                onPress={() => {
                  // Navigate to edit screen (placeholder)
                }}
              >
                <Ionicons name="create-outline" size={16} color={T.info} />
                <Text style={s.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.deleteButton}
                onPress={() => handleDelete(address.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={s.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add New Address Card */}
        <TouchableOpacity
          style={s.addCard}
          onPress={() => router.push('/(app)/add-address')}
          activeOpacity={0.7}
        >
          <View style={s.addCardIcon}>
            <Ionicons name="add-circle-outline" size={32} color={T.textMuted} />
          </View>
          <Text style={s.addCardTitle}>Add New Address</Text>
          <Text style={s.addCardSubtitle}>
            Save a new delivery or site address
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800' as const,
    color: T.navy,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amber,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  labelBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.amberBg,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.amber,
    textTransform: 'uppercase' as const,
  },
  defaultBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  fullAddress: {
    fontSize: 14,
    color: T.textSecondary,
    lineHeight: 21,
    marginBottom: 4,
  },
  cityPin: {
    fontSize: 13,
    color: T.textMuted,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingTop: 12,
    gap: 16,
  },
  setDefaultButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  setDefaultText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  editButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.info,
  },
  deleteButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  addCard: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: 'dashed' as const,
    padding: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  addCardIcon: {
    marginBottom: 12,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  addCardSubtitle: {
    fontSize: 13,
    color: T.textSecondary,
    textAlign: 'center' as const,
  },
};
