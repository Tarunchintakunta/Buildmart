import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';

class WorkerDashboard extends ConsumerStatefulWidget {
  const WorkerDashboard({super.key});

  @override
  ConsumerState<WorkerDashboard> createState() => _WorkerDashboardState();
}

class _WorkerDashboardState extends ConsumerState<WorkerDashboard>
    with TickerProviderStateMixin {
  bool _isOnline = true;
  static const double _monthlyEarnings = 18750;
  static const int _jobsCompletedThisMonth = 12;
  static const int _jobsTarget = 20;

  late AnimationController _staggerCtrl;
  late AnimationController _radialCtrl;

  static const _jobRequests = [
    _JobRequest(title: 'Masonry Work', location: 'Hitech City', pay: '₹850/day', employer: 'Arjun Builders', urgent: true),
    _JobRequest(title: 'Plastering', location: 'Banjara Hills', pay: '₹700/day', employer: 'Ravi Constructions', urgent: false),
    _JobRequest(title: 'Tile Fitting', location: 'Gachibowli', pay: '₹950/day', employer: 'NK Interiors', urgent: false),
  ];

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();
    _radialCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..forward();
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    _radialCtrl.dispose();
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

  // ignore: unused_element
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
    final user = ref.watch(authProvider).user;
    final firstName = user?.name.split(' ').first ?? 'Worker';

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),

            // Availability card with animated banner
            _staggeredItem(0, _buildAvailabilityCard(firstName)),
            const SizedBox(height: 14),

            // Today at a Glance
            _staggeredItem(1, _buildTodayStats()),
            const SizedBox(height: 14),

            // Quick actions row
            _staggeredItem(2, _buildQuickActions()),
            const SizedBox(height: 14),

            // Earnings card
            _staggeredItem(3, _buildEarningsCard()),
            const SizedBox(height: 14),

            // Jobs completed radial progress
            _staggeredItem(4, _buildJobsCompletedCard()),
            const SizedBox(height: 16),

            // Job Requests header
            _staggeredItem(5, const Text('Job Requests',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy))),
            const SizedBox(height: 12),

            // Job request cards
            for (int i = 0; i < _jobRequests.length; i++) ...[
              _staggeredItem(6 + i, _JobRequestCard(job: _jobRequests[i])),
              const SizedBox(height: 10),
            ],

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildAvailabilityCard(String firstName) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppColors.navy, Color(0xFF252838)],
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hello, $firstName!',
                          style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 400),
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _isOnline ? AppColors.success : AppColors.textMuted,
                              ),
                            ),
                            const SizedBox(width: 6),
                            AnimatedDefaultTextStyle(
                              duration: const Duration(milliseconds: 300),
                              style: TextStyle(
                                fontSize: 13,
                                color: _isOnline ? AppColors.success : AppColors.textMuted,
                              ),
                              child: Text(_isOnline
                                  ? 'Available for work'
                                  : 'Currently offline'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text('Daily Rate: ₹850',
                            style: TextStyle(
                                fontSize: 13,
                                color: AppColors.amber,
                                fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                  Column(
                    children: [
                      AnimatedDefaultTextStyle(
                        duration: const Duration(milliseconds: 300),
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: _isOnline ? AppColors.success : AppColors.textMuted,
                        ),
                        child: Text(_isOnline ? 'Online' : 'Offline'),
                      ),
                      const SizedBox(height: 6),
                      Switch(
                        value: _isOnline,
                        onChanged: (v) => setState(() => _isOnline = v),
                        activeColor: AppColors.success,
                        activeTrackColor: AppColors.success.withValues(alpha: 0.3),
                        inactiveThumbColor: AppColors.textMuted,
                        inactiveTrackColor: AppColors.textMuted.withValues(alpha: 0.3),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Animated status banner
            AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              curve: Curves.easeOutCubic,
              height: _isOnline ? 44 : 0,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 400),
                width: double.infinity,
                color: _isOnline
                    ? AppColors.success.withValues(alpha: 0.12)
                    : Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: _isOnline
                    ? Row(
                        children: [
                          const Icon(Icons.check_circle,
                              color: AppColors.success, size: 16),
                          const SizedBox(width: 8),
                          Text(
                            'You are ONLINE — Employers can see you',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.success.withValues(alpha: 0.9),
                            ),
                          ),
                        ],
                      )
                    : const SizedBox.shrink(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTodayStats() {
    const stats = [
      (label: "Today's Pay", value: '₹850', icon: Icons.payments_outlined, color: AppColors.amber),
      (label: 'Rating', value: '4.7★', icon: Icons.star_outline, color: Color(0xFFFBBF24)),
      (label: 'Active Job', value: '1', icon: Icons.work_outline, color: AppColors.worker),
    ];
    return Row(
      children: stats.asMap().entries.map((e) {
        final i = e.key;
        final s = e.value;
        return Expanded(
          child: Container(
            margin: EdgeInsets.only(right: i < 2 ? 8 : 0),
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
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
                Icon(s.icon, color: s.color, size: 20),
                const SizedBox(height: 6),
                Text(s.value,
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: s.color)),
                const SizedBox(height: 2),
                Text(s.label,
                    style: const TextStyle(
                        fontSize: 10, color: AppColors.textMuted),
                    textAlign: TextAlign.center),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildQuickActions() {
    return Row(
      children: [
        Expanded(
          child: _QuickActionBtn(
            icon: Icons.work_outline,
            label: 'Find Jobs',
            color: AppColors.worker,
            onTap: () => context.go('/jobs'),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _QuickActionBtn(
            icon: Icons.account_balance_wallet_outlined,
            label: 'My Wallet',
            color: AppColors.amber,
            onTap: () => context.go('/wallet'),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _QuickActionBtn(
            icon: Icons.handshake_outlined,
            label: 'Agreements',
            color: AppColors.navy,
            onTap: () => context.go('/agreements'),
          ),
        ),
      ],
    );
  }

  Widget _buildEarningsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
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
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.amber.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.account_balance_wallet,
                color: AppColors.amber, size: 22),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("This Month's Earnings",
                  style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
              const SizedBox(height: 2),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: _monthlyEarnings),
                duration: const Duration(milliseconds: 1200),
                curve: Curves.easeOutCubic,
                builder: (_, v, __) => Text(
                  '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
                  style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy),
                ),
              ),
            ],
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('+12%',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.success)),
          ),
        ],
      ),
    );
  }

  Widget _buildJobsCompletedCard() {
    return Container(
      padding: const EdgeInsets.all(18),
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
          AnimatedBuilder(
            animation: _radialCtrl,
            builder: (_, __) => CustomPaint(
              size: const Size(80, 80),
              painter: _RadialProgressPainter(
                progress: (_jobsCompletedThisMonth / _jobsTarget) *
                    CurvedAnimation(
                            parent: _radialCtrl,
                            curve: Curves.easeOutCubic)
                        .value,
                color: AppColors.worker,
                bgColor: AppColors.border,
              ),
              child: SizedBox(
                width: 80,
                height: 80,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$_jobsCompletedThisMonth',
                        style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: AppColors.navy),
                      ),
                      const Text('jobs',
                          style: TextStyle(
                              fontSize: 10,
                              color: AppColors.textSecondary)),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Jobs This Month',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy)),
                const SizedBox(height: 6),
                Text(
                  '$_jobsCompletedThisMonth of $_jobsTarget completed',
                  style: const TextStyle(
                      fontSize: 13, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 10),
                // Active job progress
                const Text('Active Job Progress: 68%',
                    style: TextStyle(
                        fontSize: 12, color: AppColors.textSecondary)),
                const SizedBox(height: 6),
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 0.68),
                  duration: const Duration(milliseconds: 1200),
                  curve: Curves.easeOutCubic,
                  builder: (_, v, __) => ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: v,
                      backgroundColor: AppColors.border,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.worker),
                      minHeight: 6,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Quick action button
// ---------------------------------------------------------------------------

class _QuickActionBtn extends StatefulWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickActionBtn({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });
  @override
  State<_QuickActionBtn> createState() => _QuickActionBtnState();
}

class _QuickActionBtnState extends State<_QuickActionBtn> {
  bool _pressed = false;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: widget.onTap,
      child: AnimatedScale(
        scale: _pressed ? 0.95 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: widget.color.withValues(alpha: 0.07),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: widget.color.withValues(alpha: 0.25)),
          ),
          child: Column(
            children: [
              Icon(widget.icon, color: widget.color, size: 20),
              const SizedBox(height: 5),
              Text(widget.label,
                  style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: widget.color),
                  textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Job Request Card — press feedback
// ---------------------------------------------------------------------------

class _JobRequestCard extends StatefulWidget {
  final _JobRequest job;
  const _JobRequestCard({required this.job});
  @override
  State<_JobRequestCard> createState() => _JobRequestCardState();
}

class _JobRequestCardState extends State<_JobRequestCard> {
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
            border: Border(
              left: BorderSide(
                  color: widget.job.urgent ? AppColors.error : AppColors.worker,
                  width: 4),
              top: const BorderSide(color: AppColors.border),
              right: const BorderSide(color: AppColors.border),
              bottom: const BorderSide(color: AppColors.border),
            ),
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
                    Row(
                      children: [
                        Text(widget.job.title,
                            style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.navy)),
                        if (widget.job.urgent) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.error.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text('URGENT',
                                style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.error)),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.location_on,
                            size: 12, color: AppColors.textMuted),
                        const SizedBox(width: 3),
                        Text(widget.job.location,
                            style: const TextStyle(
                                fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(width: 10),
                        const Icon(Icons.person,
                            size: 12, color: AppColors.textMuted),
                        const SizedBox(width: 3),
                        Text(widget.job.employer,
                            style: const TextStyle(
                                fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(widget.job.pay,
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.amber)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.navy,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('Apply',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 12)),
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
// Radial progress painter
// ---------------------------------------------------------------------------

class _RadialProgressPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color bgColor;

  _RadialProgressPainter({
    required this.progress,
    required this.color,
    required this.bgColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - 8;
    const strokeWidth = 7.0;

    // Background arc
    final bgPaint = Paint()
      ..color = bgColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, bgPaint);

    // Progress arc
    final fgPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      2 * math.pi * progress,
      false,
      fgPaint,
    );
  }

  @override
  bool shouldRepaint(_RadialProgressPainter old) => old.progress != progress;
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _JobRequest {
  final String title;
  final String location;
  final String pay;
  final String employer;
  final bool urgent;
  const _JobRequest({
    required this.title,
    required this.location,
    required this.pay,
    required this.employer,
    required this.urgent,
  });
}
