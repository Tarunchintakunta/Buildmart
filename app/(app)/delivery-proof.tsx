import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

const ORDER_INFO = {
  orderNumber: 'BM-8821',
  customer: 'Rajesh Kumar',
  address: '45/A, 3rd Cross, JP Nagar, Bangalore - 560078',
};

export default function DeliveryProofScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<boolean[]>([true, false, false, false]);
  const [notes, setNotes] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [signatureCaptured, setSignatureCaptured] = useState(false);

  const handleTakePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = true;
    setPhotos(updated);
  };

  const handleOtpChange = (text: string, index: number) => {
    const updated = [...otpDigits];
    updated[index] = text.slice(0, 1);
    setOtpDigits(updated);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Delivery Proof</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Order Info Card */}
        <View style={s.orderCard}>
          <View style={s.orderRow}>
            <Ionicons name="receipt-outline" size={18} color={T.navy} />
            <Text style={s.orderNumber}>Order #{ORDER_INFO.orderNumber}</Text>
          </View>
          <Text style={s.customerName}>{ORDER_INFO.customer}</Text>
          <View style={s.addressRow}>
            <Ionicons name="location-outline" size={14} color={T.textMuted} />
            <Text style={s.addressText}>{ORDER_INFO.address}</Text>
          </View>
        </View>

        {/* Photo Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Delivery Photos</Text>
          <Text style={s.sectionSub}>Take photos of delivered items as proof</Text>
          <View style={s.photoGrid}>
            {photos.map((taken, i) => (
              <TouchableOpacity
                key={i}
                style={[s.photoBox, taken && s.photoBoxTaken]}
                onPress={() => !taken && handleTakePhoto(i)}
              >
                {taken ? (
                  <View style={s.photoTaken}>
                    <Ionicons name="checkmark-circle" size={28} color={T.success} />
                    <Text style={s.photoTakenText}>Photo {i + 1}</Text>
                  </View>
                ) : (
                  <View style={s.photoEmpty}>
                    <Ionicons name="camera-outline" size={28} color={T.textMuted} />
                    <Text style={s.photoEmptyText}>Take Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Signature Area */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Customer Signature</Text>
          <TouchableOpacity
            style={[s.signatureBox, signatureCaptured && s.signatureBoxCaptured]}
            onPress={() => setSignatureCaptured(true)}
          >
            {signatureCaptured ? (
              <View style={s.signatureDone}>
                <Ionicons name="checkmark-circle" size={24} color={T.success} />
                <Text style={s.signatureDoneText}>Signature Captured</Text>
              </View>
            ) : (
              <View style={s.signatureEmpty}>
                <Ionicons name="pencil-outline" size={24} color={T.textMuted} />
                <Text style={s.signatureLabel}>Customer Signature</Text>
                <Text style={s.signatureTap}>Tap to capture</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Delivery Notes */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Delivery Notes</Text>
          <TextInput
            style={s.notesInput}
            placeholder="Add any delivery notes here..."
            placeholderTextColor={T.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* OTP Verification */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>OTP Verification</Text>
          <Text style={s.sectionSub}>Enter 4-digit OTP shared by customer</Text>
          <View style={s.otpRow}>
            {otpDigits.map((digit, i) => (
              <TextInput
                key={i}
                style={[s.otpBox, digit ? s.otpBoxFilled : null]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>
        </View>

        {/* Report Issue Link */}
        <TouchableOpacity style={s.reportIssue}>
          <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
          <Text style={s.reportIssueText}>Report Issue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Delivery Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.confirmBtn}>
          <Ionicons name="checkmark-circle" size={20} color={T.white} />
          <Text style={s.confirmBtnText}>Confirm Delivery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
  },
  orderCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  orderRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.navy,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: T.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: T.textMuted,
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 10,
  },
  photoBox: {
    width: '47%' as const,
    aspectRatio: 1,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: 'dashed' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  photoBoxTaken: {
    borderColor: T.success,
    borderStyle: 'solid' as const,
    backgroundColor: '#F0FDF4',
  },
  photoTaken: {
    alignItems: 'center' as const,
    gap: 6,
  },
  photoTakenText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: T.success,
  },
  photoEmpty: {
    alignItems: 'center' as const,
    gap: 6,
  },
  photoEmptyText: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: '500' as const,
  },
  signatureBox: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: 'dashed' as const,
    height: 120,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  signatureBoxCaptured: {
    borderColor: T.success,
    borderStyle: 'solid' as const,
    backgroundColor: '#F0FDF4',
  },
  signatureEmpty: {
    alignItems: 'center' as const,
    gap: 6,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.textSecondary,
  },
  signatureTap: {
    fontSize: 12,
    color: T.textMuted,
  },
  signatureDone: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  signatureDoneText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.success,
  },
  notesInput: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: T.text,
    minHeight: 100,
    paddingTop: 14,
    marginTop: 8,
  },
  otpRow: {
    flexDirection: 'row' as const,
    gap: 12,
    justifyContent: 'center' as const,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: T.border,
    backgroundColor: T.surface,
    fontSize: 22,
    fontWeight: '700' as const,
    color: T.text,
  },
  otpBoxFilled: {
    borderColor: T.navy,
  },
  reportIssue: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 24,
    gap: 6,
  },
  reportIssueText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  confirmBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: T.success,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: T.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
};
