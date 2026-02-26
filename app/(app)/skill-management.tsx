import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

type Skill = {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
  years: number;
  verified: boolean;
  dailyRate: number;
};

type AvailableSkill = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  dailyRate: number;
};

const PROFICIENCY_COLORS: Record<string, string> = {
  Expert: '#10B981',
  Intermediate: '#F2960D',
  Beginner: '#3B82F6',
};

const MY_SKILLS: Skill[] = [
  { id: '1', name: 'Coolie', proficiency: 'Expert', years: 5, verified: true, dailyRate: 800 },
  { id: '2', name: 'Helper', proficiency: 'Intermediate', years: 3, verified: true, dailyRate: 600 },
  { id: '3', name: 'Mason', proficiency: 'Beginner', years: 1, verified: false, dailyRate: 1000 },
];

const AVAILABLE_SKILLS: AvailableSkill[] = [
  { id: 'a1', name: 'Electrician', icon: 'flash-outline', dailyRate: 1200 },
  { id: 'a2', name: 'Plumber', icon: 'water-outline', dailyRate: 1100 },
  { id: 'a3', name: 'Carpenter', icon: 'hammer-outline', dailyRate: 1000 },
  { id: 'a4', name: 'Painter', icon: 'color-palette-outline', dailyRate: 900 },
  { id: 'a5', name: 'Welder', icon: 'flame-outline', dailyRate: 1300 },
  { id: 'a6', name: 'Tiler', icon: 'grid-outline', dailyRate: 1000 },
];

export default function SkillManagementScreen() {
  const router = useRouter();
  const [skills] = useState<Skill[]>(MY_SKILLS);

  const handleAddSkill = (skill: AvailableSkill) => {
    Alert.alert('Add Skill', `Add "${skill.name}" to your skills? Daily rate: Rs.${skill.dailyRate}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: () => Alert.alert('Success', `${skill.name} added to your skills.`) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Skills</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Current Skills */}
        <Text style={s.sectionTitle}>Current Skills</Text>
        {skills.map((skill) => {
          const profColor = PROFICIENCY_COLORS[skill.proficiency];
          return (
            <View key={skill.id} style={s.skillCard}>
              <View style={s.skillHeader}>
                <View style={{ flex: 1 }}>
                  <View style={s.skillNameRow}>
                    <Text style={s.skillName}>{skill.name}</Text>
                    {skill.verified && (
                      <View style={s.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={T.success} />
                        <Text style={s.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.skillYears}>{skill.years} {skill.years === 1 ? 'year' : 'years'} experience</Text>
                </View>
                <View style={[s.proficiencyBadge, { backgroundColor: profColor + '1A' }]}>
                  <Text style={[s.proficiencyText, { color: profColor }]}>{skill.proficiency}</Text>
                </View>
              </View>
              <View style={s.skillFooter}>
                <Text style={s.dailyRateLabel}>Daily Rate</Text>
                <Text style={s.dailyRate}>Rs.{skill.dailyRate}</Text>
              </View>
            </View>
          );
        })}

        {/* Available Skills to Add */}
        <Text style={[s.sectionTitle, { marginTop: 28 }]}>Add New Skill</Text>
        <View style={s.skillGrid}>
          {AVAILABLE_SKILLS.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={s.availableSkillCard}
              activeOpacity={0.7}
              onPress={() => handleAddSkill(skill)}
            >
              <View style={s.availableIconCircle}>
                <Ionicons name={skill.icon} size={24} color={T.amber} />
              </View>
              <Text style={s.availableSkillName}>{skill.name}</Text>
              <Text style={s.availableRate}>Rs.{skill.dailyRate}/day</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Skill Button */}
        <TouchableOpacity
          style={s.addButton}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Add Skill', 'Select a skill from the grid above to add it to your profile.')}
        >
          <Ionicons name="add-circle-outline" size={22} color={T.white} />
          <Text style={s.addButtonText}>Add New Skill</Text>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  skillCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
  },
  skillNameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 4,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  verifiedBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 3,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.success,
  },
  skillYears: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  proficiencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  proficiencyText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  skillFooter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  dailyRateLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: T.textMuted,
  },
  dailyRate: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.navy,
  },
  skillGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  availableSkillCard: {
    width: '47%' as any,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: 'center' as const,
  },
  availableIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.amber + '1A',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
  },
  availableSkillName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  availableRate: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: T.textSecondary,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.amber,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
