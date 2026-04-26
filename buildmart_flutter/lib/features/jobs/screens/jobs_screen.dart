import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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

final _fmt = NumberFormat('##,##,###', 'en_IN');

// ─── Pulsing Status Dot ───────────────────────────────────────────────────────

class _PulsingStatusDot extends StatefulWidget {
  final Color color;
  const _PulsingStatusDot({required this.color});

  @override
  State<_PulsingStatusDot> createState() => _PulsingStatusDotState();
}

class _PulsingStatusDotState extends State<_PulsingStatusDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
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
      builder: (_, __) => Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: widget.color.withValues(alpha: 0.4 + 0.6 * _ctrl.value),
        ),
        child: Center(
          child: Container(
            width: 5,
            height: 5,
            decoration: BoxDecoration(shape: BoxShape.circle, color: widget.color),
          ),
        ),
      ),
    );
  }
}

enum _JobStatus { active, pending, completed }

class _Job {
  final String id;
  final String employerName;
  final String jobType;
  final String duration;
  final int dailyRate;
  final _JobStatus status;
  final String location;
  final String startDate;

  const _Job({
    required this.id,
    required this.employerName,
    required this.jobType,
    required this.duration,
    required this.dailyRate,
    required this.status,
    required this.location,
    required this.startDate,
  });

  double get totalAmount {
    // Extract number from duration string
    final match = RegExp(r'\d+').firstMatch(duration);
    if (match == null) return dailyRate.toDouble();
    final num = int.parse(match.group(0)!);
    if (duration.contains('week')) return dailyRate * num * 6.0;
    if (duration.contains('month')) return dailyRate * num * 24.0;
    return dailyRate * num.toDouble();
  }
}

final List<_Job> _mockJobs = [
  _Job(
    id: 'j1', employerName: 'Suresh Constructions',
    jobType: 'Masonry — Foundation Work',
    duration: '14 days', dailyRate: 950,
    status: _JobStatus.active,
    location: 'Gachibowli, Hyd', startDate: 'Apr 18, 2025',
  ),
  _Job(
    id: 'j2', employerName: 'Ramesh Developers',
    jobType: 'Masonry — Wall Plastering',
    duration: '7 days', dailyRate: 950,
    status: _JobStatus.pending,
    location: 'Madhapur, Hyd', startDate: 'Apr 28, 2025',
  ),
  _Job(
    id: 'j3', employerName: 'Lakshmi Builders',
    jobType: 'Masonry — Brick Laying',
    duration: '10 days', dailyRate: 900,
    status: _JobStatus.pending,
    location: 'Kukatpally, Hyd', startDate: 'May 2, 2025',
  ),
  _Job(
    id: 'j4', employerName: 'Vijaya Constructions',
    jobType: 'Masonry — Column Casting',
    duration: '5 days', dailyRate: 950,
    status: _JobStatus.completed,
    location: 'Uppal, Hyd', startDate: 'Apr 1, 2025',
  ),
  _Job(
    id: 'j5', employerName: 'Srinivas Infra',
    jobType: 'General Labour — Site Clearance',
    duration: '3 days', dailyRate: 850,
    status: _JobStatus.completed,
    location: 'Tolichowki, Hyd', startDate: 'Mar 22, 2025',
  ),
];

// ─── Jobs Screen ──────────────────────────────────────────────────────────────

class JobsScreen extends ConsumerStatefulWidget {
  const JobsScreen({super.key});

  @override
  ConsumerState<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends ConsumerState<JobsScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  // Per-tab stagger controllers (one per tab)
  final List<AnimationController?> _tabAnimCtrls = [null, null, null];
  int _currentTab = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    // Initialise first tab's stagger immediately
    _tabAnimCtrls[0] = _makeStaggerCtrl()..forward();

