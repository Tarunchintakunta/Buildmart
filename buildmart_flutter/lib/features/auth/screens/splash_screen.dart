import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/auth_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoCtrl;
  late AnimationController _progressCtrl;
  late Animation<double> _logoScale;
  late Animation<double> _logoFade;
  late Animation<double> _titleFade;
  late Animation<double> _subtitleFade;
  late Animation<double> _bottomFade;

  Timer? _navTimer;
  bool _navigated = false;

  @override
  void initState() {
    super.initState();

    _logoCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _progressCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );

    _logoScale = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _logoCtrl, curve: Curves.easeOutBack),
    );
    _logoFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
          parent: _logoCtrl, curve: const Interval(0.0, 0.5, curve: Curves.easeIn)),
    );
    _titleFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
          parent: _logoCtrl, curve: const Interval(0.4, 0.8, curve: Curves.easeIn)),
    );
    _subtitleFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
          parent: _logoCtrl, curve: const Interval(0.7, 1.0, curve: Curves.easeIn)),
    );
    _bottomFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
          parent: _progressCtrl,
          curve: const Interval(0.0, 0.4, curve: Curves.easeIn)),
    );

    _logoCtrl.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) _progressCtrl.forward();
    });

    // Navigate after 2.5 s
    _navTimer = Timer(const Duration(milliseconds: 2500), _doNavigate);
  }

  void _doNavigate() {
    if (!mounted || _navigated) return;
    _navigated = true;
    try {
      final isLoggedIn = ref.read(authProvider).isLoggedIn;
      if (isLoggedIn) {
        context.go('/home');
      } else {
        context.go('/login');
      }
    } catch (e) {
      // Fallback: push login directly
      if (mounted) context.go('/login');
    }
  }

  @override
  void dispose() {
    _navTimer?.cancel();
    _logoCtrl.dispose();
    _progressCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF1A1D2E);
    const amber = Color(0xFFF2960D);

    return GestureDetector(
      onTap: _doNavigate, // tap anywhere to skip
      child: Scaffold(
        backgroundColor: navy,
        body: SafeArea(
          child: Stack(
            children: [
              // ── Centre: logo + text ──
              Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Logo circle
                    FadeTransition(
                      opacity: _logoFade,
                      child: ScaleTransition(
                        scale: _logoScale,
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            color: amber,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: amber.withValues(alpha: 0.45),
                                blurRadius: 32,
                                spreadRadius: 6,
                              ),
                            ],
                          ),
                          child: const Icon(Icons.hardware,
                              size: 52, color: Colors.white),
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    // BuildMart
                    FadeTransition(
                      opacity: _titleFade,
                      child: const Text(
                        'BuildMart',
                        style: TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 1.4,
                        ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Tagline
                    FadeTransition(
                      opacity: _subtitleFade,
                      child: const Text(
                        'Construction Marketplace',
                        style: TextStyle(
                          fontSize: 16,
                          color: amber,
                          fontWeight: FontWeight.w500,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // ── Bottom: city + progress bar ──
              Positioned(
                left: 0,
                right: 0,
                bottom: 52,
                child: FadeTransition(
                  opacity: _bottomFade,
                  child: Column(
                    children: [
                      const Text(
                        "Hyderabad's #1 Construction Platform",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFF9CA3AF),
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 48),
                        child: AnimatedBuilder(
                          animation: _progressCtrl,
                          builder: (context, _) => ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: LinearProgressIndicator(
                              value: _progressCtrl.value,
                              backgroundColor:
                                  Colors.white.withValues(alpha: 0.12),
                              valueColor:
                                  const AlwaysStoppedAnimation<Color>(amber),
                              minHeight: 4,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Tap anywhere to continue',
                        style: TextStyle(
                            fontSize: 11,
                            color: Color(0xFF6B7280),
                            letterSpacing: 0.5),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
