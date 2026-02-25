import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams<{ orderId?: string; total?: string }>();

  const orderNumber = orderId || 'BM-99283';
  const orderTotal = total || '24,839';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ width: 42 }} />
        <Text style={s.headerTitle}>Order Confirmed</Text>
        <TouchableOpacity
          onPress={() => router.replace('/(app)/(tabs)')}
          style={s.closeBtn}
        >
          <Ionicons name="close" size={22} color={T.text} />
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        {/* Success Animation Area */}
        <View style={s.iconArea}>
          <View style={s.outerRing}>
            <View style={s.innerRing}>
              <Ionicons name="checkmark-circle" size={64} color={T.success} />
            </View>
          </View>
          <View style={s.sparkle1}>
            <Ionicons name="star" size={16} color={T.amber} />
          </View>
          <View style={s.sparkle2}>
            <Ionicons name="flash" size={14} color={T.amber} />
          </View>
          <View style={s.sparkle3}>
            <Ionicons name="sparkles" size={18} color={T.amber} />
          </View>
        </View>

        <Text style={s.title}>Order Successful!</Text>
        <Text style={s.subtitle}>Your construction materials are being prepared for delivery.</Text>

        {/* Order Info Card */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <View style={s.infoItem}>
              <Ionicons name="receipt-outline" size={18} color={T.textMuted} />
              <View>
                <Text style={s.infoLabel}>Order ID</Text>
                <Text style={s.infoValue}>#{orderNumber}</Text>
              </View>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoItem}>
              <Ionicons name="car-outline" size={18} color={T.info} />
              <View>
                <Text style={s.infoLabel}>Est. Delivery</Text>
                <Text style={s.infoValue}>45-60 mins</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={s.detailsCard}>
          <View style={s.detailRow}>
            <Ionicons name="cube-outline" size={16} color={T.textMuted} />
            <Text style={s.detailText}>12x Premium Cement Bags</Text>
          </View>
          <View style={s.detailRow}>
            <Ionicons name="location-outline" size={16} color={T.textMuted} />
            <Text style={s.detailText}>42 Build Lane, Sector 7</Text>
          </View>
          <View style={s.detailRow}>
            <Ionicons name="wallet-outline" size={16} color={T.textMuted} />
            <Text style={s.detailText}>Total: Rs.{orderTotal}</Text>
          </View>
        </View>

        {/* Escrow Note */}
        <View style={s.escrowNote}>
          <Ionicons name="shield-checkmark" size={16} color={T.success} />
          <Text style={s.escrowText}>Payment held securely in escrow until delivery confirmation</Text>
        </View>

        {/* Action Buttons */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.trackBtn}
            onPress={() => router.replace(`/(app)/order-tracking?orderId=${orderNumber}` as any)}
          >
            <Ionicons name="navigate-outline" size={18} color={T.white} />
            <Text style={s.trackBtnText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.marketBtn}
            onPress={() => router.replace('/(app)/(tabs)')}
          >
            <Text style={s.marketBtnText}>Back to Marketplace</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  closeBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  content: { flex: 1, alignItems: 'center' as const, paddingHorizontal: 24, paddingTop: 40 },
  iconArea: { width: 140, height: 140, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: 24 },
  outerRing: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#D1FAE5', justifyContent: 'center' as const, alignItems: 'center' as const },
  innerRing: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#ECFDF5', justifyContent: 'center' as const, alignItems: 'center' as const },
  sparkle1: { position: 'absolute' as const, top: 10, right: 10 },
  sparkle2: { position: 'absolute' as const, top: 30, left: 5 },
  sparkle3: { position: 'absolute' as const, bottom: 15, right: 0 },
  title: { fontSize: 26, fontWeight: '800' as const, color: T.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: T.textSecondary, textAlign: 'center' as const, lineHeight: 22, marginBottom: 28 },
  infoCard: { width: '100%' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, marginBottom: 14 },
  infoRow: { flexDirection: 'row' as const, alignItems: 'center' as const },
  infoItem: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  infoLabel: { fontSize: 11, color: T.textMuted, fontWeight: '500' as const },
  infoValue: { fontSize: 15, fontWeight: '700' as const, color: T.text, marginTop: 2 },
  infoDivider: { width: 1, height: 36, backgroundColor: T.border, marginHorizontal: 12 },
  detailsCard: { width: '100%' as const, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 12, marginBottom: 14 },
  detailRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  detailText: { fontSize: 14, color: T.textSecondary, fontWeight: '500' as const },
  escrowNote: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, backgroundColor: '#D1FAE5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, width: '100%' as const, marginBottom: 28 },
  escrowText: { flex: 1, fontSize: 12, color: T.success, fontWeight: '600' as const, lineHeight: 17 },
  actions: { width: '100%' as const, gap: 12 },
  trackBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 16, gap: 8, shadowColor: T.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  trackBtnText: { fontSize: 16, fontWeight: '700' as const, color: T.white },
  marketBtn: { alignItems: 'center' as const, justifyContent: 'center' as const, borderRadius: 14, paddingVertical: 16, borderWidth: 2, borderColor: T.border },
  marketBtnText: { fontSize: 15, fontWeight: '700' as const, color: T.textSecondary },
};
