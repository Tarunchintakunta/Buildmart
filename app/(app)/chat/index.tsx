import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '../../../src/theme/designSystem';

const T = LightTheme;

const ROLE_COLORS: Record<string, string> = {
  customer: '#3B82F6',
  worker: '#F59E0B',
  shopkeeper: '#10B981',
  driver: '#EF4444',
};

const conversations = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    lastMessage: 'The cement delivery will arrive by 3 PM today',
    time: '2m ago',
    unreadCount: 3,
    avatar: 'R',
    role: 'shopkeeper',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    lastMessage: 'Can you share the updated quotation for the tiles?',
    time: '15m ago',
    unreadCount: 1,
    avatar: 'P',
    role: 'customer',
  },
  {
    id: '3',
    name: 'Anil Verma',
    lastMessage: 'I have completed the plumbing work on the 2nd floor',
    time: '1h ago',
    unreadCount: 0,
    avatar: 'A',
    role: 'worker',
  },
  {
    id: '4',
    name: 'Suresh Patel',
    lastMessage: 'Truck is loaded and leaving the warehouse now',
    time: '2h ago',
    unreadCount: 5,
    avatar: 'S',
    role: 'driver',
  },
  {
    id: '5',
    name: 'Meena Devi',
    lastMessage: 'Please confirm the order for 500 bricks',
    time: '5h ago',
    unreadCount: 0,
    avatar: 'M',
    role: 'customer',
  },
  {
    id: '6',
    name: 'Vikram Singh',
    lastMessage: 'The steel rods are available in 8mm and 12mm variants',
    time: 'Yesterday',
    unreadCount: 0,
    avatar: 'V',
    role: 'shopkeeper',
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const renderConversation = ({ item }: { item: (typeof conversations)[0] }) => {
    const roleColor = ROLE_COLORS[item.role] || T.textMuted;
    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[
          s.card,
          hasUnread && s.cardUnread,
        ]}
        onPress={() => router.push(`/(app)/chat/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={s.row}>
          {/* Avatar */}
          <View style={[s.avatar, { backgroundColor: roleColor }]}>
            <Text style={s.avatarText}>{item.avatar}</Text>
          </View>

          {/* Content */}
          <View style={s.contentCol}>
            <View style={s.nameRow}>
              <Text style={s.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={s.time}>{item.time}</Text>
            </View>
            <View style={s.messageRow}>
              <Text style={s.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {hasUnread && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={s.emptyContainer}>
      <View style={s.emptyIcon}>
        <Ionicons name="chatbubbles-outline" size={48} color={T.textMuted} />
      </View>
      <Text style={s.emptyTitle}>No conversations</Text>
      <Text style={s.emptySubtitle}>
        {search
          ? 'No messages match your search'
          : 'Start a conversation with your team'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Messages</Text>
        <TouchableOpacity style={s.headerAction}>
          <Ionicons name="create-outline" size={22} color={T.navy} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={s.searchContainer}>
        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={18} color={T.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conversation List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const s = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: T.navy,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: T.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: T.amber,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.white,
  },
  contentCol: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  name: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: T.text,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: T.textMuted,
  },
  messageRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  lastMessage: {
    fontSize: 13,
    color: T.textSecondary,
    flex: 1,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: T.amber,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: T.white,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: T.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
};
