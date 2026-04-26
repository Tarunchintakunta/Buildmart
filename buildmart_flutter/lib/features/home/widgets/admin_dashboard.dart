import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';

class AdminDashboard extends ConsumerStatefulWidget {
  const AdminDashboard({super.key});

  @override
  ConsumerState<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends ConsumerState<AdminDashboard>
    with TickerProviderStateMixin {
  static const double _platformRevenue = 124500;

  late AnimationController _staggerCtrl;
  bool _shimmerDone = false;

  static const _kpis = [
    _KPI(label: 'Total Users', rawValue: 1247, displayValue: '1,247',
        icon: Icons.group, color: AppColors.customer),
    _KPI(label: 'Active Orders', rawValue: 89, displayValue: '89',
        icon: Icons.receipt_long, color: AppColors.success),
    _KPI(label: 'Pending KYC', rawValue: 23, displayValue: '23',
        icon: Icons.pending_actions, color: AppColors.amber),
    _KPI(label: 'Revenue', rawValue: 124000, displayValue: '₹1.24L',
        icon: Icons.currency_rupee, color: AppColors.admin),
  ];

  static const _pendingVerifications = [
    _VerificationItem(
      name: 'Ravi Shankar',
      type: 'Worker KYC',
      time: '5 min ago',
      initials: 'RS',
      color: AppColors.worker,
    ),
    _VerificationItem(
      name: 'Priya Metals & Hardware',
      type: 'Shop Registration',
      time: '12 min ago',
      initials: 'PM',
      color: AppColors.shopkeeper,
    ),
    _VerificationItem(
      name: 'Arjun Builders Ltd',
      type: 'Contractor Licence',
      time: '31 min ago',
      initials: 'AB',
      color: AppColors.contractor,
    ),
  ];

  static const _activities = [
    _Activity(type: 'KYC', message: 'Ravi Shankar submitted KYC documents',
        time: '2 min ago', color: AppColors.amber, icon: Icons.verified_user),
    _Activity(type: 'ORDER', message: 'New order #ORD-3112 placed — ₹15,400',
        time: '5 min ago', color: AppColors.success, icon: Icons.receipt_long),
    _Activity(type: 'USER', message: 'New worker registered: Kiran Rao',
        time: '12 min ago', color: AppColors.customer, icon: Icons.person_add),
    _Activity(type: 'DISPUTE', message: 'Dispute raised on order #ORD-3089',
        time: '28 min ago', color: AppColors.error, icon: Icons.gavel),
    _Activity(type: 'PAYMENT', message: 'Settlement processed — ₹8,200 to Venkat',
        time: '1 hr ago', color: AppColors.admin, icon: Icons.payment),
  ];

  static const _quickActions = [
    _QuickAction(label: 'Verify KYC', icon: Icons.verified_user, color: AppColors.success),
    _QuickAction(label: 'Manage Users', icon: Icons.manage_accounts, color: AppColors.customer),
    _QuickAction(label: 'Disputes', icon: Icons.gavel, color: AppColors.error),
    _QuickAction(label: 'Analytics', icon: Icons.analytics, color: AppColors.admin),
  ];

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    // Shimmer 800ms then animate in
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        setState(() => _shimmerDone = true);
        _staggerCtrl.forward();
      }
    });
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
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

  Widget _slideFromRight(int i, Widget child) {
    final anim = _itemAnim(i);
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0.3, 0),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_shimmerDone) {
      return _buildShimmerLayout();
    }

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),

            // GMV banner
            _staggeredItem(0, _buildGMVCard()),
            const SizedBox(height: 16),

            // KPI grid with staggered count-up
            _staggeredItem(1, const Text('Platform KPIs',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
            const SizedBox(height: 12),
            _buildKPIGrid(),
            const SizedBox(height: 16),

            // Platform health
            _staggeredItem(3, _buildPlatformHealthCard()),
            const SizedBox(height: 16),

            // Pending verifications
            _staggeredItem(4, const Text('Pending Verifications',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
            const SizedBox(height: 12),
            for (int i = 0; i < _pendingVerifications.length; i++) ...[
              _slideFromRight(5 + i, _VerificationCard(item: _pendingVerifications[i])),
              const SizedBox(height: 8),
            ],
            const SizedBox(height: 16),

            // Quick actions
            _staggeredItem(4, const Text('Admin Actions',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
            const SizedBox(height: 12),
            _staggeredItem(4, _buildQuickActions()),
            const SizedBox(height: 16),

            // Recent activity feed
            _staggeredItem(5, const Text('Recent Activity',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
            const SizedBox(height: 12),
            _buildActivityFeed(),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildGMVCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.navy, Color(0xFF252838)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.bar_chart, color: AppColors.amber, size: 20),
              const SizedBox(width: 8),
              Text(
                'Platform Revenue — April 2026',
                style: TextStyle(
                    fontSize: 13,
                    color: Colors.white.withValues(alpha: 0.8),
                    fontWeight: FontWeight.w500),
              ),
            ],
          ),
          const SizedBox(height: 10),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: _platformRevenue),
            duration: const Duration(milliseconds: 1400),
            curve: Curves.easeOutCubic,
            builder: (_, v, __) => Text(
              '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
              style: const TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.arrow_upward, color: AppColors.success, size: 12),
                    SizedBox(width: 3),
                    Text('+31%',
                        style: TextStyle(
                            color: AppColors.success,
                            fontSize: 12,
                            fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text('GMV growth vs last month',
                  style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.65),
                      fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildKPIGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1.8,
      ),
      itemCount: _kpis.length,
      itemBuilder: (context, i) {
        final kpi = _kpis[i];
        final anim = CurvedAnimation(
          parent: _staggerCtrl,
          curve: Interval(
            (0.1 + i * 0.06).clamp(0.0, 0.8),
            (0.1 + i * 0.06 + 0.4).clamp(0.0, 1.0),
            curve: Curves.easeOutBack,
          ),
        );
        return AnimatedBuilder(
          animation: anim,
          builder: (_, child) => Transform.scale(
            scale: anim.value,
            child: Opacity(opacity: anim.value.clamp(0.0, 1.0), child: child),
          ),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: kpi.color.withValues(alpha: 0.06),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: kpi.color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: Icon(kpi.icon, color: kpi.color, size: 19),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0, end: kpi.rawValue.toDouble()),
                        duration: Duration(milliseconds: 800 + i * 200),
                        curve: Curves.easeOutCubic,
                        builder: (_, v, __) {
                          // For revenue, show formatted string; for others, count
                          final display = kpi.label == 'Revenue'
                              ? '₹${(v / 1000).toStringAsFixed(1)}K'
                              : NumberFormat('##,##,###', 'en_IN').format(v.round());
                          return Text(display,
                              style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.navy));
                        },
                      ),
                      Text(kpi.label,
                          style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPlatformHealthCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.success,
                ),
              ),
              const SizedBox(width: 8),
              const Text('Platform Health',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.navy)),
              const Spacer(),
              const Text('94%',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.success)),
            ],
          ),
          const SizedBox(height: 10),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: 0.94),
            duration: const Duration(milliseconds: 1400),
            curve: Curves.easeOutCubic,
            builder: (_, v, __) => ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: v,
                backgroundColor: AppColors.border,
                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.success),
                minHeight: 8,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _healthMetric('Uptime', '99.8%', AppColors.success),
              _healthMetric('API Latency', '142ms', AppColors.customer),
              _healthMetric('Error Rate', '0.2%', AppColors.amber),
            ],
          ),
        ],
      ),
    );
  }

  Widget _healthMetric(String label, String value, Color color) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: color)),
        Text(label,
            style: const TextStyle(
                fontSize: 10, color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildQuickActions() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 2.8,
      ),
      itemCount: _quickActions.length,
      itemBuilder: (context, i) {
        final action = _quickActions[i];
        return _QuickActionButton(action: action);
      },
    );
  }

  Widget _buildActivityFeed() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: _activities.asMap().entries.map((entry) {
          final i = entry.key;
          final activity = entry.value;
          final isLast = i == _activities.length - 1;
          final anim = CurvedAnimation(
            parent: _staggerCtrl,
            curve: Interval(
              (0.4 + i * 0.06).clamp(0.0, 0.9),
              (0.4 + i * 0.06 + 0.4).clamp(0.0, 1.0),
              curve: Curves.easeOutCubic,
            ),
          );
          return FadeTransition(
            opacity: anim,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.2, 0),
                end: Offset.zero,
              ).animate(anim),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: activity.color.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(activity.icon,
                              color: activity.color, size: 17),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(activity.message,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      color: AppColors.navy,
                                      fontWeight: FontWeight.w500),
                                  maxLines: 2),
                              const SizedBox(height: 2),
                              Text(activity.time,
                                  style: const TextStyle(
                                      fontSize: 11,
                                      color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: activity.color.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(activity.type,
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: activity.color)),
                        ),
                      ],
                    ),
                  ),
                  if (!isLast)
                    const Divider(
                        height: 1,
                        color: AppColors.border,
                        indent: 14,
                        endIndent: 14),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildShimmerLayout() {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _shimmer(height: 130, radius: 16),
            const SizedBox(height: 20),
            _shimmer(height: 14, width: 120, radius: 4),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 1.8,
              ),
              itemCount: 4,
              itemBuilder: (_, __) => _shimmer(height: 70, radius: 12),
            ),
            const SizedBox(height: 20),
            _shimmer(height: 80, radius: 12),
            const SizedBox(height: 20),
            _shimmer(height: 14, width: 160, radius: 4),
            const SizedBox(height: 12),
            for (int i = 0; i < 3; i++) ...[
              _shimmer(height: 64, radius: 12),
              const SizedBox(height: 8),
            ],
          ],
        ),
      ),
    );
  }

  Widget _shimmer({required double height, double? width, double radius = 8}) {
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
// Verification card with press feedback
// ---------------------------------------------------------------------------

class _VerificationCard extends StatefulWidget {
  final _VerificationItem item;
  const _VerificationCard({required this.item});
  @override
  State<_VerificationCard> createState() => _VerificationCardState();
}

class _VerificationCardState extends State<_VerificationCard> {
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
                color: widget.item.color.withValues(alpha: 0.06),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: widget.item.color,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(widget.item.initials,
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Colors.white)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.item.name,
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.navy)),
                    Row(
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          margin: const EdgeInsets.only(right: 4),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: widget.item.color,
                          ),
                        ),
                        Text(widget.item.type,
                            style: TextStyle(
                                fontSize: 11,
                                color: widget.item.color,
                                fontWeight: FontWeight.w500)),
                        const SizedBox(width: 8),
                        Text(widget.item.time,
                            style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textMuted)),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.amber.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: AppColors.amber.withValues(alpha: 0.3)),
                ),
                child: const Text('Review',
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.amber)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Quick action button
// ---------------------------------------------------------------------------

