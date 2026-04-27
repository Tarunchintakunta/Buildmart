import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';

class ShopkeeperDashboard extends ConsumerStatefulWidget {
  const ShopkeeperDashboard({super.key});

  @override
  ConsumerState<ShopkeeperDashboard> createState() =>
      _ShopkeeperDashboardState();
}

class _ShopkeeperDashboardState extends ConsumerState<ShopkeeperDashboard>
    with TickerProviderStateMixin {
  bool _isShopOpen = true;
  static const double _monthlyRevenue = 124500;

  late AnimationController _staggerCtrl;
  late AnimationController _pulseDotCtrl;

  static const _lowStockItems = [
    _StockItem(name: 'Portland Cement 50kg', stock: 3, minStock: 10),
    _StockItem(name: 'TMT Steel 12mm', stock: 2, minStock: 5),
    _StockItem(name: 'PVC Pipes 1"', stock: 8, minStock: 20),
  ];

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();
    _pulseDotCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    _pulseDotCtrl.dispose();
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
        (i * 0.1).clamp(0.0, 0.6),
        (i * 0.1 + 0.4).clamp(0.0, 1.0),
        curve: Curves.easeOutBack,
      ),
    );
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.5),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final shopName = '${user?.name.split(' ').first ?? 'Your'} Hardware Store';

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Shop banner
          _staggeredItem(0, _buildShopBanner(shopName)),
          const SizedBox(height: 16),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Toggle card
                _staggeredItem(1, _buildToggleCard()),
                const SizedBox(height: 16),

                // Order pipeline bubbles
                _staggeredItem(2, _buildOrderPipeline()),
                const SizedBox(height: 16),

                // Revenue card
                _staggeredItem(3, _buildRevenueCard()),
                const SizedBox(height: 16),

                // Pending orders
                _staggeredItem(4, Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Pending Orders',
                        style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                            color: AppColors.navy)),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.amber.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('3',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.amber)),
                    ),
                  ],
                )),
                const SizedBox(height: 12),

                _staggeredItem(5, _buildPendingOrder(
                  orderId: '#ORD-3091',
                  customer: 'Ravi Kumar',
                  items: 'Portland Cement x10 bags',
                  amount: '₹3,800',
                  time: '10 min ago',
                  itemIcon: Icons.architecture,
                  itemColor: const Color(0xFF6B7280),
                )),
                const SizedBox(height: 10),
                _staggeredItem(5, _buildPendingOrder(
                  orderId: '#ORD-3087',
                  customer: 'Suresh Rao',
                  items: 'TMT Steel 12mm x2 bundles',
                  amount: '₹10,400',
                  time: '28 min ago',
                  itemIcon: Icons.straighten,
                  itemColor: const Color(0xFF3B82F6),
                )),
                const SizedBox(height: 16),

                // Low stock warning
                _staggeredItem(6, const Text('Low Stock Alerts',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy))),
                const SizedBox(height: 12),

                for (int i = 0; i < _lowStockItems.length; i++) ...[
                  _slideFromBottom(i, _buildLowStockCard(_lowStockItems[i])),
                  const SizedBox(height: 8),
                ],

                const SizedBox(height: 32),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShopBanner(String shopName) {
    return Container(
      height: 160,
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withValues(alpha: 0.25),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            CachedNetworkImage(
              imageUrl:
                  'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=800',
              fit: BoxFit.cover,
              placeholder: (context, url) => Shimmer.fromColors(
                baseColor: const Color(0xFFE5E7EB),
                highlightColor: const Color(0xFFF9FAFB),
                child: Container(color: Colors.white),
              ),
              errorWidget: (context, url, error) =>
                  Container(color: AppColors.shopkeeper),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    AppColors.navy.withValues(alpha: 0.8),
                  ],
                ),
              ),
            ),
            Positioned(
              left: 16,
              bottom: 16,
              right: 16,
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(shopName,
                            style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: Colors.white)),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.star,
                                color: AppColors.amber, size: 14),
                            const SizedBox(width: 4),
                            const Text('4.3',
                                style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white)),
                            const SizedBox(width: 4),
                            Text('(127 reviews)',
                                style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.white.withValues(alpha: 0.7))),
                          ],
                        ),
                      ],
                    ),
                  ),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 400),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _isShopOpen
                          ? AppColors.success
                          : AppColors.textMuted,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _isShopOpen ? 'Open' : 'Closed',
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToggleCard() {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 350),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: _isShopOpen
            ? AppColors.success.withValues(alpha: 0.05)
            : AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _isShopOpen
              ? AppColors.success.withValues(alpha: 0.3)
              : AppColors.border,
        ),
      ),
      child: Row(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: (_isShopOpen ? AppColors.success : AppColors.textMuted)
                  .withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              _isShopOpen ? Icons.storefront : Icons.store_mall_directory,
              color: _isShopOpen ? AppColors.success : AppColors.textMuted,
              size: 20,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 300),
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.navy),
                  child: Text(
                      _isShopOpen ? 'Shop is Open' : 'Shop is Closed'),
                ),
                Text(
                  _isShopOpen
                      ? 'Accepting orders'
                      : 'Not accepting orders',
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          Switch(
            value: _isShopOpen,
            onChanged: (v) => setState(() => _isShopOpen = v),
            activeColor: AppColors.success,
            activeTrackColor: AppColors.success.withValues(alpha: 0.3),
            inactiveThumbColor: AppColors.textMuted,
            inactiveTrackColor: AppColors.textMuted.withValues(alpha: 0.3),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderPipeline() {
    final pipeline = [
      _PipelineStat(label: 'Pending', value: 3, color: AppColors.amber, icon: Icons.pending_actions),
      _PipelineStat(label: 'Processing', value: 7, color: AppColors.customer, icon: Icons.settings),
      _PipelineStat(label: 'Delivered', value: 41, color: AppColors.success, icon: Icons.check_circle),
    ];

    return Row(
      children: pipeline.asMap().entries.map((entry) {
        final i = entry.key;
        final stat = entry.value;
        return Expanded(
          child: Container(
            margin: EdgeInsets.only(right: i < pipeline.length - 1 ? 10 : 0),
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
            decoration: BoxDecoration(
              color: stat.color.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: stat.color.withValues(alpha: 0.2)),
            ),
            child: Column(
              children: [
                Icon(stat.icon, color: stat.color, size: 22),
                const SizedBox(height: 8),
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: stat.value.toDouble()),
                  duration: Duration(milliseconds: 800 + i * 200),
                  curve: Curves.easeOutCubic,
                  builder: (_, v, __) => Text(
                    '${v.round()}',
                    style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: stat.color),
                  ),
                ),
                const SizedBox(height: 4),
                Text(stat.label,
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: stat.color.withValues(alpha: 0.8)),
                    textAlign: TextAlign.center),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildRevenueCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.shopkeeper, Color(0xFF059669)],
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: AppColors.shopkeeper.withValues(alpha: 0.35),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.bar_chart, color: Colors.white, size: 20),
              SizedBox(width: 8),
              Text('Monthly Revenue',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white)),
            ],
          ),
          const SizedBox(height: 12),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: _monthlyRevenue),
            duration: const Duration(milliseconds: 1200),
            curve: Curves.easeOutCubic,
            builder: (_, v, __) => Text(
              '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
              style: const TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.arrow_upward, color: Colors.white, size: 12),
                    SizedBox(width: 3),
                    Text('+23%',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text('vs last month',
                  style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.75),
                      fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPendingOrder({
    required String orderId,
    required String customer,
    required String items,
    required String amount,
    required String time,
    IconData itemIcon = Icons.inventory_2,
    Color itemColor = AppColors.amber,
  }) {
    final initials = customer
        .split(' ')
        .where((w) => w.isNotEmpty)
        .take(2)
        .map((w) => w[0].toUpperCase())
        .join();

    return Container(
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(orderId,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: AppColors.navy)),
              const Spacer(),
              Text(time,
                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Customer avatar
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: AppColors.navy.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(initials,
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: AppColors.navy)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(customer,
                        style: const TextStyle(
                            fontSize: 13,
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(
                            color: itemColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(5),
                          ),
                          child: Icon(itemIcon, size: 12, color: itemColor),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(items,
                              style: const TextStyle(
                                  fontSize: 12, color: AppColors.textSecondary),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Text(amount,
                  style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.navy)),
              const Spacer(),
              _PressButton(
                label: 'Reject',
                color: AppColors.error,
                onTap: () {},
              ),
              const SizedBox(width: 8),
              _PressButton(
                label: 'Accept',
                color: AppColors.amber,
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLowStockCard(_StockItem item) {
    final pct = (item.stock / item.minStock).clamp(0.0, 1.0);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border(
          left: const BorderSide(color: AppColors.error, width: 4),
          top: const BorderSide(color: AppColors.border),
          right: const BorderSide(color: AppColors.border),
          bottom: const BorderSide(color: AppColors.border),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.error.withValues(alpha: 0.04),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Pulsing red dot
          AnimatedBuilder(
            animation: _pulseDotCtrl,
            builder: (_, __) {
              final scale = 0.8 + 0.4 * _pulseDotCtrl.value;
              return Transform.scale(
                scale: scale,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.error,
                  ),
                ),
              );
            },
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.name,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.navy)),
                const SizedBox(height: 6),
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: pct),
                  duration: const Duration(milliseconds: 1000),
                  curve: Curves.easeOutCubic,
                  builder: (_, v, __) => ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: v,
                      backgroundColor: AppColors.error.withValues(alpha: 0.12),
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.error),
                      minHeight: 5,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${item.stock}',
                  style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.error)),
              Text('/ ${item.minStock} min',
                  style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.textMuted)),
            ],
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Press button helper
// ---------------------------------------------------------------------------

class _PressButton extends StatefulWidget {
  final String label;
  final Color color;
  final VoidCallback? onTap;
  const _PressButton({required this.label, required this.color, this.onTap});
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
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
            decoration: BoxDecoration(
              color: widget.color,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(widget.label,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 12)),
          ),
        ),
      );
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _PipelineStat {
  final String label;
  final int value;
  final Color color;
  final IconData icon;
  const _PipelineStat({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });
}

class _StockItem {
  final String name;
  final int stock;
  final int minStock;
  const _StockItem({required this.name, required this.stock, required this.minStock});
}
