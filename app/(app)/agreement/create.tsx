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
    <View className="flex-row items-center justify-center py-4">
      {[1, 2, 3].map((s) => (
        <View key={s} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step >= s ? 'bg-orange-500' : 'bg-gray-700'
            }`}
          >
            {step > s ? (
              <Ionicons name="checkmark" size={18} color="white" />
            ) : (
              <Text className="text-white font-bold">{s}</Text>
            )}
          </View>
          {s < 3 && (
            <View
              className={`w-12 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-700'}`}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View className="px-4">
      <Text className="text-white text-lg font-semibold mb-4">Select Worker</Text>

      {MOCK_WORKERS.map((worker) => (
        <TouchableOpacity
          key={worker.id}
          className={`bg-gray-800 rounded-xl p-4 mb-3 border-2 ${
            selectedWorker?.id === worker.id ? 'border-orange-500' : 'border-transparent'
          }`}
          onPress={() => setSelectedWorker(worker)}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-gray-700 rounded-full items-center justify-center">
              <Ionicons name="person" size={28} color="#6B7280" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white font-semibold text-lg">{worker.name}</Text>
              <View className="flex-row flex-wrap mt-1">
                {worker.skills.map((skill, index) => (
                  <View key={index} className="bg-gray-700 px-2 py-0.5 rounded mr-2">
                    <Text className="text-gray-300 text-xs">{skill}</Text>
                  </View>
                ))}
              </View>
              <View className="flex-row items-center mt-2">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className="text-white ml-1">{worker.rating}</Text>
                <Text className="text-gray-500 mx-2">•</Text>
                <Text className="text-orange-500 font-medium">₹{worker.dailyRate}/day</Text>
              </View>
            </View>
            {selectedWorker?.id === worker.id && (
              <Ionicons name="checkmark-circle" size={24} color="#F97316" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View className="px-4">
      <Text className="text-white text-lg font-semibold mb-4">Agreement Details</Text>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Title *</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-xl px-4 py-3"
          placeholder="e.g., Mason Work for Villa Project"
          placeholderTextColor="#6B7280"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Scope of Work *</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-xl px-4 py-3"
          placeholder="Describe the work to be done..."
          placeholderTextColor="#6B7280"
          value={scopeOfWork}
          onChangeText={setScopeOfWork}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-400 mb-2">Start Date *</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 py-3"
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#6B7280"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-400 mb-2">End Date *</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 py-3"
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#6B7280"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Rate Type *</Text>
        <View className="flex-row space-x-2">
          {RATE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`flex-1 py-3 rounded-xl ${
                rateType === type.id ? 'bg-orange-500' : 'bg-gray-800'
              }`}
              onPress={() => setRateType(type.id)}
            >
              <Text
                className={`text-center font-medium ${
                  rateType === type.id ? 'text-white' : 'text-gray-400'
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Rate Amount (₹) *</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-xl px-4 py-3"
          placeholder={`Amount per ${rateType}`}
          placeholderTextColor="#6B7280"
          value={rateAmount}
          onChangeText={setRateAmount}
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Work Location</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-xl px-4 py-3"
          placeholder="Address of work site"
          placeholderTextColor="#6B7280"
          value={workLocation}
          onChangeText={setWorkLocation}
        />
      </View>

      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-400 mb-2">Working Hours/Day</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 py-3"
            placeholder="8"
            placeholderTextColor="#6B7280"
            value={workingHours}
            onChangeText={setWorkingHours}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-400 mb-2">Notice Period (Days)</Text>
          <TextInput
            className="bg-gray-800 text-white rounded-xl px-4 py-3"
            placeholder="7"
            placeholderTextColor="#6B7280"
            value={terminationNoticeDays}
            onChangeText={setTerminationNoticeDays}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="px-4">
      <Text className="text-white text-lg font-semibold mb-4">Terms & Review</Text>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Termination Terms</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-xl px-4 py-3"
          placeholder="Conditions for termination..."
          placeholderTextColor="#6B7280"
          value={terminationTerms}
          onChangeText={setTerminationTerms}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-400 mb-2">Additional Terms (Optional)</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-xl px-4 py-3"
          placeholder="Any other terms or conditions..."
          placeholderTextColor="#6B7280"
          value={additionalTerms}
          onChangeText={setAdditionalTerms}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Agreement Summary */}
      <View className="bg-gray-800 rounded-xl p-4 mb-4">
        <Text className="text-white font-semibold text-lg mb-3">Agreement Summary</Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Worker</Text>
          <Text className="text-white">{selectedWorker?.name}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Title</Text>
          <Text className="text-white" numberOfLines={1}>{title || '-'}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Duration</Text>
          <Text className="text-white">{startDate} to {endDate}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Rate</Text>
          <Text className="text-orange-500 font-medium">
            ₹{rateAmount || 0}/{rateType}
          </Text>
        </View>
        <View className="flex-row justify-between pt-3 border-t border-gray-700">
          <Text className="text-white font-semibold">Total Contract Value</Text>
          <Text className="text-orange-500 font-bold text-xl">
            ₹{calculateTotalValue().toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Info Box */}
      <View className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <View className="ml-3 flex-1">
            <Text className="text-blue-400 font-medium">How it works</Text>
            <Text className="text-gray-400 text-sm mt-1">
              Once you create this agreement, it will be sent to the worker for review and signature.
              Funds will be held in escrow until work is completed.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Create Agreement</Text>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="px-4 py-4 border-t border-gray-800">
        <View className="flex-row space-x-3">
          {step > 1 && (
            <TouchableOpacity
              className="flex-1 bg-gray-700 py-4 rounded-xl"
              onPress={() => setStep(step - 1)}
            >
              <Text className="text-white text-center font-semibold">Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`flex-1 py-4 rounded-xl ${
              (step === 1 && !selectedWorker) || isSubmitting
                ? 'bg-gray-600'
                : 'bg-orange-500'
            }`}
            onPress={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={(step === 1 && !selectedWorker) || isSubmitting}
          >
            <Text className="text-white text-center font-semibold">
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
