import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ---------------------------------------------------------------------------
// UserRole
// ---------------------------------------------------------------------------

enum UserRole { customer, worker, shopkeeper, contractor, driver, admin }

extension UserRoleExtension on UserRole {
  String get label {
    switch (this) {
      case UserRole.customer:
        return 'Customer';
      case UserRole.worker:
        return 'Worker';
      case UserRole.shopkeeper:
        return 'Shopkeeper';
      case UserRole.contractor:
        return 'Contractor';
      case UserRole.driver:
        return 'Driver';
      case UserRole.admin:
        return 'Admin';
    }
  }

  static UserRole fromString(String s) {
    return UserRole.values.firstWhere(
      (r) => r.name == s,
      orElse: () => UserRole.customer,
    );
  }
}

// ---------------------------------------------------------------------------
// AppUser  (also aliased as UserModel for backward compat)
// ---------------------------------------------------------------------------

class AppUser {
  final String id;
  final String phone;
  final String fullName;
  final UserRole role;
  final double walletBalance;
  final String? avatarUrl;
  final String? email;
  final String? city;

  const AppUser({
    required this.id,
    required this.phone,
    required this.fullName,
    required this.role,
    required this.walletBalance,
    this.avatarUrl,
    this.email,
    this.city,
  });

  // Backward-compat getter used by older screens
  String get name => fullName;

