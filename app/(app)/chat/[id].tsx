import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const CONTACTS: Record<string, { name: string; role: string; avatar: string }> = {
  '1': { name: 'Rajesh Kumar', role: 'shopkeeper', avatar: 'R' },
  '2': { name: 'Priya Sharma', role: 'customer', avatar: 'P' },
  '3': { name: 'Anil Verma', role: 'worker', avatar: 'A' },
  '4': { name: 'Suresh Patel', role: 'driver', avatar: 'S' },
  '5': { name: 'Meena Devi', role: 'customer', avatar: 'M' },
  '6': { name: 'Vikram Singh', role: 'shopkeeper', avatar: 'V' },
};

const ROLE_COLORS: Record<string, string> = {
  customer: '#3B82F6',
  worker: '#F59E0B',
  shopkeeper: '#10B981',
  driver: '#EF4444',
};

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
};

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Hi, I wanted to check on my order status', sender: 'me', time: '10:30 AM' },
  { id: '2', text: 'Hello! Let me check that for you. What is your order number?', sender: 'them', time: '10:31 AM' },
  { id: '3', text: 'It is BM-45023', sender: 'me', time: '10:32 AM' },
  { id: '4', text: 'Found it! Your order of 500 bricks and 10 bags of cement is being loaded at the warehouse right now.', sender: 'them', time: '10:33 AM' },
  { id: '5', text: 'The delivery is scheduled for today between 2-4 PM', sender: 'them', time: '10:33 AM' },
  { id: '6', text: 'Great, thanks! Will the driver call before arriving?', sender: 'me', time: '10:35 AM' },
  { id: '7', text: 'Yes, the driver will call you 30 minutes before reaching your site. You will also get a notification when the truck leaves the warehouse.', sender: 'them', time: '10:36 AM' },
  { id: '8', text: 'Perfect. Also, do you have 8mm TMT steel rods in stock?', sender: 'me', time: '10:38 AM' },
  { id: '9', text: 'Yes, we have Fe-500D grade 8mm TMT bars. Rs.65 per kg. Would you like to add them to an order?', sender: 'them', time: '10:39 AM' },
  { id: '10', text: 'Let me check the quantity needed and get back to you', sender: 'me', time: '10:40 AM' },
];

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const contact = CONTACTS[id || '1'] || { name: 'Unknown', role: 'customer', avatar: '?' };
  const roleColor = ROLE_COLORS[contact.role] || T.textMuted;

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: String(messages.length + 1),
      text: input.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender === 'me';
    const showAvatar = !isMe && (index === 0 || messages[index - 1].sender !== 'them');

    return (
      <View style={[s.messageRow, isMe && s.messageRowMe]}>
        {!isMe && (
          <View style={{ width: 32 }}>
            {showAvatar && (
              <View style={[s.msgAvatar, { backgroundColor: roleColor }]}>
                <Text style={s.msgAvatarText}>{contact.avatar}</Text>
              </View>
            )}
          </View>
        )}
        <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
          <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{item.text}</Text>
          <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.navy} />
        </TouchableOpacity>
        <View style={[s.headerAvatar, { backgroundColor: roleColor }]}>
          <Text style={s.headerAvatarText}>{contact.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerName}>{contact.name}</Text>
          <Text style={s.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity style={s.headerAction}>
          <Ionicons name="call-outline" size={20} color={T.navy} />
        </TouchableOpacity>
        <TouchableOpacity style={s.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={T.navy} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={s.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={s.inputBar}>
          <TouchableOpacity style={s.attachBtn}>
            <Ionicons name="add-circle-outline" size={24} color={T.textMuted} />
          </TouchableOpacity>
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
            <TouchableOpacity style={s.sendBtn} onPress={sendMessage}>
              <Ionicons name="send" size={20} color={T.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.micBtn}>
              <Ionicons name="mic-outline" size={22} color={T.navy} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.white,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: T.text,
  },
  headerStatus: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 1,
  },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  messageList: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  messageRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    marginBottom: 4,
    gap: 6,
  },
  messageRowMe: {
    justifyContent: 'flex-end' as const,
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  msgAvatarText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: T.white,
  },
  bubble: {
    maxWidth: '75%' as any,
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
  bubbleTextMe: {
    color: T.white,
  },
  bubbleTime: {
    fontSize: 10,
    color: T.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end' as const,
  },
  bubbleTimeMe: {
    color: 'rgba(255,255,255,0.6)',
  },
  inputBar: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: T.bg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: T.text,
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.bg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
};
