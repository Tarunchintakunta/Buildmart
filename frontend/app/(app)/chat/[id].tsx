import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LightTheme as T } from '../../../src/theme/colors';

type UserRole = 'customer' | 'shopkeeper' | 'worker' | 'driver' | 'contractor';

const ROLE_COLORS: Record<UserRole, string> = {
  customer: '#3B82F6',
  shopkeeper: '#10B981',
  worker: '#F59E0B',
  driver: '#EF4444',
  contractor: '#8B5CF6',
};

const ROLE_LABELS: Record<UserRole, string> = {
  customer: 'Customer',
  shopkeeper: 'Shopkeeper',
  worker: 'Worker',
  driver: 'Driver',
  contractor: 'Contractor',
};

const CONTACTS: Record<string, { name: string; role: UserRole; avatar: string; online: boolean }> = {
  '1': { name: 'Rajesh Kumar', role: 'shopkeeper', avatar: 'RK', online: true },
  '2': { name: 'Priya Sharma', role: 'customer', avatar: 'PS', online: true },
  '3': { name: 'Anil Verma', role: 'worker', avatar: 'AV', online: false },
  '4': { name: 'Suresh Patel', role: 'driver', avatar: 'SP', online: true },
  '5': { name: 'Meena Devi', role: 'customer', avatar: 'MD', online: false },
  '6': { name: 'BuildRight Pvt Ltd', role: 'contractor', avatar: 'BR', online: true },
};

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
};

