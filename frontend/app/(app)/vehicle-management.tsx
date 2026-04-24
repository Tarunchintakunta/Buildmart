import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

const VEHICLE = {
  type: 'Mini Truck',
  registration: 'TS09AB4521',
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
  { id: '1', name: 'RC Book',          number: 'TS09AB4521',    expiry: '15 Mar 2028', status: 'valid',    icon: 'document-text-outline' },
  { id: '2', name: 'Insurance',        number: 'INS-2024-78234', expiry: '10 Mar 2026', status: 'expiring', icon: 'shield-checkmark-outline' },
  { id: '3', name: 'Permit',           number: 'PER-TS-45621',  expiry: '22 Dec 2027', status: 'valid',    icon: 'card-outline' },
  { id: '4', name: 'PUC Certificate',  number: 'PUC-2025-1123', expiry: '05 Jan 2026', status: 'expired',  icon: 'leaf-outline' },
];

const MAINTENANCE = {
  lastService: '15 Jan 2026',
  nextService: '15 Apr 2026',
  odometer: '24,580 km',
};

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string }> = {
  valid:    { label: 'Valid',         color: T.success, bg: '#DCFCE7' },
  expiring: { label: 'Expiring Soon', color: T.amber,   bg: '#FEF3C7' },
  expired:  { label: 'Expired',       color: '#EF4444', bg: '#FEE2E2' },
};

