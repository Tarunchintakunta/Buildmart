import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';

class ContractorDashboard extends ConsumerStatefulWidget {
  const ContractorDashboard({super.key});

  @override
  ConsumerState<ContractorDashboard> createState() =>
      _ContractorDashboardState();
}

class _ContractorDashboardState extends ConsumerState<ContractorDashboard>
    with TickerProviderStateMixin {
  static const double _walletBalance = 45200;
  static const int _activeSites = 3;
  static const int _totalSites = 5;

  late AnimationController _staggerCtrl;
  late AnimationController _ringCtrl;

  static const _quickActions = [
    _QuickAction(label: 'Find Workers', icon: Icons.people_outline, color: AppColors.worker),
    _QuickAction(label: 'Order Materials', icon: Icons.inventory_2, color: AppColors.customer),
    _QuickAction(label: 'Create Agreement', icon: Icons.handshake, color: AppColors.shopkeeper),
    _QuickAction(label: 'My Sites', icon: Icons.location_city, color: AppColors.contractor),
    _QuickAction(label: 'Analytics', icon: Icons.bar_chart, color: AppColors.admin),
  ];

  static const _workers = [
    _WorkerChip(name: 'Ravi', role: 'Mason', initials: 'R'),
    _WorkerChip(name: 'Suresh', role: 'Plumber', initials: 'S'),
    _WorkerChip(name: 'Kiran', role: 'Electrician', initials: 'K'),
    _WorkerChip(name: 'Arun', role: 'Carpenter', initials: 'A'),
    _WorkerChip(name: 'Rahul', role: 'Painter', initials: 'Ra'),
  ];

  static const _sites = [
    _Site(
      name: 'Hitech City Apartments',
      location: 'Hitech City, Hyderabad',
      progress: 0.68,
      workers: 7,
      daysLeft: 28,
      budgetUsed: 0.72,
      color: AppColors.customer,
    ),
    _Site(
      name: 'Banjara Hills Villa',
      location: 'Banjara Hills, Hyderabad',
      progress: 0.35,
      workers: 5,
      daysLeft: 65,
      budgetUsed: 0.38,
      color: AppColors.contractor,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _staggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();
    _ringCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..forward();
  }

  @override
  void dispose() {
    _staggerCtrl.dispose();
    _ringCtrl.dispose();
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

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final firstName = user?.name.split(' ').first ?? 'Contractor';

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero card
          _staggeredItem(0, _buildHeroCard(firstName)),
          const SizedBox(height: 16),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Active projects with ring counter
                _staggeredItem(1, _buildActiveProjectsCard()),
                const SizedBox(height: 16),

                // Quick actions
                _staggeredItem(2, const Text('Quick Actions',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy))),
                const SizedBox(height: 12),
                _staggeredItem(2, _buildQuickActions()),
                const SizedBox(height: 16),

                // Active sites
                _staggeredItem(3, const Text('Active Sites',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy))),
                const SizedBox(height: 12),

                for (int i = 0; i < _sites.length; i++) ...[
                  _staggeredItem(4 + i, _SiteCard(site: _sites[i])),
                  const SizedBox(height: 10),
                ],

                const SizedBox(height: 16),

                // Worker roster
                _staggeredItem(6, const Text('Worker Roster',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy))),
                const SizedBox(height: 12),
                _buildWorkerRoster(),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCard(String firstName) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      height: 180,
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
        child: Stack(
          fit: StackFit.expand,
          children: [
            CachedNetworkImage(
              imageUrl:
                  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(color: AppColors.navy),
              errorWidget: (context, url, error) =>
                  Container(color: AppColors.navy),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                  colors: [
                    AppColors.navy.withValues(alpha: 0.35),
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
                  Text('Welcome, $firstName',
                      style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Colors.white)),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Project Wallet',
                          style: TextStyle(
                              fontSize: 12, color: Colors.white70)),
                      const SizedBox(height: 4),
                      TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0, end: _walletBalance),
                        duration: const Duration(milliseconds: 1200),
                        curve: Curves.easeOutCubic,
                        builder: (_, v, __) => Text(
                          '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
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

  Widget _buildActiveProjectsCard() {
    final ringProgress = _activeSites / _totalSites;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          AnimatedBuilder(
            animation: _ringCtrl,
            builder: (_, __) => CustomPaint(
              size: const Size(90, 90),
              painter: _ArcPainter(
                progress: ringProgress *
                    CurvedAnimation(
                            parent: _ringCtrl,
                            curve: Curves.easeOutCubic)
                        .value,
                color: AppColors.contractor,
                bgColor: AppColors.border,
              ),
              child: SizedBox(
                width: 90,
                height: 90,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$_activeSites',
                        style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: AppColors.contractor),
                      ),
                      const Text('Active',
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
                const Text('Projects Overview',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy)),
                const SizedBox(height: 8),
                _projectStat('Active Sites', '$_activeSites', AppColors.contractor),
                const SizedBox(height: 6),
                _projectStat('Workers Hired', '12', AppColors.worker),
                const SizedBox(height: 6),
                _projectStat('Orders Placed', '24', AppColors.customer),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _projectStat(String label, String value, Color color) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(shape: BoxShape.circle, color: color),
        ),
        const SizedBox(width: 8),
        Text(label,
            style: const TextStyle(
                fontSize: 12, color: AppColors.textSecondary)),
        const Spacer(),
        Text(value,
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: color)),
      ],
    );
  }

  Widget _buildQuickActions() {
    return SizedBox(
      height: 85,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: _quickActions.length,
        itemBuilder: (context, i) {
          final action = _quickActions[i];
          final anim = CurvedAnimation(
            parent: _staggerCtrl,
            curve: Interval(
              (0.2 + i * 0.06).clamp(0.0, 0.8),
              (0.2 + i * 0.06 + 0.4).clamp(0.0, 1.0),
              curve: Curves.easeOutBack,
            ),
          );
          return AnimatedBuilder(
            animation: anim,
            builder: (_, child) => Transform.scale(
              scale: anim.value,
              child: Opacity(opacity: anim.value.clamp(0.0, 1.0), child: child),
            ),
            child: _QuickActionChip(action: action),
          );
        },
      ),
    );
  }

  Widget _buildWorkerRoster() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _workers.asMap().entries.map((entry) {
        final i = entry.key;
        final w = entry.value;
        final anim = CurvedAnimation(
          parent: _staggerCtrl,
          curve: Interval(
            (0.5 + i * 0.05).clamp(0.0, 0.9),
            (0.5 + i * 0.05 + 0.4).clamp(0.0, 1.0),
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
            child: _WorkerRosterChip(worker: w),
          ),
        );
      }).toList(),
    );
  }
}

