import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type DayStatus = 'available' | 'busy' | 'partial' | 'none';

type BookedJob = {
  id: string;
  title: string;
  time: string;
  location: string;
  customer: string;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const STATUS_COLORS: Record<DayStatus, string> = {
  available: '#10B981',
  busy: '#EF4444',
  partial: '#F2960D',
  none: 'transparent',
};

// Generate mock calendar data for current month (Feb 2026)
const generateMonthData = () => {
  const year = 2026;
  const month = 1; // February (0-indexed)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 26;

  const busyDays = [3, 7, 14, 21, 28];
  const partialDays = [5, 12, 19];

  const days: { day: number; status: DayStatus }[] = [];

  // Empty slots for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: 0, status: 'none' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    let status: DayStatus = 'available';
    if (busyDays.includes(d)) status = 'busy';
    else if (partialDays.includes(d)) status = 'partial';
    days.push({ day: d, status });
  }

  return { days, today, year, month: 'February', daysInMonth };
};

const MOCK_JOBS: Record<number, BookedJob[]> = {
  3: [
    { id: 'j1', title: 'Wall Plastering', time: '8:00 AM - 5:00 PM', location: 'Koramangala, Bengaluru', customer: 'Rajesh Kumar' },
  ],
  7: [
    { id: 'j2', title: 'Foundation Work', time: '7:00 AM - 4:00 PM', location: 'HSR Layout, Bengaluru', customer: 'Suresh Patel' },
    { id: 'j3', title: 'Cleanup', time: '5:00 PM - 7:00 PM', location: 'HSR Layout, Bengaluru', customer: 'Suresh Patel' },
  ],
  14: [
    { id: 'j4', title: 'Brick Laying', time: '8:00 AM - 6:00 PM', location: 'Whitefield, Bengaluru', customer: 'Amit Shah' },
  ],
};

export default function AvailabilityScreen() {
  const router = useRouter();
  const calendarData = generateMonthData();
  const [selectedDay, setSelectedDay] = useState<number>(calendarData.today);

  const selectedStatus = calendarData.days.find((d) => d.day === selectedDay)?.status || 'available';
  const bookedJobs = MOCK_JOBS[selectedDay] || [];

  // Weekly summary: count available and busy for current week
  const weekStart = calendarData.today - new Date(2026, 1, calendarData.today).getDay();
  let weekAvailable = 0;
  let weekBusy = 0;
  for (let i = weekStart; i < weekStart + 7; i++) {
    const dayData = calendarData.days.find((d) => d.day === i);
    if (dayData?.status === 'available') weekAvailable++;
    else if (dayData?.status === 'busy') weekBusy++;
  }

  const handleSetStatus = (status: 'available' | 'busy') => {
    const label = status === 'available' ? 'Available' : 'Unavailable';
    Alert.alert('Update Status', `Set ${calendarData.month} ${selectedDay} as ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => Alert.alert('Updated', `Day marked as ${label}.`) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Availability</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Month Header */}
        <View style={s.monthHeader}>
          <Text style={s.monthTitle}>{calendarData.month} {calendarData.year}</Text>
        </View>

        {/* Calendar Grid */}
        <View style={s.calendarCard}>
          {/* Weekday Headers */}
          <View style={s.weekdayRow}>
            {WEEKDAYS.map((day, i) => (
              <View key={i} style={s.weekdayCell}>
                <Text style={s.weekdayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={s.daysGrid}>
            {calendarData.days.map((item, index) => {
              if (item.day === 0) {
                return <View key={`empty-${index}`} style={s.dayCell} />;
              }

              const isToday = item.day === calendarData.today;
              const isSelected = item.day === selectedDay;
              const statusColor = STATUS_COLORS[item.status];

              return (
                <TouchableOpacity
                  key={item.day}
                  style={s.dayCell}
                  onPress={() => setSelectedDay(item.day)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      s.dayCircle,
                      { backgroundColor: statusColor + '33' },
                      isToday && s.todayBorder,
                      isSelected && s.selectedBorder,
                    ]}
                  >
                    <Text
                      style={[
                        s.dayText,
                        isSelected && { fontWeight: '800' as const, color: T.navy },
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={s.legendRow}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: STATUS_COLORS.available }]} />
              <Text style={s.legendText}>Available</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: STATUS_COLORS.busy }]} />
              <Text style={s.legendText}>Busy</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: STATUS_COLORS.partial }]} />
              <Text style={s.legendText}>Partial</Text>
            </View>
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={s.summaryCard}>
          <Ionicons name="calendar-outline" size={18} color={T.navy} />
          <Text style={s.summaryText}>
            This week: <Text style={{ color: '#10B981', fontWeight: '700' as const }}>{weekAvailable} available</Text>,{' '}
            <Text style={{ color: '#EF4444', fontWeight: '700' as const }}>{weekBusy} busy</Text>
          </Text>
        </View>

        {/* Selected Day Details */}
        <Text style={[s.sectionTitle, { marginTop: 24 }]}>
          {calendarData.month} {selectedDay} — {selectedStatus === 'available' ? 'Available' : selectedStatus === 'busy' ? 'Busy' : 'Partially Available'}
        </Text>

        {bookedJobs.length > 0 ? (
          bookedJobs.map((job) => (
            <View key={job.id} style={s.jobCard}>
              <View style={s.jobRow}>
                <Ionicons name="briefcase-outline" size={18} color={T.amber} />
                <Text style={s.jobTitle}>{job.title}</Text>
              </View>
              <View style={s.jobDetail}>
                <Ionicons name="time-outline" size={14} color={T.textSecondary} />
                <Text style={s.jobDetailText}>{job.time}</Text>
              </View>
              <View style={s.jobDetail}>
                <Ionicons name="location-outline" size={14} color={T.textSecondary} />
                <Text style={s.jobDetailText}>{job.location}</Text>
              </View>
              <View style={s.jobDetail}>
                <Ionicons name="person-outline" size={14} color={T.textSecondary} />
                <Text style={s.jobDetailText}>{job.customer}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={s.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color={T.success} />
            <Text style={s.emptyText}>No jobs booked for this day</Text>
          </View>
        )}

        {/* Toggle Buttons */}
        <View style={s.toggleRow}>
          <TouchableOpacity
            style={[s.toggleBtn, { backgroundColor: '#10B981' }]}
            activeOpacity={0.8}
            onPress={() => handleSetStatus('available')}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={T.white} />
            <Text style={s.toggleBtnText}>Set Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, { backgroundColor: '#EF4444' }]}
            activeOpacity={0.8}
            onPress={() => handleSetStatus('busy')}
          >
            <Ionicons name="close-circle-outline" size={20} color={T.white} />
            <Text style={s.toggleBtnText}>Set Unavailable</Text>
          </TouchableOpacity>
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
  monthHeader: {
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: T.navy,
  },
  calendarCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  weekdayRow: {
    flexDirection: 'row' as const,
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center' as const,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: T.textMuted,
  },
  daysGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  dayCell: {
    width: '14.28%' as any,
    alignItems: 'center' as const,
    paddingVertical: 4,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#1A1D2E',
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: '#F2960D',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
  },
  legendRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  summaryCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginTop: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: T.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  jobCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 10,
  },
  jobRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
  },
  jobDetail: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 4,
    marginLeft: 26,
  },
  jobDetailText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  emptyCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    alignItems: 'center' as const,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 20,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
};
