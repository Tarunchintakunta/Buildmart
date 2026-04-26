import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

// ─────────────────────────────────────────────────────────────────────────────
// Confetti painter — simple colored squares falling
// ─────────────────────────────────────────────────────────────────────────────

class _ConfettiPainter extends CustomPainter {
  final double progress; // 0 → 1
  final List<_ConfettiParticle> particles;

  _ConfettiPainter({required this.progress, required this.particles});

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in particles) {
      final x = p.x * size.width;
      final y = p.startY + (size.height - p.startY) * progress * p.speed;
      final opacity = (1.0 - progress * 0.8).clamp(0.0, 1.0);
      final paint = Paint()
        ..color = p.color.withValues(alpha: opacity)
        ..style = PaintingStyle.fill;

      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(progress * p.rotationSpeed * math.pi * 4);
      canvas.drawRect(
        Rect.fromCenter(
            center: Offset.zero, width: p.size, height: p.size),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_ConfettiPainter old) => old.progress != progress;
}

class _ConfettiParticle {
  final double x;
  final double startY;
  final double size;
  final double speed;
  final double rotationSpeed;
  final Color color;

  const _ConfettiParticle({
    required this.x,
    required this.startY,
    required this.size,
    required this.speed,
    required this.rotationSpeed,
    required this.color,
  });
}