// ---------------------------------------------------------------------------
// Site card with animated progress + budget bar
// ---------------------------------------------------------------------------

class _SiteCard extends StatelessWidget {
  final _Site site;
  const _SiteCard({required this.site});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border(
          left: BorderSide(color: site.color, width: 4),
          top: const BorderSide(color: AppColors.border),
          right: const BorderSide(color: AppColors.border),
          bottom: const BorderSide(color: AppColors.border),
        ),
        boxShadow: [
          BoxShadow(
            color: site.color.withValues(alpha: 0.06),
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
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(site.name,
                        style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.navy)),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(Icons.location_on,
                            size: 12, color: AppColors.textMuted),
                        const SizedBox(width: 3),
                        Text(site.location,
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.amber.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('${site.daysLeft} days left',
                    style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.amber)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Completion progress
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${site.workers} workers on site',
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textSecondary)),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: site.progress),
                duration: const Duration(milliseconds: 1000),
                curve: Curves.easeOutCubic,
                builder: (_, v, __) => Text(
                  '${(v * 100).toInt()}%',
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.navy),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: site.progress),
            duration: const Duration(milliseconds: 1000),
            curve: Curves.easeOutCubic,
            builder: (_, v, __) => ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: v,
                backgroundColor: AppColors.border,
                valueColor: AlwaysStoppedAnimation<Color>(site.color),
                minHeight: 6,
              ),
            ),
          ),

          const SizedBox(height: 10),

          // Budget tracker
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Budget Used',
                  style: TextStyle(
                      fontSize: 12, color: AppColors.textSecondary)),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: site.budgetUsed),
                duration: const Duration(milliseconds: 1200),
                curve: Curves.easeOutCubic,
                builder: (_, v, __) => Text(
                  '${(v * 100).toInt()}%',
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: site.budgetUsed > 0.8
                          ? AppColors.error
                          : AppColors.navy),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: site.budgetUsed),
            duration: const Duration(milliseconds: 1200),
            curve: Curves.easeOutCubic,
            builder: (_, v, __) => ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: v,
                backgroundColor: AppColors.border,
                valueColor: AlwaysStoppedAnimation<Color>(
                  v > 0.8 ? AppColors.error : AppColors.amber,
                ),
                minHeight: 5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Worker roster chip
