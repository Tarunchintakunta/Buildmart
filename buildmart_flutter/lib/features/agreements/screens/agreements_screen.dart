import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';

const Color _navy = Color(0xFF1A1D2E);
const Color _amber = Color(0xFFF2960D);
const Color _amberBg = Color(0xFFFEF3C7);
const Color _bg = Color(0xFFF5F6FA);
const Color _border = Color(0xFFE5E7EB);
const Color _success = Color(0xFF10B981);
const Color _error = Color(0xFFEF4444);
const Color _textSecondary = Color(0xFF6B7280);
const Color _textMuted = Color(0xFF9CA3AF);

// ─────────────────────────────────────────────────────────────────────────────
// Data models
// ─────────────────────────────────────────────────────────────────────────────

enum AgreementStatus { active, pending, completed, cancelled }

class AgreementModel {
  final String contractNo;
  final String contractorName;
  final String workerName;
  final String jobTitle;
  final String duration;
  final double value;
  final AgreementStatus status;

  const AgreementModel({
    required this.contractNo,
    required this.contractorName,
    required this.workerName,
    required this.jobTitle,
    required this.duration,
    required this.value,
    required this.status,
  });
}

final _mockAgreements = [
  AgreementModel(
    contractNo: 'AGR-2031',
    contractorName: 'Rahul Constructions',
    workerName: 'Vijay Kumar',
    jobTitle: 'Site Supervisor – Block A',
    duration: '1 May – 31 Jul 2026',
    value: 45000,
    status: AgreementStatus.active,
  ),
  AgreementModel(
    contractNo: 'AGR-2028',
    contractorName: 'Rahul Constructions',
    workerName: 'Suresh Reddy',
    jobTitle: 'Electrician – Wiring Phase 2',
    duration: '15 May – 30 Jun 2026',
    value: 28000,
    status: AgreementStatus.pending,
  ),
  AgreementModel(
    contractNo: 'AGR-2019',
    contractorName: 'Skyline Builders',
    workerName: 'Anil Sharma',
    jobTitle: 'Mason – Foundation Work',
    duration: '1 Jan – 31 Mar 2026',
    value: 60000,
    status: AgreementStatus.completed,
  ),
  AgreementModel(
    contractNo: 'AGR-2011',
    contractorName: 'Skyline Builders',
    workerName: 'Ravi Naidu',
    jobTitle: 'Painter – Interior Finishing',
    duration: '10 Nov – 31 Dec 2025',
    value: 18000,
    status: AgreementStatus.cancelled,
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// Agreements List Screen
// ─────────────────────────────────────────────────────────────────────────────

class AgreementsScreen extends StatefulWidget {
  const AgreementsScreen({super.key});

  @override
  State<AgreementsScreen> createState() => _AgreementsScreenState();
}

class _AgreementsScreenState extends State<AgreementsScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  late AnimationController _staggerCtrl;
  bool _shimmerActive = true;

  final List<Animation<double>> _fadeAnims = [];
  final List<Animation<Offset>> _slideAnims = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _tabController.addListener(() => setState(() {}));

    _staggerCtrl = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 400 + _mockAgreements.length * 120),
    );

    for (var i = 0; i < _mockAgreements.length; i++) {
      final start = (i * 0.15).clamp(0.0, 0.8);
      final end = (start + 0.4).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _fadeAnims.add(Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _staggerCtrl, curve: interval),
      ));
      _slideAnims.add(Tween<Offset>(
        begin: const Offset(0, 0.2),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: _staggerCtrl, curve: interval)));
    }

    // Show shimmer for 800ms then reveal content
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        setState(() => _shimmerActive = false);
        _staggerCtrl.forward();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _staggerCtrl.dispose();
    super.dispose();
  }

  List<AgreementModel> _agreementsForTab(int index) {
    switch (index) {
      case 1:
        return _mockAgreements
            .where((a) => a.status == AgreementStatus.active)
            .toList();
      case 2:
        return _mockAgreements
            .where((a) => a.status == AgreementStatus.pending)
            .toList();
      case 3:
        return _mockAgreements
            .where((a) => a.status == AgreementStatus.completed)
            .toList();
      default:
        return _mockAgreements;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        title: const Text(
          'Agreements',
          style: TextStyle(
              color: _navy, fontWeight: FontWeight.w700, fontSize: 20),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: _AnimatedTabBar(controller: _tabController),
        ),
      ),
      body: _shimmerActive
          ? _ShimmerList()
          : TabBarView(
              controller: _tabController,
              children: List.generate(4, (tabIndex) {
                final list = _agreementsForTab(tabIndex);
                if (list.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.description_outlined,
                            size: 48,
                            color: _textMuted.withValues(alpha: 0.5)),
                        const SizedBox(height: 12),
                        const Text('No agreements in this category',
                            style: TextStyle(color: _textMuted)),
                      ],
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: list.length,
                  itemBuilder: (context, i) {
                    final globalIdx = _mockAgreements.indexOf(list[i]);
                    final safeIdx =
                        globalIdx >= 0 && globalIdx < _fadeAnims.length
                            ? globalIdx
                            : 0;
                    return FadeTransition(
                      opacity: _fadeAnims[safeIdx],
                      child: SlideTransition(
                        position: _slideAnims[safeIdx],
                        child: _AgreementCard(
                          agreement: list[i],
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  AgreementDetailScreen(agreement: list[i]),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                );
              }),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const CreateAgreementScreen()),
        ),
        backgroundColor: _amber,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

// Animated sliding tab bar indicator
class _AnimatedTabBar extends StatelessWidget {
  final TabController controller;
  const _AnimatedTabBar({required this.controller});

  @override
  Widget build(BuildContext context) {
    return TabBar(
      controller: controller,
      labelColor: _amber,
      unselectedLabelColor: _textSecondary,
      indicatorColor: _amber,
      indicatorWeight: 2.5,
      indicatorSize: TabBarIndicatorSize.label,
      labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
      unselectedLabelStyle:
          const TextStyle(fontWeight: FontWeight.w500, fontSize: 13),
      tabs: const [
        Tab(text: 'All'),
        Tab(text: 'Active'),
        Tab(text: 'Pending'),
        Tab(text: 'Completed'),
      ],
    );
  }
}

// Shimmer placeholder list
class _ShimmerList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: Colors.white,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 4,
        itemBuilder: (_, __) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          height: 130,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Agreement Card with AnimatedScale press
// ─────────────────────────────────────────────────────────────────────────────

class _AgreementCard extends StatefulWidget {
  final AgreementModel agreement;
  final VoidCallback onTap;

  const _AgreementCard({required this.agreement, required this.onTap});

  @override
  State<_AgreementCard> createState() => _AgreementCardState();
}

class _AgreementCardState extends State<_AgreementCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _scaleCtrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _scaleCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 150),
      lowerBound: 0.97,
      upperBound: 1.0,
      value: 1.0,
    );
    _scale = _scaleCtrl;
  }

  @override
  void dispose() {
    _scaleCtrl.dispose();
    super.dispose();
  }

  Color get _statusColor {
    switch (widget.agreement.status) {
      case AgreementStatus.active:
        return _success;
      case AgreementStatus.pending:
        return _amber;
      case AgreementStatus.completed:
        return const Color(0xFF3B82F6);
      case AgreementStatus.cancelled:
        return _error;
    }
  }

  String get _statusLabel {
    switch (widget.agreement.status) {
      case AgreementStatus.active:
        return 'Active';
      case AgreementStatus.pending:
        return 'Pending';
      case AgreementStatus.completed:
        return 'Completed';
      case AgreementStatus.cancelled:
        return 'Cancelled';
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _scaleCtrl.reverse(),
      onTapUp: (_) {
        _scaleCtrl.forward();
        widget.onTap();
      },
      onTapCancel: () => _scaleCtrl.forward(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    widget.agreement.contractNo,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _textSecondary,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const Spacer(),
                  _PulsingStatusChip(
                    label: _statusLabel,
                    color: _statusColor,
                    showPulse: widget.agreement.status ==
                            AgreementStatus.active ||
                        widget.agreement.status == AgreementStatus.pending,
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                widget.agreement.jobTitle,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: _navy,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _PartyInfo(
                      label: 'Contractor',
                      name: widget.agreement.contractorName,
                      icon: Icons.business,
                      iconColor: const Color(0xFF8B5CF6),
                    ),
                  ),
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: _bg,
                      shape: BoxShape.circle,
                      border: Border.all(color: _border),
                    ),
                    child: const Icon(Icons.swap_horiz,
                        size: 14, color: _textSecondary),
                  ),
                  Expanded(
                    child: _PartyInfo(
                      label: 'Worker',
                      name: widget.agreement.workerName,
                      icon: Icons.engineering,
                      iconColor: const Color(0xFFF59E0B),
                      alignRight: true,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(color: _border, height: 1),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(Icons.calendar_today,
                      size: 13, color: _textMuted),
                  const SizedBox(width: 4),
                  Text(
                    widget.agreement.duration,
                    style: const TextStyle(
                        fontSize: 12, color: _textSecondary),
                  ),
                  const Spacer(),
                  // Escrow amount with amber background
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: _amberBg,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: widget.agreement.value),
                      duration: const Duration(milliseconds: 900),
                      curve: Curves.easeOutCubic,
                      builder: (_, v, __) => Text(
                        '₹${v.toInt()}',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: _amber,
                        ),
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

// Pulsing status chip for Active/Pending
class _PulsingStatusChip extends StatefulWidget {
  final String label;
  final Color color;
  final bool showPulse;

  const _PulsingStatusChip({
    required this.label,
    required this.color,
    required this.showPulse,
  });

  @override
  State<_PulsingStatusChip> createState() => _PulsingStatusChipState();
}

class _PulsingStatusChipState extends State<_PulsingStatusChip>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseCtrl;
  late Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _pulse = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
    if (widget.showPulse) {
      _pulseCtrl.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: widget.color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.showPulse) ...[
            AnimatedBuilder(
              animation: _pulse,
              builder: (_, __) => Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: widget.color.withValues(alpha: _pulse.value),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            const SizedBox(width: 5),
          ],
          Text(
            widget.label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: widget.color,
            ),
          ),
        ],
      ),
    );
  }
}