List<_ConfettiParticle> _generateParticles(int count) {
  final rng = math.Random(42);
  final colors = [_amber, _success, const Color(0xFF3B82F6), _navy, Colors.pink, Colors.purple];
  return List.generate(count, (i) {
    return _ConfettiParticle(
      x: rng.nextDouble(),
      startY: -20 - rng.nextDouble() * 80,
      size: 6 + rng.nextDouble() * 8,
      speed: 0.6 + rng.nextDouble() * 0.4,
      rotationSpeed: 0.5 + rng.nextDouble(),
      color: colors[i % colors.length],
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Pulsing camera border
// ─────────────────────────────────────────────────────────────────────────────

class _PulsingCameraBorder extends StatefulWidget {
  final bool hasPhoto;
  final VoidCallback onTap;

  const _PulsingCameraBorder({
    required this.hasPhoto,
    required this.onTap,
  });

  @override
  State<_PulsingCameraBorder> createState() => _PulsingCameraBorderState();
}

class _PulsingCameraBorderState extends State<_PulsingCameraBorder>
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
    if (widget.hasPhoto) {
      // static success state
      return GestureDetector(
        onTap: widget.onTap,
        child: Container(
          width: double.infinity,
          height: 200,
          decoration: BoxDecoration(
            color: _success.withValues(alpha: 0.08),
            border: Border.all(color: _success, width: 2),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: _success.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child:
                    const Icon(Icons.check_circle, color: _success, size: 36),
              ),
              const SizedBox(height: 12),
              const Text(
                'Photo Added',
                style: TextStyle(
                    color: _success,
                    fontWeight: FontWeight.w700,
                    fontSize: 16),
              ),
              const SizedBox(height: 4),
              TextButton(
                onPressed: widget.onTap,
                child: const Text(
                  'Change Photo',
                  style: TextStyle(color: _textSecondary, fontSize: 13),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, child) {
          final borderColor = Color.lerp(
            _border,
            _amber.withValues(alpha: 0.7),
            _ctrl.value,
          )!;
          return Container(
            width: double.infinity,
            height: 200,
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: borderColor, width: 1.5),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: _navy.withValues(alpha: 0.06),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt_outlined,
                      color: _textSecondary, size: 32),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Tap to add photo',
                  style: TextStyle(
                      color: _textSecondary,
                      fontWeight: FontWeight.w600,
                      fontSize: 15),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Camera or Gallery',
                  style: TextStyle(color: _textMuted, fontSize: 12),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Capture button with scale bounce
// ─────────────────────────────────────────────────────────────────────────────

class _CaptureButton extends StatefulWidget {
  final VoidCallback onTap;
  const _CaptureButton({required this.onTap});

  @override
  State<_CaptureButton> createState() => _CaptureButtonState();
}

class _CaptureButtonState extends State<_CaptureButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _scale = Tween<double>(begin: 1.0, end: 0.88).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _handleTap() {
    _ctrl.forward().then((_) {
      _ctrl.reverse().then((_) => widget.onTap());
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: GestureDetector(
        onTap: _handleTap,
        child: Container(
          width: 64,
          height: 64,
          decoration: const BoxDecoration(
            color: _amber,
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.camera_alt, color: Colors.white, size: 28),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delivery Proof Screen
// ─────────────────────────────────────────────────────────────────────────────

class DeliveryProofScreen extends StatefulWidget {
  const DeliveryProofScreen({super.key});

  @override
  State<DeliveryProofScreen> createState() => _DeliveryProofScreenState();
}

class _DeliveryProofScreenState extends State<DeliveryProofScreen>
    with TickerProviderStateMixin {
  bool _hasPhoto = false;
  final List<TextEditingController> _otpControllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _otpFocusNodes =
      List.generate(6, (_) => FocusNode());
  bool _isSubmitting = false;
  bool _isSuccess = false;

  // Check mark scale
  late AnimationController _checkAnimController;
  late Animation<double> _checkScale;

  // OTP fields stagger
  late AnimationController _otpStaggerCtrl;

  // Confetti
  late AnimationController _confettiCtrl;
  final List<_ConfettiParticle> _particles = _generateParticles(40);

  @override
  void initState() {
    super.initState();

    _checkAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _checkScale = CurvedAnimation(
      parent: _checkAnimController,
      curve: Curves.elasticOut,
    );

    _otpStaggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..forward();

    _confettiCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );
  }

  @override
  void dispose() {
    for (final c in _otpControllers) {
      c.dispose();
    }
    for (final f in _otpFocusNodes) {
      f.dispose();
    }
    _checkAnimController.dispose();
    _otpStaggerCtrl.dispose();
    _confettiCtrl.dispose();
    super.dispose();
  }

  String get _otpValue =>
      _otpControllers.map((c) => c.text).join();
  bool get _canSubmit => _hasPhoto && _otpValue.length == 6;

  void _showPhotoDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Add Photo',
          style:
              TextStyle(fontWeight: FontWeight.w700, color: _navy),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _PhotoOption(
              icon: Icons.camera_alt,
              label: 'Camera',
              onTap: () {
                Navigator.pop(ctx);
                setState(() => _hasPhoto = true);
              },
            ),
            _PhotoOption(
              icon: Icons.photo_library,
              label: 'Gallery',
              onTap: () {
                Navigator.pop(ctx);
                setState(() => _hasPhoto = true);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitProof() async {
    if (!_canSubmit) return;
    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    setState(() {
      _isSubmitting = false;
      _isSuccess = true;
    });
    _checkAnimController.forward();
    _confettiCtrl.forward();
  }

  @override
  Widget build(BuildContext context) {
    if (_isSuccess) return _buildSuccessScreen();

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text(
          'Delivery Proof',
          style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 18),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInstructionsCard(),
            const SizedBox(height: 20),
            const Text(
              'Delivery Photo',
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: _navy),
            ),
            const SizedBox(height: 10),
            _PulsingCameraBorder(
              hasPhoto: _hasPhoto,
              onTap: _showPhotoDialog,
            ),
            // Show capture shortcut button below
            if (!_hasPhoto) ...[
              const SizedBox(height: 12),
              Center(child: _CaptureButton(onTap: _showPhotoDialog)),
            ],
            const SizedBox(height: 24),
            const Text(
              'Customer OTP',
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: _navy),
            ),
            const SizedBox(height: 6),
            const Text(
              'Ask the customer for the 6-digit OTP from their app',
              style: TextStyle(fontSize: 13, color: _textSecondary),
            ),
            const SizedBox(height: 14),
            _buildOtpRow(),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: ElevatedButton(
                  key: ValueKey(_isSubmitting),
                  onPressed: _canSubmit ? _submitProof : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _amber,
                    disabledBackgroundColor: _border,
                    foregroundColor: Colors.white,
                    disabledForegroundColor: _textMuted,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2.5),
                        )
                      : const Text(
                          'Submit Proof',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w700),
                        ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildInstructionsCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _amberBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _amber.withValues(alpha: 0.3)),
      ),
      child: const Row(
        children: [
          Icon(Icons.info_outline, color: _amber, size: 22),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Take a photo of the delivered items at the customer\'s location',
              style: TextStyle(
                  color: Color(0xFF92400E),
                  fontSize: 13,
                  fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOtpRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (index) {
        // Each digit slides in from bottom with 60ms stagger
        final startInterval =
            ((index * 60) / 700.0).clamp(0.0, 0.85);
        final endInterval =
            (startInterval + 0.4).clamp(0.0, 1.0);
        final slideAnim = Tween<Offset>(
          begin: const Offset(0, 0.6),
          end: Offset.zero,
        ).animate(CurvedAnimation(
          parent: _otpStaggerCtrl,
          curve: Interval(startInterval, endInterval,
              curve: Curves.easeOut),
        ));
        final fadeAnim = Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(
            parent: _otpStaggerCtrl,
            curve: Interval(startInterval, endInterval,
                curve: Curves.easeIn),
          ),
        );

        return FadeTransition(
          opacity: fadeAnim,
          child: SlideTransition(
            position: slideAnim,
            child: SizedBox(
              width: 48,
              height: 56,
              child: TextField(
                controller: _otpControllers[index],
                focusNode: _otpFocusNodes[index],
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                maxLength: 1,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly
                ],
                style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _navy),
                decoration: InputDecoration(
                  counterText: '',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide:
                        const BorderSide(color: _border, width: 1.5),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide:
                        const BorderSide(color: _border, width: 1.5),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide:
                        const BorderSide(color: _amber, width: 2),
                  ),
                  filled: true,
                  fillColor: Colors.white,
                ),
                onChanged: (v) {
                  setState(() {});
                  if (v.isNotEmpty && index < 5) {
                    _otpFocusNodes[index + 1].requestFocus();
                  } else if (v.isEmpty && index > 0) {
                    _otpFocusNodes[index - 1].requestFocus();
                  }
                },
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildSuccessScreen() {
    return Scaffold(
      backgroundColor: _navy,
      body: SafeArea(
        child: Stack(
          children: [
            // Confetti
            AnimatedBuilder(
              animation: _confettiCtrl,
              builder: (context, child) => CustomPaint(
                painter: _ConfettiPainter(
                  progress: _confettiCtrl.value,
                  particles: _particles,
                ),
                child: const SizedBox.expand(),
              ),
            ),
            // Content
            Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ScaleTransition(
                      scale: _checkScale,
                      child: Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: _success,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: _success.withValues(alpha: 0.4),
                              blurRadius: 24,
                              spreadRadius: 4,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.check,
                            color: Colors.white, size: 52),
                      ),
                    ),
                    const SizedBox(height: 28),
                    const Text(
                      'Delivery Confirmed!',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Proof submitted successfully.\nPayment will be released shortly.',
                      textAlign: TextAlign.center,
                      style:
                          TextStyle(color: Colors.white70, fontSize: 15),
                    ),
                    const SizedBox(height: 40),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _amber,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text(
                          'Back to Deliveries',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PhotoOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _PhotoOption(
      {required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: _navy.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: _navy, size: 22),
            ),
            const SizedBox(width: 14),
            Text(
              label,
              style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: _navy),
            ),
          ],
        ),
      ),
    );
  }
}
