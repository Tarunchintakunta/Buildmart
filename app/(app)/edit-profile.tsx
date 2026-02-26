import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [bio, setBio] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPinCode('560001'); // Mock PIN code
      setCompanyName(
        user.role === 'contractor' || user.role === 'shopkeeper'
          ? user.full_name || ''
          : ''
      );
      setBio('');
    }
  }, [user]);

  // Track changes
  const checkForChanges = useCallback(() => {
    if (!user) return false;
    return (
      fullName !== (user.full_name || '') ||
      email !== (user.email || '') ||
      address !== (user.address || '') ||
      city !== (user.city || '') ||
      pinCode !== '560001' ||
      companyName !==
        (user.role === 'contractor' || user.role === 'shopkeeper'
          ? user.full_name || ''
          : '') ||
      bio !== ''
    );
  }, [fullName, email, address, city, pinCode, companyName, bio, user]);

  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [checkForChanges]);

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }

    // Simulate saving
    Alert.alert('Success', 'Your profile has been updated successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const showCompanyField =
    user?.role === 'contractor' || user?.role === 'shopkeeper';

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={s.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Photo Area */}
        <View style={s.photoSection}>
          <View style={s.avatarContainer}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity style={s.cameraBtn}>
              <Ionicons name="camera" size={16} color={T.white} />
            </TouchableOpacity>
          </View>
          <Text style={s.changePhotoText}>Change Photo</Text>
        </View>

        {/* Form Fields */}
        <View style={s.formContainer}>
          {/* Full Name */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Full Name</Text>
            <TextInput
              style={s.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={T.textMuted}
            />
          </View>

          {/* Phone Number (disabled) */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Phone Number</Text>
            <TextInput
              style={[s.input, s.inputDisabled]}
              value={`+91 ${phone}`}
              editable={false}
            />
            <Text style={s.helperText}>
              Phone number cannot be changed
            </Text>
          </View>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={T.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Address */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Address</Text>
            <TextInput
              style={s.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor={T.textMuted}
            />
          </View>

          {/* City */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>City</Text>
            <TextInput
              style={s.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              placeholderTextColor={T.textMuted}
            />
          </View>

          {/* PIN Code */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>PIN Code</Text>
            <TextInput
              style={s.input}
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="Enter PIN code"
              placeholderTextColor={T.textMuted}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          {/* Company Name (conditional) */}
          {showCompanyField && (
            <View style={s.fieldGroup}>
              <Text style={s.label}>Company Name</Text>
              <TextInput
                style={s.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Enter company name"
                placeholderTextColor={T.textMuted}
              />
            </View>
          )}

          {/* Bio / About */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Bio / About</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
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
    paddingBottom: 12,
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
  saveText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.amber,
  },
  photoSection: {
    alignItems: 'center' as const,
    paddingVertical: 28,
  },
  avatarContainer: {
    position: 'relative' as const,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: T.navy,
  },
  cameraBtn: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: T.bg,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.amber,
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: T.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: T.text,
  },
  inputDisabled: {
    color: T.textMuted,
    backgroundColor: T.bg,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 14,
  },
  helperText: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 4,
    marginLeft: 4,
  },
};
