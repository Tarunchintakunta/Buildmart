import 'package:flutter/material.dart';

const Color _navy = Color(0xFF1A1D2E);
const Color _amber = Color(0xFFF2960D);
const Color _bg = Color(0xFFF5F6FA);
const Color _border = Color(0xFFE5E7EB);
const Color _success = Color(0xFF10B981);
const Color _error = Color(0xFFEF4444);
const Color _info = Color(0xFF3B82F6);
const Color _textSecondary = Color(0xFF6B7280);
const Color _textMuted = Color(0xFF9CA3AF);

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

enum _NotifType { order, job, payment, agreement }

class _Notif {
  final String id;
  final String title;
  final String message;
  final String time;
  final String group;
  final _NotifType type;
  bool unread;

  _Notif({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.group,
    required this.type,
    this.unread = true,
  });
}

final List<_Notif> _mockNotifs = [
  _Notif(
    id: 'n1',
    title: 'Order Shipped',
    message: 'Your order #ORD-1042 has been picked up by the driver.',
    time: '10:15 AM',
    group: 'Today',
    type: _NotifType.order,
    unread: true,
  ),
  _Notif(
    id: 'n2',
    title: 'New Job Posted',
    message: 'Rahul Constructions is looking for a Mason in Gachibowli.',
    time: '9:02 AM',
    group: 'Today',
    type: _NotifType.job,
    unread: true,
  ),
  _Notif(
    id: 'n3',
    title: 'Payment Received',
    message:
        '₹8,000 has been credited to your wallet from Rahul Contractor.',
    time: '8:30 AM',
    group: 'Today',
    type: _NotifType.payment,
    unread: false,
  ),
  _Notif(
    id: 'n4',
    title: 'Agreement Signed',
    message: 'Vijay Kumar has signed agreement AGR-2031.',
    time: '7:45 AM',
    group: 'Today',
    type: _NotifType.agreement,
    unread: true,
  ),
  _Notif(
    id: 'n5',
    title: 'Order Delivered',
    message: 'Order #ORD-1039 was successfully delivered to your site.',
    time: '3:20 PM',
    group: 'Yesterday',
    type: _NotifType.order,
    unread: false,
  ),
  _Notif(
    id: 'n6',
    title: 'Job Application',
    message: 'Suresh Reddy applied for the Electrician role at Site B.',
    time: '11:00 AM',
    group: 'Yesterday',
    type: _NotifType.job,
    unread: false,
  ),
  _Notif(
    id: 'n7',
    title: 'Withdrawal Processed',
    message:
        '₹5,000 withdrawal to HDFC ****4521 has been processed.',
    time: '4:00 PM',
    group: 'Earlier',
    type: _NotifType.payment,
    unread: false,
  ),
  _Notif(
    id: 'n8',
    title: 'Agreement Pending',
    message:
        'Please review and sign agreement AGR-2028 sent by Rahul Constructions.',
    time: '10:00 AM',
    group: 'Earlier',
    type: _NotifType.agreement,
    unread: false,
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// Notifications Screen
// ─────────────────────────────────────────────────────────────────────────────

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

// Mark-all-read button states
enum _MarkAllState { idle, loading, done }

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<_Notif> _notifs = List.from(_mockNotifs);
  final List<bool> _visible = List.filled(_mockNotifs.length, false);
  _MarkAllState _markAllState = _MarkAllState.idle;

  @override
  void initState() {
    super.initState();
    for (var i = 0; i < _notifs.length; i++) {
      Future.delayed(Duration(milliseconds: 100 + i * 50), () {
        if (mounted) setState(() => _visible[i] = true);
      });
    }
  }

  bool get _hasUnread => _notifs.any((n) => n.unread);

  void _markAllRead() async {
    if (_markAllState != _MarkAllState.idle) return;
    setState(() => _markAllState = _MarkAllState.loading);
    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    setState(() {
      for (final n in _notifs) {
        n.unread = false;
      }
      _markAllState = _MarkAllState.done;
    });
    // Reset button after 2.5s
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (mounted) setState(() => _markAllState = _MarkAllState.idle);
    });
  }

  Color _typeColor(_NotifType type) {
    switch (type) {
      case _NotifType.order:
        return _info;
      case _NotifType.job:
        return const Color(0xFFF59E0B);
      case _NotifType.payment:
        return _success;
      case _NotifType.agreement:
        return const Color(0xFF8B5CF6);
    }
  }

  IconData _typeIcon(_NotifType type) {
    switch (type) {
      case _NotifType.order:
        return Icons.local_shipping_outlined;
      case _NotifType.job:
        return Icons.work_outline;
      case _NotifType.payment:
        return Icons.account_balance_wallet_outlined;
      case _NotifType.agreement:
        return Icons.description_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final groups = ['Today', 'Yesterday', 'Earlier'];
    final hasAny = _notifs.isNotEmpty;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        title: const Text('Notifications',
            style: TextStyle(
                color: _navy, fontWeight: FontWeight.w700, fontSize: 20)),
        actions: [
          if (_hasUnread)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                transitionBuilder: (child, anim) => FadeTransition(
                  opacity: anim,
                  child: ScaleTransition(scale: anim, child: child),
                ),
                child: _markAllState == _MarkAllState.idle
                    ? TextButton(
                        key: const ValueKey('btn'),
                        onPressed: _markAllRead,
                        child: const Text('Mark all read',
                            style: TextStyle(
                                color: _amber,
                                fontWeight: FontWeight.w600,
                                fontSize: 12)),
                      )
                    : _markAllState == _MarkAllState.loading
                        ? const SizedBox(
                            key: ValueKey('loading'),
                            width: 80,
                            child: Center(
                              child: SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: _amber),
                              ),
                            ),
                          )
                        : const Padding(
                            key: ValueKey('done'),
                            padding: EdgeInsets.symmetric(horizontal: 12),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.check_circle,
                                    color: _success, size: 14),
                                SizedBox(width: 4),
                                Text('All caught up!',
                                    style: TextStyle(
                                        color: _success,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 12)),
                              ],
                            ),
                          ),
              ),
            ),
        ],
      ),
      body: hasAny
          ? ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                for (final group in groups) ...[
                  if (_notifs.any((n) => n.group == group)) ...[
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
                      child: Text(
                        group,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: _textMuted,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    ..._notifs
                        .asMap()
                        .entries
                        .where((e) => e.value.group == group)
                        .map((e) {
                      final i = e.key;
                      final n = e.value;
                      final vis = i < _visible.length && _visible[i];
                      return AnimatedSlide(
                        duration: const Duration(milliseconds: 350),
                        curve: Curves.easeOutCubic,
                        offset: vis ? Offset.zero : const Offset(0, 0.1),
                        child: AnimatedOpacity(
                          duration: const Duration(milliseconds: 350),
                          opacity: vis ? 1 : 0,
                          child: Dismissible(
                            key: Key(n.id),
                            direction: DismissDirection.endToStart,
                            background: Container(
                              alignment: Alignment.centerRight,
                              padding: const EdgeInsets.only(right: 20),
                              color: _error.withValues(alpha: 0.8),
                              child: const Icon(Icons.delete_outline,
                                  color: Colors.white, size: 22),
                            ),
                            onDismissed: (_) =>
                                setState(() => _notifs.remove(n)),
                            child: _NotifCard(
                              notif: n,
                              typeColor: _typeColor(n.type),
                              typeIcon: _typeIcon(n.type),
                              onTap: () =>
                                  setState(() => n.unread = false),
                            ),
                          ),
                        ),
                      );
                    }),
                  ],
                ],
                const SizedBox(height: 24),
              ],
            )
          : const _EmptyState(),
    );
  }
}