// ---------------------------------------------------------------------------

class _WorkerRosterChip extends StatefulWidget {
  final _WorkerChip worker;
  const _WorkerRosterChip({required this.worker});
  @override
  State<_WorkerRosterChip> createState() => _WorkerRosterChipState();
}

class _WorkerRosterChipState extends State<_WorkerRosterChip> {
  bool _pressed = false;
  @override
  Widget build(_) => GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapUp: (_) => setState(() => _pressed = false),
        onTapCancel: () => setState(() => _pressed = false),
        onTap: () {},
        child: AnimatedScale(
          scale: _pressed ? 0.95 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: AppColors.worker.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                  color: AppColors.worker.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 22,
                  height: 22,
                  decoration: const BoxDecoration(
                    color: AppColors.worker,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(widget.worker.initials,
                        style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Colors.white)),
                  ),
                ),
                const SizedBox(width: 6),
                Text('${widget.worker.name} (${widget.worker.role})',
                    style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.worker)),
              ],
            ),
          ),
        ),
      );
}

// ---------------------------------------------------------------------------
// Quick action chip
// ---------------------------------------------------------------------------

class _QuickActionChip extends StatefulWidget {
  final _QuickAction action;
  const _QuickActionChip({required this.action});
  @override
  State<_QuickActionChip> createState() => _QuickActionChipState();
}

class _QuickActionChipState extends State<_QuickActionChip> {
  bool _pressed = false;
  @override
  Widget build(_) => GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapUp: (_) => setState(() => _pressed = false),
        onTapCancel: () => setState(() => _pressed = false),
        onTap: () {},
        child: AnimatedScale(
          scale: _pressed ? 0.95 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: Container(
            width: 90,
            margin: const EdgeInsets.only(right: 10),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: widget.action.color.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: widget.action.color.withValues(alpha: 0.2)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(widget.action.icon,
                    color: widget.action.color, size: 22),
                const SizedBox(height: 6),
                Text(widget.action.label,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: widget.action.color),
                    maxLines: 2),
              ],
            ),
          ),
        ),
      );
}

// ---------------------------------------------------------------------------
// Arc painter (active projects ring)
// ---------------------------------------------------------------------------

class _ArcPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color bgColor;

  _ArcPainter({
    required this.progress,
    required this.color,
    required this.bgColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - 8;
    const strokeWidth = 8.0;

    final bgPaint = Paint()
      ..color = bgColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, bgPaint);

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
  bool shouldRepaint(_ArcPainter old) => old.progress != progress;
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

class _QuickAction {
  final String label;
  final IconData icon;
  final Color color;
  const _QuickAction(
      {required this.label, required this.icon, required this.color});
}

class _Site {
  final String name;
  final String location;
  final double progress;
  final int workers;
  final int daysLeft;
  final double budgetUsed;
  final Color color;
  const _Site({
    required this.name,
    required this.location,
    required this.progress,
    required this.workers,
    required this.daysLeft,
    required this.budgetUsed,
    required this.color,
  });
}

class _WorkerChip {
  final String name;
  final String role;
  final String initials;
  const _WorkerChip(
      {required this.name, required this.role, required this.initials});
}
