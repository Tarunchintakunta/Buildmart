import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  lastMessage: string;
  time: string;
  unread: number;
};

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Rajesh Kumar', avatar: 'RK', role: 'shopkeeper', lastMessage: 'The cement delivery will arrive by 3 PM today, sir.', time: '2m ago', unread: 3 },
  { id: '2', name: 'Priya Sharma', avatar: 'PS', role: 'customer', lastMessage: 'Can you share the updated quotation for the tiles?', time: '15m ago', unread: 1 },
  { id: '3', name: 'Anil Verma', avatar: 'AV', role: 'worker', lastMessage: 'I have completed the plumbing work on the 2nd floor.', time: '1h ago', unread: 0 },
  { id: '4', name: 'Suresh Patel', avatar: 'SP', role: 'driver', lastMessage: 'Truck is loaded and leaving the warehouse now.', time: '2h ago', unread: 5 },
  { id: '5', name: 'Meena Devi', avatar: 'MD', role: 'customer', lastMessage: 'Please confirm the order for 500 bricks.', time: '5h ago', unread: 0 },
  { id: '6', name: 'BuildRight Pvt Ltd', avatar: 'BR', role: 'contractor', lastMessage: 'Steel rods are available in 8mm and 12mm variants.', time: 'Yesterday', unread: 0 },
];

export default function ChatListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Conversation; index: number }) => {
    const roleColor = ROLE_COLORS[item.role];
    const hasUnread = item.unread > 0;

    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
        <Pressable
          style={[s.card, hasUnread && s.cardUnread]}
          onPress={() => router.push(`/(app)/chat/${item.id}` as any)}
        >
          {/* Avatar */}
          <View style={[s.avatar, { backgroundColor: roleColor }]}>
            <Text style={s.avatarText}>{item.avatar}</Text>
          </View>

          {/* Content */}
          <View style={s.content}>
            <View style={s.nameRow}>
              <View style={s.nameLeft}>
                <Text style={s.name}>{item.name}</Text>
                <View style={[s.roleBadge, { backgroundColor: roleColor + '18' }]}>
                  <Text style={[s.roleText, { color: roleColor }]}>{ROLE_LABELS[item.role]}</Text>
                </View>
              </View>
              <Text style={s.time}>{item.time}</Text>
            </View>
            <View style={s.messageRow}>
              <Text style={[s.lastMessage, hasUnread && s.lastMessageBold]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {hasUnread && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Messages</Text>
        <Pressable style={s.composeBtn}>
          <Ionicons name="create-outline" size={22} color={T.navy} />
        </Pressable>
      </View>

      {/* Search */}
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
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={T.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Ionicons name="chatbubbles-outline" size={48} color={T.textMuted} />
            </View>
            <Text style={s.emptyTitle}>No conversations</Text>
            <Text style={s.emptySubtitle}>
              {search ? 'No messages match your search' : 'Start a conversation with your team'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: T.navy },
  composeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: T.text },
  list: { padding: 16, gap: 10, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: T.amber,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: T.white },
  content: { flex: 1, gap: 4 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameLeft: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700', color: T.text },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: { fontSize: 10, fontWeight: '700' },
  time: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: { flex: 1, fontSize: 13, color: T.textSecondary },
  lastMessageBold: { fontWeight: '600', color: T.text },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: T.amber,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: T.white },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: T.text, marginBottom: 8 },
  emptySubtitle: {
    fontSize: 14,
    color: T.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
