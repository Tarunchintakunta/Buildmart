import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';
import '../widgets/customer_dashboard.dart';
import '../widgets/worker_dashboard.dart';
import '../widgets/shopkeeper_dashboard.dart';
import '../widgets/contractor_dashboard.dart';
import '../widgets/driver_dashboard.dart';
import '../widgets/admin_dashboard.dart';

// ─────────────────────────────────────────────────────────────────────────────
// RoleDashboard — shown at /home, picks the right dashboard by role
// ─────────────────────────────────────────────────────────────────────────────

class RoleDashboard extends ConsumerWidget {
  const RoleDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = ref.watch(authProvider).user?.role ?? UserRole.customer;
    switch (role) {
      case UserRole.customer:    return const CustomerDashboard();
      case UserRole.worker:      return const WorkerDashboard();
      case UserRole.shopkeeper:  return const ShopkeeperDashboard();
      case UserRole.contractor:  return const ContractorDashboard();
      case UserRole.driver:      return const DriverDashboard();
      case UserRole.admin:       return const AdminDashboard();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HomeScreen — shell with persistent animated bottom nav
// ─────────────────────────────────────────────────────────────────────────────

class HomeScreen extends ConsumerStatefulWidget {
  final Widget? child;
  const HomeScreen({super.key, this.child});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with TickerProviderStateMixin {
  late AnimationController _navController;

  @override
  void initState() {
    super.initState();
    _navController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 250));
  }

  @override
  void dispose() {
    _navController.dispose();
    super.dispose();
  }

  // Map location → tab index for each role
  List<String> _routesForRole(UserRole role) {
    switch (role) {
      case UserRole.customer:
        return ['/home', '/shop', '/orders', '/wallet', '/profile'];
      case UserRole.worker:
        return ['/home', '/jobs', '/agreements', '/wallet', '/profile'];
      case UserRole.shopkeeper:
        return ['/home', '/shop', '/orders', '/wallet', '/profile'];
      case UserRole.contractor:
        return ['/home', '/workers', '/agreements', '/wallet', '/profile'];
      case UserRole.driver:
        return ['/home', '/deliveries', '/wallet', '/profile'];
      case UserRole.admin:
        return ['/home', '/users', '/verifications', '/profile'];
    }
  }

  int _activeIndex(String location, UserRole role) {
    final routes = _routesForRole(role);
    for (int i = routes.length - 1; i >= 0; i--) {
      if (location.startsWith(routes[i])) return i;
    }
    return 0;
  }

  void _onTabTapped(int index, UserRole role) {
    _navController.forward(from: 0);
    final routes = _routesForRole(role);
    if (index < routes.length) context.go(routes[index]);
  }

  @override
  Widget build(BuildContext context) {
    final role = ref.watch(authProvider).user?.role ?? UserRole.customer;
    final location = GoRouterState.of(context).matchedLocation;
    final activeIndex = _activeIndex(location, role);

    return Scaffold(
      backgroundColor: AppColors.background,
      // child is always provided by ShellRoute; fallback to RoleDashboard if null
      body: widget.child ?? const RoleDashboard(),
      bottomNavigationBar: _buildBottomNav(role, activeIndex),
    );
  }

  Widget _buildBottomNav(UserRole role, int activeIndex) {
    final items = _navItemsForRole(role);
    final clamped = activeIndex.clamp(0, items.length - 1);

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          height: 64,
          child: Row(
            children: List.generate(items.length, (i) {
              final isActive = i == clamped;
              final item = items[i];
              return Expanded(
                child: _AnimatedNavItem(
                  icon: isActive ? item.activeIcon : item.icon,
                  label: item.label ?? '',
                  isActive: isActive,
                  onTap: () => _onTabTapped(i, role),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  List<BottomNavigationBarItem> _navItemsForRole(UserRole role) {
    switch (role) {
      case UserRole.customer:
        return const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),       activeIcon: Icon(Icons.home),                    label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.storefront_outlined),  activeIcon: Icon(Icons.storefront),              label: 'Shop'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long_outlined),activeIcon: Icon(Icons.receipt_long),            label: 'Orders'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),       activeIcon: Icon(Icons.person),                  label: 'Profile'),
        ];
      case UserRole.worker:
        return const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),        activeIcon: Icon(Icons.home),       label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.work_outline),          activeIcon: Icon(Icons.work),       label: 'Jobs'),
          BottomNavigationBarItem(icon: Icon(Icons.handshake_outlined),    activeIcon: Icon(Icons.handshake),  label: 'Agreements'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),        activeIcon: Icon(Icons.person),     label: 'Profile'),
        ];
      case UserRole.shopkeeper:
        return const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),        activeIcon: Icon(Icons.home),       label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.storefront_outlined),   activeIcon: Icon(Icons.storefront), label: 'Shop'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long_outlined), activeIcon: Icon(Icons.receipt_long), label: 'Orders'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),        activeIcon: Icon(Icons.person),     label: 'Profile'),
        ];
      case UserRole.contractor:
        return const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),        activeIcon: Icon(Icons.home),       label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.group_outlined),        activeIcon: Icon(Icons.group),      label: 'Workers'),
          BottomNavigationBarItem(icon: Icon(Icons.handshake_outlined),    activeIcon: Icon(Icons.handshake),  label: 'Agreements'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),        activeIcon: Icon(Icons.person),     label: 'Profile'),
        ];
      case UserRole.driver:
        return const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),        activeIcon: Icon(Icons.home),            label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.local_shipping_outlined),activeIcon: Icon(Icons.local_shipping), label: 'Deliveries'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),        activeIcon: Icon(Icons.person),          label: 'Profile'),
        ];
      case UserRole.admin:
        return const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),          activeIcon: Icon(Icons.home),           label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.group_outlined),          activeIcon: Icon(Icons.group),          label: 'Users'),
          BottomNavigationBarItem(icon: Icon(Icons.verified_user_outlined),  activeIcon: Icon(Icons.verified_user),  label: 'Verify'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),          activeIcon: Icon(Icons.person),         label: 'Profile'),
        ];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated nav item
