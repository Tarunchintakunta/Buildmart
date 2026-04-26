import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/auth_provider.dart';

const Color _navy = Color(0xFF1A1D2E);
const Color _amber = Color(0xFFF2960D);
const Color _amberBg = Color(0xFFFEF3C7);
const Color _bg = Color(0xFFF5F6FA);
const Color _border = Color(0xFFE5E7EB);
const Color _success = Color(0xFF10B981);
const Color _error = Color(0xFFEF4444);
const Color _textSecondary = Color(0xFF6B7280);
const Color _textMuted = Color(0xFF9CA3AF);

// ─────────────────────────────────────────────────────────────────────────────
// Profile Screen
// ─────────────────────────────────────────────────────────────────────────────

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen>
    with TickerProviderStateMixin {
  // Avatar scale + ring
  late AnimationController _avatarCtrl;
  late Animation<double> _avatarScale;
  late AnimationController _ringCtrl;

  // Name/role fade + scale
  late AnimationController _nameCtrl;
  late Animation<double> _nameFade;
  late Animation<double> _nameScale;

  // Stats count-up (staggered)
  late AnimationController _statsCtrl;
  final List<Animation<double>> _statAnims = [];

  // Wallet mini-card slides from right
  late AnimationController _walletCtrl;
  late Animation<Offset> _walletSlide;

  // Menu items stagger from right
  late AnimationController _menuCtrl;
  final List<Animation<double>> _menuFade = [];
  final List<Animation<Offset>> _menuSlide = [];

  // Logout slides up from bottom
  late AnimationController _logoutCtrl;
  late Animation<Offset> _logoutSlide;
  late Animation<double> _logoutFade;

  static const _statValues = [12.0, 3.0, 4.7];
  static const _statLabels = ['Orders', 'Agreements', 'Rating'];
  static const _statSuffixes = ['', '', '★'];

  @override
  void initState() {
    super.initState();

    // Avatar
    _avatarCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 500));
    _avatarScale = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _avatarCtrl, curve: Curves.easeOutBack));

    _ringCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800));

    // Name
    _nameCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));
    _nameFade = Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _nameCtrl, curve: Curves.easeOut));
    _nameScale = Tween<double>(begin: 0.9, end: 1.0).animate(
        CurvedAnimation(parent: _nameCtrl, curve: Curves.easeOut));

    // Stats (3 values, staggered 250ms each)
    _statsCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1200));
    for (var i = 0; i < 3; i++) {
      final delay = i * 0.25;
      final end = (delay + 0.4).clamp(0.0, 1.0);
      _statAnims.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(
              parent: _statsCtrl,
              curve: Interval(delay, end, curve: Curves.easeOutCubic))));
    }

    // Wallet card
    _walletCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));
    _walletSlide = Tween<Offset>(
      begin: const Offset(0.3, 0),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _walletCtrl, curve: Curves.easeOutCubic));

    // Menu items (up to 15)
    const menuCount = 15;
    _menuCtrl = AnimationController(
        vsync: this,
        duration: Duration(milliseconds: 400 + menuCount * 50));
    for (var i = 0; i < menuCount; i++) {
      final start = (i * 0.05).clamp(0.0, 0.7);
      final end = (start + 0.3).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _menuFade.add(Tween<double>(begin: 0, end: 1)
          .animate(CurvedAnimation(parent: _menuCtrl, curve: interval)));
      _menuSlide.add(Tween<Offset>(
        begin: const Offset(0.15, 0),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: _menuCtrl, curve: interval)));
    }

    // Logout
    _logoutCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));
    _logoutSlide = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _logoutCtrl, curve: Curves.easeOutCubic));
    _logoutFade = Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _logoutCtrl, curve: Curves.easeOut));

    // Stagger all animations
    _avatarCtrl.forward();
    _ringCtrl.forward();
    Future.delayed(const Duration(milliseconds: 200),
        () => mounted ? _nameCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 350),
        () => mounted ? _statsCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 500),
        () => mounted ? _walletCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 600),
        () => mounted ? _menuCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 900),
        () => mounted ? _logoutCtrl.forward() : null);
  }

  @override
  void dispose() {
    _avatarCtrl.dispose();
    _ringCtrl.dispose();
    _nameCtrl.dispose();
    _statsCtrl.dispose();
    _walletCtrl.dispose();
    _menuCtrl.dispose();
    _logoutCtrl.dispose();
    super.dispose();
  }

  Color _roleColor(String roleName) {
    switch (roleName) {
      case 'Contractor':
        return const Color(0xFF8B5CF6);
      case 'Worker':
        return const Color(0xFFF59E0B);
      case 'Shopkeeper':
        return const Color(0xFF10B981);
      case 'Driver':
        return const Color(0xFFEF4444);
      case 'Admin':
        return const Color(0xFF6366F1);
      default:
        return const Color(0xFF3B82F6);
    }
  }

  List<_MenuSection> _menuSections(String roleName) {
    switch (roleName) {
      case 'Worker':
        return [
          _MenuSection('Work', [
            _MenuItem(Icons.work_outline, 'Jobs', 'Browse available jobs',
                const Color(0xFFF59E0B)),
            _MenuItem(Icons.build_outlined, 'Skills', 'Manage your skill set',
                const Color(0xFF3B82F6)),
            _MenuItem(Icons.access_time, 'Availability',
                'Set your working hours', const Color(0xFF10B981)),
            _MenuItem(Icons.history, 'Job History', 'Past completed jobs',
                const Color(0xFF8B5CF6)),
            _MenuItem(Icons.verified_outlined, 'Certifications',
                'Your licences and certs', const Color(0xFF6366F1)),
          ]),
          _MenuSection('Finance', [
            _MenuItem(Icons.account_balance_wallet_outlined, 'Wallet',
                'Balance & transactions', _amber),
          ]),
          _MenuSection('General', [
            _MenuItem(Icons.notifications_outlined, 'Notifications',
                'Manage alerts', const Color(0xFF3B82F6)),
          ]),
        ];
      case 'Contractor':
        return [
          _MenuSection('Business', [
            _MenuItem(Icons.description_outlined, 'Agreements',
                'View all contracts', const Color(0xFF8B5CF6)),
            _MenuItem(Icons.people_outline, 'Workers', 'Manage your team',
                const Color(0xFFF59E0B)),
            _MenuItem(Icons.domain, 'Site Management', 'Oversee sites',
                const Color(0xFF3B82F6)),
            _MenuItem(Icons.bar_chart, 'Analytics', 'Business insights',
                _success),
            _MenuItem(Icons.gavel, 'Tenders', 'Open bid tenders',
                const Color(0xFF6366F1)),
          ]),
          _MenuSection('Finance', [
            _MenuItem(Icons.account_balance_wallet_outlined, 'Wallet',
                'Balance & transactions', _amber),
          ]),
        ];
      case 'Shopkeeper':
        return [
          _MenuSection('Shop', [
            _MenuItem(Icons.inventory_2_outlined, 'Inventory',
                'Manage your stock', const Color(0xFF10B981)),
            _MenuItem(Icons.shopping_bag_outlined, 'Orders',
                'Incoming orders', const Color(0xFF3B82F6)),
            _MenuItem(Icons.store_outlined, 'Shop Settings', 'Edit shop info',
                const Color(0xFF8B5CF6)),
            _MenuItem(Icons.add_box_outlined, 'Add Product',
                'List new item', _amber),
            _MenuItem(Icons.bar_chart, 'Analytics', 'Sales insights',
                _success),
          ]),
          _MenuSection('Finance', [
            _MenuItem(Icons.account_balance_wallet_outlined, 'Wallet',
                'Balance & transactions', _amber),
          ]),
        ];
      case 'Driver':
        return [
          _MenuSection('Deliveries', [
            _MenuItem(Icons.local_shipping_outlined, 'Deliveries',
                'Active & history', const Color(0xFFEF4444)),
            _MenuItem(Icons.two_wheeler, 'Vehicle', 'Manage vehicle info',
                const Color(0xFF3B82F6)),
            _MenuItem(Icons.route, 'Route Optimization',
                'Smart navigation', _success),
          ]),
          _MenuSection('Finance', [
            _MenuItem(Icons.account_balance_wallet_outlined, 'Wallet',
                'Balance & earnings', _amber),
          ]),
        ];
      case 'Admin':
        return [
          _MenuSection('Administration', [
            _MenuItem(Icons.verified_user_outlined, 'Verifications',
                'Pending approvals', const Color(0xFF6366F1)),
            _MenuItem(Icons.manage_accounts_outlined, 'Users',
                'User management', const Color(0xFF3B82F6)),
            _MenuItem(Icons.gavel, 'Disputes', 'Resolve complaints', _error),
            _MenuItem(Icons.bar_chart, 'Analytics', 'Platform insights',
                _success),
          ]),
        ];
      default: // Customer
        return [
          _MenuSection('Orders & Shopping', [
            _MenuItem(Icons.shopping_bag_outlined, 'My Orders',
                'Track & manage orders', const Color(0xFF3B82F6)),
            _MenuItem(Icons.favorite_outline, 'Wishlist',
                'Saved products', _error),
            _MenuItem(Icons.location_on_outlined, 'Saved Addresses',
                'Delivery locations', _success),
            _MenuItem(Icons.credit_card_outlined, 'Payment Methods',
                'Cards & UPI', const Color(0xFF8B5CF6)),
          ]),
          _MenuSection('Account', [
            _MenuItem(Icons.notifications_outlined, 'Notifications',
                'Manage alerts', _amber),
            _MenuItem(Icons.help_outline, 'Help & Support',
                'Get assistance', const Color(0xFF3B82F6)),
            _MenuItem(Icons.policy_outlined, 'Terms of Service',
                'Legal documents', _textMuted),
          ]),
        ];
    }
  }

  void _onMenuTap(String title) {
    switch (title) {
      case 'My Orders':
        context.go('/orders');
        break;
      case 'Wishlist':
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Coming soon!')));
        break;
      case 'Notifications':
        context.go('/notifications');
        break;
      case 'Help & Support':
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Help center coming soon!')));
        break;
      case 'Settings':
        context.go('/settings');
        break;
      case 'Jobs':
        context.go('/jobs');
        break;
      case 'Agreements':
        context.go('/agreements');
        break;
      case 'Wallet':
        context.go('/wallet');
        break;
      case 'Workers':
        context.go('/workers');
        break;
      case 'Deliveries':
        context.go('/deliveries');
        break;
      case 'Verifications':
        context.go('/verifications');
        break;
      case 'Users':
        context.go('/users');
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Coming soon!')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final userName = user?.fullName ?? 'User';
    final userPhone = user?.phone != null ? '+91 ${user!.phone}' : '';
    final roleName = user?.role.label ?? 'Customer';

    int menuIdx = 0;
    final sections = _menuSections(roleName);

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        title: const Text('Profile',
            style: TextStyle(
                color: _navy, fontWeight: FontWeight.w700, fontSize: 20)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: _navy),
            onPressed: () => context.go('/settings'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Avatar + ring + name
          Center(
            child: Column(
              children: [
                // Avatar with animated progress ring
                ScaleTransition(
                  scale: _avatarScale,
                  child: TweenAnimationBuilder<double>(
                    tween: Tween(begin: 0, end: 1),
                    duration: const Duration(milliseconds: 800),
                    curve: Curves.easeOutCubic,
                    builder: (ctx, progress, child) => CustomPaint(
                      painter: _RingPainter(
                          progress: progress, color: _roleColor(roleName)),
                      child: child,
                    ),
                    child: Container(
                      width: 88,
                      height: 88,
                      margin: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: _roleColor(roleName).withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          userName[0],
                          style: TextStyle(
                            fontSize: 34,
                            fontWeight: FontWeight.w800,
                            color: _roleColor(roleName),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Name + role badge: fade + scale
                FadeTransition(
                  opacity: _nameFade,
                  child: ScaleTransition(
                    scale: _nameScale,
                    child: Column(
                      children: [
                        Text(userName,
                            style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                                color: _navy)),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Animated role badge color
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 400),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: _roleColor(roleName).withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(roleName,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: _roleColor(roleName),
                                  )),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.phone,
                                size: 12, color: _textMuted),
                            const SizedBox(width: 4),
                            Text(userPhone,
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: _textSecondary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Stats row: each counts up with stagger
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: _border),
            ),
            child: Row(
              children: List.generate(3, (i) {
                return Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        child: _AnimatedStatBlock(
                          label: _statLabels[i],
                          endValue: _statValues[i],
                          suffix: _statSuffixes[i],
                          valueColor: i == 2 ? _amber : null,
                          animation: _statAnims[i],
                        ),
                      ),
                      if (i < 2)
                        Container(
                            width: 1, height: 40, color: _border),
                    ],
                  ),
                );
              }),
            ),
          ),

          const SizedBox(height: 12),

          // Wallet mini-card slides in from right
          SlideTransition(
            position: _walletSlide,
            child: FadeTransition(
              opacity: _walletCtrl,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _navy,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: _amber.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                          Icons.account_balance_wallet_outlined,
                          color: _amber,
                          size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Wallet Balance',
                            style: TextStyle(
                                color: Colors.white54, fontSize: 11)),
                        SizedBox(height: 2),
                        Text('₹25,000',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w800)),
                      ],
                    ),
                    const Spacer(),
                    OutlinedButton(
                      onPressed: () => context.go('/wallet'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: Colors.white38),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('View',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Menu sections – items stagger from right
          for (final section in sections) ...[
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(section.title,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: _textMuted,
                    letterSpacing: 1,
                  )),
            ),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _border),
              ),
              child: Column(
                children: section.items.asMap().entries.map((e) {
                  final item = e.value;
                  final curIdx = menuIdx;
                  menuIdx++;
                  final safeIdx = curIdx < _menuFade.length ? curIdx : _menuFade.length - 1;
                  final isLast = e.key == section.items.length - 1;
                  return FadeTransition(
                    opacity: _menuFade[safeIdx],
                    child: SlideTransition(
                      position: _menuSlide[safeIdx],
                      child: Column(
                        children: [
                          Container(
                            decoration: BoxDecoration(
                              border: Border(
                                left: BorderSide(
                                    color: item.color, width: 3),
                              ),
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.only(
                                  left: 11,
                                  right: 14,
                                  top: 4,
                                  bottom: 4),
                              leading: Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  color: item.color
                                      .withValues(alpha: 0.12),
                                  borderRadius:
                                      BorderRadius.circular(8),
                                ),
                                child: Icon(item.icon,
                                    color: item.color, size: 18),
                              ),
                              title: Text(item.title,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: _navy)),
                              subtitle: Text(item.subtitle,
                                  style: const TextStyle(
                                      fontSize: 11,
                                      color: _textMuted)),
                              trailing: const Icon(Icons.chevron_right,
                                  color: _textMuted, size: 18),
                              onTap: () => _onMenuTap(item.title),
                            ),
                          ),
                          if (!isLast)
                            const Divider(
                                height: 1,
                                indent: 64,
                                endIndent: 0,
                                color: _border),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 12),
          ],

          // Logout: slides up from bottom
          SlideTransition(
            position: _logoutSlide,
            child: FadeTransition(
              opacity: _logoutFade,
              child: SizedBox(
                width: double.infinity,
                child: TextButton.icon(
                  onPressed: () async {
                    final router = GoRouter.of(context);
                    await ref.read(authProvider.notifier).logout();
                    router.go('/login');
                  },
                  icon: const Icon(Icons.logout, color: _error, size: 18),
                  label: const Text('Log Out',
                      style: TextStyle(
                          color: _error,
                          fontWeight: FontWeight.w700,
                          fontSize: 15)),
                  style: TextButton.styleFrom(
                    backgroundColor: _error.withValues(alpha: 0.06),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// Animated ring drawn around the avatar
class _RingPainter extends CustomPainter {
  final double progress;
  final Color color;

  _RingPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color.withValues(alpha: 0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    final rect = Rect.fromLTWH(1.5, 1.5, size.width - 3, size.height - 3);
    canvas.drawArc(
        rect, -math.pi / 2, 2 * math.pi * progress, false, paint);
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.progress != progress || old.color != color;
}

// Animated stat block that counts up
class _AnimatedStatBlock extends StatelessWidget {
  final String label;
  final double endValue;
  final String suffix;
  final Color? valueColor;
  final Animation<double> animation;

  const _AnimatedStatBlock({
    required this.label,
    required this.endValue,
    required this.suffix,
    required this.animation,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (_, __) {
        final v = endValue * animation.value;
        final display = endValue == endValue.truncateToDouble()
            ? v.round().toString()
            : v.toStringAsFixed(1);
        return Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(display,
                    style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: valueColor ?? _navy)),
                if (suffix.isNotEmpty) ...[
                  const SizedBox(width: 2),
                  Text(suffix,
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: valueColor ?? _navy)),
                ],
              ],
            ),
            const SizedBox(height: 2),
            Text(label,
                style:
                    const TextStyle(fontSize: 11, color: _textMuted)),
          ],
        );
      },
    );
  }
}

class _MenuSection {
  final String title;
  final List<_MenuItem> items;
  const _MenuSection(this.title, this.items);
}

class _MenuItem {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  const _MenuItem(this.icon, this.title, this.subtitle, this.color);
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings Screen – slides in from bottom
// ─────────────────────────────────────────────────────────────────────────────

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen>
    with SingleTickerProviderStateMixin {
  bool _pushNotifs = true;
  bool _darkMode = false;
  String _language = 'English';

  // Section stagger
  late AnimationController _sectionsCtrl;
  final List<Animation<double>> _sectionFade = [];
  final List<Animation<Offset>> _sectionSlide = [];

  @override
  void initState() {
    super.initState();
    const sectionCount = 3;
    _sectionsCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 700));
    for (var i = 0; i < sectionCount; i++) {
      final start = i * 0.2;
      final end = (start + 0.45).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _sectionFade.add(Tween<double>(begin: 0, end: 1)
          .animate(CurvedAnimation(parent: _sectionsCtrl, curve: interval)));
      _sectionSlide.add(Tween<Offset>(
        begin: const Offset(0, 0.15),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: _sectionsCtrl, curve: interval)));
    }
    _sectionsCtrl.forward();
  }

  @override
  void dispose() {
    _sectionsCtrl.dispose();
    super.dispose();
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Select Language',
            style: TextStyle(
                color: _navy,
                fontWeight: FontWeight.w700,
                fontSize: 16)),
        content: AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: Column(
            key: ValueKey(_language),
            mainAxisSize: MainAxisSize.min,
            children: [
              {'label': 'English', 'code': 'EN'},
              {'label': 'हिंदी', 'code': 'HI'},
              {'label': 'తెలుగు', 'code': 'TE'},
            ].map((lang) {
              final sel = _language == lang['label'];
              return GestureDetector(
                onTap: () {
                  setState(() => _language = lang['label']!);
                  Navigator.pop(ctx);
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: sel ? _amberBg : _bg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: sel ? _amber : _border,
                        width: sel ? 2 : 1),
                  ),
                  child: Row(
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: sel
                              ? _amber
                              : _textMuted.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(lang['code']!,
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color:
                                    sel ? Colors.white : _textMuted,
                              )),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(lang['label']!,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: sel
                                ? FontWeight.w700
                                : FontWeight.w500,
                            color: sel ? _navy : _textSecondary,
                          )),
                      const Spacer(),
                      if (sel)
                        const Icon(Icons.check_circle,
                            color: _amber, size: 18),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _navy),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Settings',
            style: TextStyle(
                color: _navy, fontWeight: FontWeight.w700, fontSize: 18)),
      ),
      body: ListView(
        children: [
          const SizedBox(height: 12),
          // Each section fades + slides in
          _buildSection(
            index: 0,
            child: _SettingGroup(
              title: 'PREFERENCES',
              children: [
                _SettingTile(
                  icon: Icons.language,
                  iconColor: const Color(0xFF3B82F6),
                  title: 'Language',
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 200),
                        child: Text(
                          _language,
                          key: ValueKey(_language),
                          style: const TextStyle(
                              color: _textSecondary, fontSize: 13),
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.chevron_right,
                          color: _textMuted, size: 18),
                    ],
                  ),
                  onTap: _showLanguageDialog,
                ),
                _SettingTile(
                  icon: Icons.notifications_outlined,
                  iconColor: _amber,
                  title: 'Push Notifications',
                  trailing: Switch(
                    value: _pushNotifs,
                    onChanged: (v) =>
                        setState(() => _pushNotifs = v),
                    activeColor: _amber,
                  ),
                  onTap: () =>
                      setState(() => _pushNotifs = !_pushNotifs),
                ),
                _SettingTile(
                  icon: Icons.dark_mode_outlined,
                  iconColor: _navy,
                  title: 'Dark Mode',
                  trailing: Switch(
                    value: _darkMode,
                    onChanged: (v) =>
                        setState(() => _darkMode = v),
                    activeColor: _amber,
                  ),
                  onTap: () =>
                      setState(() => _darkMode = !_darkMode),
                ),
              ],
            ),
          ),
          _buildSection(
            index: 1,
            child: _SettingGroup(
              title: 'LEGAL',
              children: [
                _SettingTile(
                  icon: Icons.privacy_tip_outlined,
                  iconColor: const Color(0xFF10B981),
                  title: 'Privacy Policy',
                  trailing: const Icon(Icons.chevron_right,
                      color: _textMuted, size: 18),
                  onTap: () {},
                ),
                _SettingTile(
                  icon: Icons.gavel,
                  iconColor: const Color(0xFF8B5CF6),
                  title: 'Terms of Service',
                  trailing: const Icon(Icons.chevron_right,
                      color: _textMuted, size: 18),
                  onTap: () {},
                ),
              ],
            ),
          ),
          _buildSection(
            index: 2,
            child: _SettingGroup(
              title: 'ABOUT',
              children: [
                _SettingTile(
                  icon: Icons.info_outline,
                  iconColor: const Color(0xFF6B7280),
                  title: 'App Version',
                  trailing: const Text('v1.0.0',
                      style: TextStyle(
                          color: _textMuted, fontSize: 13)),
                  onTap: null,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildSection({required int index, required Widget child}) {
    final safeIdx = index.clamp(0, _sectionFade.length - 1);
    return FadeTransition(
      opacity: _sectionFade[safeIdx],
      child: SlideTransition(
        position: _sectionSlide[safeIdx],
        child: child,
      ),
    );
  }
}

class _SettingGroup extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SettingGroup({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 6),
          child: Text(title,
              style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: _textMuted,
                  letterSpacing: 1.2)),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _border),
          ),
          child: Column(
            children: children.asMap().entries.map((e) {
              final isLast = e.key == children.length - 1;
              return Column(
                children: [
                  e.value,
                  if (!isLast)
                    const Divider(
                        height: 1, indent: 56, color: _border),
                ],
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _SettingTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final Widget trailing;
  final VoidCallback? onTap;

  const _SettingTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.trailing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
      leading: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: iconColor.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: iconColor, size: 17),
      ),
      title: Text(title,
          style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: _navy)),
      trailing: trailing,
    );
  }
}
