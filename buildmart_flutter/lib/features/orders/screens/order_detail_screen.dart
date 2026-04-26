import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _surface = Colors.white;
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _error = Color(0xFFEF4444);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

final _dateFmt = DateFormat('dd MMM yyyy, hh:mm a');
final _amtFmt = NumberFormat('##,##,###', 'en_IN');

class _TimelineStep {
  final String label;
  final String subtitle;
  const _TimelineStep(this.label, this.subtitle);
}

const List<_TimelineStep> _timelineSteps = [
  _TimelineStep('Placed', 'Order received'),
  _TimelineStep('Confirmed', 'Seller accepted'),
  _TimelineStep('Processing', 'Being packed'),
  _TimelineStep('Dispatched', 'Out for delivery'),
  _TimelineStep('Delivered', 'Order complete'),
];

class _OrderItem {
  final String name;
  final String imageUrl;
  final int qty;
  final double price;
  const _OrderItem(this.name, this.imageUrl, this.qty, this.price);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pulsing ring for current timeline step
// ─────────────────────────────────────────────────────────────────────────────

class _PulsingRing extends StatefulWidget {
  final Color color;
  final Widget child;
  const _PulsingRing({required this.color, required this.child});

  @override
  State<_PulsingRing> createState() => _PulsingRingState();
}

class _PulsingRingState extends State<_PulsingRing>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (_, child) => Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: widget.color.withValues(alpha: 0.3 + 0.4 * _ctrl.value),
            width: 3,
          ),
        ),
        child: Center(child: child),
      ),
      child: widget.child,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Detail Screen
// ─────────────────────────────────────────────────────────────────────────────

class OrderDetailScreen extends ConsumerStatefulWidget {
  final String orderId;
  final Object? extra;

  const OrderDetailScreen({super.key, required this.orderId, this.extra});

  @override
  ConsumerState<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends ConsumerState<OrderDetailScreen>
    with TickerProviderStateMixin {
  // Timeline: 1200ms total
  late AnimationController _timelineCtrl;
  // Items stagger
  late AnimationController _itemsCtrl;
  // Price rows
  late AnimationController _priceCtrl;
  // Action button slide-up
  late AnimationController _btnCtrl;
  late Animation<Offset> _btnSlide;

  // Order data resolved from extra
  late String _orderNumber;
  late DateTime _orderDate;
  late String _shopName; // shown in shop row
  late int _statusStep;
  late bool _isCancelled;
  late bool _isDelivered;

  // Cancel button press state for shadow pulse
  bool _cancelPressed = false;

  final List<_OrderItem> _items = [
    _OrderItem(
      'UltraTech PPC Cement',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80',
      4, 385,
    ),
    _OrderItem(
      'SAIL TMT Steel Fe500D',
      'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=200&q=80',
      50, 72,
    ),
    _OrderItem(
      'Red Clay Bricks',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&q=80',
      200, 7,
    ),
  ];

  @override
  void initState() {
    super.initState();

    _timelineCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _itemsCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _priceCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _btnCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _btnSlide = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _btnCtrl, curve: Curves.easeOut));

    _resolveOrder();