    _tabController.addListener(() {
      if (_tabController.indexIsChanging) return;
      final idx = _tabController.index;
      if (idx == _currentTab) return;

      // Fade out current, then stagger in new
      setState(() {
        _currentTab = idx;
        _tabAnimCtrls[idx]?.dispose();
        _tabAnimCtrls[idx] = _makeStaggerCtrl()..forward();
      });
    });
  }

  AnimationController _makeStaggerCtrl() => AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 700),
      );

  @override
  void dispose() {
    _tabController.dispose();
    for (final c in _tabAnimCtrls) {
      c?.dispose();
    }
    super.dispose();
  }

  List<_Job> _filter(_JobStatus status) =>
      _mockJobs.where((j) => j.status == status).toList();

  double get _monthlyEarnings {
    return _mockJobs
        .where((j) =>
            j.status == _JobStatus.active || j.status == _JobStatus.completed)
        .fold(0.0, (s, j) => s + j.totalAmount);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text(
          'My Jobs',
          style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
        ),
        bottom: _CustomTabBar(controller: _tabController),
      ),
      body: Column(
        children: [
          _buildEarningsBanner(),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: List.generate(3, (idx) {
                final status = [
                  _JobStatus.active,
                  _JobStatus.pending,
                  _JobStatus.completed
                ][idx];
                final ctrl = _tabAnimCtrls[idx];
                return _JobList(
                  key: ValueKey(idx),
                  jobs: _filter(status),
                  showActions: status == _JobStatus.pending,
                  staggerCtrl: ctrl,
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEarningsBanner() {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeOutCubic,
      builder: (_, v, child) => Opacity(
        opacity: v,
        child: Transform.translate(
          offset: Offset(0, 20 * (1 - v)),
          child: child,
        ),
      ),
      child: Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _navy,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: _navy.withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Earnings This Month',
                      style: TextStyle(color: Colors.white60, fontSize: 13)),
                  const SizedBox(height: 6),
                  TweenAnimationBuilder<double>(
                    tween: Tween(begin: 0.0, end: _monthlyEarnings),
                    duration: const Duration(milliseconds: 1000),
                    curve: Curves.easeOutCubic,
                    builder: (_, v, __) => Text(
                      '₹${_fmt.format(v.round())}',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Row(
                    children: [
                      Icon(Icons.trending_up, color: _success, size: 14),
                      SizedBox(width: 4),
                      Text('+12% from last month',
                          style: TextStyle(color: _success, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                _EarningsBadge(
                    label: 'Active',
                    count: _filter(_JobStatus.active).length,
                    color: _amber),
                const SizedBox(height: 6),
                _EarningsBadge(
                    label: 'Pending',
                    count: _filter(_JobStatus.pending).length,
                    color: Colors.white60),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

class _CustomTabBar extends StatefulWidget implements PreferredSizeWidget {
  final TabController controller;
  const _CustomTabBar({required this.controller});

  @override
  Size get preferredSize => const Size.fromHeight(48);

  @override
  State<_CustomTabBar> createState() => _CustomTabBarState();
}

class _CustomTabBarState extends State<_CustomTabBar> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(() {
      if (mounted && !widget.controller.indexIsChanging) {
        setState(() => _selectedIndex = widget.controller.index);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    const labels = ['Active', 'Pending', 'Completed'];
    return Container(
      height: 48,
      color: _navy,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final tabWidth = constraints.maxWidth / 3;
          return Stack(
            children: [
              // Animated amber indicator
              AnimatedPositioned(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeOutCubic,
                left: tabWidth * _selectedIndex,
                bottom: 0,
                child: Container(
                  width: tabWidth,
                  height: 3,
                  color: _amber,
                ),
              ),
              Row(
                children: List.generate(3, (idx) {
                  final isSelected = _selectedIndex == idx;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () {
                        widget.controller.animateTo(idx);
                        setState(() => _selectedIndex = idx);
                      },
                      child: AnimatedDefaultTextStyle(
                        duration: const Duration(milliseconds: 200),
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.white60,
                          fontWeight: isSelected
                              ? FontWeight.w600
                              : FontWeight.normal,
                          fontSize: 13,
                        ),
                        child: Container(
                          alignment: Alignment.center,
                          child: Text(labels[idx]),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _EarningsBadge extends StatelessWidget {
  final String label;
  final int count;
  final Color color;
  const _EarningsBadge({required this.label, required this.count, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text('$count $label', style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
    );
  }
}

// ─── Job List ─────────────────────────────────────────────────────────────────

class _JobList extends StatefulWidget {
  final List<_Job> jobs;
  final bool showActions;
  final AnimationController? staggerCtrl;

  const _JobList({
    super.key,
    required this.jobs,
    required this.showActions,
    this.staggerCtrl,
  });

  @override
  State<_JobList> createState() => _JobListState();
}

class _JobListState extends State<_JobList> {
  late List<bool> _accepted;
  late List<bool> _rejected;

  @override
  void initState() {
    super.initState();
    _accepted = List.filled(widget.jobs.length, false);
    _rejected = List.filled(widget.jobs.length, false);
  }

  Animation<double> _cardAnim(int i) {
    final ctrl = widget.staggerCtrl;
    if (ctrl == null) return const AlwaysStoppedAnimation(1.0);
    return CurvedAnimation(
      parent: ctrl,
      curve: Interval(
        (i * 0.12).clamp(0.0, 0.6),
        (i * 0.12 + 0.4).clamp(0.0, 1.0),
        curve: Curves.easeOutCubic,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (widget.jobs.isEmpty) {
      return Center(
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: 0.0, end: 1.0),
          duration: const Duration(milliseconds: 700),
          curve: Curves.elasticOut,
          builder: (_, v, child) => Transform.scale(scale: v, child: child),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.work_outline, size: 64, color: _textMuted),
              SizedBox(height: 16),
              Text('No jobs here',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: _navy)),
              SizedBox(height: 8),
              Text('Jobs in this category will appear here.',
                  style: TextStyle(color: _textSecondary, fontSize: 14)),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      itemCount: widget.jobs.length,
      itemBuilder: (context, i) {
        final anim = _cardAnim(i);
        return AnimatedBuilder(
          animation: anim,
          builder: (_, child) => FadeTransition(
            opacity: anim,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.12, 0),
                end: Offset.zero,
              ).animate(anim),
              child: child,
            ),
          ),
          child: _JobCard(
            job: widget.jobs[i],
            showActions: widget.showActions && !_accepted[i] && !_rejected[i],
            isRejected: _rejected[i],
            onAccept: () => setState(() => _accepted[i] = true),
            onReject: () => setState(() => _rejected[i] = true),
          ),
        );
      },
    );
  }
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

class _JobCard extends StatefulWidget {
  final _Job job;
  final bool showActions;
  final bool isRejected;
  final VoidCallback onAccept;
  final VoidCallback onReject;

  const _JobCard({
    required this.job,
    required this.showActions,
    required this.onAccept,
    required this.onReject,
    this.isRejected = false,
  });

  @override
  State<_JobCard> createState() => _JobCardState();
}

class _JobCardState extends State<_JobCard> {
  Color get _statusColor {
    if (widget.isRejected) return const Color(0xFFEF4444);
    switch (widget.job.status) {
      case _JobStatus.active:
        return _amber;
      case _JobStatus.pending:
        return _textSecondary;
      case _JobStatus.completed:
        return _success;
    }
  }

  Color get _statusBg {
    if (widget.isRejected) return const Color(0xFFFEE2E2);
    switch (widget.job.status) {
      case _JobStatus.active:
        return _amberBg;
      case _JobStatus.pending:
        return const Color(0xFFF3F4F6);
      case _JobStatus.completed:
        return const Color(0xFFD1FAE5);
    }
  }

  String get _statusLabel {
    if (widget.isRejected && widget.job.status == _JobStatus.pending) {
      return 'Declined';
    }
    switch (widget.job.status) {
      case _JobStatus.active:
        return 'Active';
      case _JobStatus.pending:
        return 'Pending';
      case _JobStatus.completed:
        return 'Completed';
    }
  }

  bool get _isActive => widget.job.status == _JobStatus.active;

  @override
  Widget build(BuildContext context) {
    final job = widget.job;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _surface,
        border: Border.all(color: _border),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
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
              Expanded(
                child: Text(
                  job.employerName,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 15, color: _navy),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              _StatusBadge(
                label: _statusLabel,
                color: _statusColor,
                bg: _statusBg,
                pulsing: _isActive,
              ),
            ],
          ),
          const SizedBox(height: 6),
          // Job type highlighted amber
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: _amberBg,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              job.jobType,
              style: const TextStyle(
                  color: _amber, fontSize: 13, fontWeight: FontWeight.w500),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _JobMeta(icon: Icons.schedule_outlined, text: job.duration),
              const SizedBox(width: 16),
              _JobMeta(icon: Icons.location_on_outlined, text: job.location),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              _JobMeta(
                  icon: Icons.calendar_today_outlined,
                  text: 'Start: ${job.startDate}'),
              const SizedBox(width: 16),
              _JobMeta(
                  icon: Icons.currency_rupee,
                  text: '₹${_fmt.format(job.dailyRate)}/day'),
            ],
          ),
          const Divider(height: 16, color: _border),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Total',
                      style: TextStyle(color: _textSecondary, fontSize: 12)),
                  Text(
                    '₹${_fmt.format(job.totalAmount)}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: _navy),
                  ),
                ],
              ),
              if (widget.showActions)
                _ActionButtons(
                  onAccept: () {
                    widget.onAccept();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Job accepted!'),
                        backgroundColor: _success,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  onReject: () {
                    widget.onReject();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Job declined.'),
                        backgroundColor: _error,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                )
              else if (_isActive)
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Job is currently in progress'),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: Color(0xFF1A1D2E),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: _navy,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'In Progress',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

class _StatusBadge extends StatelessWidget {
  final String label;
  final Color color;
  final Color bg;
  final bool pulsing;

  const _StatusBadge({
    required this.label,
    required this.color,
    required this.bg,
    required this.pulsing,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (pulsing) ...[
            _PulsingStatusDot(color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
                color: color, fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

// ─── Accept / Reject Buttons with AnimatedSwitcher ────────────────────────────

class _ActionButtons extends StatefulWidget {
  final VoidCallback onAccept;
  final VoidCallback onReject;
  const _ActionButtons({required this.onAccept, required this.onReject});

  @override
  State<_ActionButtons> createState() => _ActionButtonsState();
}

class _ActionButtonsState extends State<_ActionButtons> {
  bool _rejectPressed = false;
  bool _acceptPressed = false;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTapDown: (_) => setState(() => _rejectPressed = true),
          onTapUp: (_) {
            setState(() => _rejectPressed = false);
            widget.onReject();
          },
          onTapCancel: () => setState(() => _rejectPressed = false),
          child: AnimatedScale(
            scale: _rejectPressed ? 0.94 : 1.0,
            duration: const Duration(milliseconds: 100),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: _surface,
                border: Border.all(color: _error),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('Reject',
                  style: TextStyle(
                      color: _error,
                      fontWeight: FontWeight.w600,
                      fontSize: 13)),
            ),
          ),
        ),
        const SizedBox(width: 8),
        GestureDetector(
          onTapDown: (_) => setState(() => _acceptPressed = true),
          onTapUp: (_) {
            setState(() => _acceptPressed = false);
            widget.onAccept();
          },
          onTapCancel: () => setState(() => _acceptPressed = false),
          child: AnimatedScale(
            scale: _acceptPressed ? 0.94 : 1.0,
            duration: const Duration(milliseconds: 100),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: _acceptPressed ? _success.withValues(alpha: 0.85) : _success,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('Accept',
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 13)),
            ),
          ),
        ),
      ],
    );
  }
}

class _JobMeta extends StatelessWidget {
  final IconData icon;
  final String text;
  const _JobMeta({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 13, color: _textSecondary),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(color: _textSecondary, fontSize: 12)),
      ],
    );
  }
}
