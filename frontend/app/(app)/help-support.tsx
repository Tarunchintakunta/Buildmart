import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LightTheme as T } from '../../src/theme/colors';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQ[] = [
  {
    id: 'f1',
    question: 'How do I place an order?',
    answer:
      'Browse products in the Shop tab, add items to your cart, and proceed to checkout. Choose delivery or self-pickup, select a payment method, and confirm. You will receive a confirmation with tracking details and the shop\'s contact number.',
  },
  {
    id: 'f2',
    question: 'How does the wallet work?',
    answer:
      'Your BuildMart wallet can be topped up via UPI, bank transfer, or card. Wallet balance is used for payments and instant refunds. You can also earn cashback directly to your wallet on eligible orders. Withdrawal to bank takes 1-2 business days.',
  },
  {
    id: 'f3',
    question: 'How is the escrow system secured?',
    answer:
      'When you place an order, your payment is held in a secure RBI-compliant escrow account. The seller receives funds only after you confirm receipt and are satisfied. This protects both buyers and sellers from fraud and disputes.',
  },
  {
    id: 'f4',
    question: 'How do I hire a worker?',
    answer:
      'Go to the Workers tab, browse verified workers by skill (mason, carpenter, electrician, etc.), view profiles and ratings, and tap "Hire." You can negotiate terms and create a formal agreement. Payment is milestone-based and held in escrow.',
  },
  {
    id: 'f5',
    question: 'What if my delivery is late?',
    answer:
      'If delivery is delayed beyond the promised time, go to your order details and tap "Report Issue." You can track the delivery in real-time. If the delay is due to the shop\'s fault, you may be eligible for compensation. Contact support for urgent cases.',
  },
  {
    id: 'f6',
    question: 'How do I file a dispute?',
    answer:
      'From your order page, tap "Report a Problem" and describe the issue. Upload photos if applicable. Our team reviews disputes within 24 hours. You can track the status of your dispute under the "Disputes" section in your profile.',
  },
];

function FAQItem({ faq, delay }: { faq: FAQ; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden' as const,
  }));

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    height.value = withTiming(next ? 120 : 0, { duration: 280 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={s.faqCard}>
      <Pressable style={s.faqQuestion} onPress={toggle}>
        <Text style={s.faqQuestionText}>{faq.question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={T.textSecondary}
        />
      </Pressable>
      <Animated.View style={animStyle}>
        <Text style={s.faqAnswer}>{faq.answer}</Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = FAQ_DATA.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </Pressable>
        <Text style={s.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={s.searchBar}>
          <Ionicons name="search" size={18} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search help articles..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </Pressable>
          )}
        </Animated.View>

        {/* Contact Support */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <Text style={s.sectionTitle}>Contact Support</Text>
          <View style={s.contactRow}>
            <Pressable
              style={[s.contactBtn, { backgroundColor: '#3B82F618', borderColor: '#3B82F628' }]}
              onPress={() => Linking.openURL('tel:+911800XXX')}
            >
              <View style={[s.contactIcon, { backgroundColor: '#3B82F618' }]}>
                <Ionicons name="call" size={22} color="#3B82F6" />
              </View>
              <Text style={[s.contactBtnText, { color: '#3B82F6' }]}>Call</Text>
            </Pressable>
            <Pressable
              style={[s.contactBtn, { backgroundColor: '#25D36618', borderColor: '#25D36628' }]}
              onPress={() => Linking.openURL('https://wa.me/91XXXXXXXXXX')}
            >
              <View style={[s.contactIcon, { backgroundColor: '#25D36618' }]}>
                <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
              </View>
              <Text style={[s.contactBtnText, { color: '#25D366' }]}>WhatsApp</Text>
            </Pressable>
            <Pressable
              style={[s.contactBtn, { backgroundColor: '#10B98118', borderColor: '#10B98128' }]}
              onPress={() => Linking.openURL('mailto:support@buildmart.in')}
            >
              <View style={[s.contactIcon, { backgroundColor: '#10B98118' }]}>
                <Ionicons name="mail" size={22} color="#10B981" />
              </View>
              <Text style={[s.contactBtnText, { color: '#10B981' }]}>Email</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* FAQ Accordion */}
        <Text style={s.sectionTitle}>Frequently Asked Questions</Text>
        {filtered.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(300)} style={s.empty}>
            <Ionicons name="search-outline" size={40} color={T.textMuted} />
            <Text style={s.emptyText}>No results found</Text>
            <Text style={s.emptySubtext}>Try a different keyword</Text>
          </Animated.View>
        ) : (
          filtered.map((faq, i) => (
            <FAQItem key={faq.id} faq={faq} delay={100 + i * 50} />
          ))
        )}

        {/* Support Hours */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={s.hoursCard}>
          <View style={s.hoursHeader}>
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
            <Text style={s.hoursTitle}>Support Hours</Text>
          </View>
          <Text style={s.hoursText}>Monday to Saturday • 9:00 AM – 6:00 PM</Text>
          <Text style={s.hoursText}>Call: +91 1800-XXX-XXXX (Toll Free)</Text>
          <Text style={s.hoursText}>Email: support@buildmart.in</Text>
        </Animated.View>

        {/* Report a Problem */}
        <Animated.View entering={FadeInDown.delay(560).duration(400)}>
          <Pressable style={s.reportBtn}>
            <View style={[s.contactIcon, { backgroundColor: '#EF444418' }]}>
              <Ionicons name="warning-outline" size={20} color={T.error} />
            </View>
            <Text style={s.reportBtnText}>Report a Problem</Text>
            <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
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
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: T.text },
  scroll: { padding: 16, paddingBottom: 60, gap: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: T.border,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: T.text },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: T.text, marginBottom: 4 },
  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtnText: { fontSize: 13, fontWeight: '700' },
  faqCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  faqQuestionText: { flex: 1, fontSize: 15, fontWeight: '600', color: T.text, lineHeight: 22 },
  faqAnswer: {
    fontSize: 14,
    color: T.textSecondary,
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  hoursCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    gap: 8,
  },
  hoursHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  hoursTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  hoursText: { fontSize: 13, color: T.textSecondary },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    gap: 12,
  },
  reportBtnText: { flex: 1, fontSize: 15, fontWeight: '600', color: T.error },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: T.text },
  emptySubtext: { fontSize: 14, color: T.textSecondary },
});
