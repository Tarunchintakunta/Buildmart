import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _surface = Colors.white;
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _error = Color(0xFFEF4444);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);
const _blue = Color(0xFF3B82F6);

final _dateFmt = DateFormat('dd MMM yyyy');
final _amtFmt = NumberFormat('##,##,###', 'en_IN');

enum _OrderStatus { active, completed, cancelled, pending }

class _Order {
  final String id;
  final String orderNumber;
  final DateTime date;
  final _OrderStatus status;
  final String shopName;
  final double amount;
  final int itemsCount;

  const _Order({
    required this.id,
    required this.orderNumber,
    required this.date,
    required this.status,
    required this.shopName,
    required this.amount,
    required this.itemsCount,
  });
}

final List<_Order> _mockOrders = [
  _Order(
    id: 'o1', orderNumber: '#BM-2024-001',
    date: DateTime(2025, 4, 20),
    status: _OrderStatus.pending,
    shopName: 'Hyderabad Building Supplies', amount: 5400, itemsCount: 2,
  ),
  _Order(
    id: 'o2', orderNumber: '#BM-2024-002',
    date: DateTime(2025, 4, 20),
    status: _OrderStatus.active,
    shopName: 'Hyderabad Building Supplies', amount: 12750, itemsCount: 3,
  ),
  _Order(
    id: 'o3', orderNumber: '#BM-2024-003',
    date: DateTime(2025, 4, 18),
    status: _OrderStatus.active,
    shopName: 'Star Construction Depot', amount: 4620, itemsCount: 2,
  ),
  _Order(
    id: 'o4', orderNumber: '#BM-2024-004',
    date: DateTime(2025, 4, 10),
    status: _OrderStatus.completed,
    shopName: 'RK Hardware Mart', amount: 8200, itemsCount: 1,
  ),
  _Order(
    id: 'o5', orderNumber: '#BM-2024-005',
    date: DateTime(2025, 4, 5),
    status: _OrderStatus.completed,
    shopName: 'Cement World', amount: 3080, itemsCount: 4,
  ),
  _Order(
    id: 'o6', orderNumber: '#BM-2024-006',
    date: DateTime(2025, 3, 28),
    status: _OrderStatus.cancelled,
    shopName: 'SteelCraft Hyderabad', amount: 21600, itemsCount: 2,
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// Pulsing dot widget
// ─────────────────────────────────────────────────────────────────────────────

class _PulsingDot extends StatefulWidget {
  final Color color;
  const _PulsingDot({required this.color});

  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _ctrl,
        builder: (context, child) => Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: widget.color.withValues(alpha: 0.4 + 0.6 * _ctrl.value),
          ),
        ),
      );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab labels
// ─────────────────────────────────────────────────────────────────────────────

const _tabLabels = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

