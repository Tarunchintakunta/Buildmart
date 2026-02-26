import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const VEHICLE = {
  type: 'Mini Truck',
  registration: 'KA01AB1234',
  color: 'White',
  year: '2022',
  model: 'Tata Ace Gold',
};

type DocStatus = 'valid' | 'expiring' | 'expired';

type Document = {
  id: string;
  name: string;
  number: string;
  expiry: string;
  status: DocStatus;
  icon: keyof typeof Ionicons.glyphMap;
};

const DOCUMENTS: Document[] = [
  { id: '1', name: 'RC Book', number: 'KA01AB1234', expiry: '15 Mar 2028', status: 'valid', icon: 'document-text-outline' },
  { id: '2', name: 'Insurance', number: 'INS-2024-78234', expiry: '10 Mar 2026', status: 'expiring', icon: 'shield-checkmark-outline' },
  { id: '3', name: 'Permit', number: 'PER-KA-45621', expiry: '22 Dec 2027', status: 'valid', icon: 'card-outline' },
  { id: '4', name: 'PUC Certificate', number: 'PUC-2025-11234', expiry: '05 Jan 2026', status: 'expired', icon: 'leaf-outline' },
];

const MAINTENANCE = {
  lastService: '15 Jan 2026',
  nextService: '15 Apr 2026',
  odometer: '24,580 km',
};

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string }> = {
  valid: { label: 'Valid', color: T.success, bg: '#F0FDF4' },
  expiring: { label: 'Expiring Soon', color: T.amber, bg: '#FEF3C7' },
  expired: { label: 'Expired', color: '#EF4444', bg: '#FEF2F2' },
};

export default function VehicleManagementScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Vehicle</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Vehicle Card */}
        <View style={s.vehicleCard}>
          <View style={s.vehicleIconCircle}>
            <Ionicons name="car" size={36} color={T.white} />
          </View>
          <Text style={s.vehicleModel}>{VEHICLE.model}</Text>
          <Text style={s.vehicleType}>{VEHICLE.type}</Text>
          <View style={s.vehicleDetails}>
            <View style={s.vehicleDetailItem}>
              <Text style={s.vehicleDetailLabel}>Registration</Text>
              <Text style={s.vehicleDetailValue}>{VEHICLE.registration}</Text>
            </View>
            <View style={s.vehicleDetailDivider} />
            <View style={s.vehicleDetailItem}>
              <Text style={s.vehicleDetailLabel}>Color</Text>
              <Text style={s.vehicleDetailValue}>{VEHICLE.color}</Text>
            </View>
            <View style={s.vehicleDetailDivider} />
            <View style={s.vehicleDetailItem}>
              <Text style={s.vehicleDetailLabel}>Year</Text>
              <Text style={s.vehicleDetailValue}>{VEHICLE.year}</Text>
            </View>
          </View>
        </View>

        {/* Documents Section */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Documents</Text>
        </View>

        {DOCUMENTS.map((doc) => {
          const statusConfig = STATUS_CONFIG[doc.status];
          return (
            <View key={doc.id} style={s.docCard}>
              <View style={s.docLeft}>
                <View style={s.docIconBox}>
                  <Ionicons name={doc.icon} size={20} color={T.navy} />
                </View>
                <View style={s.docInfo}>
                  <View style={s.docTopRow}>
                    <Text style={s.docName}>{doc.name}</Text>
                    <View style={[s.statusBadge, { backgroundColor: statusConfig.bg }]}>
                      <Text style={[s.statusBadgeText, { color: statusConfig.color }]}>
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.docNumber}>{doc.number}</Text>
                  <Text style={s.docExpiry}>Expires: {doc.expiry}</Text>
                </View>
              </View>
              <TouchableOpacity style={s.uploadBtn}>
                <Ionicons name="cloud-upload-outline" size={16} color={T.amber} />
                <Text style={s.uploadBtnText}>Upload</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Maintenance Section */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Maintenance</Text>
        </View>

        <View style={s.maintenanceCard}>
          <View style={s.maintenanceRow}>
            <View style={s.maintenanceItem}>
              <Ionicons name="construct-outline" size={18} color={T.info} />
              <Text style={s.maintenanceLabel}>Last Service</Text>
              <Text style={s.maintenanceValue}>{MAINTENANCE.lastService}</Text>
            </View>
            <View style={s.maintenanceItem}>
              <Ionicons name="calendar-outline" size={18} color={T.amber} />
              <Text style={s.maintenanceLabel}>Next Service Due</Text>
              <Text style={s.maintenanceValue}>{MAINTENANCE.nextService}</Text>
            </View>
          </View>
          <View style={s.odometerRow}>
            <Ionicons name="speedometer-outline" size={18} color={T.navy} />
            <View style={s.odometerInfo}>
              <Text style={s.maintenanceLabel}>Odometer Reading</Text>
              <Text style={s.maintenanceValue}>{MAINTENANCE.odometer}</Text>
            </View>
          </View>
        </View>

        {/* Update Details Button */}
        <TouchableOpacity style={s.updateBtn}>
          <Ionicons name="create-outline" size={18} color={T.white} />
          <Text style={s.updateBtnText}>Update Details</Text>
        </TouchableOpacity>
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
    paddingVertical: 10,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
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
  vehicleCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  vehicleIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.navy,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  vehicleModel: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: 14,
    color: T.textSecondary,
    marginBottom: 20,
  },
  vehicleDetails: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    width: '100%' as const,
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingVertical: 14,
  },
  vehicleDetailItem: {
    flex: 1,
    alignItems: 'center' as const,
  },
  vehicleDetailLabel: {
    fontSize: 11,
    color: T.textMuted,
    marginBottom: 4,
  },
  vehicleDetailValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  vehicleDetailDivider: {
    width: 1,
    height: 30,
    backgroundColor: T.border,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  docCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  docLeft: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    flex: 1,
  },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docTopRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 4,
  },
  docName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  docNumber: {
    fontSize: 12,
    color: T.textSecondary,
    marginBottom: 2,
  },
  docExpiry: {
    fontSize: 11,
    color: T.textMuted,
  },
  uploadBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.amber,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.amber,
  },
  maintenanceCard: {
    marginHorizontal: 16,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  maintenanceRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 14,
  },
  maintenanceItem: {
    flex: 1,
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  maintenanceLabel: {
    fontSize: 12,
    color: T.textMuted,
  },
  maintenanceValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
  },
  odometerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  odometerInfo: {
    gap: 4,
  },
  updateBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
