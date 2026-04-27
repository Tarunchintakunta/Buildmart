# BuildMart ProGuard Rules

# ── Flutter ──────────────────────────────────────────────────────────────────
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# ── Supabase / OkHttp ────────────────────────────────────────────────────────
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# ── Razorpay ─────────────────────────────────────────────────────────────────
# Uncomment after adding razorpay_flutter package:
# -keepattributes *Annotation*
# -keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
# -keep class com.razorpay.** { *; }

# ── Google Maps ──────────────────────────────────────────────────────────────
# Uncomment after adding google_maps_flutter package:
# -keep class com.google.android.gms.maps.** { *; }

# ── Firebase / FCM ───────────────────────────────────────────────────────────
# Uncomment after adding firebase_messaging package:
# -keep class com.google.firebase.** { *; }

# ── General Android ──────────────────────────────────────────────────────────
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
