import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const RATE_TYPES = [
  { id: 'daily', label: 'Daily', multiplier: 1 },
  { id: 'weekly', label: 'Weekly', multiplier: 7 },
  { id: 'monthly', label: 'Monthly', multiplier: 30 },
];

const MOCK_WORKERS = [
  { id: 'w1', name: 'Ramu Yadav', skills: ['Coolie', 'Helper'], dailyRate: 600, rating: 4.5 },
  { id: 'w2', name: 'Suresh Kumar', skills: ['Mason', 'Painter'], dailyRate: 800, rating: 4.8 },
  { id: 'w3', name: 'Mohammed Ali', skills: ['Electrician'], dailyRate: 900, rating: 4.6 },
  { id: 'w5', name: 'Venkat Rao', skills: ['Carpenter'], dailyRate: 1000, rating: 4.9 },
];

export default function CreateAgreementScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState<typeof MOCK_WORKERS[0] | null>(null);
  const [title, setTitle] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rateType, setRateType] = useState('daily');
  const [rateAmount, setRateAmount] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [workingHours, setWorkingHours] = useState('8');
  const [terminationNoticeDays, setTerminationNoticeDays] = useState('7');
  const [terminationTerms, setTerminationTerms] = useState('');
  const [additionalTerms, setAdditionalTerms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalValue = () => {
    if (!rateAmount || !startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const rateTypeObj = RATE_TYPES.find((r) => r.id === rateType);
    const periods = Math.ceil(days / (rateTypeObj?.multiplier || 1));

    return periods * parseFloat(rateAmount);
  };

  const handleSubmit = () => {
    if (!selectedWorker) {
      Alert.alert('Error', 'Please select a worker');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!scopeOfWork.trim()) {
      Alert.alert('Error', 'Please describe the scope of work');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select start and end dates');
      return;
    }
    if (!rateAmount) {
      Alert.alert('Error', 'Please enter the rate amount');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Agreement Created!',
        'The agreement has been sent to the worker for signature.',
        [
          {
            text: 'View Agreements',
            onPress: () => router.replace('/(app)/(tabs)/agreements'),
          },
        ]
      );
    }, 2000);
  };

  const renderStepIndicator = () => (
    <View style={s.stepRow}>
      {[1, 2, 3].map((n) => (
        <View key={n} style={s.stepItem}>
          <View
            style={[
              s.stepCircle,
              { backgroundColor: step >= n ? T.amber : T.bg },
            ]}
          >
            {step > n ? (
              <Ionicons name="checkmark" size={18} color={T.white} />
            ) : (
              <Text
                style={{
                  color: step >= n ? T.white : T.textSecondary,
                  fontWeight: '700',
                }}
              >
                {n}
              </Text>
            )}
          </View>
          {n < 3 && (
            <View
              style={[
                s.stepConnector,
                { backgroundColor: step > n ? T.amber : T.bg },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={s.sectionPadding}>
      <Text style={s.sectionTitle}>Select Worker</Text>

      {MOCK_WORKERS.map((worker) => {
        const isSelected = selectedWorker?.id === worker.id;
        return (
          <TouchableOpacity
            key={worker.id}
            style={[
              s.workerCard,
              {
                borderColor: isSelected ? T.amber : T.border,
              },
            ]}
            onPress={() => setSelectedWorker(worker)}
          >
            <View style={s.workerRow}>
              <View style={s.workerAvatar}>
                <Ionicons name="person" size={28} color={T.textSecondary} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={s.workerName}>{worker.name}</Text>
                <View style={s.skillsRow}>
                  {worker.skills.map((skill, index) => (
                    <View key={index} style={s.skillBadge}>
                      <Text style={s.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.ratingRow}>
                  <Ionicons name="star" size={14} color={T.amber} />
                  <Text style={s.ratingText}>{worker.rating}</Text>
                  <Text style={{ color: T.textMuted, marginHorizontal: 8 }}>
                    •
                  </Text>
                  <Text style={s.rateText}>₹{worker.dailyRate}/day</Text>
                </View>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={T.amber} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStep2 = () => (
    <View style={s.sectionPadding}>
      <Text style={s.sectionTitle}>Agreement Details</Text>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Title *</Text>
        <TextInput
          style={s.input}
          placeholder="e.g., Mason Work for Villa Project"
          placeholderTextColor={T.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Scope of Work *</Text>
        <TextInput
          style={[s.input, { minHeight: 100, textAlignVertical: 'top' }]}
          placeholder="Describe the work to be done..."
          placeholderTextColor={T.textMuted}
          value={scopeOfWork}
          onChangeText={setScopeOfWork}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={s.dateRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Start Date *</Text>
          <TextInput
            style={s.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={T.textMuted}
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={s.label}>End Date *</Text>
          <TextInput
            style={s.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={T.textMuted}
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Rate Type *</Text>
        <View style={s.rateTypeRow}>
          {RATE_TYPES.map((type) => {
            const isActive = rateType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  s.rateTypeTab,
                  {
                    backgroundColor: isActive ? T.navy : T.bg,
                  },
                ]}
                onPress={() => setRateType(type.id)}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '500',
                    color: isActive ? T.white : T.textSecondary,
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Rate Amount (₹) *</Text>
        <TextInput
          style={s.input}
          placeholder={`Amount per ${rateType}`}
          placeholderTextColor={T.textMuted}
          value={rateAmount}
          onChangeText={setRateAmount}
          keyboardType="numeric"
        />
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Work Location</Text>
        <TextInput
          style={s.input}
          placeholder="Address of work site"
          placeholderTextColor={T.textMuted}
          value={workLocation}
          onChangeText={setWorkLocation}
        />
      </View>

      <View style={s.dateRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Working Hours/Day</Text>
          <TextInput
            style={s.input}
            placeholder="8"
            placeholderTextColor={T.textMuted}
            value={workingHours}
            onChangeText={setWorkingHours}
            keyboardType="numeric"
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Notice Period (Days)</Text>
          <TextInput
            style={s.input}
            placeholder="7"
            placeholderTextColor={T.textMuted}
            value={terminationNoticeDays}
            onChangeText={setTerminationNoticeDays}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={s.sectionPadding}>
      <Text style={s.sectionTitle}>Terms & Review</Text>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Termination Terms</Text>
        <TextInput
          style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder="Conditions for termination..."
          placeholderTextColor={T.textMuted}
          value={terminationTerms}
          onChangeText={setTerminationTerms}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Additional Terms (Optional)</Text>
        <TextInput
          style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder="Any other terms or conditions..."
          placeholderTextColor={T.textMuted}
          value={additionalTerms}
          onChangeText={setAdditionalTerms}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Agreement Summary */}
      <View style={s.summaryCard}>
        <Text style={s.summaryTitle}>Agreement Summary</Text>

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Worker</Text>
          <Text style={s.summaryValue}>{selectedWorker?.name}</Text>
        </View>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Title</Text>
          <Text style={s.summaryValue} numberOfLines={1}>
            {title || '-'}
          </Text>
        </View>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Duration</Text>
          <Text style={s.summaryValue}>
            {startDate} to {endDate}
          </Text>
        </View>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Rate</Text>
          <Text style={s.summaryAmber}>
            ₹{rateAmount || 0}/{rateType}
          </Text>
        </View>
        <View style={s.summaryTotalRow}>
          <Text style={s.summaryTotalLabel}>Total Contract Value</Text>
          <Text style={s.summaryTotalValue}>
            ₹{calculateTotalValue().toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Info Box */}
      <View style={s.infoBox}>
        <View style={s.infoRow}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={s.infoTitle}>How it works</Text>
            <Text style={s.infoBody}>
              Once you create this agreement, it will be sent to the worker for
              review and signature. Funds will be held in escrow until work is
              completed.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const isNextDisabled = (step === 1 && !selectedWorker) || isSubmitting;

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Create Agreement</Text>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={s.footer}>
        <View style={s.footerRow}>
          {step > 1 && (
            <TouchableOpacity
              style={s.backButton}
              onPress={() => setStep(step - 1)}
            >
              <Text style={s.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              s.continueButton,
              {
                backgroundColor: isNextDisabled ? T.textMuted : T.amber,
              },
            ]}
            onPress={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={isNextDisabled}
          >
            <Text style={s.continueButtonText}>
              {isSubmitting
                ? 'Creating...'
                : step === 3
                ? 'Create Agreement'
                : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = {
  /* Root */
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  } as const,

  /* Header */
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    color: T.text,
    fontSize: 20,
    fontWeight: '700' as const,
    marginLeft: 16,
  },

  /* Step Indicator */
  stepRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
  },
  stepItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  stepConnector: {
    width: 48,
    height: 4,
  },

  /* General */
  sectionPadding: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: T.text,
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: T.textSecondary,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: T.text,
    fontSize: 15,
  },

  /* Step 1 - Worker cards */
  workerCard: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  workerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  workerAvatar: {
    width: 56,
    height: 56,
    backgroundColor: T.bg,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  workerName: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 18,
  },
  skillsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 4,
  },
  skillBadge: {
    backgroundColor: T.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  skillText: {
    color: T.textSecondary,
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  ratingText: {
    color: T.text,
    marginLeft: 4,
  },
  rateText: {
    color: T.amber,
    fontWeight: '500' as const,
  },

  /* Step 2 - Date row */
  dateRow: {
    flexDirection: 'row' as const,
    marginBottom: 16,
  },
  rateTypeRow: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  rateTypeTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },

  /* Step 3 - Summary */
  summaryCard: {
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  summaryTitle: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 18,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  summaryLabel: {
    color: T.textSecondary,
  },
  summaryValue: {
    color: T.text,
  },
  summaryAmber: {
    color: T.amber,
    fontWeight: '500' as const,
  },
  summaryTotalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  summaryTotalLabel: {
    color: T.text,
    fontWeight: '600' as const,
  },
  summaryTotalValue: {
    color: T.amber,
    fontWeight: '700' as const,
    fontSize: 20,
  },

  /* Info box */
  infoBox: {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  infoTitle: {
    color: '#3B82F6',
    fontWeight: '500' as const,
    fontSize: 15,
  },
  infoBody: {
    color: T.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  /* Footer / Nav buttons */
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  footerRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: T.bg,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backButtonText: {
    color: T.text,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
    fontSize: 15,
  },
  continueButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  continueButtonText: {
    color: T.white,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
    fontSize: 15,
  },
};
