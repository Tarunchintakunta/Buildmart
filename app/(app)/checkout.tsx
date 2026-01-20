import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore, useWalletStore } from '../../src/store/useStore';
import { useAuth } from '../../src/context/AuthContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const wallet = useWalletStore((state) => state.wallet);

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = subtotal > 5000 ? 0 : 150; // Free delivery above 5000
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + deliveryFee + tax;

  const walletBalance = wallet?.balance ?? 25000;
  const hasEnoughBalance = walletBalance >= total;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a delivery address');
      return;
    }

    if (!hasEnoughBalance) {
      Alert.alert(
        'Insufficient Balance',
        'You do not have enough balance in your wallet. Please add funds to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Funds', onPress: () => {} },
        ]
      );
      return;
    }

    setIsProcessing(true);

    // Simulate order placement
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      Alert.alert(
        'Order Placed!',
        'Your order has been placed successfully. You can track it in the Orders section.',
        [
          {
            text: 'View Orders',
            onPress: () => router.replace('/(app)/(tabs)/orders'),
          },
        ]
      );
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Cart</Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cart-outline" size={80} color="#6B7280" />
          <Text className="text-white text-xl font-semibold mt-4">Your cart is empty</Text>
          <Text className="text-gray-400 text-center mt-2">
            Add some construction materials to get started
          </Text>
          <TouchableOpacity
            className="bg-orange-500 px-8 py-3 rounded-full mt-6"
            onPress={() => router.replace('/(app)/(tabs)/shop')}
          >
            <Text className="text-white font-semibold">Browse Shop</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Checkout</Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={() => clearCart()}>
          <Text className="text-red-500">Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Shop Info */}
        {items[0]?.shop && (
          <View className="px-4 py-3 bg-gray-800/50">
            <View className="flex-row items-center">
              <Ionicons name="storefront" size={20} color="#F97316" />
              <Text className="text-white font-medium ml-2">{items[0].shop.name}</Text>
            </View>
          </View>
        )}

        {/* Cart Items */}
        <View className="px-4 py-4">
          <Text className="text-white text-lg font-semibold mb-3">
            Cart Items ({items.length})
          </Text>

          {items.map((item) => (
            <View key={item.inventory_id} className="bg-gray-800 rounded-xl p-4 mb-3">
              <View className="flex-row">
                <View className="w-16 h-16 bg-gray-700 rounded-lg items-center justify-center">
                  <Ionicons name="cube" size={28} color="#6B7280" />
                </View>

                <View className="flex-1 ml-4">
                  <Text className="text-white font-medium" numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text className="text-orange-500 font-bold mt-1">
                    ₹{item.price} / {item.product.unit}
                  </Text>
                </View>

                <TouchableOpacity
                  className="p-2"
                  onPress={() => removeItem(item.inventory_id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-700">
                <View className="flex-row items-center bg-gray-700 rounded-lg">
                  <TouchableOpacity
                    className="px-4 py-2"
                    onPress={() =>
                      updateQuantity(item.inventory_id, item.quantity - 1)
                    }
                  >
                    <Ionicons name="remove" size={18} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white font-bold px-4">{item.quantity}</Text>
                  <TouchableOpacity
                    className="px-4 py-2"
                    onPress={() =>
                      updateQuantity(item.inventory_id, item.quantity + 1)
                    }
                  >
                    <Ionicons name="add" size={18} color="white" />
                  </TouchableOpacity>
                </View>
                <Text className="text-white font-bold text-lg">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Delivery Address</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <TextInput
              className="text-white"
              placeholder="Enter delivery address..."
              placeholderTextColor="#6B7280"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Delivery Notes */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Delivery Notes (Optional)</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <TextInput
              className="text-white"
              placeholder="Any special instructions for delivery..."
              placeholderTextColor="#6B7280"
              value={deliveryNotes}
              onChangeText={setDeliveryNotes}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Delivery Time */}
        <View className="px-4 pb-4">
          <View className="bg-orange-500/10 rounded-xl p-4 flex-row items-center border border-orange-500/30">
            <Ionicons name="time" size={24} color="#F97316" />
            <View className="ml-3">
              <Text className="text-orange-500 font-semibold">Estimated Delivery</Text>
              <Text className="text-gray-400">30-60 minutes (Heavy materials)</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className="px-4 pb-4">
          <Text className="text-white text-lg font-semibold mb-3">Order Summary</Text>
          <View className="bg-gray-800 rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-white">₹{subtotal.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Delivery Fee</Text>
              <Text className={deliveryFee === 0 ? 'text-green-500' : 'text-white'}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Tax (GST 18%)</Text>
              <Text className="text-white">₹{tax.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between pt-3 border-t border-gray-700">
              <Text className="text-white font-semibold text-lg">Total</Text>
              <Text className="text-orange-500 font-bold text-xl">
                ₹{total.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance */}
        <View className="px-4 pb-8">
          <View className={`rounded-xl p-4 flex-row items-center justify-between ${
            hasEnoughBalance ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <View className="flex-row items-center">
              <Ionicons
                name="wallet"
                size={24}
                color={hasEnoughBalance ? '#22C55E' : '#EF4444'}
              />
              <View className="ml-3">
                <Text className={hasEnoughBalance ? 'text-green-500' : 'text-red-500'}>
                  Wallet Balance
                </Text>
                <Text className="text-white font-bold text-lg">
                  ₹{walletBalance.toLocaleString()}
                </Text>
              </View>
            </View>
            {!hasEnoughBalance && (
              <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-full">
                <Text className="text-white font-medium">Add Funds</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="px-4 py-4 bg-gray-800 border-t border-gray-700">
        <TouchableOpacity
          className={`py-4 rounded-xl flex-row items-center justify-center ${
            hasEnoughBalance && !isProcessing ? 'bg-orange-500' : 'bg-gray-600'
          }`}
          onPress={handlePlaceOrder}
          disabled={!hasEnoughBalance || isProcessing}
        >
          {isProcessing ? (
            <Text className="text-white font-semibold text-lg">Processing...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Place Order • ₹{total.toLocaleString()}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
