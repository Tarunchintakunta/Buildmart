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
const _error = Color(0xFFEF4444);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

final _rateFmt = NumberFormat('##,##,###', 'en_IN');

enum _JobType { daily, weekly, monthly }

// ─── Hire Screen ──────────────────────────────────────────────────────────────

class HireScreen extends ConsumerStatefulWidget {
  final String workerId;
  final Object? extra;

  const HireScreen({super.key, required this.workerId, this.extra});

  @override
  ConsumerState<HireScreen> createState() => _HireScreenState();
}

class _HireScreenState extends ConsumerState<HireScreen>
    with TickerProviderStateMixin {
  WorkerModel? _worker;

  _JobType _jobType = _JobType.daily;
  int _duration = 1;
  final TextEditingController _locationController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  // Button state: idle / loading / success
  _BtnState _btnState = _BtnState.idle;

  // Entrance stagger
  late AnimationController _entranceCtrl;

  // Pulsing glow for button
  late AnimationController _glowCtrl;

  // Animated underline for job type tabs
  int _selectedTabIndex = 0;

  // Total price animation
  double _displayedTotal = 0;

  @override
  void initState() {
    super.initState();

    _resolveWorker();

    _entranceCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();

    _glowCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);

    _displayedTotal = _totalCost;
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
    _locationController.dispose();
    _descriptionController.dispose();
    _entranceCtrl.dispose();
    _glowCtrl.dispose();
    super.dispose();
  }

  int get _effectiveRate {
    final w = _worker!;
    switch (_jobType) {
      case _JobType.daily:
        return w.dailyRate;
      case _JobType.weekly:
        return (w.dailyRate * 6).round();
      case _JobType.monthly:
        return (w.dailyRate * 24).round();
    }
  }

  double get _totalCost => _effectiveRate * _duration.toDouble();

  String get _durationLabel {
    switch (_jobType) {
      case _JobType.daily:
        return _duration == 1 ? '1 day' : '$_duration days';
      case _JobType.weekly:
        return _duration == 1 ? '1 week' : '$_duration weeks';
      case _JobType.monthly:
        return _duration == 1 ? '1 month' : '$_duration months';
    }
  }

  void _changeType(int idx) {
    setState(() {
      _selectedTabIndex = idx;
      _jobType = _JobType.values[idx];
      _duration = 1;
      _displayedTotal = _totalCost;
    });
  }

  void _changeDuration(int delta) {
    final maxDuration = _jobType == _JobType.daily
        ? 30
        : (_jobType == _JobType.weekly ? 12 : 6);
    final newDuration = _duration + delta;
    if (newDuration < 1 || newDuration > maxDuration) return;
    setState(() {
      _duration = newDuration;
      _displayedTotal = _totalCost;
    });
  }

  void _confirmHire() async {
    if (_locationController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter work location'),
          backgroundColor: _error,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _btnState = _BtnState.loading);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    setState(() => _btnState = _BtnState.success);
    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;

    _showConfirmationDialog();
    setState(() => _btnState = _BtnState.idle);
  }

  void _showConfirmationDialog() {
    final w = _worker!;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: _success, size: 28),
            SizedBox(width: 10),
            Text('Hire Confirmed!',
                style: TextStyle(color: _navy, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${w.name} has been notified.',
                style: const TextStyle(color: _textSecondary)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                  color: _bg, borderRadius: BorderRadius.circular(10)),
              child: Column(
                children: [
                  _ConfirmRow('Worker', w.name),
                  _ConfirmRow('Duration', _durationLabel),
                  _ConfirmRow('Location', _locationController.text.trim()),
                  _ConfirmRow('Total', '₹${_rateFmt.format(_totalCost)}'),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: _amberBg,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: _amber.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.lock_outline, size: 16, color: _amber),
                  SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Funds held in escrow until job complete.',
                      style: TextStyle(
                          color: _amber, fontSize: 12, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: _navy,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              context.go('/workers');
            },
            child: const Text('Done', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // Stagger helper
  Animation<double> _entrance(int step) => CurvedAnimation(
    parent: _entranceCtrl,
    curve: Interval(
      (step * 0.1).clamp(0.0, 0.7),
      (step * 0.1 + 0.3).clamp(0.0, 1.0),
      curve: Curves.easeOutCubic,
    ),
  );

  Widget _staggered(int step, Widget child) {
    final anim = _entrance(step);
    return AnimatedBuilder(
      animation: anim,
      builder: (_, c) => FadeTransition(
        opacity: anim,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 0.3),
            end: Offset.zero,
          ).animate(anim),
          child: c,
        ),
      ),
      child: child,
    );
  }

  @override
  Widget build(BuildContext context) {
    final w = _worker!;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Hire Worker',
          style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
        ),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _staggered(0, _buildWorkerMiniCard(w)),
                const SizedBox(height: 20),
                _staggered(1, _buildJobTypeSelector()),
                const SizedBox(height: 20),
                _staggered(2, _buildDurationStepper()),
                const SizedBox(height: 20),
                _staggered(3, _buildLocationField()),
                const SizedBox(height: 20),
                _staggered(4, _buildDescriptionField()),
                const SizedBox(height: 20),
                _staggered(5, _buildTotalCard()),
                const SizedBox(height: 20),
                _staggered(6, _buildEscrowNote()),
                const SizedBox(height: 100),
              ],
            ),
          ),
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildWorkerMiniCard(WorkerModel w) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.8, end: 1.0),
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeOutBack,
      builder: (_, scale, child) => Transform.scale(scale: scale, child: child),
      child: Container(
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
        child: Row(
          children: [
            ClipOval(
              child: CachedNetworkImage(
                imageUrl: w.photoUrl,
                width: 52,
                height: 52,
                fit: BoxFit.cover,
                placeholder: (context, url) =>
                    Container(width: 52, height: 52, color: _bg),
                errorWidget: (context, url, err) => Container(
                  width: 52,
                  height: 52,
                  color: _bg,
                  child: const Icon(Icons.person, color: _textMuted),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(w.name,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          color: _navy)),
                  const SizedBox(height: 2),
                  Text(w.skill,
                      style: const TextStyle(color: _amber, fontSize: 13)),
                  Text(w.location,
                      style: const TextStyle(
                          color: _textSecondary, fontSize: 12)),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text('₹${_rateFmt.format(w.dailyRate)}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: _navy)),
                const Text('per day',
                    style: TextStyle(color: _textMuted, fontSize: 11)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJobTypeSelector() {
    const labels = ['Daily', 'Weekly', 'Monthly'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Job Type',
            style: TextStyle(
                fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Stack(
            children: [
              // Animated amber underline
              LayoutBuilder(builder: (context, constraints) {
                final tabWidth = constraints.maxWidth / 3;
                return TweenAnimationBuilder<double>(
                  tween: Tween(
                    begin: _selectedTabIndex.toDouble(),
                    end: _selectedTabIndex.toDouble(),
                  ),
                  duration: const Duration(milliseconds: 250),
                  curve: Curves.easeOutCubic,
                  builder: (_, v, __) => Positioned(
                    bottom: 0,
                    left: tabWidth * v,
                    child: Container(
                      width: tabWidth,
                      height: 3,
                      decoration: BoxDecoration(
                        color: _amber,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                );
              }),
              Row(
                children: List.generate(3, (idx) {
                  final isSelected = _selectedTabIndex == idx;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => _changeType(idx),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? _amber.withValues(alpha: 0.08)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(9),
                        ),
                        alignment: Alignment.center,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              labels[idx],
                              style: TextStyle(
                                color: isSelected ? _amber : _textSecondary,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 2),
                            AnimatedSwitcher(
                              duration: const Duration(milliseconds: 250),
                              transitionBuilder: (child, anim) =>
                                  FadeTransition(opacity: anim, child: child),
                              child: isSelected
                                  ? Text(
                                      key: ValueKey('rate_$idx'),
                                      _rateForType(_JobType.values[idx]),
                                      style: const TextStyle(
                                          color: _amber,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500),
                                    )
                                  : const SizedBox.shrink(
                                      key: ValueKey('empty')),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _rateForType(_JobType t) {
    final w = _worker!;
    switch (t) {
      case _JobType.daily:
        return '₹${_rateFmt.format(w.dailyRate)}/day';
      case _JobType.weekly:
        return '₹${_rateFmt.format(w.dailyRate * 6)}/wk';
      case _JobType.monthly:
        return '₹${_rateFmt.format(w.dailyRate * 24)}/mo';
    }
  }

  Widget _buildDurationStepper() {
    final maxDuration = _jobType == _JobType.daily
        ? 30
        : (_jobType == _JobType.weekly ? 12 : 6);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Duration (max $maxDuration)',
          style: const TextStyle(
              fontWeight: FontWeight.w600, fontSize: 15, color: _navy),
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _StepperButton(
                icon: Icons.remove,
                enabled: _duration > 1,
                onTap: () => _changeDuration(-1),
              ),
              // AnimatedSwitcher flips vertically when number changes
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                transitionBuilder: (child, anim) => SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, -0.5),
                    end: Offset.zero,
                  ).animate(anim),
                  child: FadeTransition(opacity: anim, child: child),
                ),
                child: Column(
                  key: ValueKey(_duration),
                  children: [
                    Text(
                      '$_duration',
                      style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: _navy),
                    ),
                    Text(
                      _durationLabel,
                      style: const TextStyle(
                          color: _textSecondary, fontSize: 13),
                    ),
                  ],
                ),
              ),
              _StepperButton(
                icon: Icons.add,
                enabled: _duration < maxDuration,
                onTap: () => _changeDuration(1),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLocationField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Work Location',
            style: TextStyle(
                fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(10),
          ),
          child: TextField(
            controller: _locationController,
            decoration: InputDecoration(
              hintText: 'e.g. Plot 12, Gachibowli, Hyd',
              hintStyle: const TextStyle(color: _textMuted),
              prefixIcon:
                  const Icon(Icons.location_on_outlined, color: _textSecondary),
              border: InputBorder.none,
              contentPadding:
                  const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDescriptionField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Job Description',
            style: TextStyle(
                fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(10),
          ),
          child: TextField(
            controller: _descriptionController,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Describe the work to be done (optional)',
              hintStyle: TextStyle(color: _textMuted),
              border: InputBorder.none,
              contentPadding: EdgeInsets.all(14),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTotalCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _navy,
        borderRadius: BorderRadius.circular(12),
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
                const Text('Estimated Total',
                    style: TextStyle(color: Colors.white60, fontSize: 13)),
                const SizedBox(height: 4),
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: _displayedTotal, end: _totalCost),
                  duration: const Duration(milliseconds: 500),
                  curve: Curves.easeOutCubic,
                  builder: (_, v, __) => Text(
                    '₹${_rateFmt.format(v.round())}',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                Text(
                  '₹${_rateFmt.format(_effectiveRate)} × $_durationLabel',
                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                ),
              ],
            ),
          ),
          const Icon(Icons.calculate_outlined, color: Colors.white38, size: 36),
        ],
      ),
    );
  }

  Widget _buildEscrowNote() {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeOutCubic,
      builder: (_, v, child) => Transform.translate(
        offset: Offset(0, 20 * (1 - v)),
        child: Opacity(opacity: v, child: child),
      ),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: _amberBg,
          border: Border.all(color: _amber.withValues(alpha: 0.4)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.lock_outline, color: _amber, size: 20),
            SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Escrow Payment',
                      style: TextStyle(
                          color: _amber,
                          fontWeight: FontWeight.bold,
                          fontSize: 14)),
                  SizedBox(height: 4),
                  Text(
                    'Your payment is held securely in escrow and released to the worker only after the job is completed and you approve the work.',
                    style: TextStyle(
                        color: Color(0xFF92400E), fontSize: 13, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
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
        child: _ConfirmPayButton(
          state: _btnState,
          glowCtrl: _glowCtrl,
          onTap: _btnState == _BtnState.idle ? _confirmHire : null,
        ),
      ),
    );
  }
}

// ─── Button States ────────────────────────────────────────────────────────────

enum _BtnState { idle, loading, success }

class _ConfirmPayButton extends StatelessWidget {
  final _BtnState state;
  final AnimationController glowCtrl;
  final VoidCallback? onTap;

  const _ConfirmPayButton({
    required this.state,
    required this.glowCtrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedBuilder(
        animation: glowCtrl,
        builder: (_, __) => AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: double.infinity,
          height: 52,
          decoration: BoxDecoration(
            color: state == _BtnState.success
                ? _success
                : state == _BtnState.loading
                    ? _amber.withValues(alpha: 0.8)
                    : _amber,
            borderRadius: BorderRadius.circular(12),
            boxShadow: state == _BtnState.idle
                ? [
                    BoxShadow(
                      color: _amber.withValues(
                          alpha: 0.3 + 0.3 * glowCtrl.value),
                      blurRadius: 8 + 8 * glowCtrl.value,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : [],
          ),
          alignment: Alignment.center,
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: _btnContent(),
          ),
        ),
      ),
    );
  }

  Widget _btnContent() {
    switch (state) {
      case _BtnState.idle:
        return const Text(
          key: ValueKey('idle'),
          'Confirm & Pay',
          style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
        );
      case _BtnState.loading:
        return const SizedBox(
          key: ValueKey('loading'),
          width: 24,
          height: 24,
          child: CircularProgressIndicator(
              color: Colors.white, strokeWidth: 2.5),
        );
      case _BtnState.success:
        return const Icon(
          key: ValueKey('success'),
          Icons.check_circle_outline,
          color: Colors.white,
          size: 28,
        );
    }
  }
}

// ─── Stepper Button ───────────────────────────────────────────────────────────

class _StepperButton extends StatefulWidget {
  final IconData icon;
  final bool enabled;
  final VoidCallback onTap;

  const _StepperButton({
    required this.icon,
    required this.enabled,
    required this.onTap,
  });

  @override
  State<_StepperButton> createState() => _StepperButtonState();
}

class _StepperButtonState extends State<_StepperButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _pressCtrl;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _pressCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 80),
      reverseDuration: const Duration(milliseconds: 200),
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 0.88).animate(
      CurvedAnimation(parent: _pressCtrl, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _pressCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        if (widget.enabled) _pressCtrl.forward();
      },
      onTapUp: (_) {
        _pressCtrl.reverse();
        if (widget.enabled) widget.onTap();
      },
      onTapCancel: () => _pressCtrl.reverse(),
      child: ScaleTransition(
        scale: _scaleAnim,
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: widget.enabled ? _navy : _bg,
            borderRadius: BorderRadius.circular(8),
          ),
          alignment: Alignment.center,
          child: Icon(
            widget.icon,
            color: widget.enabled ? Colors.white : _textMuted,
          ),
        ),
      ),
    );
  }
}

// ─── Confirm Row ──────────────────────────────────────────────────────────────

class _ConfirmRow extends StatelessWidget {
  final String label;
  final String value;
  const _ConfirmRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(label,
                style: const TextStyle(color: _textSecondary, fontSize: 13)),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: const TextStyle(
                  color: _navy,
                  fontWeight: FontWeight.w600,
                  fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
