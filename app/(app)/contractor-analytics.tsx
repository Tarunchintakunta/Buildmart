import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const PERIODS = ['This Week', 'This Month', 'This Quarter', 'This Year'] as const;

const SUMMARY = [
  { label: 'Total Spent', value: 'Rs.5.2L', icon: 'wallet' as const, color: T.amber },
  { label: 'Workers Hired', value: '18', icon: 'people' as const, color: '#3B82F6' },
  { label: 'Orders Placed', value: '45', icon: 'cube' as const, color: '#10B981' },
  { label: 'Agreements', value: '8', icon: 'document-text' as const, color: '#8B5CF6' },
];

const CHART_MONTHS = [
  { label: 'Sep', pct: 40 },
  { label: 'Oct', pct: 65 },
  { label: 'Nov', pct: 50 },
  { label: 'Dec', pct: 80 },
  { label: 'Jan', pct: 72 },
  { label: 'Feb', pct: 55 },
];

const CATEGORIES = [
  { name: 'Cement', pct: 40, color: T.amber },
  { name: 'Steel', pct: 25, color: '#3B82F6' },
  { name: 'Labor', pct: 20, color: '#10B981' },
  { name: 'Hardware', pct: 15, color: '#8B5CF6' },
];

const RECENT_EXPENSES = [
  { id: '1', icon: 'cube' as const, category: 'Cement', desc: 'UltraTech OPC 53 Grade — 200 bags', amount: 'Rs.1,10,000', date: '24 Feb 2026' },
  { id: '2', icon: 'construct' as const, category: 'Steel', desc: 'TMT Bars 12mm — 2 tonnes', amount: 'Rs.92,000', date: '22 Feb 2026' },
  { id: '3', icon: 'people' as const, category: 'Labor', desc: 'Mason team — 5 workers × 12 days', amount: 'Rs.72,000', date: '20 Feb 2026' },
  { id: '4', icon: 'hammer' as const, category: 'Hardware', desc: 'Plumbing fittings & pipes', amount: 'Rs.34,500', date: '18 Feb 2026' },
  { id: '5', icon: 'cube' as const, category: 'Cement', desc: 'ACC PPC Cement — 100 bags', amount: 'Rs.48,000', date: '15 Feb 2026' },
];

export default function ContractorAnalyticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<typeof PERIODS[number]>('This Month');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Period Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.periodRow}
        >
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[s.periodPill, selectedPeriod === p && s.periodPillActive]}
              onPress={() => setSelectedPeriod(p)}
            >
              <Text style={[s.periodText, selectedPeriod === p && s.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary Cards */}
        <View style={s.summaryGrid}>
          {SUMMARY.map((item) => (
            <View key={item.label} style={s.summaryCard}>
              <View style={[s.summaryIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={s.summaryValue}>{item.value}</Text>
              <Text style={s.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Spending Chart */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Monthly Spending</Text>
          <View style={s.chartArea}>
            {CHART_MONTHS.map((m) => (
              <View key={m.label} style={s.barCol}>
                <View style={s.barTrack}>
                  <View style={[s.barFill, { height: `${m.pct}%` as any }]} />
                </View>
                <Text style={s.barLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Categories */}
        <View style={s.categoriesCard}>
          <Text style={s.sectionTitle}>Top Categories</Text>
          {CATEGORIES.map((cat) => (
            <View key={cat.name} style={s.catRow}>
              <View style={s.catLabelRow}>
                <View style={[s.catDot, { backgroundColor: cat.color }]} />
                <Text style={s.catName}>{cat.name}</Text>
                <Text style={s.catPct}>{cat.pct}%</Text>
              </View>
              <View style={s.catBarTrack}>
                <View style={[s.catBarFill, { width: `${cat.pct}%` as any, backgroundColor: cat.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Recent Expenses */}
        <View style={s.expensesSection}>
          <Text style={s.sectionTitlePadded}>Recent Expenses</Text>
          {RECENT_EXPENSES.map((exp) => (
            <View key={exp.id} style={s.expenseCard}>
              <View style={s.expenseIconWrap}>
                <Ionicons name={exp.icon} size={18} color={T.amber} />
              </View>
              <View style={s.expenseInfo}>
                <Text style={s.expenseCategory}>{exp.category}</Text>
                <Text style={s.expenseDesc} numberOfLines={1}>{exp.desc}</Text>
              </View>
              <View style={s.expenseRight}>
                <Text style={s.expenseAmount}>{exp.amount}</Text>
                <Text style={s.expenseDate}>{exp.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: T.text,
  },

  /* Period Filter */
  periodRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  periodPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  periodPillActive: {
    backgroundColor: T.navy,
    borderColor: T.navy,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.textMuted,
  },
  periodTextActive: {
    color: T.white,
  },

  /* Summary */
  summaryGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 10,
  },
  summaryCard: {
    width: '47%' as any,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: T.text,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Chart */
  chartCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 16,
  },
  chartArea: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'space-between' as const,
    height: 140,
  },
  barCol: {
    flex: 1,
    alignItems: 'center' as const,
  },
  barTrack: {
    width: 28,
    height: 110,
    backgroundColor: T.bg,
    borderRadius: 6,
    justifyContent: 'flex-end' as const,
    overflow: 'hidden' as const,
  },
  barFill: {
    width: '100%' as any,
    backgroundColor: T.amber,
    borderRadius: 6,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 11,
    color: T.textMuted,
    fontWeight: '500' as const,
  },

  /* Categories */
  categoriesCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 14,
  },
  catRow: {
    marginBottom: 14,
  },
  catLabelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  catName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as const,
    color: T.text,
  },
  catPct: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.text,
  },
  catBarTrack: {
    height: 6,
    backgroundColor: T.bg,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  catBarFill: {
    height: 6,
    borderRadius: 3,
  },

  /* Expenses */
  expensesSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitlePadded: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 12,
  },
  expenseCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginBottom: 10,
  },
  expenseIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.amber + '18',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 10,
  },
  expenseCategory: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 2,
  },
  expenseDesc: {
    fontSize: 11,
    color: T.textMuted,
  },
  expenseRight: {
    alignItems: 'flex-end' as const,
  },
  expenseAmount: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 11,
    color: T.textMuted,
  },
};
