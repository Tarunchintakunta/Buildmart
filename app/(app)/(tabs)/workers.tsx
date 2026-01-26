import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

const SKILLS = [
  { id: 'all', name: 'All', icon: 'people' },
  { id: 'coolie', name: 'Coolie', icon: 'fitness' },
  { id: 'mason', name: 'Mason', icon: 'construct' },
  { id: 'electrician', name: 'Electrician', icon: 'flash' },
  { id: 'plumber', name: 'Plumber', icon: 'water' },
  { id: 'carpenter', name: 'Carpenter', icon: 'hammer' },
  { id: 'painter', name: 'Painter', icon: 'color-palette' },
  { id: 'welder', name: 'Welder', icon: 'flame' },
];

const WORKERS = [
  {
    id: 'w1',
    name: 'Ramu Yadav',
    skills: ['Coolie', 'Helper'],
    dailyRate: 600,
    hourlyRate: 100,
    rating: 4.5,
    totalJobs: 120,
    status: 'waiting',
    isVerified: true,
    experience: 5,
    distance: '2.3 km',
  },
  {
    id: 'w2',
    name: 'Suresh Kumar',
    skills: ['Mason', 'Painter'],
    dailyRate: 800,
    hourlyRate: 120,
    rating: 4.8,
    totalJobs: 200,
    status: 'working',
    isVerified: true,
    experience: 8,
    distance: '3.1 km',
  },
  {
    id: 'w3',
    name: 'Mohammed Ali',
    skills: ['Electrician'],
    dailyRate: 900,
    hourlyRate: 150,
    rating: 4.6,
    totalJobs: 150,
    status: 'waiting',
    isVerified: true,
    experience: 6,
    distance: '1.8 km',
  },
  {
    id: 'w4',
    name: 'Ganesh Babu',
    skills: ['Plumber', 'Welder'],
    dailyRate: 850,
    hourlyRate: 130,
    rating: 4.7,
    totalJobs: 180,
    status: 'waiting',
    isVerified: false,
    experience: 10,
    distance: '4.2 km',
  },
  {
    id: 'w5',
    name: 'Venkat Rao',
    skills: ['Carpenter'],
    dailyRate: 1000,
    hourlyRate: 160,
    rating: 4.9,
    totalJobs: 250,
    status: 'working',
    isVerified: true,
    experience: 12,
    distance: '2.8 km',
  },
];