// Individual notification card with animated unread state
class _NotifCard extends StatefulWidget {
  final _Notif notif;
  final Color typeColor;
  final IconData typeIcon;
  final VoidCallback onTap;

  const _NotifCard({
    required this.notif,
    required this.typeColor,
    required this.typeIcon,
    required this.onTap,
  });

  @override
  State<_NotifCard> createState() => _NotifCardState();
}

class _NotifCardState extends State<_NotifCard> {
  @override
  Widget build(BuildContext context) {
    final n = widget.notif;
    return GestureDetector(
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          color: n.unread
              ? _info.withValues(alpha: 0.04)
              : Colors.white,
          border: Border(
            left: BorderSide(
              color: n.unread ? _info : Colors.transparent,
              width: n.unread ? 4 : 0,
            ),
            bottom: const BorderSide(color: _border),
          ),
        ),
        child: Padding(
          padding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Bouncing icon container
              _BouncingIcon(
                icon: widget.typeIcon,
                color: widget.typeColor,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(n.title,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: n.unread
                                    ? FontWeight.w700
                                    : FontWeight.w600,
                                color: _navy,
                              )),
                        ),
                        if (n.unread) _PulsingBlueIndicator(),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(n.message,
                        style: const TextStyle(
                            fontSize: 12,
                            color: _textSecondary,
                            height: 1.4)),
                    const SizedBox(height: 4),
                    // Timestamp fades in with delay
                    AnimatedOpacity(
                      opacity: 1.0,
                      duration: const Duration(milliseconds: 500),
                      child: Text(n.time,
                          style: const TextStyle(
                              fontSize: 10, color: _textMuted)),
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

// Bouncing icon on page load
class _BouncingIcon extends StatefulWidget {
  final IconData icon;
  final Color color;
  const _BouncingIcon({required this.icon, required this.color});

  @override
  State<_BouncingIcon> createState() => _BouncingIconState();
}

class _BouncingIconState extends State<_BouncingIcon>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600));
    _scale = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.elasticOut));
    Future.delayed(const Duration(milliseconds: 200),
        () => mounted ? _ctrl.forward() : null);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: widget.color.withValues(alpha: 0.12),
          shape: BoxShape.circle,
        ),
        child: Icon(widget.icon, color: widget.color, size: 20),
      ),
    );
  }
}

