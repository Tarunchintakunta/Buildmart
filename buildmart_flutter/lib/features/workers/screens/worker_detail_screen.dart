import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'workers_screen.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _surface = Colors.white;
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

final _rateFmt = NumberFormat('##,##,###', 'en_IN');

// ─── Review Model ─────────────────────────────────────────────────────────────

class _Review {
  final String name;
  final double rating;
  final String comment;
  final String date;
  const _Review(this.name, this.rating, this.comment, this.date);
}

const List<_Review> _mockReviews = [
  _Review(
    'Ramakrishna Rao', 5.0,
    'Excellent work! Very professional and completed the job ahead of schedule. The plastering quality is outstanding. Will definitely hire again.',
    'Mar 2025',
  ),
  _Review(
    'Sunita Patel', 4.5,
    'Good worker. Showed up on time and did a clean job. Minor communication issues initially but overall very satisfied with the output.',
    'Feb 2025',
  ),
];

// ─── Pulsing Online Dot ───────────────────────────────────────────────────────

class _PulsingOnlineDot extends StatefulWidget {
  const _PulsingOnlineDot();

  @override
  State<_PulsingOnlineDot> createState() => _PulsingOnlineDotState();
}

class _PulsingOnlineDotState extends State<_PulsingOnlineDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat(reverse: true);
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
      builder: (_, __) => Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.green.withValues(alpha: 0.3 + 0.7 * _ctrl.value),
        ),
        child: Center(
          child: Container(
            width: 7,
            height: 7,
            decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.green),
          ),
        ),
      ),
    );
  }
}

// ─── Count-up Stat ────────────────────────────────────────────────────────────

class _AnimatedStat extends StatelessWidget {
  final String label;
  final String displayValue;
  final double numericEnd;
  final IconData icon;
  final Color iconColor;
  final Duration delay;

  const _AnimatedStat({
    required this.label,
    required this.displayValue,
    required this.numericEnd,
    required this.icon,
    required this.iconColor,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0.0, end: numericEnd),
        duration: Duration(milliseconds: 900 + delay.inMilliseconds),
        curve: Curves.easeOutCubic,
        builder: (_, v, __) {
          // Show count-up for numeric stats; for the rate use full format
          final shown = numericEnd > 100
              ? '₹${_rateFmt.format(v.round())}'
              : numericEnd < 10
                  ? v.toStringAsFixed(1)
                  : '${v.round()}+';
          return Column(
            children: [
              Icon(icon, size: 20, color: iconColor),
              const SizedBox(height: 4),
              Text(
                shown,
                style: const TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 14, color: _navy),
              ),
              const SizedBox(height: 2),
              Text(label,
                  style: const TextStyle(fontSize: 11, color: _textSecondary)),
            ],
          );
        },
      ),
    );
  }
}

// ─── Worker Detail Screen ─────────────────────────────────────────────────────

class WorkerDetailScreen extends ConsumerStatefulWidget {
  final String workerId;
  final Object? extra;

  const WorkerDetailScreen({super.key, required this.workerId, this.extra});

  @override
  ConsumerState<WorkerDetailScreen> createState() => _WorkerDetailScreenState();
}

