import 'dart:async';
import 'package:flutter/material.dart';

const Color _navy = Color(0xFF1A1D2E);
const Color _amber = Color(0xFFF2960D);
const Color _bg = Color(0xFFF5F6FA);
const Color _border = Color(0xFFE5E7EB);
const Color _success = Color(0xFF10B981);
const Color _error = Color(0xFFEF4444);
const Color _textSecondary = Color(0xFF6B7280);
const Color _textMuted = Color(0xFF9CA3AF);
const Color _blue = Color(0xFF3B82F6);

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

enum _DeliveryTab { available, active, completed }

class _Delivery {
  final String id;
  final String pickup;
  final String drop;
  final double distance;
  final double earnings;
  final int items;
  final _DeliveryTab tab;
  final int etaMinutes;

  const _Delivery({
    required this.id,
    required this.pickup,
    required this.drop,
    required this.distance,
    required this.earnings,
    required this.items,
    required this.tab,
    this.etaMinutes = 0,
  });
}

final _mockDeliveries = [
  const _Delivery(
    id: 'DEL-4021',
    pickup: 'BuildMart Warehouse, Kukatpally',
    drop: 'Site – Gachibowli Block C',
    distance: 8.4,
    earnings: 180,
    items: 6,
    tab: _DeliveryTab.available,
  ),
  const _Delivery(
    id: 'DEL-4018',
    pickup: 'Steel Depot, Uppal',
    drop: 'Site – LB Nagar Apt 4',
    distance: 12.1,
    earnings: 260,
    items: 12,
    tab: _DeliveryTab.active,
    etaMinutes: 25,
  ),
  const _Delivery(
    id: 'DEL-3990',
    pickup: 'BuildMart Warehouse, Kukatpally',
    drop: 'Site – Kondapur Phase 2',
    distance: 6.8,
    earnings: 150,
    items: 4,
    tab: _DeliveryTab.completed,
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// Pulsing dot
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
// Deliveries Screen
// ─────────────────────────────────────────────────────────────────────────────

class DeliveriesScreen extends StatefulWidget {
  const DeliveriesScreen({super.key});

  @override
  State<DeliveriesScreen> createState() => _DeliveriesScreenState();
}

class _DeliveriesScreenState extends State<DeliveriesScreen>
    with SingleTickerProviderStateMixin {
  bool _isOnline = true;
  late TabController _tabController;
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<_Delivery> _deliveriesForTab(_DeliveryTab tab) =>
      _mockDeliveries.where((d) => d.tab == tab).toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        title: const Text(
          'Deliveries',
          style: TextStyle(
              color: _navy, fontWeight: FontWeight.w700, fontSize: 20),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: _navy),
            onPressed: () {},
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: _amber,
          unselectedLabelColor: _textSecondary,
          indicatorColor: _amber,
          indicatorWeight: 2.5,
          labelStyle:
              const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          unselectedLabelStyle:
              const TextStyle(fontWeight: FontWeight.w500, fontSize: 13),
          tabs: const [
            Tab(text: 'Available'),
            Tab(text: 'Active'),
            Tab(text: 'Completed'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Online toggle card
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: GestureDetector(
              onTap: () => setState(() => _isOnline = !_isOnline),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 350),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: _isOnline ? _success : _textMuted,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: (_isOnline ? _success : _textMuted)
                          .withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isOnline
                            ? Icons.directions_bike
                            : Icons.directions_bike_outlined,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _isOnline ? 'You are Online' : 'You are Offline',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          Text(
                            _isOnline
                                ? 'Accepting new delivery requests'
                                : 'Tap to go online',
                            style: const TextStyle(
                                color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    // Toggle pill
                    Container(
                      width: 50,
                      height: 28,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.25),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: AnimatedAlign(
                        duration: const Duration(milliseconds: 250),
                        alignment: _isOnline
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Container(
                          width: 22,
                          height: 22,
                          margin:
                              const EdgeInsets.symmetric(horizontal: 3),
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 12),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _DeliveryList(
                  key: const ValueKey(_DeliveryTab.available),
                  tab: _DeliveryTab.available,
                  deliveries: _deliveriesForTab(_DeliveryTab.available),
                ),
                _DeliveryList(
                  key: const ValueKey(_DeliveryTab.active),
                  tab: _DeliveryTab.active,
                  deliveries: _deliveriesForTab(_DeliveryTab.active),
                ),
                _DeliveryList(
                  key: const ValueKey(_DeliveryTab.completed),
                  tab: _DeliveryTab.completed,
                  deliveries: _deliveriesForTab(_DeliveryTab.completed),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delivery List — staggered with FadeThroughTransition wrapper
// ─────────────────────────────────────────────────────────────────────────────

class _DeliveryList extends StatefulWidget {
  final _DeliveryTab tab;
  final List<_Delivery> deliveries;

  const _DeliveryList({
    super.key,
    required this.tab,
    required this.deliveries,
  });

  @override
  State<_DeliveryList> createState() => _DeliveryListState();
}

class _DeliveryListState extends State<_DeliveryList>
    with SingleTickerProviderStateMixin {
  late AnimationController _staggerCtrl;

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..forward();
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.deliveries.isEmpty) {
      return const Center(
        child: Text('No deliveries here',
            style: TextStyle(color: _textMuted)),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: widget.deliveries.length,
      itemBuilder: (context, i) {
        final startInterval = (i * 0.2).clamp(0.0, 0.8);
        final endInterval = (startInterval + 0.5).clamp(0.0, 1.0);
        final interval =
            Interval(startInterval, endInterval, curve: Curves.easeOut);

        final opacity = Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _staggerCtrl, curve: interval),
        );
        final slide = Tween<Offset>(
          begin: const Offset(0, 0.2),
          end: Offset.zero,
        ).animate(CurvedAnimation(parent: _staggerCtrl, curve: interval));

        return FadeTransition(
          opacity: opacity,
          child: SlideTransition(
            position: slide,
            child: _DeliveryCard(
              delivery: widget.deliveries[i],
              tab: widget.tab,
              onAccept: widget.tab == _DeliveryTab.available
                  ? () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => OrderTrackingScreen(
                              orderId: widget.deliveries[i].id),
                        ),
                      )
                  : null,
              onTrack: widget.tab == _DeliveryTab.active
                  ? () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => OrderTrackingScreen(
                              orderId: widget.deliveries[i].id),
                        ),
                      )
                  : null,
            ),
          ),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delivery Card — expandable with animated map pulse
// ─────────────────────────────────────────────────────────────────────────────

class _DeliveryCard extends StatefulWidget {
  final _Delivery delivery;
  final _DeliveryTab tab;
  final VoidCallback? onAccept;
  final VoidCallback? onTrack;

  const _DeliveryCard({
    required this.delivery,
    required this.tab,
    this.onAccept,
    this.onTrack,
  });

  @override
  State<_DeliveryCard> createState() => _DeliveryCardState();
}

class _DeliveryCardState extends State<_DeliveryCard>
    with SingleTickerProviderStateMixin {
  bool _expanded = false;
  bool _deliveredPressed = false;

  // Map gradient pulse controller
  late AnimationController _mapCtrl;
  late Animation<double> _mapPulse;

  @override
  void initState() {
    super.initState();
    _mapCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _mapPulse = CurvedAnimation(parent: _mapCtrl, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _mapCtrl.dispose();
    super.dispose();
  }

  Color get _statusColor {
    switch (widget.tab) {
      case _DeliveryTab.completed:
        return _success;
      case _DeliveryTab.active:
        return _amber;
      case _DeliveryTab.available:
        return _blue;
    }
  }

  String get _statusLabel {
    switch (widget.tab) {
      case _DeliveryTab.completed:
        return 'Completed';
      case _DeliveryTab.active:
        return 'In Transit';
      case _DeliveryTab.available:
        return 'Available';
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _expanded = !_expanded),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            // Header row
            Row(
              children: [
                Text(
                  widget.delivery.id,
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _textSecondary),
                ),
                const Spacer(),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: _statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.tab == _DeliveryTab.active) ...[
                        _PulsingDot(color: _statusColor),
                        const SizedBox(width: 4),
                      ],
                      Text(
                        _statusLabel,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: _statusColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                AnimatedRotation(
                  turns: _expanded ? 0.5 : 0.0,
                  duration: const Duration(milliseconds: 250),
                  child: const Icon(Icons.keyboard_arrow_down,
                      size: 18, color: _textMuted),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Route display
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: _success,
                        shape: BoxShape.circle,
                      ),
                    ),
                    Container(
                      width: 2,
                      height: 36,
                      color: _border,
                    ),
                    Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: _error,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.delivery.pickup,
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: _navy),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        widget.delivery.drop,
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: _navy),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),
            const Divider(color: _border, height: 1),
            const SizedBox(height: 10),

            // Info row
            Row(
              children: [
                _InfoChip(
                    icon: Icons.route,
                    label: '${widget.delivery.distance} km'),
                const SizedBox(width: 12),
                _InfoChip(
                    icon: Icons.inventory_2_outlined,
                    label: '${widget.delivery.items} items'),
                if (widget.tab == _DeliveryTab.active &&
                    widget.delivery.etaMinutes > 0) ...[
                  const SizedBox(width: 12),
                  _AnimatedEta(minutes: widget.delivery.etaMinutes),
                ],
                const Spacer(),
                Text(
                  '₹${widget.delivery.earnings.toInt()}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: _navy,
                  ),
                ),
              ],
            ),

            // Expandable detail section
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              height: _expanded ? (_expandedHeight()) : 0,
              child: SingleChildScrollView(
                physics: const NeverScrollableScrollPhysics(),
                child: _buildExpandedContent(),
              ),
            ),

            if (widget.tab == _DeliveryTab.available) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: widget.onAccept,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _amber,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                    elevation: 0,
                  ),
                  child: const Text('Accept Delivery',
                      style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ),
            ],

            if (widget.tab == _DeliveryTab.active) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: widget.onTrack,
                      icon: const Icon(Icons.navigation, size: 16),
                      label: const Text('Navigate',
                          style: TextStyle(fontWeight: FontWeight.w700)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _navy,
                        side: const BorderSide(color: _border),
                        padding: const EdgeInsets.symmetric(vertical: 11),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: GestureDetector(
                      onTapDown: (_) =>
                          setState(() => _deliveredPressed = true),
                      onTapUp: (_) =>
                          setState(() => _deliveredPressed = false),
                      onTapCancel: () =>
                          setState(() => _deliveredPressed = false),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 120),
                        padding: const EdgeInsets.symmetric(vertical: 11),
                        decoration: BoxDecoration(
                          color: _deliveredPressed
                              ? _success.withValues(alpha: 0.85)
                              : _success,
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: _deliveredPressed
                              ? [
                                  BoxShadow(
                                    color: _success.withValues(alpha: 0.4),
                                    blurRadius: 10,
                                    spreadRadius: 1,
                                  )
                                ]
                              : [],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.check_circle_outline,
                                size: 16, color: Colors.white),
                            SizedBox(width: 6),
                            Text(
                              'Delivered',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  double _expandedHeight() {
    // map placeholder + some detail info
    return 160.0;
  }

  Widget _buildExpandedContent() {
    return Padding(
      padding: const EdgeInsets.only(top: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Divider(color: _border, height: 1),
          const SizedBox(height: 12),
          // Pulsing map placeholder
          AnimatedBuilder(
            animation: _mapPulse,
            builder: (context, child) {
              final t = _mapPulse.value;
              return Container(
                height: 100,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color.lerp(const Color(0xFF1E2340),
                          const Color(0xFF2A3060), t)!,
                      Color.lerp(const Color(0xFF1A1D2E),
                          const Color(0xFF222540), t)!,
                    ],
                  ),
                ),
                child: Stack(
                  children: [
                    Center(
                      child: CustomPaint(
                        size: const Size(220, 60),
                        painter: _RoutePainter(),
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _amber,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          widget.delivery.etaMinutes > 0
                              ? '${widget.delivery.etaMinutes} min away'
                              : '${widget.delivery.distance} km',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated ETA display
// ─────────────────────────────────────────────────────────────────────────────

class _AnimatedEta extends StatefulWidget {
  final int minutes;
  const _AnimatedEta({required this.minutes});

  @override
  State<_AnimatedEta> createState() => _AnimatedEtaState();
}

class _AnimatedEtaState extends State<_AnimatedEta>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fade;
  int _displayMinutes = 0;

  @override
  void initState() {
    super.initState();
    _displayMinutes = widget.minutes;
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    )..forward();
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeIn);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fade,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.access_time, size: 12, color: _amber),
          const SizedBox(width: 3),
          Text(
            '$_displayMinutes min',
            style: const TextStyle(
              fontSize: 12,
              color: _amber,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: _textMuted),
        const SizedBox(width: 4),
        Text(label,
            style: const TextStyle(fontSize: 12, color: _textSecondary)),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Tracking Screen
// ─────────────────────────────────────────────────────────────────────────────

class OrderTrackingScreen extends StatefulWidget {
  final String orderId;
  const OrderTrackingScreen({super.key, required this.orderId});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  final int _currentStep = 3;
  int _etaMinutes = 25;
  Timer? _timer;

  final _steps = [
    {'label': 'Order Placed', 'icon': Icons.receipt_long},
    {'label': 'Confirmed', 'icon': Icons.check_circle_outline},
    {'label': 'Processing', 'icon': Icons.inventory},
    {'label': 'Out for Delivery', 'icon': Icons.local_shipping},
    {'label': 'Delivered', 'icon': Icons.home},
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 8), (_) {
      if (mounted && _etaMinutes > 0) {
        setState(() => _etaMinutes -= 1);
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
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
        title: Text(
          widget.orderId,
          style: const TextStyle(
              color: _navy, fontWeight: FontWeight.w700, fontSize: 16),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Map placeholder
            Container(
              height: 220,
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _navy,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Stack(
                children: [
                  Center(
                    child: CustomPaint(
                      size: const Size(260, 120),
                      painter: _RoutePainter(),
                    ),
                  ),
                  Positioned(
                    left: 40,
                    top: 80,
                    child: _WaypointCircle(label: '1', color: _success),
                  ),
                  Positioned(
                    left: 120,
                    top: 55,
                    child: _WaypointCircle(label: '2', color: _amber),
                  ),
                  Positioned(
                    right: 50,
                    top: 80,
                    child: _WaypointCircle(label: '3', color: _error),
                  ),
                  Positioned(
                    top: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: _amber,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$_etaMinutes mins away',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Driver info
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _border),
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color:
                          const Color(0xFFEF4444).withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        'RK',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFEF4444),
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Ramesh Kumar',
                          style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: _navy,
                              fontSize: 15),
                        ),
                        const SizedBox(height: 2),
                        const Row(
                          children: [
                            Icon(Icons.two_wheeler,
                                size: 13, color: _textMuted),
                            SizedBox(width: 4),
                            Text(
                              'TVS Apache · TS09 AB 2341',
                              style: TextStyle(
                                  fontSize: 11, color: _textSecondary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        const Row(
                          children: [
                            Icon(Icons.star, size: 13, color: _amber),
                            SizedBox(width: 2),
                            Text(
                              '4.8',
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: _navy),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.call, color: _success),
                    style: IconButton.styleFrom(
                      backgroundColor: _success.withValues(alpha: 0.1),
                      shape: const CircleBorder(),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Timeline
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Delivery Status',
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: _navy),
                  ),
                  const SizedBox(height: 16),
                  ..._steps.asMap().entries.map((e) {
                    final i = e.key;
                    final step = e.value;
                    final done = i < _currentStep;
                    final current = i == _currentStep;
                    final isLast = i == _steps.length - 1;

                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Column(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 400),
                              width: 28,
                              height: 28,
                              decoration: BoxDecoration(
                                color: done
                                    ? _success
                                    : (current ? _amber : _border),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                done
                                    ? Icons.check
                                    : (step['icon'] as IconData),
                                size: 14,
                                color: done || current
                                    ? Colors.white
                                    : _textMuted,
                              ),
                            ),
                            if (!isLast)
                              Container(
                                width: 2,
                                height: 28,
                                color: done ? _success : _border,
                              ),
                          ],
                        ),
                        const SizedBox(width: 12),
                        Padding(
                          padding:
                              const EdgeInsets.only(top: 4, bottom: 28),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                step['label'] as String,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: current
                                      ? FontWeight.w700
                                      : FontWeight.w500,
                                  color: current ? _navy : _textSecondary,
                                ),
                              ),
                              if (current)
                                Text(
                                  'Est. $_etaMinutes min',
                                  style: const TextStyle(
                                      fontSize: 11,
                                      color: _amber,
                                      fontWeight: FontWeight.w600),
                                ),
                            ],
                          ),
                        ),
                      ],
                    );
                  }),
                ],
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _WaypointCircle extends StatelessWidget {
  final String label;
  final Color color;

  const _WaypointCircle({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: Center(
        child: Text(
          label,
          style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w800,
              fontSize: 11),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Painter — CustomPainter with dotted line (clamp fix preserved)
// ─────────────────────────────────────────────────────────────────────────────

class _RoutePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.3)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path()
      ..moveTo(40, size.height * 0.65)
      ..quadraticBezierTo(
          size.width * 0.4,
          size.height * 0.2,
          size.width * 0.6,
          size.height * 0.45)
      ..quadraticBezierTo(
          size.width * 0.75,
          size.height * 0.6,
          size.width - 40,
          size.height * 0.65);

    // Dotted effect
    const dashWidth = 6.0;
    const gapWidth = 4.0;
    final pathMetrics = path.computeMetrics();
    for (final metric in pathMetrics) {
      double distance = 0;
      while (distance < metric.length) {
        final next =
            (distance + dashWidth).clamp(0.0, metric.length).toDouble();
        final start = metric.getTangentForOffset(distance);
        final end = metric.getTangentForOffset(next);
        if (start != null && end != null) {
          canvas.drawLine(start.position, end.position, paint);
        }
        distance += dashWidth + gapWidth;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
