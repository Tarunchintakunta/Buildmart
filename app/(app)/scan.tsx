import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRScanner from '../../src/components/QRScanner';

interface ScannedData {
  raw: string;
  type: string;
  parsed: {
    type: 'order' | 'delivery' | 'worker' | 'payment' | 'product' | 'url' | 'text' | 'unknown';
    data: Record<string, any>;
  };
}

function parseQRData(rawData: string): ScannedData['parsed'] {
  // Try to parse as JSON
  try {
    const jsonData = JSON.parse(rawData);

    // Check for known types
    if (jsonData.orderId || jsonData.order_id) {
      return {
        type: 'order',
        data: {
          orderId: jsonData.orderId || jsonData.order_id,
          ...jsonData
        }
      };
    }

    if (jsonData.deliveryId || jsonData.delivery_id) {
      return {
        type: 'delivery',
        data: {
          deliveryId: jsonData.deliveryId || jsonData.delivery_id,
          ...jsonData
        }
      };
    }

    if (jsonData.workerId || jsonData.worker_id) {
      return {
        type: 'worker',
        data: {
          workerId: jsonData.workerId || jsonData.worker_id,
          ...jsonData
        }
      };
    }

    if (jsonData.paymentId || jsonData.payment_id || jsonData.amount) {
      return {
        type: 'payment',
        data: jsonData
      };
    }

    if (jsonData.productId || jsonData.product_id || jsonData.sku) {
      return {
        type: 'product',
        data: jsonData
      };
    }

    return {
      type: 'unknown',
      data: jsonData
    };
  } catch {
    // Not JSON, try other formats
  }

  // Check if URL
  if (rawData.startsWith('http://') || rawData.startsWith('https://')) {
    return {
      type: 'url',
      data: { url: rawData }
    };
  }

  // Check for known prefixes
  if (rawData.startsWith('ORD-') || rawData.startsWith('ORDER-')) {
    return {
      type: 'order',
      data: { orderId: rawData }
    };
  }

  if (rawData.startsWith('DEL-') || rawData.startsWith('DELIVERY-')) {
    return {
      type: 'delivery',
      data: { deliveryId: rawData }
    };
  }

  if (rawData.startsWith('WRK-') || rawData.startsWith('WORKER-')) {
    return {
      type: 'worker',
      data: { workerId: rawData }
    };
  }

  if (rawData.startsWith('PAY-') || rawData.startsWith('PAYMENT-')) {
    return {
      type: 'payment',
      data: { paymentId: rawData }
    };
  }

  if (rawData.startsWith('PRD-') || rawData.startsWith('PRODUCT-') || rawData.startsWith('SKU-')) {
    return {
      type: 'product',
      data: { productId: rawData }
    };
  }

  // Default to text
  return {
    type: 'text',
    data: { text: rawData }
  };
}

function getTypeIcon(type: ScannedData['parsed']['type']): string {
  switch (type) {
    case 'order': return 'receipt';
    case 'delivery': return 'car';
    case 'worker': return 'person';
    case 'payment': return 'wallet';
    case 'product': return 'cube';
    case 'url': return 'link';
    default: return 'document-text';
  }
}

function getTypeColor(type: ScannedData['parsed']['type']): string {
  switch (type) {
    case 'order': return '#3B82F6';
    case 'delivery': return '#22C55E';
    case 'worker': return '#8B5CF6';
    case 'payment': return '#F97316';
    case 'product': return '#EC4899';
    case 'url': return '#06B6D4';
    default: return '#6B7280';
  }
}

function getTypeLabel(type: ScannedData['parsed']['type']): string {
  switch (type) {
    case 'order': return 'Order';
    case 'delivery': return 'Delivery';
    case 'worker': return 'Worker';
    case 'payment': return 'Payment';
    case 'product': return 'Product';
    case 'url': return 'Website Link';
    case 'text': return 'Text Data';
    default: return 'Unknown Data';
  }
}