class _WorkerDetailScreenState extends ConsumerState<WorkerDetailScreen>
    with TickerProviderStateMixin {
  WorkerModel? _worker;

  // Bio/skills/reviews entrance
  late AnimationController _contentCtrl;

  // Bottom bar slide-up
  late AnimationController _bottomBarCtrl;
  late Animation<Offset> _bottomBarSlide;

  // Skill chips stagger
  late AnimationController _chipsCtrl;

  // Review cards stagger
  late AnimationController _reviewsCtrl;

  @override
  void initState() {
    super.initState();

    _resolveWorker();

    _contentCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _bottomBarCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _bottomBarSlide = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _bottomBarCtrl, curve: Curves.easeOutCubic));

    _chipsCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _reviewsCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    // Stagger the entrance of content sections
    _contentCtrl.forward();
    Future.delayed(const Duration(milliseconds: 200), () {
      if (mounted) _chipsCtrl.forward();
    });
    Future.delayed(const Duration(milliseconds: 350), () {
      if (mounted) _reviewsCtrl.forward();
    });
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) _bottomBarCtrl.forward();
    });
  }

  void _resolveWorker() {
    if (widget.extra is WorkerModel) {
      _worker = widget.extra as WorkerModel;
      return;
    }
    try {
      _worker = mockWorkers.firstWhere((w) => w.id == widget.workerId);
    } catch (_) {
      _worker = mockWorkers.first;
    }
  }

  @override
  void dispose() {
    _contentCtrl.dispose();
    _bottomBarCtrl.dispose();
    _chipsCtrl.dispose();
    _reviewsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final w = _worker!;

    return Scaffold(
      backgroundColor: _bg,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 260,
                pinned: true,
                backgroundColor: _navy,
                elevation: 0,
                leading: IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                  ),
                  onPressed: () => context.pop(),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.only(right: 12, top: 8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: w.isAvailable ? _success : _textMuted,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (w.isAvailable) ...[
                            const _PulsingOnlineDot(),
                            const SizedBox(width: 4),
                          ],
                          Text(
                            w.isAvailable ? 'Available' : 'Busy',
                            style: const TextStyle(
                                color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: _buildHeroContent(w),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildStatsRow(w),
                      const SizedBox(height: 24),
                      _buildBioSection(w),
                      const SizedBox(height: 24),
                      _buildSkillsSection(w),
                      const SizedBox(height: 24),
                      _buildReviewsSection(),
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          ),
          // Bottom bar slides up
          SlideTransition(
            position: _bottomBarSlide,
            child: _buildBottomBar(w),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroContent(WorkerModel w) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF1A1D2E), Color(0xFF2D3150)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            Hero(
              tag: 'worker_${w.id}',
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: _amber, width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.3),
                      blurRadius: 16,
                    ),
                  ],
                ),
                child: ClipOval(
                  child: CachedNetworkImage(
                    imageUrl: w.photoUrl,
                    width: 110,
                    height: 110,
                    fit: BoxFit.cover,
                    placeholder: (context, url) =>
                        Container(width: 110, height: 110, color: _bg),
                    errorWidget: (context, url, err) => Container(
                      width: 110, height: 110, color: _bg,
                      child: const Icon(Icons.person, size: 56, color: _textMuted),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              w.name,
              style: const TextStyle(
                  color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
              decoration: BoxDecoration(
                color: _amber.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _amber.withValues(alpha: 0.5)),
              ),
              child: Text(
                w.skill,
                style: const TextStyle(
                    color: _amber, fontSize: 14, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.location_on_outlined, size: 14, color: Colors.white60),
                const SizedBox(width: 4),
                Text(w.location,
                    style: const TextStyle(color: Colors.white60, fontSize: 13)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsRow(WorkerModel w) {
    return AnimatedBuilder(
      animation: _contentCtrl,
      builder: (_, child) => FadeTransition(
        opacity: _contentCtrl,
        child: SlideTransition(
          position: Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero)
              .animate(CurvedAnimation(parent: _contentCtrl, curve: Curves.easeOutCubic)),
          child: child,
        ),
      ),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: _surface,
          border: Border.all(color: _border),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            _AnimatedStat(
              label: 'Rating',
              displayValue: w.rating.toStringAsFixed(1),
              numericEnd: w.rating,
              icon: Icons.star,
              iconColor: _amber,
              delay: Duration.zero,
            ),
            _VerticalDivider(),
            _AnimatedStat(
              label: 'Jobs Done',
              displayValue: '${w.jobsDone}+',
              numericEnd: w.jobsDone.toDouble(),
              icon: Icons.check_circle_outline,
              iconColor: _success,
              delay: const Duration(milliseconds: 200),
            ),
            _VerticalDivider(),
            _AnimatedStat(
              label: 'Experience',
              displayValue: '${w.experienceYears}yr',
              numericEnd: w.experienceYears.toDouble(),
              icon: Icons.workspace_premium_outlined,
              iconColor: _navy,
              delay: const Duration(milliseconds: 400),
            ),
            _VerticalDivider(),
            _AnimatedStat(
              label: 'Daily Rate',
              displayValue: '₹${_rateFmt.format(w.dailyRate)}',
              numericEnd: w.dailyRate.toDouble(),
              icon: Icons.currency_rupee,
              iconColor: _amber,
              delay: const Duration(milliseconds: 600),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBioSection(WorkerModel w) {
    return AnimatedBuilder(
      animation: _contentCtrl,
      builder: (_, child) => FadeTransition(
        opacity: _contentCtrl,
        child: SlideTransition(
          position: Tween<Offset>(begin: const Offset(0, 0.4), end: Offset.zero)
              .animate(CurvedAnimation(
            parent: _contentCtrl,
            curve: const Interval(0.2, 1.0, curve: Curves.easeOutCubic),
          )),
          child: child,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('About',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: _navy)),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: _surface,
              border: Border.all(color: _border),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              w.bio,
              style: const TextStyle(color: _textSecondary, fontSize: 14, height: 1.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSkillsSection(WorkerModel w) {
    final allSkills = [
      w.skill,
      'Concrete Work',
      'Site Safety',
      'Blueprint Reading',
      'Material Estimation',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Skills',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: _navy)),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: allSkills.asMap().entries.map((entry) {
            final i = entry.key;
            final skill = entry.value;
            final anim = CurvedAnimation(
              parent: _chipsCtrl,
              curve: Interval(
                (i * 0.12).clamp(0.0, 0.7),
                (i * 0.12 + 0.3).clamp(0.0, 1.0),
                curve: Curves.easeOutCubic,
              ),
            );
            return AnimatedBuilder(
              animation: anim,
              builder: (_, child) => FadeTransition(
                opacity: anim,
                child: Transform.translate(
                  offset: Offset(0, 10 * (1 - anim.value)),
                  child: child,
                ),
              ),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: _amberBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _amber.withValues(alpha: 0.3)),
                ),
                child: Text(
                  skill,
                  style: const TextStyle(
                      color: _amber, fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildReviewsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text('Reviews',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: _navy)),
            const Spacer(),
            Text('${_mockReviews.length} reviews',
                style: const TextStyle(color: _textSecondary, fontSize: 13)),
          ],
        ),
        const SizedBox(height: 12),
        ..._mockReviews.asMap().entries.map((entry) {
          final i = entry.key;
          final r = entry.value;
          final anim = CurvedAnimation(
            parent: _reviewsCtrl,
            curve: Interval(
              (i * 0.2).clamp(0.0, 0.6),
              (i * 0.2 + 0.4).clamp(0.0, 1.0),
              curve: Curves.easeOutCubic,
            ),
          );
          return AnimatedBuilder(
            animation: anim,
            builder: (_, child) => FadeTransition(
              opacity: anim,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0.15, 0),
                  end: Offset.zero,
                ).animate(anim),
                child: child,
              ),
            ),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
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
                      CircleAvatar(
                        radius: 18,
                        backgroundColor: _navy.withValues(alpha: 0.1),
                        child: Text(
                          r.name[0],
                          style: const TextStyle(
                              color: _navy, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(r.name,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                    color: _navy)),
                            Text(r.date,
                                style: const TextStyle(
                                    fontSize: 12, color: _textMuted)),
                          ],
                        ),
                      ),
                      Row(
                        children: List.generate(
                          5,
                          (i) => Icon(
                            i < r.rating.floor()
                                ? Icons.star
                                : (i < r.rating
                                    ? Icons.star_half
                                    : Icons.star_border),
                            size: 14,
                            color: _amber,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    r.comment,
                    style: const TextStyle(
                        color: _textSecondary, fontSize: 13, height: 1.5),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildBottomBar(WorkerModel w) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 12,
          bottom: MediaQuery.of(context).padding.bottom + 12,
        ),
        decoration: BoxDecoration(
          color: _surface,
          border: const Border(top: BorderSide(color: _border)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 12,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: _PulsingHireButton(
          label: 'Hire Now — ₹${_rateFmt.format(w.dailyRate)}/day',
          onTap: () => context.push('/workers/${w.id}/hire', extra: w),
        ),
      ),
    );
  }
}

// ─── Pulsing Hire Button ──────────────────────────────────────────────────────

class _PulsingHireButton extends StatefulWidget {
  final String label;
  final VoidCallback onTap;
  const _PulsingHireButton({required this.label, required this.onTap});

  @override
  State<_PulsingHireButton> createState() => _PulsingHireButtonState();
}

class _PulsingHireButtonState extends State<_PulsingHireButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowCtrl;

  @override
  void initState() {
    super.initState();
    _glowCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _glowCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _glowCtrl,
      builder: (_, __) => GestureDetector(
        onTap: widget.onTap,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: _amber,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: _amber.withValues(alpha: 0.3 + 0.3 * _glowCtrl.value),
                blurRadius: 8 + 8 * _glowCtrl.value,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: Text(
            widget.label,
            style: const TextStyle(
                color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
      ),
    );
  }
}

// ─── Vertical Divider ─────────────────────────────────────────────────────────

class _VerticalDivider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 48, color: _border);
  }
}
