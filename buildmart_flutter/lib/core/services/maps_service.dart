// ─────────────────────────────────────────────────────────────────────────────
// MapsService — Google Maps + live location scaffold
//
// Setup steps:
//   1. Enable the Maps SDK at https://console.cloud.google.com → APIs & Services
//   2. Create an API key with Maps SDK for Android/iOS enabled
//   3. Add to pubspec.yaml:   google_maps_flutter: ^2.9.0
//   4. Android: add to android/app/src/main/AndroidManifest.xml inside <application>:
//        <meta-data android:name="com.google.android.geo.API_KEY"
//                   android:value="YOUR_GOOGLE_MAPS_KEY"/>
//   5. iOS: add to ios/Runner/AppDelegate.swift:
//        GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_KEY")
//   6. Add the --dart-define=GOOGLE_MAPS_KEY=your-key for injection
// ─────────────────────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

// TODO: Uncomment after adding google_maps_flutter to pubspec.yaml
// import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapsService {
  static const String _apiKey =
      String.fromEnvironment('GOOGLE_MAPS_KEY', defaultValue: '');

  static bool get isConfigured => _apiKey.isNotEmpty;

  /// Returns a placeholder widget showing a map icon until Google Maps
  /// is properly configured.
  static Widget buildMapPlaceholder({
    required String address,
    double height = 200,
  }) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFFF5F6FA),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.map_outlined, size: 48, color: Color(0xFF9CA3AF)),
          const SizedBox(height: 8),
          Text(address,
              style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
              textAlign: TextAlign.center),
          const SizedBox(height: 6),
          const Text(
            'Google Maps — configure API key to enable',
            style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF)),
          ),
        ],
      ),
    );
  }

  // TODO: Add real GoogleMap widget here after package is added:
  //
  // static Widget buildMap({
  //   required LatLng center,
  //   required Set<Marker> markers,
  //   double height = 200,
  // }) {
  //   return SizedBox(
  //     height: height,
  //     child: ClipRRect(
  //       borderRadius: BorderRadius.circular(12),
  //       child: GoogleMap(
  //         initialCameraPosition: CameraPosition(target: center, zoom: 15),
  //         markers: markers,
  //         zoomControlsEnabled: false,
  //         myLocationButtonEnabled: true,
  //         myLocationEnabled: true,
  //       ),
  //     ),
  //   );
  // }

  /// Tracks a driver's live location via Supabase Realtime.
  ///
  /// Subscribe to `driver_locations` table filtered by order_id.
  static Stream<Map<String, dynamic>> watchDriverLocation(String orderId) {
    // TODO: Uncomment after Supabase is configured:
    // return Supabase.instance.client
    //     .from('driver_locations')
    //     .stream(primaryKey: ['order_id'])
    //     .eq('order_id', orderId)
    //     .map((rows) => rows.isNotEmpty ? rows.first : {});
    return const Stream.empty();
  }
}