export default function ScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [showScanner, setShowScanner] = useState(true);

  const handleScan = (data: string, type: string) => {
    const parsed = parseQRData(data);
    setScannedData({
      raw: data,
      type,
      parsed
    });
    setShowScanner(false);
  };

  const handleClose = () => {
    router.back();
  };

  const handleScanAgain = () => {
    setScannedData(null);
    setShowScanner(true);
  };

  const handleAction = () => {
    if (!scannedData) return;

    const { parsed } = scannedData;

    switch (parsed.type) {
      case 'order':
        if (parsed.data.orderId) {
          router.push(`/order/${parsed.data.orderId}`);
        }
        break;
      case 'worker':
        if (parsed.data.workerId) {
          router.push(`/worker/${parsed.data.workerId}`);
        }
        break;
      case 'url':
        Alert.alert(
          'Open Link',
          `Do you want to open this link?\n${parsed.data.url}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open', onPress: () => {
              // In a real app, use Linking.openURL
              Alert.alert('Link', parsed.data.url);
            }}
          ]
        );
        break;
      default:
        Alert.alert(
          'Data Scanned',
          `Type: ${getTypeLabel(parsed.type)}\n\n${JSON.stringify(parsed.data, null, 2)}`
        );
    }
  };

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleScan}
        onClose={handleClose}
        title={params.mode === 'delivery' ? 'Scan Delivery QR' : 'Scan QR Code'}
        subtitle={params.mode === 'delivery'
          ? 'Scan the delivery confirmation QR code'
          : 'Position the QR code within the frame'
        }
      />
    );
  }

  // Result view
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={handleClose} className="mr-4">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold flex-1">Scan Result</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {scannedData && (
          <>
            {/* Type Badge */}
            <View className="items-center mb-6">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: `${getTypeColor(scannedData.parsed.type)}20` }}
              >
                <Ionicons
                  name={getTypeIcon(scannedData.parsed.type) as any}
                  size={40}
                  color={getTypeColor(scannedData.parsed.type)}
                />
              </View>
              <Text className="text-white text-xl font-bold">
                {getTypeLabel(scannedData.parsed.type)}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Successfully scanned
              </Text>
            </View>

            {/* Data Card */}
            <View className="bg-gray-800 rounded-xl p-4 mb-4">
              <Text className="text-gray-400 text-sm mb-2">Scanned Data</Text>

              {scannedData.parsed.type === 'order' && (
                <View>
                  <Text className="text-white text-lg font-semibold">
                    Order: {scannedData.parsed.data.orderId}
                  </Text>
                  {scannedData.parsed.data.customer && (
                    <Text className="text-gray-400 mt-1">
                      Customer: {scannedData.parsed.data.customer}
                    </Text>
                  )}
                  {scannedData.parsed.data.total && (
                    <Text className="text-green-500 font-bold mt-1">
                      Total: ₹{scannedData.parsed.data.total}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'delivery' && (
                <View>
                  <Text className="text-white text-lg font-semibold">
                    Delivery: {scannedData.parsed.data.deliveryId}
                  </Text>
                  {scannedData.parsed.data.status && (
                    <Text className="text-gray-400 mt-1">
                      Status: {scannedData.parsed.data.status}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'worker' && (
                <View>
                  <Text className="text-white text-lg font-semibold">
                    Worker: {scannedData.parsed.data.workerId}
                  </Text>
                  {scannedData.parsed.data.name && (
                    <Text className="text-gray-400 mt-1">
                      Name: {scannedData.parsed.data.name}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'payment' && (
                <View>
                  <Text className="text-white text-lg font-semibold">
                    Payment: {scannedData.parsed.data.paymentId || 'Pending'}
                  </Text>
                  {scannedData.parsed.data.amount && (
                    <Text className="text-green-500 font-bold text-xl mt-1">
                      ₹{scannedData.parsed.data.amount}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'product' && (
                <View>
                  <Text className="text-white text-lg font-semibold">
                    Product: {scannedData.parsed.data.productId || scannedData.parsed.data.sku}
                  </Text>
                  {scannedData.parsed.data.name && (
                    <Text className="text-gray-400 mt-1">
                      {scannedData.parsed.data.name}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'url' && (
                <Text className="text-blue-400 text-base" numberOfLines={3}>
                  {scannedData.parsed.data.url}
                </Text>
              )}

              {(scannedData.parsed.type === 'text' || scannedData.parsed.type === 'unknown') && (
                <Text className="text-white text-base">
                  {scannedData.raw}
                </Text>
              )}
            </View>

            {/* Raw Data */}
            <View className="bg-gray-800 rounded-xl p-4 mb-6">
              <Text className="text-gray-400 text-sm mb-2">Raw Content</Text>
              <Text className="text-gray-300 text-sm font-mono" numberOfLines={5}>
                {scannedData.raw}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              {(scannedData.parsed.type === 'order' ||
                scannedData.parsed.type === 'worker' ||
                scannedData.parsed.type === 'url') && (
                <TouchableOpacity
                  className="py-4 rounded-xl flex-row items-center justify-center"
                  style={{ backgroundColor: getTypeColor(scannedData.parsed.type) }}
                  onPress={handleAction}
                >
                  <Ionicons
                    name={scannedData.parsed.type === 'url' ? 'open-outline' : 'arrow-forward'}
                    size={20}
                    color="white"
                  />
                  <Text className="text-white font-semibold text-lg ml-2">
                    {scannedData.parsed.type === 'order' ? 'View Order' :
                     scannedData.parsed.type === 'worker' ? 'View Worker' :
                     scannedData.parsed.type === 'url' ? 'Open Link' :
                     'View Details'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="bg-gray-700 py-4 rounded-xl flex-row items-center justify-center"
                onPress={handleScanAgain}
              >
                <Ionicons name="scan" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Scan Another
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