const MOCK_MESSAGES_BY_ID: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Namaste, I wanted to check the status of my cement order.', sender: 'me', time: '10:30 AM' },
    { id: '2', text: 'Namaste sir! Let me pull up your order. Can you share the order number?', sender: 'them', time: '10:31 AM' },
    { id: '3', text: 'It is BM-45023. I ordered 20 bags of OPC 53 grade.', sender: 'me', time: '10:32 AM' },
    { id: '4', text: 'Found it! Your order is currently being loaded at our warehouse in Kukatpally.', sender: 'them', time: '10:33 AM' },
    { id: '5', text: 'Delivery is scheduled between 2-4 PM today. Our driver Raju will call before arriving.', sender: 'them', time: '10:33 AM' },
    { id: '6', text: 'Perfect! Will he call at least 30 minutes before?', sender: 'me', time: '10:35 AM' },
    { id: '7', text: 'Yes, he will call 30-45 minutes before. You will also receive a WhatsApp notification with live tracking.', sender: 'them', time: '10:36 AM' },
    { id: '8', text: 'Great. Also, do you have Fe-500D TMT bars in 8mm and 12mm in stock?', sender: 'me', time: '10:38 AM' },
    { id: '9', text: 'Yes! We stock Fe-500D from TATA and JSW. 8mm at ₹65/kg and 12mm at ₹62/kg (minimum 50 kg order).', sender: 'them', time: '10:39 AM' },
    { id: '10', text: 'I need about 500 kg of 12mm. Can I get a bulk discount?', sender: 'me', time: '10:40 AM' },
    { id: '11', text: 'For 500 kg, I can offer ₹60/kg. That saves you ₹1,000 on the total order.', sender: 'them', time: '10:41 AM' },
    { id: '12', text: 'That sounds good. Let me confirm with my contractor and get back to you by evening.', sender: 'me', time: '10:42 AM' },
    { id: '13', text: 'No problem sir. I will hold the stock for you till 6 PM. Feel free to call if you need anything else!', sender: 'them', time: '10:43 AM' },
  ],
  '2': [
    { id: '1', text: 'Hello, I would like a quotation for 300 sqft of ceramic floor tiles.', sender: 'me', time: '9:00 AM' },
    { id: '2', text: 'Sure! We have Italian, Spanish, and Indian brands. What is your budget range?', sender: 'them', time: '9:02 AM' },
    { id: '3', text: 'Looking for ₹40-60 per sqft range, good quality.', sender: 'me', time: '9:03 AM' },
    { id: '4', text: 'I recommend Kajaria Eternity 600x600mm at ₹48/sqft. Very popular for living rooms.', sender: 'them', time: '9:05 AM' },
    { id: '5', text: 'Can you send me the updated quotation with installation cost?', sender: 'me', time: '9:10 AM' },
  ],
  default: [
    { id: '1', text: 'Hello! How can I help you?', sender: 'them', time: '9:00 AM' },
    { id: '2', text: 'Hi, I have a question about my order.', sender: 'me', time: '9:01 AM' },
  ],
};

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = id || '1';
  const contact = CONTACTS[chatId] || { name: 'Unknown', role: 'customer' as UserRole, avatar: '?', online: false };
  const roleColor = ROLE_COLORS[contact.role];

  const initialMessages = MOCK_MESSAGES_BY_ID[chatId] || MOCK_MESSAGES_BY_ID['default'];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 150);
  }, []);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: String(Date.now()),
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender === 'me';
    const showAvatar =
      !isMe && (index === 0 || messages[index - 1].sender !== 'them');

    return (
      <Animated.View
        entering={FadeInUp.delay(Math.min(index * 30, 400)).duration(350)}
        style={[s.msgRow, isMe && s.msgRowMe]}
      >
        {/* Other user avatar */}
        {!isMe && (
          <View style={{ width: 32, marginRight: 6 }}>
            {showAvatar && (
              <View style={[s.msgAvatar, { backgroundColor: roleColor }]}>
                <Text style={s.msgAvatarText}>{contact.avatar.charAt(0)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Bubble */}
        <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
          <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{item.text}</Text>
          <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{item.time}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </Pressable>
        <View style={[s.headerAvatar, { backgroundColor: roleColor }]}>
          <Text style={s.headerAvatarText}>{contact.avatar.charAt(0)}</Text>
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>{contact.name}</Text>
          <View style={s.headerStatusRow}>
            <View style={[s.onlineDot, { backgroundColor: contact.online ? T.success : T.textMuted }]} />
            <Text style={[s.headerStatus, { color: contact.online ? T.success : T.textMuted }]}>
              {contact.online ? 'Online' : 'Offline'}
            </Text>
            <Text style={s.rolePill}>{ROLE_LABELS[contact.role]}</Text>
          </View>
        </View>
        <Pressable style={s.headerAction}>
          <Ionicons name="call-outline" size={20} color={T.navy} />
        </Pressable>
        <Pressable style={s.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={T.navy} />
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={s.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={s.inputBar}>
          <Pressable style={s.attachBtn}>
            <Ionicons name="attach" size={22} color={T.textMuted} />
          </Pressable>
          <View style={s.inputWrapper}>
            <TextInput
              style={s.input}
              placeholder="Type a message..."
              placeholderTextColor={T.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={1000}
            />
          </View>
          {input.trim() ? (
            <Pressable style={s.sendBtn} onPress={sendMessage}>
              <Ionicons name="arrow-up-circle" size={36} color={T.amber} />
            </Pressable>
          ) : (
            <Pressable style={s.micBtn}>
              <Ionicons name="mic-outline" size={22} color={T.textMuted} />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 16, fontWeight: '800', color: T.white },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: T.text },
  headerStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  headerStatus: { fontSize: 12 },
  rolePill: {
    fontSize: 10,
    fontWeight: '600',
    color: T.textMuted,
    backgroundColor: T.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgList: { paddingHorizontal: 12, paddingVertical: 14, gap: 4 },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  msgRowMe: { justifyContent: 'flex-end' },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgAvatarText: { fontSize: 12, fontWeight: '700', color: T.white },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: T.navy,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: T.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: T.border,
  },
  bubbleText: {
    fontSize: 14,
    color: T.text,
    lineHeight: 20,
  },
  bubbleTextMe: { color: T.white },
  bubbleTime: {
    fontSize: 10,
    color: T.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.55)' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 8,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: T.bg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 110,
  },
  input: {
    fontSize: 15,
    color: T.text,
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
});
