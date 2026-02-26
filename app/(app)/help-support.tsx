import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const FAQ_DATA = [
  {
    id: '1',
    question: 'How do I place an order?',
    answer:
      'Browse products in the Shop tab, add items to your cart, and proceed to checkout. You can choose delivery or self-pickup, select a payment method, and confirm your order. You will receive a confirmation with tracking details.',
  },
  {
    id: '2',
    question: 'How does payment escrow work?',
    answer:
      'When you place an order, your payment is held securely in escrow. The seller only receives the funds once you confirm delivery and are satisfied with the materials. This protects both buyers and sellers from disputes.',
  },
  {
    id: '3',
    question: 'How to hire a worker?',
    answer:
      'Go to the Workers tab, browse verified workers by skill (mason, carpenter, electrician, etc.), view their profiles and ratings, then tap "Hire" to send a request. You can negotiate terms and create a formal agreement.',
  },
  {
    id: '4',
    question: 'What if an order is damaged?',
    answer:
      'If you receive damaged materials, report the issue within 24 hours from the order details screen. Upload photos of the damage, and our team will review your claim. You can get a replacement or refund through our dispute resolution process.',
  },
  {
    id: '5',
    question: 'How do agreements work?',
    answer:
      'Agreements are formal contracts between you and a worker or contractor. They outline scope of work, timeline, payment milestones, and terms. Both parties must accept the agreement before work begins. Payments are released as milestones are completed.',
  },
  {
    id: '6',
    question: 'How to become a verified worker?',
    answer:
      'Register as a worker, complete your profile with skills and experience, upload government ID and skill certifications, and pass our verification process. Verified workers get a badge, higher visibility, and access to premium job listings.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Help & Support</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Search Bar */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={20} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={T.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.quickActionsRow}>
          <TouchableOpacity style={s.quickActionCard}>
            <View style={[s.quickActionIcon, { backgroundColor: T.info + '18' }]}>
              <Ionicons name="call" size={22} color={T.info} />
            </View>
            <Text style={s.quickActionLabel}>Call Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.quickActionCard}>
            <View style={[s.quickActionIcon, { backgroundColor: T.success + '18' }]}>
              <Ionicons name="mail" size={22} color={T.success} />
            </View>
            <Text style={s.quickActionLabel}>Email Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.quickActionCard}>
            <View style={[s.quickActionIcon, { backgroundColor: '#25D366' + '18' }]}>
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            </View>
            <Text style={s.quickActionLabel}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={s.sectionTitle}>Frequently Asked Questions</Text>
        <View style={{ gap: 10 }}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.includes(faq.id);
            return (
              <TouchableOpacity
                key={faq.id}
                style={s.faqCard}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <View style={s.faqQuestionRow}>
                  <Text style={s.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={T.textSecondary}
                    style={{
                      transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                    }}
                  />
                </View>
                {isExpanded && (
                  <Text style={s.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            );
          })}
          {filteredFaqs.length === 0 && (
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={40} color={T.textMuted} />
              <Text style={s.emptyText}>No results found</Text>
              <Text style={s.emptySubtext}>Try a different search term</Text>
            </View>
          )}
        </View>

        {/* Contact Section */}
        <Text style={s.sectionTitle}>Contact Information</Text>
        <View style={s.contactCard}>
          <View style={s.contactRow}>
            <Ionicons name="time-outline" size={20} color={T.info} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={s.contactLabel}>Support Hours</Text>
              <Text style={s.contactValue}>Mon-Sat, 9 AM - 6 PM</Text>
            </View>
          </View>
          <View style={s.contactDivider} />
          <View style={s.contactRow}>
            <Ionicons name="call-outline" size={20} color={T.info} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={s.contactLabel}>Phone</Text>
              <Text style={s.contactValue}>+91 1800-XXX-XXXX</Text>
            </View>
          </View>
          <View style={s.contactDivider} />
          <View style={s.contactRow}>
            <Ionicons name="mail-outline" size={20} color={T.info} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={s.contactLabel}>Email</Text>
              <Text style={s.contactValue}>support@buildmart.in</Text>
            </View>
          </View>
        </View>

        {/* Report a Problem */}
        <TouchableOpacity style={s.reportBtn}>
          <Ionicons name="warning-outline" size={22} color="#EF4444" />
          <Text style={s.reportBtnText}>Report a Problem</Text>
          <Ionicons name="chevron-forward" size={20} color={T.textMuted} style={{ marginLeft: 'auto' }} />
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
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: T.text,
    padding: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: T.text,
    marginTop: 24,
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
    gap: 10,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
  },
  faqCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  faqQuestionRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: T.textSecondary,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  contactCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  contactRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 4,
  },
  contactDivider: {
    height: 1,
    backgroundColor: T.border,
    marginVertical: 12,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textMuted,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
    marginTop: 2,
  },
  reportBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: T.border,
    gap: 12,
  },
  reportBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: T.textSecondary,
  },
};
