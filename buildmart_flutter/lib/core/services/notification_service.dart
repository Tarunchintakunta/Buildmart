// ─────────────────────────────────────────────────────────────────────────────
// NotificationService — FCM Push Notifications scaffold
//
// Setup steps:
//   1. Create a Firebase project at https://console.firebase.google.com
//   2. Add your Android app (package: com.buildmart.buildmart)
//   3. Download google-services.json → android/app/google-services.json
//   4. Add to pubspec.yaml:
//        firebase_core: ^3.6.0
//        firebase_messaging: ^15.1.3
//   5. In android/build.gradle (project level):
//        dependencies { classpath 'com.google.gms:google-services:4.4.2' }
//   6. In android/app/build.gradle:
//        apply plugin: 'com.google.gms.google-services'
//   7. Initialize Firebase in main.dart:
//        await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
//   8. Request permission and get FCM token (see below)
//   9. Save FCM token to Supabase `profiles` table (column: fcm_token)
//  10. Use Supabase Edge Functions to trigger push notifications on events
// ─────────────────────────────────────────────────────────────────────────────

import 'package:flutter/foundation.dart';

// TODO: Uncomment after adding firebase_core and firebase_messaging to pubspec.yaml
// import 'package:firebase_messaging/firebase_messaging.dart';
// import 'package:firebase_core/firebase_core.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  bool _initialized = false;

  /// Call once at app startup (after Firebase.initializeApp).
  Future<void> initialize() async {
    if (_initialized) return;

    // TODO: Uncomment after adding Firebase packages
    // final messaging = FirebaseMessaging.instance;
    //
    // // Request permission (iOS)
    // final settings = await messaging.requestPermission(
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // );
    // debugPrint('FCM permission: ${settings.authorizationStatus}');
    //
    // // Get token
    // final token = await messaging.getToken();
    // debugPrint('FCM token: $token');
    //
    // // Save token to Supabase
    // final userId = Supabase.instance.client.auth.currentUser?.id;
    // if (userId != null && token != null) {
    //   await DatabaseService.upsertProfile({'id': userId, 'fcm_token': token});
    // }
    //
    // // Handle foreground messages
    // FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    //   debugPrint('FCM foreground message: ${message.notification?.title}');
    //   // Show in-app notification banner
    // });
    //
    // // Handle background tap
    // FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    //   debugPrint('FCM opened from background: ${message.notification?.title}');
    //   // Navigate to relevant screen based on message.data
    // });

    _initialized = true;
    debugPrint('NotificationService: initialized (Firebase packages not yet enabled)');
  }

  /// Shows a local in-app notification snackbar (works without FCM setup).
  static void showLocalNotification({
    required String title,
    required String body,
  }) {
    // This is handled by ScaffoldMessenger in the calling widget.
    // Use this as a placeholder until real FCM is set up.
    debugPrint('LOCAL NOTIFICATION: $title — $body');
  }

  /// Sends a push notification via Supabase Edge Function.
  ///
  /// Requires a Supabase Edge Function named 'send-push' that calls
  /// the FCM HTTP v1 API.
  static Future<void> sendPush({
    required String targetUserId,
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    // TODO: Uncomment after setting up Supabase Edge Functions
    // try {
    //   await Supabase.instance.client.functions.invoke('send-push', body: {
    //     'user_id': targetUserId,
    //     'title': title,
    //     'body': body,
    //     'data': data,
    //   });
    // } catch (e) {
    //   debugPrint('sendPush error: $e');
    // }
    debugPrint('sendPush (stub): $title → $targetUserId');
  }
}
