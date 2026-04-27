plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

// ─────────────────────────────────────────────────────────────────────────────
// Release signing configuration
//
// To generate the keystore:
//   keytool -genkey -v -keystore buildmart-release.jks \
//     -alias buildmart -keyalg RSA -keysize 2048 -validity 10000
//
// Place the keystore file in android/app/buildmart-release.jks
// Set these environment variables (or use a local.properties approach):
//   BUILDMART_KEY_STORE_PATH  = path to .jks file
//   BUILDMART_KEY_ALIAS       = buildmart
//   BUILDMART_STORE_PASSWORD  = your-store-password
//   BUILDMART_KEY_PASSWORD    = your-key-password
//
// For CI/CD (GitHub Actions):
//   - Base64-encode the .jks file and store as a secret
//   - Decode it in the workflow and set env vars
// ─────────────────────────────────────────────────────────────────────────────

android {
    namespace = "com.buildmart.buildmart"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        applicationId = "com.buildmart.buildmart"
        minSdk = 21  // Required for Razorpay + other modern packages
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    // ── Release signing ──────────────────────────────────────────────────────
    val keystorePath = System.getenv("BUILDMART_KEY_STORE_PATH") ?: ""
    val keystoreAlias = System.getenv("BUILDMART_KEY_ALIAS") ?: "buildmart"
    val storePassword = System.getenv("BUILDMART_STORE_PASSWORD") ?: ""
    val keyPassword = System.getenv("BUILDMART_KEY_PASSWORD") ?: ""

    signingConfigs {
        if (keystorePath.isNotEmpty()) {
            create("release") {
                storeFile = file(keystorePath)
                storePassword = storePassword
                keyAlias = keystoreAlias
                keyPassword = keyPassword
            }
        }
    }

    buildTypes {
        release {
            // Use release keystore when configured, fall back to debug
            val releaseConfig = try { signingConfigs.getByName("release") } catch (_: Exception) { null }
            signingConfig = releaseConfig ?: signingConfigs.getByName("debug")

            // Enable code shrinking and obfuscation for release
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}
