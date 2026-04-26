import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';

class DriverDashboard extends ConsumerStatefulWidget {
  const DriverDashboard({super.key});

  @override
  ConsumerState<DriverDashboard> createState() => _DriverDashboardState();
}

class _DriverDashboardState extends ConsumerState<DriverDashboard>
    with TickerProviderStateMixin {
  bool _isOnline = false;
  static const double _todayEarnings = 850;
  static const double _walletBalance = 9800;

  late AnimationController _staggerCtrl;
  late AnimationController _pinPulseCtrl;

  static const _deliveries = [
    _Delivery(
      id: '#DEL-5512',
      pickup: 'Kukatpally Warehouse',
      drop: 'Hitech City, Apt 402',
      distance: '4.2 km',
      earnings: '₹180',
    ),
    _Delivery(
      id: '#DEL-5509',
      pickup: 'LB Nagar Depot',
      drop: 'Banjara Hills, Villa 12',
      distance: '8.7 km',
      earnings: '₹320',
    ),
    _Delivery(
      id: '#DEL-5504',
      pickup: 'Kompally Yard',
      drop: 'Secunderabad Junction',
      distance: '12.1 km',
      earnings: '₹480',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();
    _pinPulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    _pinPulseCtrl.dispose();
    super.dispose();
  }

  Animation<double> _itemAnim(int i, {int total = 8}) => CurvedAnimation(
        parent: _staggerCtrl,
        curve: Interval(
          i / total * 0.6,
          (i / total * 0.6 + 0.4).clamp(0.0, 1.0),
          curve: Curves.easeOutCubic,
        ),
      );

  Widget _staggeredItem(int i, Widget child) {
    final anim = _itemAnim(i);
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.3),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  Widget _slideFromBottom(int i, Widget child) {
    final anim = CurvedAnimation(
      parent: _staggerCtrl,
      curve: Interval(
        (0.3 + i * 0.08).clamp(0.0, 0.8),
        (0.3 + i * 0.08 + 0.4).clamp(0.0, 1.0),
        curve: Curves.easeOutCubic,
      ),
    );
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.4),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final firstName = user?.name.split(' ').first ?? 'Driver';

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),

            // Status toggle card
            _staggeredItem(0, _buildStatusCard(firstName)),
            const SizedBox(height: 16),

            // Stats row with count-up
            _staggeredItem(1, _buildStatsRow()),
            const SizedBox(height: 16),

            // Route map placeholder with pulsing pin
            _staggeredItem(2, _buildRouteMapPlaceholder()),
            const SizedBox(height: 16),

            // Deliveries
            _staggeredItem(3, const Text('Available Deliveries',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
            const SizedBox(height: 12),

            if (!_isOnline)
              _staggeredItem(4, Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Center(
                  child: Column(
                    children: [
                      Icon(Icons.wifi_off,
                          color: AppColors.textMuted, size: 36),
                      SizedBox(height: 8),
                      Text('Go online to see available deliveries',
                          style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 14)),
                    ],
                  ),
                ),
              ))
            else
              for (int i = 0; i < _deliveries.length; i++) ...[
                _slideFromBottom(i, _DeliveryCard(delivery: _deliveries[i])),
                const SizedBox(height: 10),
              ],

            const SizedBox(height: 16),

            // Wallet card
            _staggeredItem(6, _buildWalletCard()),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(String firstName) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: _isOnline
              ? [const Color(0xFF065F46), AppColors.success]
              : [AppColors.navy, const Color(0xFF252838)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: (_isOnline ? AppColors.success : AppColors.navy)
                .withValues(alpha: 0.3),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            'Hello, $firstName!',
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white),
          ),
          const SizedBox(height: 16),
          GestureDetector(
            onTap: () => setState(() => _isOnline = !_isOnline),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              curve: Curves.easeInOut,
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isOnline
                    ? Colors.white.withValues(alpha: 0.2)
                    : Colors.white.withValues(alpha: 0.1),
                border: Border.all(
                    color: Colors.white,
                    width: _isOnline ? 3 : 2),
              ),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Icon(
                  _isOnline ? Icons.wifi : Icons.wifi_off,
                  key: ValueKey(_isOnline),
                  color: Colors.white,
                  size: 36,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            transitionBuilder: (child, anim) => FadeTransition(
              opacity: anim,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 0.3),
                  end: Offset.zero,
                ).animate(anim),
                child: child,
              ),
            ),
            child: Text(
              _isOnline
                  ? 'You are ONLINE — Ready for deliveries'
                  : 'You are OFFLINE — Tap to go online',
              key: ValueKey(_isOnline),
              style: const TextStyle(
                  fontSize: 13,
                  color: Colors.white,
                  fontWeight: FontWeight.w500),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(child: _buildStatCard(
          label: "Today's Trips",
          value: '4',
          icon: Icons.route,
          color: AppColors.customer,
          index: 0,
        )),
        const SizedBox(width: 10),
        Expanded(child: _buildEarningsStatCard()),
        const SizedBox(width: 10),
        Expanded(child: _buildStatCard(
          label: 'Rating',
          value: '4.2 ★',
          icon: Icons.star_outline,
          color: AppColors.amber,
          index: 2,
        )),
      ],
    );
  }

  Widget _buildStatCard({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
    required int index,
  }) {
    final anim = CurvedAnimation(
      parent: _staggerCtrl,
      curve: Interval(
        (0.1 + index * 0.08).clamp(0.0, 0.8),
        (0.1 + index * 0.08 + 0.4).clamp(0.0, 1.0),
        curve: Curves.easeOutBack,
      ),
    );
    return AnimatedBuilder(
      animation: anim,
      builder: (_, child) => Transform.scale(
        scale: anim.value,
        child: child,
      ),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: AppColors.navy.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(value,
                style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy)),
            const SizedBox(height: 2),
            Text(label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 10,
                    color: AppColors.textSecondary),
                maxLines: 2),
          ],
        ),
      ),
    );
  }

  Widget _buildEarningsStatCard() {
    final anim = CurvedAnimation(
      parent: _staggerCtrl,
      curve: const Interval(0.18, 0.58, curve: Curves.easeOutBack),
    );
    return AnimatedBuilder(
      animation: anim,
      builder: (_, child) => Transform.scale(scale: anim.value, child: child),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: AppColors.navy.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            const Icon(Icons.payments_outlined,
                color: AppColors.success, size: 22),
            const SizedBox(height: 6),
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: _todayEarnings),
              duration: const Duration(milliseconds: 1000),
              curve: Curves.easeOutCubic,
              builder: (_, v, __) => Text(
                '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy),
              ),
            ),
            const SizedBox(height: 2),
            const Text('Earnings',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 10,
                    color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }

  Widget _buildRouteMapPlaceholder() {
    return Container(
      height: 140,
      decoration: BoxDecoration(
        color: const Color(0xFFE8F4FD),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Stack(
        children: [
          // Grid lines simulating map
          CustomPaint(
            size: const Size(double.infinity, 140),
            painter: _MapGridPainter(),
          ),
          // Route line
          Center(
            child: Container(
              height: 3,
              width: 160,
              decoration: BoxDecoration(
                color: AppColors.customer,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          // Pulsing location pin
          Center(
            child: AnimatedBuilder(
              animation: _pinPulseCtrl,
              builder: (_, child) {
                final scale = 1.0 + 0.3 * _pinPulseCtrl.value;
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Transform.scale(
                      scale: scale,
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.driver.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.location_on,
                            color: AppColors.driver, size: 22),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text('Current Location',
                        style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: AppColors.textSecondary)),
                  ],
                );
              },
            ),
          ),
          // Label
          Positioned(
            top: 10,
            left: 14,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.map_outlined,
                      size: 12, color: AppColors.customer),
                  SizedBox(width: 4),
                  Text('Route Map',
                      style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.navy)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWalletCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.driver, Color(0xFFDC2626)],
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: AppColors.driver.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.account_balance_wallet,
              color: Colors.white, size: 32),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Wallet Balance',
                  style: TextStyle(
                      fontSize: 13,
                      color: Colors.white70,
                      fontWeight: FontWeight.w500)),
              const SizedBox(height: 4),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: _walletBalance),
                duration: const Duration(milliseconds: 1200),
                curve: Curves.easeOutCubic,
                builder: (_, v, __) => Text(
                  '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
                  style: const TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const Spacer(),
          _PressButton(
            label: 'Withdraw',
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Delivery card with press feedback
// ---------------------------------------------------------------------------

class _DeliveryCard extends StatefulWidget {
  final _Delivery delivery;
  const _DeliveryCard({required this.delivery});
  @override
  State<_DeliveryCard> createState() => _DeliveryCardState();
}

class _DeliveryCardState extends State<_DeliveryCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: () {},
      child: AnimatedScale(
        scale: _pressed ? 0.97 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
            boxShadow: [
              BoxShadow(
                color: AppColors.navy.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Text(widget.delivery.id,
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.navy)),
                  const Spacer(),
                  Text(widget.delivery.distance,
                      style: const TextStyle(
                          fontSize: 12, color: AppColors.textSecondary)),
                  const SizedBox(width: 4),
                  const Icon(Icons.directions_car,
                      size: 14, color: AppColors.textSecondary),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Column(
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.success,
                        ),
                      ),
                      Container(width: 2, height: 20, color: AppColors.border),
                      Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.error,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.delivery.pickup,
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.navy)),
                        const SizedBox(height: 12),
                        Text(widget.delivery.drop,
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.navy)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(widget.delivery.earnings,
                          style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.success)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.navy,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text('Accept',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 12)),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Withdraw button
// ---------------------------------------------------------------------------

class _PressButton extends StatefulWidget {
  final String label;
  final VoidCallback? onTap;
  const _PressButton({required this.label, this.onTap});
  @override
  State<_PressButton> createState() => _PressButtonState();
}

class _PressButtonState extends State<_PressButton> {
  bool _p = false;
  @override
  Widget build(_) => GestureDetector(
        onTapDown: (_) => setState(() => _p = true),
        onTapUp: (_) => setState(() => _p = false),
        onTapCancel: () => setState(() => _p = false),
        onTap: widget.onTap,
        child: AnimatedScale(
          scale: _p ? 0.95 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                  color: Colors.white.withValues(alpha: 0.4)),
            ),
            child: Text(widget.label,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 13)),
          ),
        ),
      );
}

// ---------------------------------------------------------------------------
// Map grid painter (cosmetic)
// ---------------------------------------------------------------------------

class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFBFDBFE).withValues(alpha: 0.5)
      ..strokeWidth = 1;

    const spacing = 28.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_MapGridPainter _) => false;
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _Delivery {
  final String id;
  final String pickup;
  final String drop;
  final String distance;
  final String earnings;
  const _Delivery({
    required this.id,
    required this.pickup,
    required this.drop,
    required this.distance,
    required this.earnings,
  });
}