  AppUser copyWith({
    String? id,
    String? phone,
    String? fullName,
    UserRole? role,
    double? walletBalance,
    String? avatarUrl,
    String? email,
    String? city,
  }) {
    return AppUser(
      id: id ?? this.id,
      phone: phone ?? this.phone,
      fullName: fullName ?? this.fullName,
      role: role ?? this.role,
      walletBalance: walletBalance ?? this.walletBalance,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      email: email ?? this.email,
      city: city ?? this.city,
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'phone': phone,
        'fullName': fullName,
        'role': role.name,
        'walletBalance': walletBalance,
        'avatarUrl': avatarUrl,
        'email': email,
        'city': city,
      };

  factory AppUser.fromMap(Map<String, dynamic> map) {
    return AppUser(
      id: map['id'] as String,
      phone: map['phone'] as String,
      fullName: map['fullName'] as String,
      role: UserRoleExtension.fromString(map['role'] as String),
      walletBalance: (map['walletBalance'] as num).toDouble(),
      avatarUrl: map['avatarUrl'] as String?,
      email: map['email'] as String?,
      city: map['city'] as String?,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppUser && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() =>
      'AppUser(id: $id, name: $fullName, role: ${role.label})';
}

/// Backward-compat alias
typedef UserModel = AppUser;

// ---------------------------------------------------------------------------
// AuthState  (thin wrapper so old code using authState.isLoggedIn still works)
// ---------------------------------------------------------------------------

class AuthState {
  final AppUser? user;
  final bool isLoading;

  const AuthState({this.user, this.isLoading = false});

  bool get isLoggedIn => user != null;

  AuthState copyWith({AppUser? user, bool? isLoading, bool clearUser = false}) {
    return AuthState(
      user: clearUser ? null : (user ?? this.user),
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

// ---------------------------------------------------------------------------
// Seed Users for dev / demo login
// ---------------------------------------------------------------------------

const List<AppUser> seedUsers = [
  AppUser(
    id: 'seed_001',
    phone: '9000000001',
    fullName: 'Rajesh Kumar',
    role: UserRole.customer,
    walletBalance: 12500,
    email: 'rajesh.kumar@buildmart.in',
    city: 'Hyderabad',
  ),
  AppUser(
    id: 'seed_002',
    phone: '9000000002',
    fullName: 'Ravi Shankar',
    role: UserRole.worker,
    walletBalance: 8750,
    email: 'ravi.shankar@buildmart.in',
    city: 'Hyderabad',
  ),
  AppUser(
    id: 'seed_003',
    phone: '9000000003',
    fullName: 'Venkat Reddy',
    role: UserRole.shopkeeper,
    walletBalance: 45200,
    email: 'venkat.reddy@buildmart.in',
    city: 'Hyderabad',
  ),
  AppUser(
    id: 'seed_004',
    phone: '9000000004',
    fullName: 'Suresh Babu',
    role: UserRole.contractor,
    walletBalance: 98000,
    email: 'suresh.babu@buildmart.in',
    city: 'Hyderabad',
  ),
  AppUser(
    id: 'seed_005',
    phone: '9000000005',
    fullName: 'Krishna Rao',
    role: UserRole.driver,
    walletBalance: 5600,
    email: 'krishna.rao@buildmart.in',
    city: 'Hyderabad',
  ),
  AppUser(
    id: 'seed_006',
    phone: '9000000006',
    fullName: 'Admin BuildMart',
    role: UserRole.admin,
    walletBalance: 0,
    email: 'admin@buildmart.in',
    city: 'Hyderabad',
  ),
];

// ---------------------------------------------------------------------------
// AuthNotifier
// ---------------------------------------------------------------------------

const _kPhoneKey = 'bm_logged_in_phone';

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  // ------------------------------------------------------------------
  // Session restore (called by SplashScreen for backward compat)
  // ------------------------------------------------------------------

  Future<void> checkSavedAuth() async {
    state = state.copyWith(isLoading: true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedPhone = prefs.getString(_kPhoneKey) ??
          prefs.getString('saved_phone'); // old key
      if (savedPhone != null) {
        final user = _findSeedUser(savedPhone);
        if (user != null) {
          state = AuthState(user: user, isLoading: false);
          return;
        }
      }
    } catch (e) {
      debugPrint('AuthNotifier.checkSavedAuth error: $e');
    }
    state = const AuthState(isLoading: false);
  }

  // ------------------------------------------------------------------
  // Login
  // ------------------------------------------------------------------

  /// Logs in by matching the phone number against seed users.
  /// Returns true on success, false if the phone is not found.
  Future<bool> login(String phone) async {
    state = state.copyWith(isLoading: true);
    final cleaned = phone.replaceAll(RegExp(r'\D'), '');
    final user = _findSeedUser(cleaned);

    if (user == null) {
      state = state.copyWith(isLoading: false);
      return false;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_kPhoneKey, cleaned);
    } catch (e) {
      debugPrint('AuthNotifier.login persist error: $e');
    }

    state = AuthState(user: user, isLoading: false);
    return true;
  }

  // ------------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------------

  Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_kPhoneKey);
      await prefs.remove('saved_phone');
    } catch (e) {
      debugPrint('AuthNotifier.logout error: $e');
    }
    state = const AuthState();
  }

  // ------------------------------------------------------------------
  // Update helpers
  // ------------------------------------------------------------------

  void updateWalletBalance(double newBalance) {
    if (state.user != null) {
      state = state.copyWith(user: state.user!.copyWith(walletBalance: newBalance));
    }
  }

  void updateProfile({String? fullName, String? email, String? city}) {
    if (state.user != null) {
      state = state.copyWith(
        user: state.user!.copyWith(
          fullName: fullName,
          email: email,
          city: city,
        ),
      );
    }
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  AppUser? _findSeedUser(String phone) {
    try {
      return seedUsers.firstWhere((u) => u.phone == phone);
    } catch (_) {
      return null;
    }
  }
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);

/// Convenience: current logged-in user (nullable).
final currentUserProvider = Provider<AppUser?>(
  (ref) => ref.watch(authProvider).user,
);

/// Convenience: current user's role (nullable).
final currentRoleProvider = Provider<UserRole?>(
  (ref) => ref.watch(authProvider).user?.role,
);

/// Convenience: true when a user is logged in.
final isLoggedInProvider = Provider<bool>(
  (ref) => ref.watch(authProvider).isLoggedIn,
);