export default function WorkersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const isContractor = user?.role === 'contractor';

  const filteredWorkers = WORKERS.filter((worker) => {
    const matchesSearch = worker.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSkill =
      selectedSkill === 'all' ||
      worker.skills.some((s) => s.toLowerCase() === selectedSkill);
    const matchesAvailability = !showAvailableOnly || worker.status === 'waiting';
    return matchesSearch && matchesSkill && matchesAvailability;
  });

  const renderWorker = ({ item: worker }: { item: typeof WORKERS[0] }) => (
    <TouchableOpacity
      className="bg-gray-800 rounded-xl p-4 mb-3"
      onPress={() => router.push(`/(app)/worker/${worker.id}`)}
    >
      <View className="flex-row">
        {/* Avatar */}
        <View className="w-16 h-16 bg-gray-700 rounded-full items-center justify-center">
          <Ionicons name="person" size={32} color="#6B7280" />
          {worker.isVerified && (
            <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-semibold text-lg">{worker.name}</Text>
            <View
              className={`px-2 py-1 rounded ${
                worker.status === 'waiting' ? 'bg-green-500/20' : 'bg-orange-500/20'
              }`}
            >
              <Text
                className={
                  worker.status === 'waiting' ? 'text-green-500' : 'text-orange-500'
                }
              >
                {worker.status === 'waiting' ? 'Available' : 'Working'}
              </Text>
            </View>
          </View>

          {/* Skills */}
          <View className="flex-row flex-wrap mt-2">
            {worker.skills.map((skill, index) => (
              <View key={index} className="bg-gray-700 px-2 py-1 rounded mr-2 mb-1">
                <Text className="text-gray-300 text-xs">{skill}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="text-white ml-1">{worker.rating}</Text>
            <Text className="text-gray-500 mx-2">•</Text>
            <Text className="text-gray-400">{worker.totalJobs} jobs</Text>
            <Text className="text-gray-500 mx-2">•</Text>
            <Text className="text-gray-400">{worker.experience}y exp</Text>
          </View>

          {/* Rate & Distance */}
          <View className="flex-row items-center justify-between mt-3">
            <View>
              <Text className="text-orange-500 font-bold">₹{worker.dailyRate}/day</Text>
              <Text className="text-gray-500 text-xs">₹{worker.hourlyRate}/hr</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 ml-1">{worker.distance}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3 mt-4 pt-4 border-t border-gray-700">
        <TouchableOpacity
          className="flex-1 bg-gray-700 py-3 rounded-lg flex-row items-center justify-center"
          onPress={() => router.push(`/(app)/worker/${worker.id}`)}
        >
          <Ionicons name="person" size={18} color="#9CA3AF" />
          <Text className="text-gray-300 font-medium ml-2">View Profile</Text>
        </TouchableOpacity>

        {worker.status === 'waiting' && worker.isVerified && (
          <>
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center"
              onPress={() => router.push(`/(app)/hire?workerId=${worker.id}`)}
            >
              <Ionicons name="calendar" size={18} color="white" />
              <Text className="text-white font-medium ml-2">
                {isContractor ? 'Hire Long-term' : 'Book Now'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {!worker.isVerified && (
          <View className="flex-1 bg-yellow-500/20 py-3 rounded-lg flex-row items-center justify-center">
            <Ionicons name="warning" size={18} color="#EAB308" />
            <Text className="text-yellow-500 font-medium ml-2">Not Verified</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View 
        className="px-5 py-4 border-b"
        style={{ borderBottomColor: '#374151' }}
      >
        <Text className="text-white text-3xl font-bold mb-4">
          {isContractor ? 'Hire Workers' : 'Find Workers'}
        </Text>

        {/* Search Bar */}
        <View 
          className="flex-row items-center rounded-2xl px-4"
          style={{
            backgroundColor: '#1F2937',
            borderWidth: 1,
            borderColor: '#374151',
          }}
        >
          <Ionicons name="search" size={22} color="#6B7280" />
          <TextInput
            className="flex-1 text-white py-4 ml-3 text-base"
            placeholder="Search workers..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
              <Ionicons name="close-circle" size={22} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Skills Filter */}
      <View className="py-4 border-b" style={{ borderBottomColor: '#374151' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {SKILLS.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              className="flex-row items-center px-5 py-3 rounded-xl mr-3"
              style={{
                backgroundColor: selectedSkill === skill.id ? '#F97316' : '#1F2937',
              }}
              onPress={() => setSelectedSkill(skill.id)}
            >
              <Ionicons
                name={skill.icon as any}
                size={18}
                color={selectedSkill === skill.id ? 'white' : '#9CA3AF'}
              />
              <Text
                className="ml-2 font-semibold"
                style={{
                  color: selectedSkill === skill.id ? '#FFFFFF' : '#9CA3AF',
                  fontSize: 14,
                }}
              >
                {skill.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Available Filter */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <Text className="text-gray-400">{filteredWorkers.length} workers found</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setShowAvailableOnly(!showAvailableOnly)}
        >
          <View
            className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
              showAvailableOnly ? 'bg-orange-500 border-orange-500' : 'border-gray-600'
            }`}
          >
            {showAvailableOnly && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
          <Text className="text-gray-400">Available only</Text>
        </TouchableOpacity>
      </View>

      {/* Contractor Banner */}
      {isContractor && (
        <TouchableOpacity
          className="mx-4 mb-3 bg-purple-500/10 rounded-xl p-4 flex-row items-center border border-purple-500/30"
          onPress={() => router.push('/(app)/agreement/create')}
        >
          <Ionicons name="document-text" size={24} color="#A855F7" />
          <View className="ml-3 flex-1">
            <Text className="text-purple-400 font-semibold">Create Long-term Agreement</Text>
            <Text className="text-gray-400 text-sm">
              Hire workers for weeks or months with digital contracts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A855F7" />
        </TouchableOpacity>
      )}

      {/* Workers List */}
      <FlatList
        data={filteredWorkers}
        renderItem={renderWorker}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="people" size={48} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No workers found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
