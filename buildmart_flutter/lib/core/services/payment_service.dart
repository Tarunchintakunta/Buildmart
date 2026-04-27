// ─────────────────────────────────────────────────────────────────────────────
// PaymentService — Razorpay / UPI integration scaffold
//
// Setup steps:
//   1. Add to pubspec.yaml:      razorpay_flutter: ^1.3.7
//   2. Android — in android/app/build.gradle add:
//        implementation 'com.razorpay:checkout:1.6.38'
//        and set minSdkVersion to 19
//   3. iOS — add "import Razorpay" in AppDelegate.swift and set minimum iOS 10
//   4. Set your Razorpay Key ID in SupabaseConfig or a separate keys file
//   5. Uncomment the razorpay_flutter import and usage below
//
// Usage:
//   final service = PaymentService();
//   await service.openCheckout(
//     amount: 50000, // in paise (₹500)
//     description: 'Wallet Top-up',
//     userId: 'user_uuid',
//     onSuccess: (paymentId) { ... },
//     onFailure: (error) { ... },
//   );
// ─────────────────────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

// TODO: Uncomment after adding razorpay_flutter to pubspec.yaml
// import 'package:razorpay_flutter/razorpay_flutter.dart';

class PaymentService {
  // ignore: unused_field
  static const String _razorpayKeyId =
      String.fromEnvironment('RAZORPAY_KEY_ID', defaultValue: 'rzp_test_YOUR_KEY_HERE');

  static bool get isConfigured => _razorpayKeyId != 'rzp_test_YOUR_KEY_HERE';

  // Razorpay? _razorpay; // TODO: enable after adding package

  /// Opens the Razorpay checkout sheet.
  ///
  /// [amount] is in paise (₹1 = 100 paise).
  Future<void> openCheckout({
    required int amount,
    required String description,
    required String userId,
    required ValueChanged<String> onSuccess,
    required ValueChanged<String> onFailure,
    String? name,
    String? email,
    String? contact,
  }) async {
    if (!isConfigured) {
      // Dev mode: simulate a successful payment after 1.5s
      await Future.delayed(const Duration(milliseconds: 1500));
      onSuccess('mock_pay_${DateTime.now().millisecondsSinceEpoch}');
      return;
    }

    // TODO: Uncomment after adding razorpay_flutter package
    // _razorpay = Razorpay();
    // _razorpay!.on(Razorpay.EVENT_PAYMENT_SUCCESS, (PaymentSuccessResponse r) {
    //   onSuccess(r.paymentId ?? '');
    //   _razorpay?.clear();
    // });
    // _razorpay!.on(Razorpay.EVENT_PAYMENT_ERROR, (PaymentFailureResponse r) {
    //   onFailure(r.message ?? 'Payment failed');
    //   _razorpay?.clear();
    // });
    // _razorpay!.on(Razorpay.EVENT_EXTERNAL_WALLET, (ExternalWalletResponse r) {
    //   onFailure('External wallet: ${r.walletName}');
    //   _razorpay?.clear();
    // });
    //
    // _razorpay!.open({
    //   'key': _razorpayKeyId,
    //   'amount': amount,
    //   'name': 'BuildMart',
    //   'description': description,
    //   'prefill': {
    //     'contact': contact ?? '',
    //     'email': email ?? '',
    //     'name': name ?? 'BuildMart User',
    //   },
    //   'theme': {'color': '#1A1D2E'},
    // });
    debugPrint('PaymentService: Razorpay package not yet enabled.');
  }

  void dispose() {
    // _razorpay?.clear();
  }
}