// Pulsing blue dot for unread
class _PulsingBlueIndicator extends StatefulWidget {
  @override
  State<_PulsingBlueIndicator> createState() =>
      _PulsingBlueIndicatorState();
}

class _PulsingBlueIndicatorState extends State<_PulsingBlueIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900))
      ..repeat(reverse: true);
    _scale = Tween<double>(begin: 0.8, end: 1.2).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: Container(
        width: 8,
        height: 8,
        decoration: const BoxDecoration(
          color: _info,
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}

// Empty state with ringing bell animation
class _EmptyState extends StatefulWidget {
  const _EmptyState();

  @override
  State<_EmptyState> createState() => _EmptyStateState();
}

class _EmptyStateState extends State<_EmptyState>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _rotate;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600))
      ..repeat(reverse: true);
    _rotate = Tween<double>(begin: -0.1, end: 0.1)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TweenAnimationBuilder<double>(
            tween: Tween(begin: -0.1, end: 0.1),
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeInOut,
            builder: (_, angle, child) {
              return AnimatedBuilder(
                animation: _ctrl,
                builder: (_, __) => Transform.rotate(
                  angle: _rotate.value,
                  child: const Icon(Icons.notifications_none,
                      size: 64, color: _textMuted),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0.0, end: 1.0),
            duration: const Duration(milliseconds: 600),
            builder: (_, opacity, child) => Opacity(
              opacity: opacity,
              child: child,
            ),
            child: const Text(
              'You\'re all caught up!',
              style: TextStyle(
                  color: _textSecondary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(height: 8),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0.0, end: 1.0),
            duration: const Duration(milliseconds: 800),
            builder: (_, opacity, child) => Opacity(
              opacity: opacity,
              child: child,
            ),
            child: const Text(
              'No new notifications',
              style: TextStyle(color: _textMuted, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