// ─────────────────────────────────────────────────────────────────────────────
// Orders Screen
// ─────────────────────────────────────────────────────────────────────────────

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen>
    with TickerProviderStateMixin {
  int _selectedTab = 0;
  bool _loading = true;
  bool _contentVisible = true;

  // For the AnimatedContainer sliding tab indicator
  final _tabScrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Simulate 800ms shimmer loading
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) setState(() => _loading = false);
    });
  }

  @override
  void dispose() {
    _tabScrollController.dispose();
    super.dispose();
  }

  List<_Order> _filterOrders(int tabIndex) {
    switch (tabIndex) {
      case 0:
        return _mockOrders;
      case 1:
        return _mockOrders.where((o) => o.status == _OrderStatus.pending).toList();
      case 2:
        return _mockOrders.where((o) => o.status == _OrderStatus.active).toList();
      case 3:
        return _mockOrders.where((o) => o.status == _OrderStatus.completed).toList();
      case 4:
        return _mockOrders.where((o) => o.status == _OrderStatus.cancelled).toList();
      default:
        return _mockOrders;
    }
  }

  Future<void> _switchTab(int index) async {
    if (index == _selectedTab) return;
    // fade out
    setState(() => _contentVisible = false);
    await Future.delayed(const Duration(milliseconds: 200));
    if (!mounted) return;
    setState(() {
      _selectedTab = index;
      _contentVisible = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text(
          'My Orders',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: _AnimatedTabBar(
            labels: _tabLabels,
            selectedIndex: _selectedTab,
            onTap: _switchTab,
          ),
        ),
      ),
      body: AnimatedOpacity(
        opacity: _contentVisible ? 1.0 : 0.0,
        duration: const Duration(milliseconds: 200),
        child: _loading
            ? _buildShimmer()
            : AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _OrdersList(
                  key: ValueKey(_selectedTab),
                  orders: _filterOrders(_selectedTab),
                ),
              ),
      ),
    );
  }

  Widget _buildShimmer() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Shimmer.fromColors(
        baseColor: const Color(0xFFE5E7EB),
        highlightColor: const Color(0xFFF9FAFB),
        child: Column(
          children: List.generate(
            4,
            (i) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              height: 88,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Tab Bar with sliding indicator
// ─────────────────────────────────────────────────────────────────────────────

class _AnimatedTabBar extends StatelessWidget {
  final List<String> labels;
  final int selectedIndex;
  final ValueChanged<int> onTap;

  const _AnimatedTabBar({
    required this.labels,
    required this.selectedIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Row(
          children: List.generate(labels.length, (i) {
            final isSelected = i == selectedIndex;
            return GestureDetector(
              onTap: () => onTap(i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeInOut,
                margin: const EdgeInsets.only(right: 4),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: isSelected
                      ? _amber
                      : Colors.white.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  labels[i],
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.white60,
                    fontWeight:
                        isSelected ? FontWeight.w700 : FontWeight.normal,
                    fontSize: 13,
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders List with stagger
// ─────────────────────────────────────────────────────────────────────────────

class _OrdersList extends StatefulWidget {
  final List<_Order> orders;
  const _OrdersList({super.key, required this.orders});

  @override
  State<_OrdersList> createState() => _OrdersListState();
}

class _OrdersListState extends State<_OrdersList>
    with SingleTickerProviderStateMixin {
  late AnimationController _staggerCtrl;

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.orders.isEmpty) {
      return _BounceEmptyState();
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: widget.orders.length,
      itemBuilder: (context, i) {
        // Stagger: each card uses an Interval offset
        final startInterval = (i * 0.15).clamp(0.0, 0.8);
        final endInterval = (startInterval + 0.5).clamp(0.0, 1.0);
        final interval = Interval(startInterval, endInterval, curve: Curves.easeOut);

        final opacity = Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _staggerCtrl, curve: interval),
        );
        final slide = Tween<Offset>(
          begin: const Offset(0, 0.15),
          end: Offset.zero,
        ).animate(CurvedAnimation(parent: _staggerCtrl, curve: interval));

        return FadeTransition(
          opacity: opacity,
          child: SlideTransition(
            position: slide,
            child: _OrderCard(order: widget.orders[i]),
          ),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bounce empty state
// ─────────────────────────────────────────────────────────────────────────────

class _BounceEmptyState extends StatefulWidget {
  @override
  State<_BounceEmptyState> createState() => _BounceEmptyStateState();
}

class _BounceEmptyStateState extends State<_BounceEmptyState>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..forward();
    _scale = CurvedAnimation(parent: _ctrl, curve: Curves.elasticOut);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ScaleTransition(
        scale: _scale,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.receipt_long_outlined, size: 64, color: _textMuted),
            const SizedBox(height: 16),
            const Text(
              'No orders here',
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold, color: _navy),
            ),
            const SizedBox(height: 8),
            const Text(
              'Your orders in this category will appear here.',
              style: TextStyle(color: _textSecondary, fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Card with AnimatedScale on press
// ─────────────────────────────────────────────────────────────────────────────

class _OrderCard extends StatefulWidget {
  final _Order order;
  const _OrderCard({required this.order});

  @override
  State<_OrderCard> createState() => _OrderCardState();
}

class _OrderCardState extends State<_OrderCard> {
  bool _pressed = false;

  Color get _statusColor {
    switch (widget.order.status) {
      case _OrderStatus.active:
        return _blue;
      case _OrderStatus.completed:
        return _success;
      case _OrderStatus.cancelled:
        return _error;
      case _OrderStatus.pending:
        return _amber;
    }
  }

  String get _statusLabel {
    switch (widget.order.status) {
      case _OrderStatus.active:
        return 'Active';
      case _OrderStatus.completed:
        return 'Completed';
      case _OrderStatus.cancelled:
        return 'Cancelled';
      case _OrderStatus.pending:
        return 'Pending';
    }
  }

  Color get _statusBg {
    switch (widget.order.status) {
      case _OrderStatus.active:
        return _blue.withValues(alpha: 0.1);
      case _OrderStatus.completed:
        return const Color(0xFFD1FAE5);
      case _OrderStatus.cancelled:
        return const Color(0xFFFEE2E2);
      case _OrderStatus.pending:
        return _amberBg;
    }
  }

  bool get _isPulsing =>
      widget.order.status == _OrderStatus.pending ||
      widget.order.status == _OrderStatus.active;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        context.push('/orders/${widget.order.id}', extra: widget.order);
      },
      onTapCancel: () => setState(() => _pressed = false),
      child: AnimatedScale(
        scale: _pressed ? 0.97 : 1.0,
        duration: const Duration(milliseconds: 120),
        curve: Curves.easeOut,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.order.orderNumber,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: _navy,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: _statusBg,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (_isPulsing) ...[
                          _PulsingDot(color: _statusColor),
                          const SizedBox(width: 5),
                        ] else ...[
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _statusColor,
                            ),
                          ),
                          const SizedBox(width: 5),
                        ],
                        Text(
                          _statusLabel,
                          style: TextStyle(
                            color: _statusColor,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.store_outlined,
                      size: 14, color: _textSecondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      widget.order.shopName,
                      style:
                          const TextStyle(color: _textSecondary, fontSize: 13),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.calendar_today_outlined,
                      size: 14, color: _textSecondary),
                  const SizedBox(width: 4),
                  Text(
                    _dateFmt.format(widget.order.date),
                    style:
                        const TextStyle(color: _textSecondary, fontSize: 13),
                  ),
                  const SizedBox(width: 12),
                  const Icon(Icons.inventory_2_outlined,
                      size: 14, color: _textSecondary),
                  const SizedBox(width: 4),
                  Text(
                    '${widget.order.itemsCount} item${widget.order.itemsCount > 1 ? 's' : ''}',
                    style:
                        const TextStyle(color: _textSecondary, fontSize: 13),
                  ),
                ],
              ),
              const Divider(height: 20, color: _border),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '₹${_amtFmt.format(widget.order.amount)}',
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: _amber,
                    ),
                  ),
                  if (widget.order.status == _OrderStatus.active)
                    GestureDetector(
                      onTap: () => context.push(
                          '/orders/${widget.order.id}',
                          extra: widget.order),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 7),
                        decoration: BoxDecoration(
                          color: _navy,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.local_shipping_outlined,
                                size: 14, color: Colors.white),
                            SizedBox(width: 4),
                            Text(
                              'Track',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
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
