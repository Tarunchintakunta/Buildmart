import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface QRScannerProps {
  onScan: (data: string, type: string) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function QRScanner({
  onScan,
  onClose,
  title = 'Scan QR Code',
  subtitle = 'Position the QR code within the frame'
}: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;

    const { data, type } = result;

    if (!data || data.trim() === '') {
      Alert.alert('Invalid QR Code', 'The scanned QR code contains no usable data.');
      return;
    }

    setScanned(true);
    onScan(data, type);
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="camera" size={48} color="#6B7280" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Ionicons name="camera-outline" size={64} color="#F97316" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to scan QR codes
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => setTorch(!torch)} style={styles.torchButton}>
          <Ionicons name={torch ? 'flash' : 'flash-outline'} size={24} color={torch ? '#F97316' : 'white'} />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'aztec', 'datamatrix', 'code128', 'code39', 'code93', 'ean13', 'ean8', 'upc_a', 'upc_e'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.overlayTop} />

          {/* Middle section with scan window */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanWindow}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            <View style={styles.overlaySide} />
          </View>

          {/* Bottom overlay */}
          <View style={styles.overlayBottom}>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {scanned && (
              <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const SCAN_WINDOW_SIZE = 250;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#111827',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  permissionButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_WINDOW_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanWindow: {
    width: SCAN_WINDOW_SIZE,
    height: SCAN_WINDOW_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#F97316',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 24,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
