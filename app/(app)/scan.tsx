import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRScanner from '../../src/components/QRScanner';
import { LightTheme } from '../../src/theme/designSystem';

const T = LightTheme;

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
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={handleClose} style={s.closeButton}>
          <Ionicons name="close" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Scan Result</Text>
      </View>

      <ScrollView style={s.scrollView}>
        {scannedData && (
          <>
            {/* Type Badge */}
            <View style={s.badgeContainer}>
              <View
                style={[
                  s.badgeCircle,
                  { backgroundColor: `${getTypeColor(scannedData.parsed.type)}26` },
                ]}
              >
                <Ionicons
                  name={getTypeIcon(scannedData.parsed.type) as any}
                  size={40}
                  color={getTypeColor(scannedData.parsed.type)}
                />
              </View>
              <Text style={s.typeLabel}>
                {getTypeLabel(scannedData.parsed.type)}
              </Text>
              <Text style={s.successText}>
                Successfully scanned
              </Text>
            </View>

            {/* Data Card */}
            <View style={s.dataCard}>
              <Text style={s.cardLabel}>Scanned Data</Text>

              {scannedData.parsed.type === 'order' && (
                <View>
                  <Text style={s.primaryText}>
                    Order: {scannedData.parsed.data.orderId}
                  </Text>
                  {scannedData.parsed.data.customer && (
                    <Text style={s.secondaryText}>
                      Customer: {scannedData.parsed.data.customer}
                    </Text>
                  )}
                  {scannedData.parsed.data.total && (
                    <Text style={s.greenAmount}>
                      Total: {scannedData.parsed.data.total}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'delivery' && (
                <View>
                  <Text style={s.primaryText}>
                    Delivery: {scannedData.parsed.data.deliveryId}
                  </Text>
                  {scannedData.parsed.data.status && (
                    <Text style={s.secondaryText}>
                      Status: {scannedData.parsed.data.status}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'worker' && (
                <View>
                  <Text style={s.primaryText}>
                    Worker: {scannedData.parsed.data.workerId}
                  </Text>
                  {scannedData.parsed.data.name && (
                    <Text style={s.secondaryText}>
                      Name: {scannedData.parsed.data.name}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'payment' && (
                <View>
                  <Text style={s.primaryText}>
                    Payment: {scannedData.parsed.data.paymentId || 'Pending'}
                  </Text>
                  {scannedData.parsed.data.amount && (
                    <Text style={s.greenAmountLarge}>
                      {scannedData.parsed.data.amount}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'product' && (
                <View>
                  <Text style={s.primaryText}>
                    Product: {scannedData.parsed.data.productId || scannedData.parsed.data.sku}
                  </Text>
                  {scannedData.parsed.data.name && (
                    <Text style={s.secondaryText}>
                      {scannedData.parsed.data.name}
                    </Text>
                  )}
                </View>
              )}

              {scannedData.parsed.type === 'url' && (
                <Text style={s.urlText} numberOfLines={3}>
                  {scannedData.parsed.data.url}
                </Text>
              )}

              {(scannedData.parsed.type === 'text' || scannedData.parsed.type === 'unknown') && (
                <Text style={s.plainText}>
                  {scannedData.raw}
                </Text>
              )}
            </View>

            {/* Raw Data */}
            <View style={s.rawCard}>
              <Text style={s.cardLabel}>Raw Content</Text>
              <Text style={s.rawText} numberOfLines={5}>
                {scannedData.raw}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={s.actionsContainer}>
              {(scannedData.parsed.type === 'order' ||
                scannedData.parsed.type === 'worker' ||
                scannedData.parsed.type === 'url') && (
                <TouchableOpacity
                  style={[
                    s.actionButton,
                    { backgroundColor: getTypeColor(scannedData.parsed.type) },
                  ]}
                  onPress={handleAction}
                >
                  <Ionicons
                    name={scannedData.parsed.type === 'url' ? 'open-outline' : 'arrow-forward'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={s.actionButtonText}>
                    {scannedData.parsed.type === 'order' ? 'View Order' :
                     scannedData.parsed.type === 'worker' ? 'View Worker' :
                     scannedData.parsed.type === 'url' ? 'Open Link' :
                     'View Details'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={s.scanAgainButton}
                onPress={handleScanAgain}
              >
                <Ionicons name="scan" size={20} color={T.text} />
                <Text style={s.scanAgainText}>
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

const s = {
  safeArea: {
    flex: 1 as const,
    backgroundColor: T.bg,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  closeButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: T.text,
    fontSize: 18,
    fontWeight: '600' as const,
    flex: 1,
  },
  scrollView: {
    flex: 1 as const,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  badgeContainer: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 16,
  },
  typeLabel: {
    color: T.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  successText: {
    color: T.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  dataCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: {
    color: T.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  primaryText: {
    color: T.text,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  secondaryText: {
    color: T.textSecondary,
    marginTop: 4,
  },
  greenAmount: {
    color: T.success,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  greenAmountLarge: {
    color: T.success,
    fontWeight: '700' as const,
    fontSize: 20,
    marginTop: 4,
  },
  urlText: {
    color: '#3B82F6',
    fontSize: 16,
  },
  plainText: {
    color: T.text,
    fontSize: 16,
  },
  rawCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 24,
  },
  rawText: {
    color: T.textSecondary,
    fontSize: 14,
    fontFamily: 'monospace' as const,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 18,
    marginLeft: 8,
  },
  scanAgainButton: {
    backgroundColor: T.bg,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  scanAgainText: {
    color: T.text,
    fontWeight: '600' as const,
    fontSize: 18,
    marginLeft: 8,
  },
};
