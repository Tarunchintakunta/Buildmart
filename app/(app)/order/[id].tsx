import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';
import { getProductImage } from '../../../src/constants/images';

const T = LightTheme;

const ORDER = {
  number: 'BM-98234',
  date: 'Oct 28, 2023',
  status: 'delivered',
  address: { name: 'Skyline Construction Site', line: '45-B, Industrial Area, Sector 62,', city: 'Noida, Uttar Pradesh - 201301' },
  items: [
    { name: 'Premium Portland Cement', spec: '50kg Bag . UltraTech', unitPrice: 370, qty: 5 },
    { name: 'TMT Steel Bars', spec: '12mm Fe500D . Tata Tiscon', unitPrice: 1240, qty: 10 },
    { name: 'Ceramic Floor Tiles', spec: '2x2 ft . Kajaria Marble Finish', unitPrice: 850, qty: 8 },
  ],
  deliveryFee: 0,
  gstin: '09AAACH7409R1ZZ',
  paymentMode: 'Credit Card (**** 4421)',
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const itemsTotal = ORDER.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const cgst = Math.round(itemsTotal * 0.09);
  const sgst = cgst;
  const grandTotal = itemsTotal + ORDER.deliveryFee + cgst + sgst;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Order Details</Text>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="share-outline" size={20} color={T.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Status Banner */}
        <View style={s.statusBanner}>
          <View style={s.statusIcon}>
            <Ionicons name="checkmark-circle" size={28} color={T.white} />
          </View>
          <View>
            <Text style={s.statusTitle}>Order Delivered</Text>
            <Text style={s.statusSub}>Order #{ORDER.number} . {ORDER.date}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Delivery Address */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>DELIVERY ADDRESS</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <Ionicons name="location-outline" size={18} color={T.textMuted} />
            <View>
              <Text style={s.addressName}>{ORDER.address.name}</Text>
              <Text style={s.addressLine}>{ORDER.address.line}</Text>
              <Text style={s.addressLine}>{ORDER.address.city}</Text>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        {/* Items */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>ITEMS BREAKDOWN ({ORDER.items.length})</Text>
          {ORDER.items.map((item, i) => (
            <View key={i} style={s.itemRow}>
              <View style={s.itemThumb}>
                <Image source={getProductImage(item.name)} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemSpec}>{item.spec}</Text>
                <View style={s.itemPriceRow}>
                  <Text style={s.itemCalc}>Rs.{item.unitPrice} x {item.qty} Units</Text>
                  <Text style={s.itemTotal}>Rs.{(item.unitPrice * item.qty).toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Payment Summary */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <View style={s.summaryCard}>
            <Text style={s.summaryTitle}>Payment Summary</Text>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>Items Total</Text><Text style={s.summaryValue}>Rs.{itemsTotal.toLocaleString()}</Text></View>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>Delivery Fee</Text><Text style={[s.summaryValue, { color: T.success }]}>FREE</Text></View>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>CGST (9%)</Text><Text style={s.summaryValue}>Rs.{cgst.toLocaleString()}</Text></View>
            <View style={s.summaryRow}><Text style={s.summaryLabel}>SGST (9%)</Text><Text style={s.summaryValue}>Rs.{sgst.toLocaleString()}</Text></View>
            <View style={{ height: 1, backgroundColor: T.border, marginVertical: 8 }} />
            <View style={s.summaryRow}><Text style={s.grandLabel}>Grand Total</Text><Text style={s.grandValue}>Rs.{grandTotal.toLocaleString()}</Text></View>
          </View>
        </View>

        {/* Billing Info */}
        <View style={s.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Ionicons name="information-circle-outline" size={18} color={T.textMuted} />
            <Text style={s.billingLabel}>BILLING INFORMATION</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.billingKey}>GSTIN</Text>
              <Text style={s.billingVal}>{ORDER.gstin}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.billingKey}>Payment Mode</Text>
              <Text style={s.billingVal}>{ORDER.paymentMode}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.downloadBtn}>
          <Ionicons name="download-outline" size={18} color={T.white} />
          <Text style={s.downloadText}>Download Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.supportBtn}>
          <Ionicons name="headset-outline" size={22} color={T.navy} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  headerBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center' as const, alignItems: 'center' as const },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  statusBanner: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 14, paddingHorizontal: 16, paddingVertical: 16 },
  statusIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: T.navy, justifyContent: 'center' as const, alignItems: 'center' as const },
  statusTitle: { fontSize: 18, fontWeight: '700' as const, color: T.text },
  statusSub: { fontSize: 13, color: T.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: T.border, marginHorizontal: 16 },
  section: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700' as const, color: T.text, letterSpacing: 1, textTransform: 'uppercase' as const },
  addressName: { fontSize: 15, fontWeight: '600' as const, color: T.text },
  addressLine: { fontSize: 13, color: T.textSecondary, lineHeight: 20 },
  itemRow: { flexDirection: 'row' as const, gap: 14, paddingVertical: 12 },
  itemThumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const, overflow: 'hidden' as const },
  itemName: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  itemSpec: { fontSize: 13, color: T.textMuted, marginTop: 2 },
  itemPriceRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginTop: 6 },
  itemCalc: { fontSize: 13, color: T.textMuted },
  itemTotal: { fontSize: 15, fontWeight: '700' as const, color: T.text },
  summaryCard: { backgroundColor: '#F0F1F5', borderRadius: 14, padding: 16 },
  summaryTitle: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const, color: T.text, marginBottom: 14 },
  summaryRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: T.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600' as const, color: T.text },
  grandLabel: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  grandValue: { fontSize: 17, fontWeight: '800' as const, color: T.text },
  billingLabel: { fontSize: 11, fontWeight: '600' as const, color: T.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  billingKey: { fontSize: 10, fontWeight: '700' as const, color: T.textMuted, textTransform: 'uppercase' as const, marginBottom: 4 },
  billingVal: { fontSize: 14, color: T.textSecondary },
  bottomBar: { flexDirection: 'row' as const, padding: 16, gap: 12, backgroundColor: T.surface, borderTopWidth: 1, borderTopColor: T.border },
  downloadBtn: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: T.navy, borderRadius: 14, paddingVertical: 16, gap: 8, shadowColor: T.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  downloadText: { fontSize: 15, fontWeight: '700' as const, color: T.white },
  supportBtn: { width: 56, height: 56, borderRadius: 14, borderWidth: 2, borderColor: T.border, justifyContent: 'center' as const, alignItems: 'center' as const },
};
