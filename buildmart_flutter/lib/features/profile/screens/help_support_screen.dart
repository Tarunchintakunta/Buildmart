import 'package:flutter/material.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
// ignore: unused_element
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
// ignore: unused_element
const _info = Color(0xFF3B82F6);
const _textSecondary = Color(0xFF6B7280);
// ignore: unused_element
const _textMuted = Color(0xFF9CA3AF);

class _Faq {
  final String question;
  final String answer;

  const _Faq(this.question, this.answer);
}

const _faqs = [
  _Faq(
    'How do I place an order?',
    'Browse products in the Shop tab, add items to your cart, then proceed to checkout. Choose your delivery address, review your order summary, and tap "Place Order". You\'ll receive a confirmation with order ID instantly.',
  ),
  _Faq(
    'How does the escrow system work?',
    'When you place an order, payment is held securely in escrow. The amount is only released to the seller after you confirm delivery. This protects both buyers and sellers from fraud and ensures quality delivery.',
  ),
  _Faq(
    'How do I hire a worker?',
    'Go to the Workers section and browse skilled professionals near you. Filter by skill, location, and daily rate. View their profile, ratings, and availability. Send a booking request and the worker will confirm within 2 hours.',
  ),
  _Faq(
    'What are the delivery charges?',
    'Delivery within Hyderabad is FREE for orders above ₹2,000. For orders below ₹2,000, a flat fee of ₹49 applies. Express delivery (within 2 hours) is available for ₹99. Bulk material delivery may have separate charges.',
  ),
  _Faq(
    'How do I withdraw wallet funds?',
    'Go to Wallet → Withdraw. Enter the amount and select your bank account (add one via Settings → Bank Account). Withdrawals are processed within 2-4 business days. Minimum withdrawal is ₹100.',
  ),
  _Faq(
    'What if a worker doesn\'t show up?',
    'If a confirmed worker doesn\'t show up, report it via the booking details page within 2 hours of the scheduled time. You\'ll receive a full refund within 24 hours and we\'ll help you find an alternative worker.',
  ),
];

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen>
    with TickerProviderStateMixin {
  final Set<int> _expanded = {};

  // Contact buttons stagger in from bottom
  late AnimationController _contactCtrl;
  final List<Animation<double>> _contactFade = [];
  final List<Animation<Offset>> _contactSlide = [];

  // FAQ stagger in
  late AnimationController _faqCtrl;
  final List<Animation<double>> _faqFade = [];
  final List<Animation<Offset>> _faqSlide = [];

  // Rate banner
  late AnimationController _bannerCtrl;
  late Animation<double> _bannerFade;
  late Animation<Offset> _bannerSlide;

  @override
  void initState() {
    super.initState();

    // Contact (3 buttons) stagger from bottom
    const contactCount = 3;
    _contactCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600));
    for (var i = 0; i < contactCount; i++) {
      final start = i * 0.2;
      final end = (start + 0.45).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _contactFade.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _contactCtrl, curve: interval)));
      _contactSlide.add(Tween<Offset>(
        begin: const Offset(0, 0.4),
        end: Offset.zero,
      ).animate(
          CurvedAnimation(parent: _contactCtrl, curve: interval)));
    }

    // FAQ stagger
    _faqCtrl = AnimationController(
        vsync: this,
        duration:
            Duration(milliseconds: 400 + _faqs.length * 80));
    for (var i = 0; i < _faqs.length; i++) {
      final start = (i * 0.1).clamp(0.0, 0.7);
      final end = (start + 0.35).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _faqFade.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _faqCtrl, curve: interval)));
      _faqSlide.add(Tween<Offset>(
        begin: const Offset(0, 0.15),
        end: Offset.zero,
      ).animate(
          CurvedAnimation(parent: _faqCtrl, curve: interval)));
    }

    // Rate banner
    _bannerCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));
    _bannerFade = Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _bannerCtrl, curve: Curves.easeOut));
    _bannerSlide = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _bannerCtrl, curve: Curves.easeOut));

    _contactCtrl.forward();
    Future.delayed(const Duration(milliseconds: 300),
        () => mounted ? _faqCtrl.forward() : null);
    Future.delayed(const Duration(milliseconds: 800),
        () => mounted ? _bannerCtrl.forward() : null);
  }

  @override
  void dispose() {
    _contactCtrl.dispose();
    _faqCtrl.dispose();
    _bannerCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Help & Support',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildContactSection(),
          const SizedBox(height: 20),
          _buildFaqSection(),
          const SizedBox(height: 20),
          _buildRateBanner(),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildContactSection() {
    final buttons = [
      _ContactData(
        icon: Icons.phone,
        label: 'Call Us',
        subLabel: '+91 1800-123-4567 (Toll Free)',
        color: _amber,
      ),
      _ContactData(
        icon: Icons.chat_bubble_outline,
        label: 'WhatsApp',
        subLabel: 'Chat with us on WhatsApp',
        color: _success,
      ),
      _ContactData(
        icon: Icons.email_outlined,
        label: 'Email Support',
        subLabel: 'support@buildmart.in',
        color: _navy,
      ),
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Contact Us',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: _navy)),
          const SizedBox(height: 4),
          const Text('We\'re here to help 9am – 9pm, Mon–Sat',
              style: TextStyle(
                  fontSize: 12, color: _textSecondary)),
          const SizedBox(height: 16),
          ...buttons.asMap().entries.map((e) {
            final i = e.key;
            final d = e.value;
            return Column(
              children: [
                FadeTransition(
                  opacity: _contactFade[i],
                  child: SlideTransition(
                    position: _contactSlide[i],
                    child: _ContactButton(
                      icon: d.icon,
                      label: d.label,
                      subLabel: d.subLabel,
                      color: d.color,
                      onTap: () {},
                    ),
                  ),
                ),
                if (i < buttons.length - 1)
                  const SizedBox(height: 10),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildFaqSection() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text('Frequently Asked Questions',
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: _navy)),
          ),
          ...List.generate(_faqs.length, (index) {
            final faq = _faqs[index];
            final isExpanded = _expanded.contains(index);
            final isLast = index == _faqs.length - 1;
            final safeIdx =
                index.clamp(0, _faqFade.length - 1);

            return FadeTransition(
              opacity: _faqFade[safeIdx],
              child: SlideTransition(
                position: _faqSlide[safeIdx],
                child: Column(
                  children: [
                    if (index > 0)
                      const Divider(
                          height: 1,
                          indent: 16,
                          endIndent: 16,
                          color: _border),
                    InkWell(
                      onTap: () => setState(() {
                        if (isExpanded) {
                          _expanded.remove(index);
                        } else {
                          _expanded.add(index);
                        }
                      }),
                      borderRadius: BorderRadius.vertical(
                        top: index == 0
                            ? const Radius.circular(16)
                            : Radius.zero,
                        bottom: isLast
                            ? const Radius.circular(16)
                            : Radius.zero,
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 14),
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    faq.question,
                                    style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: _navy),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                // Rotating chevron
                                AnimatedRotation(
                                  turns: isExpanded ? 0.5 : 0,
                                  duration: const Duration(
                                      milliseconds: 250),
                                  curve: Curves.easeInOut,
                                  child: const Icon(
                                      Icons.keyboard_arrow_down,
                                      color: _textSecondary,
                                      size: 22),
                                ),
                              ],
                            ),
                            // AnimatedSize for expand/collapse
                            AnimatedSize(
                              duration: const Duration(
                                  milliseconds: 300),
                              curve: Curves.easeInOut,
                              child: isExpanded
                                  ? Padding(
                                      padding:
                                          const EdgeInsets.only(
                                              top: 10),
                                      child: Text(
                                        faq.answer,
                                        style: const TextStyle(
                                            fontSize: 13,
                                            color:
                                                _textSecondary,
                                            height: 1.5),
                                      ),
                                    )
                                  : const SizedBox.shrink(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildRateBanner() {
    return FadeTransition(
      opacity: _bannerFade,
      child: SlideTransition(
        position: _bannerSlide,
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [_amber, Color(0xFFE58B00)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                  color: _amber.withValues(alpha: 0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4)),
            ],
          ),
          child: Row(
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Enjoying BuildMart?',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700)),
                    SizedBox(height: 4),
                    Text(
                        'Rate us on the Play Store and help us improve!',
                        style: TextStyle(
                            color: Colors.white70, fontSize: 13)),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () {},
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.star, color: _amber, size: 18),
                      SizedBox(width: 6),
                      Text('Rate App',
                          style: TextStyle(
                              color: _amber,
                              fontWeight: FontWeight.bold,
                              fontSize: 13)),
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

class _ContactData {
  final IconData icon;
  final String label;
  final String subLabel;
  final Color color;

  const _ContactData({
    required this.icon,
    required this.label,
    required this.subLabel,
    required this.color,
  });
}

class _ContactButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subLabel;
  final Color color;
  final VoidCallback onTap;

  const _ContactButton({
    required this.icon,
    required this.label,
    required this.subLabel,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(
            horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label,
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: color)),
                  Text(subLabel,
                      style: const TextStyle(
                          fontSize: 12, color: _textSecondary)),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, color: color, size: 14),
          ],
        ),
      ),
    );
  }
}