    // Chain animations
    _timelineCtrl.forward().then((_) {
      _itemsCtrl.forward().then((_) {
        _priceCtrl.forward().then((_) {
          _btnCtrl.forward();
        });
      });
    });
  }

  void _resolveOrder() {
    try {
      final e = widget.extra as dynamic;
      _orderNumber = e.orderNumber ?? '#BM-2024-001';
      _orderDate = e.date ?? DateTime(2025, 4, 20);
      _shopName = e.shopName ?? 'Hyderabad Building Supplies';
      final status = e.status?.toString() ?? '';
      if (status.contains('cancelled')) {
        _statusStep = 0;
        _isCancelled = true;
        _isDelivered = false;
      } else if (status.contains('completed')) {
        _statusStep = 4;
        _isCancelled = false;
        _isDelivered = true;
      } else if (status.contains('pending')) {
        _statusStep = 0;
        _isCancelled = false;
        _isDelivered = false;
      } else {
        _statusStep = 2; // active = Processing
        _isCancelled = false;
        _isDelivered = false;
      }
    } catch (_) {
      _orderNumber = '#BM-2024-001';
      _orderDate = DateTime(2025, 4, 20);
      _shopName = 'Hyderabad Building Supplies';
      _statusStep = 2;
      _isCancelled = false;
      _isDelivered = false;
    }
  }

  @override
  void dispose() {
    _timelineCtrl.dispose();
    _itemsCtrl.dispose();
    _priceCtrl.dispose();
    _btnCtrl.dispose();
    super.dispose();
  }

  double get _subtotal => _items.fold(0, (s, i) => s + i.price * i.qty);
  double get _delivery => 150.0;
  double get _gst => _subtotal * 0.05;
  double get _total => _subtotal + _delivery + _gst;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _orderNumber,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            Text(
              _dateFmt.format(_orderDate),
              style: const TextStyle(color: Colors.white60, fontSize: 11),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (!_isCancelled) _buildTimeline(),
          if (!_isCancelled) const SizedBox(height: 20),
          _buildItemsList(),
          const SizedBox(height: 16),
          _buildPriceBreakdown(),
          const SizedBox(height: 16),
          _buildDeliveryAddress(),
          const SizedBox(height: 24),
          _buildActionButton(context),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  // ── Timeline ──────────────────────────────────────────────────────────────

  Widget _buildTimeline() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _surface,
        border: Border.all(color: _border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Order Status',
            style: TextStyle(
                fontWeight: FontWeight.bold, fontSize: 15, color: _navy),
          ),
          const SizedBox(height: 16),
          ...List.generate(_timelineSteps.length, (i) {
            final step = _timelineSteps[i];
            final isDone = i <= _statusStep;
            final isCurrent = i == _statusStep;
            final isLast = i == _timelineSteps.length - 1;

            // Each circle appears at i * 200ms, duration 300ms, elasticOut
            final circleStart = (i * 200 / 1200).clamp(0.0, 1.0);
            final circleEnd = ((i * 200 + 300) / 1200).clamp(0.0, 1.0);
            final circleAnim = Tween<double>(begin: 0, end: 1).animate(
              CurvedAnimation(
                parent: _timelineCtrl,
                curve: Interval(circleStart, circleEnd,
                    curve: Curves.elasticOut),
              ),
            );

            // Line appears between step i and i+1
            final lineStart = ((i * 200 + 200) / 1200).clamp(0.0, 1.0);
            final lineEnd = ((i * 200 + 400) / 1200).clamp(0.0, 1.0);
            final lineAnim = Tween<double>(begin: 0, end: 1).animate(
              CurvedAnimation(
                parent: _timelineCtrl,
                curve: Interval(lineStart, lineEnd, curve: Curves.easeOut),
              ),
            );

            // Check fade for completed steps
            final checkAnim = Tween<double>(begin: 0, end: 1).animate(
              CurvedAnimation(
                parent: _timelineCtrl,
                curve: Interval(
                  circleEnd.clamp(0.0, 0.95),
                  (circleEnd + 0.1).clamp(0.0, 1.0),
                  curve: Curves.easeIn,
                ),
              ),
            );

            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Circle + line column
                  Column(
                    children: [
                      ScaleTransition(
                        scale: circleAnim,
                        child: isCurrent
                            ? _PulsingRing(
                                color: _amber,
                                child: Container(
                                  width: 26,
                                  height: 26,
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: _amber,
                                  ),
                                  child: const Icon(
                                      Icons.radio_button_checked,
                                      size: 14,
                                      color: Colors.white),
                                ),
                              )
                            : Container(
                                width: 26,
                                height: 26,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isDone ? _success : _bg,
                                  border: Border.all(
                                    color: isDone ? _success : _border,
                                    width: 2,
                                  ),
                                ),
                                child: isDone
                                    ? FadeTransition(
                                        opacity: checkAnim,
                                        child: const Icon(Icons.check,
                                            size: 14, color: Colors.white),
                                      )
                                    : null,
                              ),
                      ),
                      if (!isLast)
                        Expanded(
                          child: AnimatedBuilder(
                            animation: lineAnim,
                            builder: (context, child) => ClipRect(
                              child: Align(
                                alignment: Alignment.topCenter,
                                heightFactor: lineAnim.value,
                                child: Container(
                                  width: 2,
                                  height: 40,
                                  color: i < _statusStep ? _success : _border,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(bottom: isLast ? 0 : 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            step.label,
                            style: TextStyle(
                              fontWeight: isCurrent
                                  ? FontWeight.bold
                                  : FontWeight.w500,
                              color: isDone ? _navy : _textMuted,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            step.subtitle,
                            style: const TextStyle(
                                color: _textSecondary, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // ── Items list with stagger from right ────────────────────────────────────

  Widget _buildItemsList() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _surface,
        border: Border.all(color: _border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Items (${_items.length})',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 15, color: _navy),
                ),
              ),
              Text(
                _shopName,
                style: const TextStyle(fontSize: 12, color: _textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ..._items.asMap().entries.map((e) {
            final item = e.value;
            final idx = e.key;
            final isLast = idx == _items.length - 1;

            final start = (idx * 0.25).clamp(0.0, 0.75);
            final end = (start + 0.4).clamp(0.0, 1.0);
            final interval = Interval(start, end, curve: Curves.easeOut);

            final opacity = Tween<double>(begin: 0, end: 1).animate(
              CurvedAnimation(parent: _itemsCtrl, curve: interval),
            );
            final slide = Tween<Offset>(
              begin: const Offset(0.2, 0),
              end: Offset.zero,
            ).animate(
              CurvedAnimation(parent: _itemsCtrl, curve: interval),
            );

            return FadeTransition(
              opacity: opacity,
              child: SlideTransition(
                position: slide,
                child: Column(
                  children: [
                    Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: CachedNetworkImage(
                            imageUrl: item.imageUrl,
                            width: 56,
                            height: 56,
                            fit: BoxFit.cover,
                            placeholder: (ctx, url) => Container(
                                width: 56, height: 56, color: _bg),
                            errorWidget: (ctx, url, err) =>
                                Container(width: 56, height: 56, color: _bg),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13,
                                  color: _navy,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 3),
                              Text(
                                'Qty: ${item.qty}',
                                style: const TextStyle(
                                    fontSize: 12, color: _textSecondary),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '₹${_amtFmt.format(item.price * item.qty)}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: _navy,
                          ),
                        ),
                      ],
                    ),
                    if (!isLast) const Divider(height: 16, color: _border),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // ── Price breakdown with sequential row fades ─────────────────────────────

  Widget _buildPriceBreakdown() {
    final rows = [
      ('Subtotal', _subtotal),
      ('Delivery', _delivery),
      ('GST (5%)', _gst),
    ];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _surface,
        border: Border.all(color: _border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Price Breakdown',
            style: TextStyle(
                fontWeight: FontWeight.bold, fontSize: 15, color: _navy),
          ),
          const SizedBox(height: 12),
          ...rows.asMap().entries.map((e) {
            final idx = e.key;
            final (label, value) = e.value;
            final start = (idx * 0.25).clamp(0.0, 0.75);
            final end = (start + 0.4).clamp(0.0, 1.0);
            final opacity = Tween<double>(begin: 0, end: 1).animate(
              CurvedAnimation(
                parent: _priceCtrl,
                curve: Interval(start, end, curve: Curves.easeIn),
              ),
            );
            return FadeTransition(
              opacity: opacity,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: _priceRow(label, value),
              ),
            );
          }),
          const Divider(height: 20, color: _border),
          // Total with count-up
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total',
                style: TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 16, color: _navy),
              ),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: _total),
                duration: const Duration(milliseconds: 800),
                curve: Curves.easeOut,
                builder: (context, value, child) => Text(
                  '₹${_amtFmt.format(value)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: _amber,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _priceRow(String label, double value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: const TextStyle(color: _textSecondary, fontSize: 14)),
        Text(
          '₹${_amtFmt.format(value)}',
          style: const TextStyle(
              color: _navy, fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  // ── Delivery address ──────────────────────────────────────────────────────

  Widget _buildDeliveryAddress() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _surface,
        border: Border.all(color: _border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.location_on_outlined, size: 18, color: _navy),
              SizedBox(width: 6),
              Text(
                'Delivery Address',
                style: TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 15, color: _navy),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            'Rajesh Kumar',
            style: TextStyle(
                fontWeight: FontWeight.w600, color: _navy, fontSize: 14),
          ),
          SizedBox(height: 4),
          Text(
            'Plot 42, Gachibowli Main Road\nHyderabad, Telangana — 500032',
            style: TextStyle(
                color: _textSecondary, fontSize: 13, height: 1.5),
          ),
          SizedBox(height: 4),
          Text(
            '+91 98765 43210',
            style: TextStyle(color: _textSecondary, fontSize: 13),
          ),
        ],
      ),
    );
  }

  // ── Action button — slides up from bottom ─────────────────────────────────

  Widget _buildActionButton(BuildContext context) {
    Widget button;

    if (_isCancelled) {
      button = Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFFFEE2E2),
          border: Border.all(color: _error.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Row(
          children: [
            Icon(Icons.cancel_outlined, color: _error),
            SizedBox(width: 10),
            Text(
              'This order was cancelled.',
              style:
                  TextStyle(color: _error, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      );
    } else if (_isDelivered) {
      button = GestureDetector(
        onTap: () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Items added to cart for reorder'),
            backgroundColor: _navy,
            behavior: SnackBarBehavior.floating,
          ),
        ),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: _amber,
            borderRadius: BorderRadius.circular(12),
          ),
          alignment: Alignment.center,
          child: const Text(
            'Reorder',
            style: TextStyle(
                color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
      );
    } else {
      // Active / pending — cancel button with animated shadow on press
      button = GestureDetector(
        onTapDown: (_) => setState(() => _cancelPressed = true),
        onTapUp: (_) {
          setState(() => _cancelPressed = false);
          _showCancelDialog(context);
        },
        onTapCancel: () => setState(() => _cancelPressed = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _error),
            borderRadius: BorderRadius.circular(12),
            boxShadow: _cancelPressed
                ? [
                    BoxShadow(
                      color: _error.withValues(alpha: 0.25),
                      blurRadius: 12,
                      spreadRadius: 2,
                    ),
                  ]
                : [],
          ),
          alignment: Alignment.center,
          child: const Text(
            'Cancel Order',
            style: TextStyle(
                color: _error, fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
      );
    }

    return SlideTransition(
      position: _btnSlide,
      child: button,
    );
  }

  void _showCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Cancel Order?',
          style: TextStyle(color: _navy, fontWeight: FontWeight.bold),
        ),
        content: Text('Are you sure you want to cancel $_orderNumber?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text(
              'Keep Order',
              style: TextStyle(color: _textSecondary),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: _error,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              context.pop();
            },
            child: const Text(
              'Cancel Order',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
