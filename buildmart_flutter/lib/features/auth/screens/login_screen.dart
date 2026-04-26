import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/auth_provider.dart';

class _SeedRole {
  final String name;
  final String phone;
  final Color color;
  final IconData icon;

  const _SeedRole({
    required this.name,
    required this.phone,
    required this.color,
    required this.icon,
  });
}

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with TickerProviderStateMixin {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  // Animation visibility states
  bool _headerVisible = false;
  bool _heroBannerVisible = false;
  bool _titleVisible = false;
  bool _phoneVisible = false;
  bool _buttonVisible = false;
  bool _dividerVisible = false;
  final List<bool> _cardVisible = List.filled(6, false);

  // Slide offsets
  Offset _headerOffset = const Offset(0, -0.3);
  Offset _heroBannerOffset = const Offset(0, 0.2);
  Offset _titleOffset = const Offset(0, 0.15);
  Offset _phoneOffset = const Offset(0, 0.15);
  Offset _buttonOffset = const Offset(0, 0.15);
  Offset _dividerOffset = const Offset(0, 0.15);

  static const _seedRoles = [
    _SeedRole(
        name: 'Customer',
        phone: '9000000001',
        color: AppColors.customer,
        icon: Icons.person),
    _SeedRole(
        name: 'Worker',
        phone: '9000000002',
        color: AppColors.worker,
        icon: Icons.construction),
    _SeedRole(
        name: 'Shopkeeper',
        phone: '9000000003',
        color: AppColors.shopkeeper,
        icon: Icons.storefront),
    _SeedRole(
        name: 'Contractor',
        phone: '9000000004',
        color: AppColors.contractor,
        icon: Icons.business_center),
    _SeedRole(
        name: 'Driver',
        phone: '9000000005',
        color: AppColors.driver,
        icon: Icons.local_shipping),
    _SeedRole(
        name: 'Admin',
        phone: '9000000006',
        color: AppColors.admin,
        icon: Icons.admin_panel_settings),
  ];

  @override
  void initState() {
    super.initState();
    _startAnimations();
  }

  void _startAnimations() async {
    await Future.delayed(const Duration(milliseconds: 50));
    if (!mounted) return;
    setState(() {
      _headerVisible = true;
      _headerOffset = Offset.zero;
    });

    await Future.delayed(const Duration(milliseconds: 100));
    if (!mounted) return;
    setState(() {
      _heroBannerVisible = true;
      _heroBannerOffset = Offset.zero;
    });

    await Future.delayed(const Duration(milliseconds: 100));
    if (!mounted) return;
    setState(() {
      _titleVisible = true;
      _titleOffset = Offset.zero;
    });

    await Future.delayed(const Duration(milliseconds: 60));
    if (!mounted) return;
    setState(() {
      _phoneVisible = true;
      _phoneOffset = Offset.zero;
    });

    await Future.delayed(const Duration(milliseconds: 60));
    if (!mounted) return;
    setState(() {
      _buttonVisible = true;
      _buttonOffset = Offset.zero;
    });

    await Future.delayed(const Duration(milliseconds: 60));
    if (!mounted) return;
    setState(() {
      _dividerVisible = true;
      _dividerOffset = Offset.zero;
    });

    for (int i = 0; i < 6; i++) {
      await Future.delayed(const Duration(milliseconds: 60));
      if (!mounted) return;
      setState(() {
        _cardVisible[i] = true;
      });
    }
  }

  Future<void> _handleLogin(String phone) async {
    setState(() => _isLoading = true);
    final success = await ref.read(authProvider.notifier).login(phone);
    if (!mounted) return;
    setState(() => _isLoading = false);
    if (success) {
      context.go('/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Phone number not found. Try a seed login.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 24),

                // Header: hammer icon + BuildMart
                AnimatedOpacity(
                  opacity: _headerVisible ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                  child: AnimatedSlide(
                    offset: _headerOffset,
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.easeOutBack,
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: const BoxDecoration(
                            color: AppColors.amber,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.hardware,
                              color: Colors.white, size: 24),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'BuildMart',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: AppColors.navy,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Navy hero banner
                AnimatedOpacity(
                  opacity: _heroBannerVisible ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                  child: AnimatedSlide(
                    offset: _heroBannerOffset,
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.easeOutBack,
                    child: Container(
                      width: double.infinity,
                      height: 140,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [AppColors.navy, Color(0xFF252838)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.navy.withValues(alpha: 0.3),
                            blurRadius: 16,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Build Smarter,',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                          const Text(
                            'Build Better',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: AppColors.amber,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            "Hyderabad's #1 Construction Platform",
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.white.withValues(alpha: 0.7),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Welcome title
                AnimatedOpacity(
                  opacity: _titleVisible ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                  child: AnimatedSlide(
                    offset: _titleOffset,
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.easeOutBack,
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome to BuildMart',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: AppColors.navy,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Enter your phone number to continue',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Phone input
                AnimatedOpacity(
                  opacity: _phoneVisible ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                  child: AnimatedSlide(
                    offset: _phoneOffset,
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.easeOutBack,
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 14),
                            decoration: const BoxDecoration(
                              border: Border(
                                  right: BorderSide(color: AppColors.border)),
                            ),
                            child: Row(
                              children: [
                                const Text('🇮🇳',
                                    style: TextStyle(fontSize: 20)),
                                const SizedBox(width: 6),
                                const Text(
                                  '+91',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.navy,
                                    fontSize: 15,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: TextFormField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              maxLength: 10,
                              style: const TextStyle(
                                fontSize: 15,
                                color: AppColors.navy,
                                fontWeight: FontWeight.w500,
                              ),
                              decoration: const InputDecoration(
                                hintText: 'Enter 10-digit number',
                                hintStyle: TextStyle(
                                    color: AppColors.textMuted, fontSize: 14),
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 14),
                                counterText: '',
                              ),
                              validator: (v) {
                                if (v == null || v.length < 10) {
                                  return 'Enter a valid 10-digit number';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 14),

                // Continue button
                AnimatedOpacity(
                  opacity: _buttonVisible ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                  child: AnimatedSlide(
                    offset: _buttonOffset,
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.easeOutBack,
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _isLoading
                            ? null
                            : () {
                                if (_formKey.currentState!.validate()) {
                                  _handleLogin(_phoneController.text);
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.navy,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(
                                    color: Colors.white, strokeWidth: 2.5),
                              )
                            : const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Continue',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(Icons.arrow_forward, size: 18),
                                ],
                              ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Divider: QUICK DEV LOGIN
                AnimatedOpacity(
                  opacity: _dividerVisible ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                  child: AnimatedSlide(
                    offset: _dividerOffset,
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.easeOutBack,
                    child: Row(
                      children: [
                        const Expanded(
                            child: Divider(color: AppColors.border)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'QUICK DEV LOGIN',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const Expanded(
                            child: Divider(color: AppColors.border)),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Seed role cards
                ...List.generate(_seedRoles.length, (i) {
                  final role = _seedRoles[i];
                  return AnimatedOpacity(
                    opacity: _cardVisible[i] ? 1.0 : 0.0,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    child: _SeedRoleCard(
                      role: role,
                      onTap: () => _handleLogin(role.phone),
                    ),
                  );
                }),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SeedRoleCard extends StatefulWidget {
  final _SeedRole role;
  final VoidCallback onTap;

  const _SeedRoleCard({required this.role, required this.onTap});

  @override
  State<_SeedRoleCard> createState() => _SeedRoleCardState();
}

class _SeedRoleCardState extends State<_SeedRoleCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: widget.onTap,
      child: AnimatedScale(
        scale: _pressed ? 0.96 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(
            color: widget.role.color.withValues(alpha: 0.04),
            borderRadius: BorderRadius.circular(12),
            border: Border(
              left: BorderSide(color: widget.role.color, width: 5),
              top: const BorderSide(color: AppColors.border),
              right: const BorderSide(color: AppColors.border),
              bottom: const BorderSide(color: AppColors.border),
            ),
          ),
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: widget.role.color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(widget.role.icon,
                      color: widget.role.color, size: 20),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.role.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.navy,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '+91 ${widget.role.phone}',
                        style: TextStyle(
                          fontSize: 14,
                          color: widget.role.color,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right,
                    color: AppColors.textMuted, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