class _PartyInfo extends StatelessWidget {
  final String label;
  final String name;
  final IconData icon;
  final Color iconColor;
  final bool alignRight;

  const _PartyInfo({
    required this.label,
    required this.name,
    required this.icon,
    required this.iconColor,
    this.alignRight = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment:
          alignRight ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(fontSize: 10, color: _textMuted)),
        const SizedBox(height: 3),
        Row(
          mainAxisAlignment:
              alignRight ? MainAxisAlignment.end : MainAxisAlignment.start,
          children: alignRight
              ? [
                  Flexible(
                    child: Text(name,
                        textAlign: TextAlign.right,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _navy)),
                  ),
                  const SizedBox(width: 4),
                  Icon(icon, size: 14, color: iconColor),
                ]
              : [
                  Icon(icon, size: 14, color: iconColor),
                  const SizedBox(width: 4),
                  Flexible(
                    child: Text(name,
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _navy)),
                  ),
                ],
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Agreement Detail Screen
// ─────────────────────────────────────────────────────────────────────────────

class AgreementDetailScreen extends StatefulWidget {
  final AgreementModel? agreement;

  /// Legacy string-ID support for router compat (looks up mock data).
  final String? agreementId;

  const AgreementDetailScreen({
    super.key,
    this.agreement,
    this.agreementId,
  });