// ─────────────────────────────────────────────────────────────────────────────

class _AnimatedNavItem extends StatefulWidget {
  final Widget icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _AnimatedNavItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  State<_AnimatedNavItem> createState() => _AnimatedNavItemState();
}

class _AnimatedNavItemState extends State<_AnimatedNavItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _bounce;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));
    _bounce = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0, end: -6), weight: 40),
      TweenSequenceItem(tween: Tween(begin: -6, end: 2),  weight: 30),
      TweenSequenceItem(tween: Tween(begin: 2, end: 0),   weight: 30),
    ]).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void didUpdateWidget(_AnimatedNavItem old) {
    super.didUpdateWidget(old);
    if (!old.isActive && widget.isActive) _ctrl.forward(from: 0);
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedBuilder(
            animation: _bounce,
            builder: (_, child) => Transform.translate(
              offset: Offset(0, _bounce.value), child: child!),
            child: AnimatedScale(
              scale: widget.isActive ? 1.15 : 1.0,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOutBack,
              child: IconTheme(
                data: IconThemeData(
                  color: widget.isActive ? AppColors.navy : AppColors.textMuted,
                  size: widget.isActive ? 26 : 22,
                ),
                child: widget.icon,
              ),
            ),
          ),
          const SizedBox(height: 2),
          AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: TextStyle(
              fontSize: widget.isActive ? 11.5 : 10.5,
              fontWeight: widget.isActive ? FontWeight.w700 : FontWeight.w400,
              color: widget.isActive ? AppColors.navy : AppColors.textMuted,
            ),
            child: Text(widget.label),
          ),
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOutCubic,
            width: widget.isActive ? 20 : 0,
            height: 3,
            margin: const EdgeInsets.only(top: 3),
            decoration: BoxDecoration(
              color: AppColors.amber,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ],
      ),
    );
  }
}
