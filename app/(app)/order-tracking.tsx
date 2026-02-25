import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';
import { MiscImages } from '../../src/constants/images';

const T = LightTheme;

const TIMELINE = [
  { step: 'Order Placed', time: 'Oct 24, 2023 · 09:15 AM', status: 'completed' as const },
  { step: 'Processing', time: 'Oct 24, 2023 · 11:30 AM', status: 'completed' as const },
  { step: 'Out for Delivery', time: 'Expected today by 5:00 PM', status: 'active' as const },
  { step: 'Delivered', time: 'Pending delivery', status: 'pending' as const },
];

const DRIVER = {
  name: 'Marcus Wright',
  rating: 4.9,
  reviews: '1.2k',
  vehicle: 'Tata Ace Mini Truck',
};

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const orderNumber = orderId || 'BM-8821';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Track Order #{orderNumber}</Text>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={T.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Status Banner */}
        <View style={s.statusBanner}>
          <View style={s.statusLeft}>
            <View style={s.statusIconBox}>
              <Ionicons name="car" size={22} color={T.white} />
            </View>
            <View>
              <Text style={s.statusTitle}>Driver is near</Text>
              <Text style={s.statusSub}>Arriving in ~15 minutes</Text>
            </View>
          </View>
        </View>

        {/* Escrow Status */}
        <View style={s.escrowCard}>
          <View style={s.escrowHeader}>
            <Ionicons name="shield-checkmark" size={18} color={T.success} />
            <Text style={s.escrowTitle}>Status: In Escrow</Text>
          </View>
          <Text style={s.escrowDesc}>Payment secured until delivery confirmation</Text>
          <TouchableOpacity>
            <Text style={s.escrowLink}>View Transaction Details</Text>
          </TouchableOpacity>
        </View>

        {/* Map Placeholder */}
        <View style={s.mapArea}>
          <Image source={MiscImages.mapPlaceholder} style={{ width: '100%', height: '100%', borderRadius: 14 }} resizeMode="cover" />
          {/* Route indicator dots */}
          <View style={s.routeOverlay}>
            <View style={s.routeDot}>
              <Ionicons name="navigate" size={16} color={T.white} />
            </View>
            <View style={s.routeLine} />
            <View style={[s.routeDot, { backgroundColor: T.success }]}>
              <Ionicons name="location" size={16} color={T.white} />
            </View>
          </View>
        </View>

        {/* Delivery Timeline */}
        <View style={s.timelineCard}>
          <Text style={s.cardTitle}>Delivery Timeline</Text>
          {TIMELINE.map((item, i) => (
            <View key={i} style={s.timelineItem}>
              <View style={s.timelineLeft}>
                <View style={[
                  s.timelineDot,
                  item.status === 'completed' && s.timelineDotDone,
                  item.status === 'active' && s.timelineDotActive,
                ]}>
                  {item.status === 'completed' ? (
                    <Ionicons name="checkmark" size={12} color={T.white} />
                  ) : item.status === 'active' ? (
                    <View style={s.activePulse} />
                  ) : null}
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[
                    s.timelineLine,
                    (item.status === 'completed') && s.timelineLineDone,
                  ]} />
                )}
              </View>
              <View style={s.timelineContent}>
                <Text style={[
                  s.timelineStep,
                  item.status === 'active' && { color: T.navy, fontWeight: '700' as const },
                  item.status === 'pending' && { color: T.textMuted },
                ]}>{item.step}</Text>
                <Text style={s.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Driver Card */}
        <View style={s.driverCard}>
          <Text style={s.cardTitle}>Courier Information</Text>
          <View style={s.driverInfo}>
            <View style={s.driverAvatar}>
              <Image source={MiscImages.driverAvatar} style={{ width: '100%', height: '100%', borderRadius: 14 }} resizeMode="cover" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.driverName}>{DRIVER.name}</Text>
              <View style={s.driverRating}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={s.driverRatingText}>{DRIVER.rating} ({DRIVER.reviews} reviews)</Text>
              </View>
              <Text style={s.driverVehicle}>{DRIVER.vehicle}</Text>
            </View>
            <View style={s.driverActions}>
              <TouchableOpacity style={s.callBtn}>
                <Ionicons name="call" size={18} color={T.navy} />
              </TouchableOpacity>
              <TouchableOpacity style={s.chatBtn}>
                <Ionicons name="chatbubble" size={18} color={T.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.confirmBtn}>
          <Ionicons name="checkmark-circle-outline" size={18} color={T.white} />
          <Text style={s.confirmText}>Confirm Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.issueBtn}>
          <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
          <Text style={s.issueText}>Report Issue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  headerBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 16, fontWeight: '700' as const, color: T.text },
  statusBanner: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: T.surface },
  statusLeft: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  statusIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.info, justifyContent: 'center' as const, alignItems: 'center' as const },
  statusTitle: { fontSize: 16, fontWeight: '700' as const, color: T.text },
  statusSub: { fontSize: 13, color: T.textMuted, marginTop: 2 },
  escrowCard: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#ECFDF5', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#D1FAE5' },
  escrowHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 4 },
  escrowTitle: { fontSize: 14, fontWeight: '700' as const, color: T.success },
  escrowDesc: { fontSize: 13, color: '#065F46', lineHeight: 18 },
  escrowLink: { fontSize: 13, fontWeight: '600' as const, color: T.info, marginTop: 6 },
  mapArea: { height: 200, marginHorizontal: 16, marginTop: 12, borderRadius: 14, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, overflow: 'hidden' as const, justifyContent: 'center' as const, alignItems: 'center' as const },
  mapPlaceholder: { alignItems: 'center' as const, gap: 8 },
  mapText: { fontSize: 13, color: T.textMuted },
  routeOverlay: { position: 'absolute' as const, bottom: 20, left: 30, right: 30, flexDirection: 'row' as const, alignItems: 'center' as const },
  routeDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.info, justifyContent: 'center' as const, alignItems: 'center' as const },
  routeLine: { flex: 1, height: 3, backgroundColor: T.info, opacity: 0.3 },
  timelineCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  cardTitle: { fontSize: 16, fontWeight: '700' as const, color: T.text, marginBottom: 16 },
  timelineItem: { flexDirection: 'row' as const, minHeight: 60 },
  timelineLeft: { alignItems: 'center' as const, width: 28 },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: T.bg, borderWidth: 2, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  timelineDotDone: { backgroundColor: T.success, borderColor: T.success },
  timelineDotActive: { backgroundColor: T.white, borderColor: T.navy, borderWidth: 3 },
  activePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.navy },
  timelineLine: { width: 2, flex: 1, backgroundColor: T.border, marginVertical: 4 },
  timelineLineDone: { backgroundColor: T.success },
  timelineContent: { flex: 1, marginLeft: 12, paddingBottom: 16 },
  timelineStep: { fontSize: 14, fontWeight: '600' as const, color: T.text },
  timelineTime: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  driverCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: T.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  driverInfo: { flexDirection: 'row' as const, alignItems: 'center' as const },
  driverAvatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: T.navy, justifyContent: 'center' as const, alignItems: 'center' as const, marginRight: 14, overflow: 'hidden' as const },
  driverInitial: { fontSize: 20, fontWeight: '800' as const, color: T.white },
  driverName: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  driverRating: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, marginTop: 2 },
  driverRatingText: { fontSize: 12, color: T.textMuted },
  driverVehicle: { fontSize: 12, color: T.textSecondary, marginTop: 2 },
  driverActions: { flexDirection: 'row' as const, gap: 8 },
  callBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
  chatBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: T.navy, justifyContent: 'center' as const, alignItems: 'center' as const },
  bottomBar: { flexDirection: 'row' as const, padding: 16, gap: 10, backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border },
  confirmBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 16, gap: 8, shadowColor: T.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  confirmText: { fontSize: 15, fontWeight: '700' as const, color: T.white },
  issueBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderColor: '#FECACA', gap: 6 },
  issueText: { fontSize: 13, fontWeight: '700' as const, color: '#EF4444' },
};