  @override
  State<AgreementDetailScreen> createState() =>
      _AgreementDetailScreenState();
}

class _AgreementDetailScreenState extends State<AgreementDetailScreen>
    with TickerProviderStateMixin {
  late AnimationController _headerCtrl;
  late AnimationController _timelineCtrl;
  late AnimationController _termsCtrl;
  late AnimationController _buttonsCtrl;

  late Animation<Offset> _headerSlide;
  late List<Animation<double>> _timelineAnims;
  late List<Animation<double>> _termsFadeAnims;
  late Animation<Offset> _buttonsSlide;

  AgreementModel get _resolved =>
      widget.agreement ??
      _mockAgreements.firstWhere(
        (a) => a.contractNo == widget.agreementId,
        orElse: () => _mockAgreements.first,
      );

  Color get _statusColor {
    switch (_resolved.status) {
      case AgreementStatus.active:
        return _success;
      case AgreementStatus.pending:
        return _amber;
      case AgreementStatus.completed:
        return const Color(0xFF3B82F6);
      case AgreementStatus.cancelled:
        return _error;
    }
  }

  @override
  void initState() {
    super.initState();

    _headerCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 500));
    _headerSlide = Tween<Offset>(
      begin: const Offset(0, -0.3),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _headerCtrl, curve: Curves.easeOutCubic));

    _timelineCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900));
    _timelineAnims = List.generate(3, (i) {
      final start = i * 0.3;
      final end = (start + 0.4).clamp(0.0, 1.0);
      return Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(
          parent: _timelineCtrl,
          curve: Interval(start, end, curve: Curves.easeOut),
        ),
      );
    });

    _termsCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800));
    _termsFadeAnims = List.generate(4, (i) {
      final start = i * 0.2;
      final end = (start + 0.35).clamp(0.0, 1.0);
      return Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(
          parent: _termsCtrl,
          curve: Interval(start, end, curve: Curves.easeOut),
        ),
      );
    });

    _buttonsCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));
    _buttonsSlide = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _buttonsCtrl, curve: Curves.easeOutCubic));

    // Stagger the animations
    _headerCtrl.forward();
    Future.delayed(const Duration(milliseconds: 200),
        () => mounted ? _timelineCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 350),
        () => mounted ? _termsCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 600),
        () => mounted ? _buttonsCtrl.forward() : null);
  }

  @override
  void dispose() {
    _headerCtrl.dispose();
    _timelineCtrl.dispose();
    _termsCtrl.dispose();
    _buttonsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final agr = _resolved;
    final isActive = agr.status == AgreementStatus.active;
    final isPending = agr.status == AgreementStatus.pending;

    final timelineSteps = ['Draft', 'Active', 'Completed'];
    final currentStep = agr.status == AgreementStatus.active
        ? 1
        : agr.status == AgreementStatus.completed
            ? 2
            : agr.status == AgreementStatus.pending
                ? 0
                : 0;

    final termItems = [
      _TermData('Duration', agr.duration),
      _TermData('Total Value', '₹${agr.value.toInt()}'),
      _TermData('Rate Type', 'Monthly'),
      _TermData('Payment Schedule', '5th of every month'),
    ];

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
          agr.contractNo,
          style: const TextStyle(
              color: _navy, fontWeight: FontWeight.w700, fontSize: 16),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Header slides down from top
            SlideTransition(
              position: _headerSlide,
              child: FadeTransition(
                opacity: _headerCtrl,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: _navy,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'SERVICE AGREEMENT',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(agr.contractNo,
                          style: const TextStyle(
                              color: Colors.white54, fontSize: 12)),
                      const SizedBox(height: 12),
                      // Escrow amount counts up
                      TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0, end: agr.value),
                        duration: const Duration(milliseconds: 1200),
                        curve: Curves.easeOutCubic,
                        builder: (ctx, v, _) => Text(
                          '₹${NumberFormat('##,##,###', 'en_IN').format(v.round())}',
                          style: const TextStyle(
                            color: _amber,
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text('Escrow Value',
                          style: TextStyle(
                              color: Colors.white38, fontSize: 11)),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 4),
                        decoration: BoxDecoration(
                          color: _statusColor.withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: _statusColor.withValues(alpha: 0.5)),
                        ),
                        child: Text(
                          agr.status.name.toUpperCase(),
                          style: TextStyle(
                            color: _statusColor,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Status timeline – animated sequentially
            _SectionCard(
              title: 'TIMELINE',
              child: Row(
                children: List.generate(timelineSteps.length * 2 - 1, (i) {
                  if (i.isOdd) {
                    // Connector line
                    final stepIdx = i ~/ 2;
                    return Expanded(
                      child: AnimatedBuilder(
                        animation: _timelineAnims[stepIdx],
                        builder: (_, __) => Container(
                          height: 2,
                          color: stepIdx < currentStep
                              ? _success.withValues(
                                  alpha: _timelineAnims[stepIdx].value)
                              : _border,
                        ),
                      ),
                    );
                  }
                  final stepIdx = i ~/ 2;
                  final isDone = stepIdx <= currentStep;
                  return AnimatedBuilder(
                    animation: _timelineAnims[stepIdx],
                    builder: (_, __) => Opacity(
                      opacity: _timelineAnims[stepIdx].value,
                      child: Column(
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: isDone ? _success : _border,
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: isDone
                                  ? const Icon(Icons.check,
                                      color: Colors.white, size: 14)
                                  : Text('${stepIdx + 1}',
                                      style: const TextStyle(
                                          fontSize: 11,
                                          color: _textMuted,
                                          fontWeight: FontWeight.w700)),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            timelineSteps[stepIdx],
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: isDone ? _success : _textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ),
            ),

            const SizedBox(height: 12),

            // Parties
            _SectionCard(
              title: 'PARTIES',
              child: Row(
                children: [
                  Expanded(
                    child: _PartyDetailBlock(
                      role: 'CONTRACTOR',
                      name: agr.contractorName,
                      icon: Icons.business,
                      color: const Color(0xFF8B5CF6),
                    ),
                  ),
                  Container(
                    width: 1,
                    height: 60,
                    color: _border,
                    margin: const EdgeInsets.symmetric(horizontal: 12),
                  ),
                  Expanded(
                    child: _PartyDetailBlock(
                      role: 'WORKER',
                      name: agr.workerName,
                      icon: Icons.engineering,
                      color: const Color(0xFFF59E0B),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Scope
            _SectionCard(
              title: 'SCOPE OF WORK',
              child: Text(
                '${agr.jobTitle}\n\nThe worker agrees to provide professional services as outlined for the duration of this agreement. Work shall be performed at the designated construction site in compliance with all safety regulations and quality standards.',
                style: const TextStyle(
                    fontSize: 13, color: _textSecondary, height: 1.6),
              ),
            ),

            const SizedBox(height: 12),

            // Terms – each row fades in line by line
            _SectionCard(
              title: 'TERMS',
              child: Column(
                children: termItems.asMap().entries.map((e) {
                  final idx = e.key.clamp(0, _termsFadeAnims.length - 1);
                  return FadeTransition(
                    opacity: _termsFadeAnims[idx],
                    child: _TermRow(
                        label: e.value.label, value: e.value.value),
                  );
                }).toList(),
              ),
            ),

            if (isActive) ...[
              const SizedBox(height: 12),
              _SectionCard(
                title: 'PROGRESS',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Completion',
                            style: TextStyle(
                                fontSize: 13, color: _textSecondary)),
                        const Text('40%',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: _navy)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0.0, end: 0.4),
                      duration: const Duration(milliseconds: 1000),
                      curve: Curves.easeOutCubic,
                      builder: (_, v, __) => ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: v,
                          backgroundColor: _border,
                          valueColor:
                              const AlwaysStoppedAnimation<Color>(_success),
                          minHeight: 8,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 12),

            // Signatures
            _SectionCard(
              title: 'SIGNATURES',
              child: Row(
                children: [
                  Expanded(
                    child: _SignatureBox(
                      role: 'Contractor',
                      name: agr.contractorName,
                      signed: true,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _SignatureBox(
                      role: 'Worker',
                      name: agr.workerName,
                      signed: !isPending,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Action buttons slide up from bottom with stagger
            if (isPending || isActive)
              SlideTransition(
                position: _buttonsSlide,
                child: FadeTransition(
                  opacity: _buttonsCtrl,
                  child: Column(
                    children: [
                      if (isPending)
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.draw, size: 18),
                            label: const Text('Sign Agreement',
                                style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 15)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _amber,
                              foregroundColor: Colors.white,
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                              elevation: 0,
                            ),
                          ),
                        ),
                      if (isPending) const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            foregroundColor: _error,
                            side: const BorderSide(color: _error),
                            padding:
                                const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          child: const Text('Cancel Agreement',
                              style:
                                  TextStyle(fontWeight: FontWeight.w700)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _TermData {
  final String label;
  final String value;
  const _TermData(this.label, this.value);
}

class _SectionCard extends StatelessWidget {
  final String title;
  final Widget child;

  const _SectionCard({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: _textMuted,
                letterSpacing: 1.2,
              )),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _PartyDetailBlock extends StatelessWidget {
  final String role;
  final String name;
  final IconData icon;
  final Color color;

  const _PartyDetailBlock({
    required this.role,
    required this.name,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        const SizedBox(height: 8),
        Text(role,
            style: const TextStyle(
                fontSize: 9,
                color: _textMuted,
                fontWeight: FontWeight.w600,
                letterSpacing: 1)),
        const SizedBox(height: 3),
        Text(name,
            textAlign: TextAlign.center,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: _navy)),
      ],
    );
  }
}

class _TermRow extends StatelessWidget {
  final String label;
  final String value;

  const _TermRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 13, color: _textSecondary)),
          Text(value,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: _navy)),
        ],
      ),
    );
  }
}

class _SignatureBox extends StatelessWidget {
  final String role;
  final String name;
  final bool signed;

  const _SignatureBox(
      {required this.role, required this.name, required this.signed});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: signed
            ? _success.withValues(alpha: 0.06)
            : _amber.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: signed
              ? _success.withValues(alpha: 0.3)
              : _amber.withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        children: [
          Text(role, style: const TextStyle(fontSize: 10, color: _textMuted)),
          const SizedBox(height: 4),
          Text(name,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: _navy)),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                signed ? Icons.check_circle : Icons.access_time,
                size: 14,
                color: signed ? _success : _amber,
              ),
              const SizedBox(width: 4),
              Text(
                signed ? 'Signed ✓' : 'Pending',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: signed ? _success : _amber,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Agreement Screen – 3-step wizard with animations
// ─────────────────────────────────────────────────────────────────────────────

class CreateAgreementScreen extends StatefulWidget {
  const CreateAgreementScreen({super.key});

  @override
  State<CreateAgreementScreen> createState() => _CreateAgreementScreenState();
}

class _CreateAgreementScreenState extends State<CreateAgreementScreen>
    with TickerProviderStateMixin {
  int _step = 0;
  String? _selectedWorker;
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _startCtrl = TextEditingController(text: '2026-05-01');
  final _endCtrl = TextEditingController(text: '2026-07-31');
  final _rateCtrl = TextEditingController(text: '15000');
  final _locationCtrl = TextEditingController(text: 'Hyderabad, Block A');
  String _rateType = 'Monthly';
  String _search = '';
  bool _submitted = false;

  late AnimationController _pulseCtrl;
  late Animation<double> _pulse;

  final _workers = [
    'Vijay Kumar',
    'Suresh Reddy',
    'Anil Sharma',
    'Ravi Naidu',
    'Pradeep Singh',
  ];

  // Per-step field animations
  late AnimationController _fieldCtrl;
  List<Animation<double>> _fieldFadeAnims = [];
  List<Animation<Offset>> _fieldSlideAnims = [];

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
    _pulse = Tween<double>(begin: 1.0, end: 1.04)
        .animate(CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));

    _fieldCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _rebuildFieldAnims(7);
    _fieldCtrl.forward();
  }

  void _rebuildFieldAnims(int count) {
    _fieldFadeAnims = [];
    _fieldSlideAnims = [];
    for (var i = 0; i < count; i++) {
      final start = (i * 0.1).clamp(0.0, 0.7);
      final end = (start + 0.35).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _fieldFadeAnims.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _fieldCtrl, curve: interval)));
      _fieldSlideAnims.add(Tween<Offset>(
        begin: const Offset(0, 0.3),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: _fieldCtrl, curve: interval)));
    }
  }

  void _nextStep() {
    setState(() => _step++);
    _fieldCtrl.reset();
    _fieldCtrl.forward();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _startCtrl.dispose();
    _endCtrl.dispose();
    _rateCtrl.dispose();
    _locationCtrl.dispose();
    _pulseCtrl.dispose();
    _fieldCtrl.dispose();
    super.dispose();
  }

  Widget _animatedField(int idx, Widget child) {
    final safeIdx = idx.clamp(0, _fieldFadeAnims.length - 1);
    return FadeTransition(
      opacity: _fieldFadeAnims[safeIdx],
      child: SlideTransition(
        position: _fieldSlideAnims[safeIdx],
        child: child,
      ),
    );
  }

  Widget _buildStep0() {
    final filtered = _workers
        .where((w) => w.toLowerCase().contains(_search.toLowerCase()))
        .toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _animatedField(
          0,
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Select Worker',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: _navy)),
              SizedBox(height: 4),
              Text('Choose the worker for this agreement',
                  style:
                      TextStyle(color: _textSecondary, fontSize: 13)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _animatedField(
          1,
          TextField(
            onChanged: (v) => setState(() => _search = v),
            decoration: InputDecoration(
              hintText: 'Search workers...',
              prefixIcon: const Icon(Icons.search, color: _textMuted),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: _border)),
              enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: _border)),
              focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide:
                      const BorderSide(color: _amber, width: 2)),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
        ),
        const SizedBox(height: 12),
        ...filtered.asMap().entries.map((e) {
          final w = e.value;
          return _animatedField(
            e.key + 2,
            GestureDetector(
              onTap: () => setState(() => _selectedWorker = w),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: _selectedWorker == w ? _amberBg : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _selectedWorker == w ? _amber : _border,
                    width: _selectedWorker == w ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B)
                            .withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(w[0],
                            style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFF59E0B),
                                fontSize: 16)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(w,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: _navy,
                                  fontSize: 14)),
                          const Text('Construction Worker',
                              style: TextStyle(
                                  color: _textMuted, fontSize: 11)),
                        ],
                      ),
                    ),
                    if (_selectedWorker == w)
                      const Icon(Icons.check_circle,
                          color: _amber, size: 20),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _animatedField(
          0,
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Job Details',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: _navy)),
              SizedBox(height: 4),
              Text('Fill in the job information',
                  style: TextStyle(color: _textSecondary, fontSize: 13)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _animatedField(
          1,
          _FormField(
              ctrl: _titleCtrl,
              label: 'Job Title',
              hint: 'e.g. Site Supervisor – Block A'),
        ),
        const SizedBox(height: 12),
        _animatedField(
          2,
          _FormField(
              ctrl: _descCtrl,
              label: 'Description',
              hint: 'Describe the scope of work',
              maxLines: 3),
        ),
        const SizedBox(height: 12),
        _animatedField(
          3,
          Row(
            children: [
              Expanded(
                  child: _FormField(
                      ctrl: _startCtrl,
                      label: 'Start Date',
                      hint: 'YYYY-MM-DD')),
              const SizedBox(width: 12),
              Expanded(
                  child: _FormField(
                      ctrl: _endCtrl,
                      label: 'End Date',
                      hint: 'YYYY-MM-DD')),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _animatedField(
          4,
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Rate Type',
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: _navy)),
              const SizedBox(height: 8),
              Row(
                children: ['Daily', 'Weekly', 'Monthly'].map((t) {
                  final sel = _rateType == t;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setState(() => _rateType = t),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: sel ? _amber : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: sel ? _amber : _border),
                        ),
                        child: Text(t,
                            style: TextStyle(
                              color:
                                  sel ? Colors.white : _textSecondary,
                              fontWeight: sel
                                  ? FontWeight.w700
                                  : FontWeight.w500,
                              fontSize: 13,
                            )),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _animatedField(
          5,
          _FormField(
              ctrl: _rateCtrl,
              label: 'Rate Amount (₹)',
              hint: 'e.g. 15000',
              keyboardType: TextInputType.number),
        ),
        const SizedBox(height: 12),
        _animatedField(
          6,
          _FormField(
              ctrl: _locationCtrl,
              label: 'Location',
              hint: 'Site address'),
        ),
      ],
    );
  }

  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _animatedField(
          0,
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Preview Agreement',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: _navy)),
              SizedBox(height: 4),
              Text('Review before confirming',
                  style:
                      TextStyle(color: _textSecondary, fontSize: 13)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _animatedField(
          1,
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: _navy,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              children: [
                Text('SERVICE AGREEMENT',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2,
                    )),
                SizedBox(height: 4),
                Text('DRAFT – AGR-NEW',
                    style:
                        TextStyle(color: Colors.white38, fontSize: 12)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        _animatedField(2,
            _PreviewRow('Worker', _selectedWorker ?? '—')),
        _animatedField(
            3,
            _PreviewRow('Job Title',
                _titleCtrl.text.isEmpty ? '—' : _titleCtrl.text)),
        _animatedField(4, _PreviewRow('Start Date', _startCtrl.text)),
        _animatedField(5, _PreviewRow('End Date', _endCtrl.text)),
        _animatedField(6,
            _PreviewRow('Rate Type', _rateType)),
        _animatedField(
            7,
            _PreviewRow(
                'Rate Amount',
                _rateCtrl.text.isEmpty
                    ? '—'
                    : '₹${_rateCtrl.text}')),
        const SizedBox(height: 16),
        _animatedField(
          8,
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: _amberBg,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: _amber.withValues(alpha: 0.4)),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline, color: _amber, size: 18),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Once confirmed, the agreement will be sent to the worker for signature.',
                    style: TextStyle(
                        fontSize: 12, color: Color(0xFF92400E)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: _navy),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('New Agreement',
            style: TextStyle(
                color: _navy,
                fontWeight: FontWeight.w700,
                fontSize: 16)),
      ),
      body: Column(
        children: [
          // Step indicator
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(
                horizontal: 24, vertical: 16),
            child: Row(
              children: List.generate(3, (i) {
                final done = i < _step;
                final current = i == _step;
                final labels = [
                  'Select Worker',
                  'Job Details',
                  'Preview'
                ];
                return Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              width: 28,
                              height: 28,
                              decoration: BoxDecoration(
                                color: done
                                    ? _success
                                    : (current ? _amber : _border),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: done
                                    ? const Icon(Icons.check,
                                        color: Colors.white, size: 14)
                                    : Text('${i + 1}',
                                        style: TextStyle(
                                          color: current
                                              ? Colors.white
                                              : _textMuted,
                                          fontWeight: FontWeight.w700,
                                          fontSize: 12,
                                        )),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(labels[i],
                                style: TextStyle(
                                  fontSize: 9,
                                  color: current ? _amber : _textMuted,
                                  fontWeight: current
                                      ? FontWeight.w700
                                      : FontWeight.w400,
                                )),
                          ],
                        ),
                      ),
                      if (i < 2)
                        Expanded(
                          child: Container(
                            height: 1.5,
                            margin: const EdgeInsets.only(bottom: 18),
                            color: i < _step ? _success : _border,
                          ),
                        ),
                    ],
                  ),
                );
              }),
            ),
          ),

          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                transitionBuilder: (child, animation) {
                  final slide = Tween<Offset>(
                    begin: const Offset(1, 0),
                    end: Offset.zero,
                  ).animate(CurvedAnimation(
                      parent: animation, curve: Curves.easeOut));
                  return SlideTransition(
                      position: slide, child: child);
                },
                child: KeyedSubtree(
                  key: ValueKey(_step),
                  child: _step == 0
                      ? _buildStep0()
                      : (_step == 1 ? _buildStep1() : _buildStep2()),
                ),
              ),
            ),
          ),

          // Navigation
          Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            color: Colors.white,
            child: Row(
              children: [
                if (_step > 0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() => _step--);
                        _fieldCtrl.reset();
                        _fieldCtrl.forward();
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _navy,
                        side: const BorderSide(color: _border),
                        padding:
                            const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Back',
                          style:
                              TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                if (_step > 0) const SizedBox(width: 12),
                Expanded(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _submitted
                        ? Container(
                            key: const ValueKey('success'),
                            padding:
                                const EdgeInsets.symmetric(vertical: 14),
                            decoration: BoxDecoration(
                              color: _success,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.check_circle,
                                    color: Colors.white, size: 20),
                                SizedBox(width: 8),
                                Text('Sent!',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 15)),
                              ],
                            ),
                          )
                        : ScaleTransition(
                            key: const ValueKey('button'),
                            scale: _step == 2 ? _pulse : const AlwaysStoppedAnimation(1.0),
                            child: ElevatedButton(
                              onPressed: () {
                                if (_step < 2) {
                                  _nextStep();
                                } else {
                                  setState(() => _submitted = true);
                                  final nav = Navigator.of(context);
                                  Future.delayed(
                                      const Duration(
                                          milliseconds: 1500),
                                      () {
                                    if (!mounted) return;
                                    nav.pop();
                                  });
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _amber,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                    vertical: 14),
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                        BorderRadius.circular(12)),
                                elevation: 0,
                              ),
                              child: Text(
                                _step == 2
                                    ? 'Confirm & Send'
                                    : 'Next',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 15),
                              ),
                            ),
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

class _FormField extends StatelessWidget {
  final TextEditingController ctrl;
  final String label;
  final String hint;
  final int maxLines;
  final TextInputType? keyboardType;

  const _FormField({
    required this.ctrl,
    required this.label,
    required this.hint,
    this.maxLines = 1,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: ctrl,
      maxLines: maxLines,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        hintStyle: const TextStyle(color: _textMuted, fontSize: 13),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _border)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _border)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _amber, width: 2)),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(
            horizontal: 14, vertical: 12),
      ),
    );
  }
}

class _PreviewRow extends StatelessWidget {
  final String label;
  final String value;

  const _PreviewRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: _border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 13, color: _textSecondary)),
          Text(value,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: _navy)),
        ],
      ),
    );
  }
}
