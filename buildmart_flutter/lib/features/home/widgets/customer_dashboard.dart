import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';

class CustomerDashboard extends ConsumerStatefulWidget {
  const CustomerDashboard({super.key});

  @override
  ConsumerState<CustomerDashboard> createState() => _CustomerDashboardState();
}

class _CustomerDashboardState extends ConsumerState<CustomerDashboard>
    with TickerProviderStateMixin {
  static const double _walletBalance = 25000;

  late AnimationController _staggerCtrl;
  late AnimationController _waveCtrl;
  late AnimationController _underlineCtrl;
  bool _showShimmer = true;

  static const _quickActions = [
    _QuickAction(label: 'Order Materials', icon: Icons.inventory_2, color: AppColors.customer, route: '/shop'),
    _QuickAction(label: 'Hire Worker', icon: Icons.construction, color: AppColors.worker, route: '/workers'),
    _QuickAction(label: 'My Orders', icon: Icons.receipt_long, color: AppColors.shopkeeper, route: '/orders'),
    _QuickAction(label: 'Track Delivery', icon: Icons.local_shipping, color: AppColors.driver, route: '/deliveries'),
    _QuickAction(label: 'Agreements', icon: Icons.handshake, color: AppColors.contractor, route: '/agreements'),
    _QuickAction(label: 'My Wallet', icon: Icons.account_balance_wallet, color: AppColors.admin, route: '/wallet'),
  ];

  static const _categories = [
    _Category(label: 'Cement', color: Color(0xFF6B7280)),
    _Category(label: 'Steel', color: Color(0xFF475569)),
    _Category(label: 'Bricks', color: Color(0xFFB45309)),
    _Category(label: 'Paint', color: Color(0xFF2563EB)),
    _Category(label: 'Pipes', color: Color(0xFF0891B2)),
    _Category(label: 'Hardware', color: Color(0xFF65A30D)),
  ];

  static const _products = [
    _Product(id: 'p1', name: 'Portland Cement', price: 380, unit: '/bag',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300'),
    _Product(id: 'p2', name: 'TMT Steel Bars', price: 5200, unit: '/bundle',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300'),
    _Product(id: 'p3', name: 'Red Bricks', price: 7500, unit: '/1000',
        imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300'),
    _Product(id: 'p4', name: 'Interior Paint', price: 850, unit: '/litre',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300'),
  ];

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _waveCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
    _underlineCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    // Shimmer for 800ms then reveal
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        setState(() => _showShimmer = false);
        _staggerCtrl.forward();
        _underlineCtrl.forward();
      }
    });
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    _waveCtrl.dispose();
    _underlineCtrl.dispose();
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

  Widget _staggeredItemFromLeft(int i, Widget child) {
    final anim = _itemAnim(i);
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(-0.3, 0),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final firstName = user?.name.split(' ').first ?? 'there';

    if (_showShimmer) {
      return _buildShimmerLayout();
    }

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero card
          _staggeredItem(0, _buildHeroCard(firstName)),

          const SizedBox(height: 20),

          // Quick Actions
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _staggeredItem(1, const Text('Quick Actions',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy))),
                const SizedBox(height: 12),
                _buildQuickActionsGrid(),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Categories
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: _staggeredItem(3, const Text('Browse Categories',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
          ),
          const SizedBox(height: 12),
          _buildCategories(),

          const SizedBox(height: 20),

          // Featured Products with animated underline title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: _staggeredItem(4, _buildFeaturedTitle()),
          ),
          const SizedBox(height: 12),
          _buildFeaturedProducts(),

          const SizedBox(height: 20),

          // Recent Orders
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: _staggeredItem(6, const Text('Recent Orders',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                _staggeredItem(7, _buildOrderCard(
                  orderId: '#ORD-2847',
                  items: 'Portland Cement x5, Steel Bars x2',
                  status: 'In Transit',
                  statusColor: AppColors.info,
                  date: 'Apr 23, 2026',
                )),
                const SizedBox(height: 10),
                _staggeredItem(7, _buildOrderCard(
                  orderId: '#ORD-2831',
                  items: 'Red Bricks x1000, Paint 10L',
                  status: 'Delivered',
                  statusColor: AppColors.success,
                  date: 'Apr 20, 2026',
                )),
              ],
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildFeaturedTitle() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Featured Products',
            style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w700,
                color: AppColors.navy)),
        const SizedBox(height: 4),
        AnimatedBuilder(
          animation: _underlineCtrl,
          builder: (_, __) {
            return LayoutBuilder(builder: (ctx, constraints) {
              return Container(
                height: 3,
                width: constraints.maxWidth * _underlineCtrl.value * 0.38,
                decoration: BoxDecoration(
                  color: AppColors.amber,
                  borderRadius: BorderRadius.circular(2),
                ),
              );
            });
          },
        ),
      ],
    );
  }

  Widget _buildHeroCard(String firstName) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      height: 190,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: AppColors.navy.withValues(alpha: 0.3),
              blurRadius: 16,
              offset: const Offset(0, 6))
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            CachedNetworkImage(
              imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(color: AppColors.navy),
              errorWidget: (context, url, error) => Container(color: AppColors.navy),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                  colors: [
                    AppColors.navy.withValues(alpha: 0.4),
                    AppColors.navy.withValues(alpha: 0.85),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Greeting with wave emoji
                  Row(
                    children: [
                      Text(
                        '${_greeting()}, $firstName! ',
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.white),
                      ),
                      AnimatedBuilder(
                        animation: _waveCtrl,
                        builder: (_, __) {
                          final angle = (math.pi / 12) *
                              math.sin(_waveCtrl.value * math.pi * 2);
                          return Transform.rotate(
                            angle: angle,
                            origin: const Offset(0, 8),
                            child: const Text('👋',
                                style: TextStyle(fontSize: 18)),
                          );
                        },
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Wallet Balance',
                          style: TextStyle(fontSize: 12, color: Colors.white70)),
                      const SizedBox(height: 4),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          TweenAnimationBuilder<double>(
                            tween: Tween(begin: 0, end: _walletBalance),
                            duration: const Duration(milliseconds: 1200),
                            curve: Curves.easeOutCubic,
                            builder: (ctx, v, _) => Text(
                              '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const Spacer(),
                          _PressCard(
                            onTap: () => context.go('/wallet'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: AppColors.amber,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Text('+ Add Money',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 13)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionsGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1.0,
      ),
      itemCount: _quickActions.length,
      itemBuilder: (context, i) {
        final action = _quickActions[i];
        final start = 0.1 * i;
        final end = (0.1 * i + 0.3).clamp(0.0, 1.0);
        final anim = CurvedAnimation(
          parent: _staggerCtrl,
          curve: Interval(start, end, curve: Curves.easeOutBack),
        );
        return AnimatedBuilder(
          animation: anim,
          builder: (_, child) => Transform.scale(
            scale: anim.value,
            child: Opacity(opacity: anim.value.clamp(0.0, 1.0), child: child),
          ),
          child: _QuickActionTile(action: action),
        );
      },
    );
  }

  Widget _buildCategories() {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        itemCount: _categories.length,
        itemBuilder: (context, i) {
          final cat = _categories[i];
          return _staggeredItemFromLeft(
            3,
            GestureDetector(
              onTap: () => context.go('/shop'),
              child: Container(
                margin: const EdgeInsets.only(right: 16),
                child: Column(
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: cat.color.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.category, color: cat.color, size: 24),
                    ),
                    const SizedBox(height: 6),
                    Text(cat.label,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: AppColors.navy)),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeaturedProducts() {
    return SizedBox(
      height: 190,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        itemCount: _products.length,
        itemBuilder: (context, i) {
          final product = _products[i];
          final anim = CurvedAnimation(
            parent: _staggerCtrl,
            curve: Interval(
              (0.4 + i * 0.08).clamp(0.0, 1.0),
              (0.4 + i * 0.08 + 0.4).clamp(0.0, 1.0),
              curve: Curves.easeOutCubic,
            ),
          );
          return FadeTransition(
            opacity: anim,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.3),
                end: Offset.zero,
              ).animate(anim),
              child: _ProductCard(product: product),
            ),
          );
        },
      ),
    );
  }

  Widget _buildOrderCard({
    required String orderId,
    required String items,
    required String status,
    required Color statusColor,
    required String date,
  }) {
    return GestureDetector(
      onTap: () => context.go('/orders'),
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
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(orderId,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: AppColors.navy)),
                const SizedBox(height: 4),
                Text(items,
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(date,
                    style: const TextStyle(
                        fontSize: 11, color: AppColors.textMuted)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(status,
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: statusColor)),
          ),
        ],
      ),
    ),
    );
  }

  Widget _buildShimmerLayout() {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _shimmerBox(height: 190, radius: 16),
            const SizedBox(height: 20),
            Row(children: [
              _shimmerBox(height: 14, width: 120, radius: 4),
            ]),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3, crossAxisSpacing: 10,
                mainAxisSpacing: 10, childAspectRatio: 1.0,
              ),
              itemCount: 6,
              itemBuilder: (_, __) => _shimmerBox(height: 80, radius: 12),
            ),
            const SizedBox(height: 20),
            _shimmerBox(height: 14, width: 140, radius: 4),
            const SizedBox(height: 12),
            SizedBox(
              height: 90,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 5,
                itemBuilder: (_, __) => Container(
                  margin: const EdgeInsets.only(right: 16),
                  child: Column(children: [
                    _shimmerBox(height: 52, width: 52, radius: 26),
                    const SizedBox(height: 6),
                    _shimmerBox(height: 10, width: 40, radius: 4),
                  ]),
                ),
              ),
            ),
            const SizedBox(height: 20),
            _shimmerBox(height: 14, width: 160, radius: 4),
            const SizedBox(height: 12),
            SizedBox(
              height: 190,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 4,
                itemBuilder: (_, __) => Container(
                  width: 140,
                  margin: const EdgeInsets.only(right: 12),
                  child: _shimmerBox(height: 190, radius: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _shimmerBox({required double height, double? width, double radius = 8}) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: Container(
        height: height,
        width: width ?? double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Product Card with Hero + press feedback
// ---------------------------------------------------------------------------

class _ProductCard extends StatefulWidget {
  final _Product product;
  const _ProductCard({required this.product});
  @override
  State<_ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<_ProductCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: () => context.go('/product/${widget.product.id}'),
      child: AnimatedScale(
        scale: _pressed ? 0.96 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          width: 140,
          margin: const EdgeInsets.only(right: 12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
            boxShadow: [
              BoxShadow(
                color: AppColors.navy.withValues(alpha: 0.05),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Hero(
                tag: 'product_${widget.product.id}',
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                  child: CachedNetworkImage(
                    imageUrl: widget.product.imageUrl,
                    height: 110,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (ctx, url) => Shimmer.fromColors(
                      baseColor: const Color(0xFFE5E7EB),
                      highlightColor: const Color(0xFFF9FAFB),
                      child: Container(
                        color: Colors.white,
                        height: 110,
                      ),
                    ),
                    errorWidget: (ctx, url, err) => Container(
                        color: AppColors.background,
                        height: 110,
                        child: const Icon(Icons.image_not_supported,
                            color: AppColors.textMuted)),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.product.name,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.navy),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '₹${NumberFormat('##,##,###', 'en_IN').format(widget.product.price)}',
                          style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.amber),
                        ),
                        Text(widget.product.unit,
                            style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textMuted)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Quick action tile with press feedback
// ---------------------------------------------------------------------------

class _QuickActionTile extends StatefulWidget {
  final _QuickAction action;
  const _QuickActionTile({required this.action});
  @override
  State<_QuickActionTile> createState() => _QuickActionTileState();
}

class _QuickActionTileState extends State<_QuickActionTile> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: () => context.go(widget.action.route),
      child: AnimatedScale(
        scale: _pressed ? 0.96 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          decoration: BoxDecoration(
            color: _pressed
                ? widget.action.color.withValues(alpha: 0.06)
                : AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
                color: _pressed
                    ? widget.action.color.withValues(alpha: 0.3)
                    : AppColors.border),
            boxShadow: [
              BoxShadow(
                color: AppColors.navy.withValues(alpha: _pressed ? 0.02 : 0.05),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: widget.action.color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(widget.action.icon,
                    color: widget.action.color, size: 22),
              ),
              const SizedBox(height: 6),
              Text(
                widget.action.label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.navy),
                maxLines: 2,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Generic press-feedback card wrapper
// ---------------------------------------------------------------------------

class _PressCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  const _PressCard({required this.child, this.onTap});
  @override
  State<_PressCard> createState() => _PressCardState();
}

class _PressCardState extends State<_PressCard> {
  bool _pressed = false;
  @override
  Widget build(_) => GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapUp: (_) => setState(() => _pressed = false),
        onTapCancel: () => setState(() => _pressed = false),
        onTap: widget.onTap,
        child: AnimatedScale(
            scale: _pressed ? 0.96 : 1.0,
            duration: const Duration(milliseconds: 100),
            child: widget.child),
      );
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _QuickAction {
  final String label;
  final IconData icon;
  final Color color;
  final String route;
  const _QuickAction({required this.label, required this.icon, required this.color, required this.route});
}

class _Category {
  final String label;
  final Color color;
  const _Category({required this.label, required this.color});
}

class _Product {
  final String id;
  final String name;
  final int price;
  final String unit;
  final String imageUrl;
  const _Product({
    required this.id,
    required this.name,
    required this.price,
    required this.unit,
    required this.imageUrl,
  });
}