class _QuickActionButton extends StatefulWidget {
  final _QuickAction action;
  const _QuickActionButton({required this.action});
  @override
  State<_QuickActionButton> createState() => _QuickActionButtonState();
}

class _QuickActionButtonState extends State<_QuickActionButton> {
  bool _p = false;
  @override
  Widget build(_) => GestureDetector(
        onTapDown: (_) => setState(() => _p = true),
        onTapUp: (_) => setState(() => _p = false),
        onTapCancel: () => setState(() => _p = false),
        onTap: () {},
        child: AnimatedScale(
          scale: _p ? 0.95 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: Container(
            decoration: BoxDecoration(
              color: widget.action.color.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: widget.action.color.withValues(alpha: 0.2)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(widget.action.icon,
                    color: widget.action.color, size: 18),
                const SizedBox(width: 8),
                Text(widget.action.label,
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: widget.action.color)),
              ],
            ),
          ),
        ),
      );
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _KPI {
  final String label;
  final int rawValue;
  final String displayValue;
  final IconData icon;
  final Color color;
  const _KPI({
    required this.label,
    required this.rawValue,
    required this.displayValue,
    required this.icon,
    required this.color,
  });
}

class _VerificationItem {
  final String name;
  final String type;
  final String time;
  final String initials;
  final Color color;
  const _VerificationItem({
    required this.name,
    required this.type,
    required this.time,
    required this.initials,
    required this.color,
  });
}

class _Activity {
  final String type;
  final String message;
  final String time;
  final Color color;
  final IconData icon;
  const _Activity({
    required this.type,
    required this.message,
    required this.time,
    required this.color,
    required this.icon,
  });
}

class _QuickAction {
  final String label;
  final IconData icon;
  final Color color;
  const _QuickAction(
      {required this.label, required this.icon, required this.color});
}