export default function VehicleManagementScreen() {
  const router = useRouter();
  const [docs] = useState(DOCUMENTS);

  const handleUpload = (docName: string) => {
    Alert.alert(`Upload ${docName}`, 'Choose a method to upload your document.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Camera', onPress: () => Alert.alert('✅ Uploaded', `${docName} uploaded successfully!`) },
      { text: 'Gallery', onPress: () => Alert.alert('✅ Uploaded', `${docName} uploaded successfully!`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(280)}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={styles.headerTitle}>My Vehicle</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Vehicle Hero Card */}
        <Animated.View style={styles.vehicleCard} entering={FadeInDown.delay(60).springify().damping(18)}>
          <Animated.View style={styles.vehicleIconCircle} entering={ZoomIn.delay(140).springify().damping(14)}>
            <Ionicons name="car" size={36} color={T.white} />
          </Animated.View>
          <Text style={styles.vehicleModel}>{VEHICLE.model}</Text>
          <Text style={styles.vehicleType}>{VEHICLE.type}</Text>
          <View style={styles.vehicleDetailsRow}>
            <View style={styles.vehicleDetailItem}>
              <Text style={styles.vehicleDetailLabel}>Reg. No.</Text>
              <Text style={styles.vehicleDetailValue}>{VEHICLE.registration}</Text>
            </View>
            <View style={styles.vehicleDetailDivider} />
            <View style={styles.vehicleDetailItem}>
              <Text style={styles.vehicleDetailLabel}>Color</Text>
              <Text style={styles.vehicleDetailValue}>{VEHICLE.color}</Text>
            </View>
            <View style={styles.vehicleDetailDivider} />
            <View style={styles.vehicleDetailItem}>
              <Text style={styles.vehicleDetailLabel}>Year</Text>
              <Text style={styles.vehicleDetailValue}>{VEHICLE.year}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Documents */}
        <Animated.Text style={styles.sectionLabel} entering={FadeInDown.delay(200)}>
          DOCUMENTS
        </Animated.Text>
        {docs.map((doc, i) => {
          const cfg = STATUS_CONFIG[doc.status];
          return (
            <Animated.View
              key={doc.id}
              style={styles.docCard}
              entering={FadeInLeft.delay(220 + i * 70).springify().damping(18).stiffness(180)}
            >
              <View style={styles.docIconBox}>
                <Ionicons name={doc.icon} size={20} color={T.navy} />
              </View>
              <View style={styles.docInfo}>
                <View style={styles.docTopRow}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: cfg.color }]}>
                      {cfg.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.docNumber}>{doc.number}</Text>
                <Text style={styles.docExpiry}>Expires: {doc.expiry}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.7 }]}
                onPress={() => handleUpload(doc.name)}
              >
                <Ionicons name="cloud-upload-outline" size={14} color={T.amber} />
                <Text style={styles.uploadBtnText}>Upload</Text>
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Maintenance */}
        <Animated.Text style={[styles.sectionLabel, { marginTop: 16 }]} entering={FadeInDown.delay(480)}>
          MAINTENANCE
        </Animated.Text>
        <Animated.View style={styles.maintenanceCard} entering={FadeInDown.delay(500).springify().damping(18)}>
          <View style={styles.maintenanceRow}>
            <View style={styles.maintenanceItem}>
              <Ionicons name="construct-outline" size={18} color={T.info} />
              <Text style={styles.maintenanceLabel}>Last Service</Text>
              <Text style={styles.maintenanceValue}>{MAINTENANCE.lastService}</Text>
            </View>
            <View style={styles.maintenanceItem}>
              <Ionicons name="calendar-outline" size={18} color={T.amber} />
              <Text style={styles.maintenanceLabel}>Next Service Due</Text>
              <Text style={styles.maintenanceValue}>{MAINTENANCE.nextService}</Text>
            </View>
          </View>
          <View style={styles.odometerRow}>
            <Ionicons name="speedometer-outline" size={20} color={T.navy} />
            <View style={{ gap: 2 }}>
              <Text style={styles.maintenanceLabel}>Odometer Reading</Text>
              <Text style={styles.maintenanceValue}>{MAINTENANCE.odometer}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Update Button */}
        <Animated.View entering={FadeInDown.delay(560).springify()}>
          <Pressable
            style={({ pressed }) => [styles.updateBtn, pressed && { opacity: 0.85 }]}
            onPress={() => Alert.alert('Update Details', 'Vehicle details updated successfully!')}
          >
            <Ionicons name="create-outline" size={18} color={T.white} />
            <Text style={styles.updateBtnText}>Update Details</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  scroll: { padding: 16, paddingBottom: 48 },
  vehicleCard: {
    backgroundColor: T.surface, borderRadius: 16, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: T.border, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  vehicleIconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: T.navy,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: T.navy, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  vehicleModel: { fontSize: 20, fontWeight: '800', color: T.text, marginBottom: 2 },
  vehicleType: { fontSize: 14, color: T.textSecondary, marginBottom: 20 },
  vehicleDetailsRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    backgroundColor: T.bg, borderRadius: 12, paddingVertical: 14,
  },
  vehicleDetailItem: { flex: 1, alignItems: 'center' },
  vehicleDetailLabel: { fontSize: 11, color: T.textMuted, marginBottom: 4 },
  vehicleDetailValue: { fontSize: 13, fontWeight: '700', color: T.text },
  vehicleDetailDivider: { width: 1, height: 28, backgroundColor: T.border },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: T.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 2,
  },
  docCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.surface, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 10, gap: 12,
  },
  docIconBox: {
    width: 42, height: 42, borderRadius: 11, backgroundColor: T.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  docInfo: { flex: 1 },
  docTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  docName: { fontSize: 14, fontWeight: '700', color: T.text, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  docNumber: { fontSize: 12, color: T.textSecondary, marginBottom: 2 },
  docExpiry: { fontSize: 11, color: T.textMuted },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: T.amber,
  },
  uploadBtnText: { fontSize: 12, fontWeight: '600', color: T.amber },
  maintenanceCard: {
    backgroundColor: T.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: T.border, marginBottom: 16,
  },
  maintenanceRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  maintenanceItem: {
    flex: 1, backgroundColor: T.bg, borderRadius: 12, padding: 14, gap: 6,
  },
  maintenanceLabel: { fontSize: 12, color: T.textMuted },
  maintenanceValue: { fontSize: 15, fontWeight: '700', color: T.text },
  odometerRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.bg, borderRadius: 12, padding: 14, gap: 12,
  },
  updateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: T.amber, borderRadius: 14, paddingVertical: 16, gap: 8,
    shadowColor: T.amber, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  updateBtnText: { fontSize: 16, fontWeight: '700', color: T.white },
});
