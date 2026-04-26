import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:animations/animations.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

class _CartItem {
  final String id;
  final String name;
  final double price;
  final String unit;
  int quantity;

  _CartItem({required this.id, required this.name, required this.price, required this.unit, required this.quantity});
}

class _Address {
  final String label;
  final String line1;
  final String line2;

  const _Address(this.label, this.line1, this.line2);
}

const _addresses = [
  _Address('Home', 'Flat 202, Sunrise Apartments', 'Madhapur, Hyderabad – 500081'),
  _Address('Site', 'Plot 45, Sai Nagar Colony', 'Kukatpally, Hyderabad – 500072'),
];

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen>
    with TickerProviderStateMixin {
  int _currentStep = 0;
  int _prevStep = 0;

  final List<_CartItem> _cart = [
    _CartItem(id: 'c1', name: 'UltraTech PPC Cement', price: 385, unit: '50kg bag', quantity: 10),
    _CartItem(id: 'c2', name: 'SAIL TMT Steel Fe500D', price: 72, unit: 'per kg', quantity: 50),
    _CartItem(id: 'c3', name: 'Red Clay Bricks', price: 7, unit: 'per brick', quantity: 200),
  ];

  int _selectedAddress = 0;
  int _selectedPayment = 0; // 0 = COD, 1 = UPI, 2 = Bank Transfer
  final TextEditingController _notesController = TextEditingController();

  // Place order button states: 'idle' | 'loading' | 'success'
  String _orderState = 'idle';

  // Stagger controllers per step
  late AnimationController _step1Ctrl;
  late AnimationController _step2Ctrl;
  late AnimationController _step3Ctrl;

  @override
  void initState() {
    super.initState();
    _step1Ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _step2Ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _step3Ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _step1Ctrl.forward();
  }

  @override
  void dispose() {
    _notesController.dispose();
    _step1Ctrl.dispose();
    _step2Ctrl.dispose();
    _step3Ctrl.dispose();
    super.dispose();
  }

  double get _subtotal => _cart.fold(0, (sum, i) => sum + i.price * i.quantity);
  double get _delivery => 0;
  double get _gst => _subtotal * 0.05;
  double get _total => _subtotal + _delivery + _gst;

  String _formatPrice(double price) {
    if (price >= 100000) {
      return '₹${(price / 100000).toStringAsFixed(2)}L';
    } else if (price >= 1000) {
      final formatted = price.toStringAsFixed(0);
      if (formatted.length > 4) {
        return '₹${formatted.substring(0, formatted.length - 3)},${formatted.substring(formatted.length - 3)}';
      }
      return '₹$formatted';
    }
    return '₹${price.toStringAsFixed(0)}';
  }

  void _nextStep() {
    if (_currentStep < 2) {
      setState(() {
        _prevStep = _currentStep;
        _currentStep++;
      });
      if (_currentStep == 1) {
        _step2Ctrl.reset();
        _step2Ctrl.forward();
      } else if (_currentStep == 2) {
        _step3Ctrl.reset();
        _step3Ctrl.forward();
      }
    }
  }

  void _goBack() {
    if (_currentStep > 0) {
      setState(() {
        _prevStep = _currentStep;
        _currentStep--;
      });
    }
  }

  void _placeOrder() async {
    setState(() => _orderState = 'loading');
    await Future.delayed(const Duration(milliseconds: 1800));
    if (!mounted) return;
    setState(() => _orderState = 'success');
    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const OrderSuccessScreen()),
    );
  }

  AnimationController _ctrlForStep(int step) {
    switch (step) {
      case 0: return _step1Ctrl;
      case 1: return _step2Ctrl;
      default: return _step3Ctrl;
    }
  }

  Animation<double> _itemAnim(int step, int i) {
    final ctrl = _ctrlForStep(step);
    return CurvedAnimation(
      parent: ctrl,
      curve: Interval(
        (i * 0.1).clamp(0.0, 0.7),
        ((i * 0.1) + 0.4).clamp(0.0, 1.0),
        curve: Curves.easeOutCubic,
      ),
    );
  }

  Widget _staggerItem(int step, int i, Widget child) {
    final anim = _itemAnim(step, i);
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.15),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Checkout',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          _AnimatedStepIndicator(currentStep: _currentStep),
          Expanded(
            child: PageTransitionSwitcher(
              duration: const Duration(milliseconds: 380),
              reverse: _currentStep < _prevStep,
              transitionBuilder: (child, primaryAnimation, secondaryAnimation) {
                return SharedAxisTransition(
                  animation: primaryAnimation,
                  secondaryAnimation: secondaryAnimation,
                  transitionType: SharedAxisTransitionType.horizontal,
                  child: child,
                );
              },
              child: KeyedSubtree(
                key: ValueKey(_currentStep),
                child: _currentStep == 0
                    ? _buildCartStep()
                    : _currentStep == 1
                        ? _buildAddressStep()
                        : _buildConfirmStep(),
              ),
            ),
          ),
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildCartStep() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        ..._cart.asMap().entries.map((e) {
          final i = e.key;
          final item = e.value;
          return _staggerItem(
            0,
            i,
            _CartItemRow(
              item: item,
              onDecrement: () {
                if (item.quantity > 1) setState(() => item.quantity--);
              },
              onIncrement: () => setState(() => item.quantity++),
              onRemove: () => setState(() => _cart.remove(item)),
              formatPrice: _formatPrice,
            ),
          );
        }),
        const SizedBox(height: 16),
        _staggerItem(0, _cart.length, _SummaryRow(label: 'Subtotal', value: _formatPrice(_subtotal))),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildAddressStep() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _staggerItem(
          1,
          0,
          const Text('Select Delivery Address',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: _navy)),
        ),
        const SizedBox(height: 12),
        ..._addresses.asMap().entries.map((entry) {
          final i = entry.key;
          final addr = entry.value;
          final selected = _selectedAddress == i;
          return _staggerItem(
            1,
            i + 1,
            GestureDetector(
              onTap: () => setState(() => _selectedAddress = i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? _amber : _border,
                    width: selected ? 2 : 1,
                  ),
                  boxShadow: selected
                      ? [BoxShadow(color: _amber.withValues(alpha: 0.15), blurRadius: 8, offset: const Offset(0, 2))]
                      : [],
                ),
                child: Row(
                  children: [
                    Radio<int>(
                      value: i,
                      groupValue: _selectedAddress,
                      onChanged: (v) => setState(() => _selectedAddress = v!),
                      activeColor: _amber,
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(addr.label,
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: _navy)),
                              const SizedBox(width: 8),
                              if (selected)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(color: _amberBg, borderRadius: BorderRadius.circular(4)),
                                  child: const Text('Selected',
                                      style: TextStyle(color: _amber, fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(addr.line1, style: const TextStyle(color: _textSecondary, fontSize: 13)),
                          Text(addr.line2, style: const TextStyle(color: _textMuted, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
        _staggerItem(
          1,
          _addresses.length + 1,
          Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _border),
            ),
            child: const Row(
              children: [
                Icon(Icons.add_circle_outline, color: _amber, size: 22),
                SizedBox(width: 10),
                Text('Add New Address',
                    style: TextStyle(color: _amber, fontWeight: FontWeight.w600, fontSize: 14)),
              ],
            ),
          ),
        ),
        _staggerItem(
          1,
          _addresses.length + 2,
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Delivery Notes (Optional)',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: _navy)),
              const SizedBox(height: 8),
              TextField(
                controller: _notesController,
                maxLines: 3,
                style: const TextStyle(fontSize: 14, color: _navy),
                decoration: InputDecoration(
                  hintText: 'Any special instructions for the delivery...',
                  hintStyle: const TextStyle(color: _textMuted, fontSize: 13),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: _border)),
                  enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: _border)),
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: _amber, width: 1.5)),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.all(12),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildConfirmStep() {
    final addr = _addresses[_selectedAddress];
    final paymentLabels = ['Cash on Delivery', 'UPI / QR Code', 'Bank Transfer'];
    final paymentIcons = [Icons.payments_outlined, Icons.qr_code, Icons.account_balance_outlined];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _staggerItem(
          2,
          0,
          _buildSectionCard(
            'Order Items',
            Column(
              children: _cart.map((item) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text('${item.name} × ${item.quantity}',
                              style: const TextStyle(fontSize: 13, color: _navy)),
                        ),
                        Text(_formatPrice(item.price * item.quantity),
                            style: const TextStyle(
                                fontSize: 13, fontWeight: FontWeight.w600, color: _navy)),
                      ],
                    ),
                  )).toList(),
            ),
          ),
        ),
        const SizedBox(height: 12),
        _staggerItem(
          2,
          1,
          _buildSectionCard(
            'Delivery To',
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(addr.label,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: _navy)),
                Text(addr.line1, style: const TextStyle(color: _textSecondary, fontSize: 13)),
                Text(addr.line2, style: const TextStyle(color: _textMuted, fontSize: 12)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        // Payment method selection
        _staggerItem(
          2,
          2,
          _buildSectionCard(
            'Payment Method',
            Column(
              children: List.generate(3, (i) {
                final selected = _selectedPayment == i;
                return GestureDetector(
                  onTap: () => setState(() => _selectedPayment = i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: selected ? _amber : _border,
                        width: selected ? 2 : 1,
                      ),
                      color: selected ? _amberBg : Colors.white,
                      boxShadow: selected
                          ? [BoxShadow(color: _amber.withValues(alpha: 0.15), blurRadius: 8)]
                          : [],
                    ),
                    child: Row(
                      children: [
                        Icon(paymentIcons[i],
                            color: selected ? _amber : _textSecondary, size: 22),
                        const SizedBox(width: 12),
                        Text(paymentLabels[i],
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
                              color: selected ? _amber : _navy,
                            )),
                        const Spacer(),
                        if (selected)
                          const Icon(Icons.check_circle, color: _amber, size: 18),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
        const SizedBox(height: 12),
        _staggerItem(
          2,
          3,
          _buildSectionCard(
            'Price Breakdown',
            Column(
              children: [
                _SummaryRow(label: 'Subtotal', value: _formatPrice(_subtotal)),
                const SizedBox(height: 6),
                _SummaryRow(
                    label: 'Delivery',
                    value: _delivery == 0 ? 'FREE' : _formatPrice(_delivery),
                    valueColor: _success),
                const SizedBox(height: 6),
                _SummaryRow(label: 'GST (5%)', value: _formatPrice(_gst)),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 10),
                  child: Divider(color: _border),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: _navy)),
                    Text(_formatPrice(_total),
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w800, color: _navy)),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildSectionCard(String title, Widget content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 2),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: _navy)),
          const SizedBox(height: 12),
          content,
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    final isLastStep = _currentStep == 2;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentStep > 0) ...[
            Expanded(
              flex: 1,
              child: OutlinedButton(
                onPressed: _orderState == 'idle' ? _goBack : null,
                style: OutlinedButton.styleFrom(
                  foregroundColor: _navy,
                  side: const BorderSide(color: _border),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Back', style: TextStyle(fontWeight: FontWeight.w600)),
              ),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            flex: 2,
            child: isLastStep
                ? _buildPlaceOrderButton()
                : ElevatedButton(
                    onPressed: _nextStep,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _amber,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Next',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceOrderButton() {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
      height: 50,
      width: _orderState == 'loading' ? 50 : double.infinity,
      decoration: BoxDecoration(
        color: _orderState == 'success' ? _success : _amber,
        borderRadius: BorderRadius.circular(_orderState == 'loading' ? 25 : 12),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(_orderState == 'loading' ? 25 : 12),
          onTap: _orderState == 'idle' ? _placeOrder : null,
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: _orderState == 'loading'
                ? const SizedBox(
                    key: ValueKey('loading'),
                    width: 22,
                    height: 22,
                    child: Center(
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                    ),
                  )
                : _orderState == 'success'
                    ? const Icon(Icons.check, color: Colors.white, size: 24, key: ValueKey('success'))
                    : const Center(
                        key: ValueKey('idle'),
                        child: Text('Place Order',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 15,
                                fontWeight: FontWeight.w700)),
                      ),
          ),
        ),
      ),
    );
  }
}

// ─── Animated Step Indicator ─────────────────────────────────────────────────

class _AnimatedStepIndicator extends StatefulWidget {
  final int currentStep;

  const _AnimatedStepIndicator({required this.currentStep});

  @override
  State<_AnimatedStepIndicator> createState() => _AnimatedStepIndicatorState();
}

class _AnimatedStepIndicatorState extends State<_AnimatedStepIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseCtrl;

  static const _labels = ['Cart', 'Address', 'Confirm'];

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
      child: Row(
        children: List.generate(3, (i) {
          final isDone = i < widget.currentStep;
          final isCurrent = i == widget.currentStep;
          return Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    children: [
                      // Pulsing ring for active step
                      AnimatedBuilder(
                        animation: _pulseCtrl,
                        builder: (context, child) {
                          final pulse = isCurrent
                              ? (1.0 + _pulseCtrl.value * 0.12)
                              : 1.0;
                          return Transform.scale(
                            scale: pulse,
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              width: 34,
                              height: 34,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isDone ? _success : isCurrent ? _amber : _bg,
                                border: Border.all(
                                  color: isDone ? _success : isCurrent ? _amber : _border,
                                  width: isCurrent ? 2.5 : 2,
                                ),
                                boxShadow: isCurrent
                                    ? [BoxShadow(
                                        color: _amber.withValues(alpha: 0.35 * _pulseCtrl.value),
                                        blurRadius: 10,
                                        spreadRadius: 2,
                                      )]
                                    : isDone
                                        ? [BoxShadow(
                                            color: _success.withValues(alpha: 0.2),
                                            blurRadius: 6,
                                          )]
                                        : [],
                              ),
                              child: Center(
                                child: AnimatedSwitcher(
                                  duration: const Duration(milliseconds: 250),
                                  child: isDone
                                      ? const Icon(Icons.check, color: Colors.white, size: 16, key: ValueKey('done'))
                                      : Text(
                                          '${i + 1}',
                                          key: ValueKey('num_$i'),
                                          style: TextStyle(
                                            color: isCurrent ? Colors.white : _textMuted,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                          ),
                                        ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 6),
                      AnimatedDefaultTextStyle(
                        duration: const Duration(milliseconds: 250),
                        style: TextStyle(
                          fontSize: 11,
                          color: isCurrent ? _amber : isDone ? _success : _textMuted,
                          fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w400,
                        ),
                        child: Text(_labels[i]),
                      ),
                    ],
                  ),
                ),
                if (i < 2)
                  Expanded(
                    child: TweenAnimationBuilder<double>(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeOut,
                      tween: Tween(begin: 0.0, end: i < widget.currentStep ? 1.0 : 0.0),
                      builder: (context, progress, _) {
                        return Container(
                          height: 2,
                          margin: const EdgeInsets.only(bottom: 22),
                          child: Stack(
                            children: [
                              Container(color: _border),
                              FractionallySizedBox(
                                widthFactor: progress,
                                child: Container(color: _success),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }
}

class _CartItemRow extends StatelessWidget {
  final _CartItem item;
  final VoidCallback onDecrement;
  final VoidCallback onIncrement;
  final VoidCallback onRemove;
  final String Function(double) formatPrice;

  const _CartItemRow({
    required this.item,
    required this.onDecrement,
    required this.onIncrement,
    required this.onRemove,
    required this.formatPrice,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _border),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(color: _bg, borderRadius: BorderRadius.circular(10)),
            child: const Icon(Icons.inventory_2_outlined, color: _textMuted, size: 24),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.name,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _navy),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                Text('${formatPrice(item.price)} / ${item.unit}',
                    style: const TextStyle(fontSize: 11, color: _textSecondary)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                children: [
                  _QtyButton(icon: Icons.remove, onTap: onDecrement),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text('${item.quantity}',
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: _navy)),
                  ),
                  _QtyButton(icon: Icons.add, onTap: onIncrement),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Text(formatPrice(item.price * item.quantity),
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: _navy)),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: onRemove,
                    child: const Icon(Icons.delete_outline, color: Colors.red, size: 18),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _QtyButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _QtyButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          border: Border.all(color: _border),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Icon(icon, size: 16, color: _navy),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _SummaryRow({required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: _textSecondary)),
        Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: valueColor ?? _navy)),
      ],
    );
  }
}

// ─── Order Success Screen ────────────────────────────────────────────────────

class OrderSuccessScreen extends StatefulWidget {
  const OrderSuccessScreen({super.key});

  @override
  State<OrderSuccessScreen> createState() => _OrderSuccessScreenState();
}

class _OrderSuccessScreenState extends State<OrderSuccessScreen>
    with TickerProviderStateMixin {
  late AnimationController _checkController;
  late Animation<double> _checkScale;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnim;
  late AnimationController _confettiController;

  // Typewriter for order number
  String _displayedOrderNumber = '';
  static const _fullOrderNumber = '#BM-2891';

  @override
  void initState() {
    super.initState();

    _checkController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _checkScale = CurvedAnimation(parent: _checkController, curve: Curves.elasticOut);

    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _fadeAnim = CurvedAnimation(parent: _fadeController, curve: Curves.easeIn);

    _confettiController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );

    Future.delayed(const Duration(milliseconds: 100), () {
      if (!mounted) return;
      _checkController.forward();
    });

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      _fadeController.forward();
      _confettiController.forward();
      _startTypewriter();
    });
  }

  void _startTypewriter() async {
    for (int i = 0; i <= _fullOrderNumber.length; i++) {
      await Future.delayed(const Duration(milliseconds: 60));
      if (!mounted) return;
      setState(() => _displayedOrderNumber = _fullOrderNumber.substring(0, i));
    }
  }

  @override
  void dispose() {
    _checkController.dispose();
    _fadeController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _navy,
      body: SafeArea(
        child: Stack(
          children: [
            // Confetti layer
            Positioned.fill(
              child: AnimatedBuilder(
                animation: _confettiController,
                builder: (context, _) {
                  return CustomPaint(
                    painter: _ConfettiPainter(_confettiController.value),
                  );
                },
              ),
            ),
            Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Check circle with elastic scale
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
                              color: _success.withValues(alpha: 0.45),
                              blurRadius: 28,
                              spreadRadius: 6,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.check_rounded, color: Colors.white, size: 54),
                      ),
                    ),
                    const SizedBox(height: 32),
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: Column(
                        children: [
                          const Text(
                            'Order Placed!',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 30,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 10),
                          // Typewriter order number
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                'Order ',
                                style: TextStyle(color: Colors.white60, fontSize: 15),
                              ),
                              Text(
                                _displayedOrderNumber,
                                style: const TextStyle(
                                  color: _amber,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const Text(
                                ' confirmed',
                                style: TextStyle(color: Colors.white60, fontSize: 15),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.09),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.schedule, color: _amber, size: 18),
                                SizedBox(width: 8),
                                Text('Estimated delivery: ',
                                    style: TextStyle(color: Colors.white60, fontSize: 14)),
                                Text('45 minutes',
                                    style: TextStyle(
                                        color: _amber,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 44),
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: Column(
                        children: [
                          SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _amber,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14)),
                              ),
                              child: const Text('Track Order',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: OutlinedButton(
                              onPressed: () =>
                                  Navigator.of(context).popUntil((r) => r.isFirst),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: BorderSide(color: Colors.white.withValues(alpha: 0.35)),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14)),
                              ),
                              child: const Text('Continue Shopping',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                            ),
                          ),
                        ],
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

// ─── Confetti Painter ────────────────────────────────────────────────────────

class _ConfettiPainter extends CustomPainter {
  final double progress;

  _ConfettiPainter(this.progress);

  static final _rng = math.Random(42);
  static final _particles = List.generate(60, (i) {
    return _ConfettiParticle(
      x: _rng.nextDouble(),
      startY: -0.05 - _rng.nextDouble() * 0.3,
      color: [
        const Color(0xFFF2960D),
        const Color(0xFF10B981),
        const Color(0xFF3B82F6),
        const Color(0xFF8B5CF6),
        const Color(0xFFEF4444),
        const Color(0xFFFBBF24),
        Colors.white,
      ][i % 7],
      size: 5.0 + _rng.nextDouble() * 7,
      speed: 0.5 + _rng.nextDouble() * 0.5,
      wobble: _rng.nextDouble() * 2 * math.pi,
      isRect: _rng.nextBool(),
      rotation: _rng.nextDouble() * math.pi * 2,
    );
  });

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in _particles) {
      final t = (progress * p.speed).clamp(0.0, 1.0);
      if (t <= 0) continue;

      final x = (p.x + math.sin(p.wobble + t * 4) * 0.04) * size.width;
      final y = (p.startY + t * 1.4) * size.height;
      final opacity = (1.0 - (t - 0.7).clamp(0.0, 0.3) / 0.3).clamp(0.0, 1.0);

      if (y > size.height || opacity <= 0) continue;

      final paint = Paint()
        ..color = p.color.withValues(alpha: opacity)
        ..style = PaintingStyle.fill;

      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(p.rotation + t * 3);

      if (p.isRect) {
        canvas.drawRect(
          Rect.fromCenter(center: Offset.zero, width: p.size, height: p.size * 0.5),
          paint,
        );
      } else {
        canvas.drawCircle(Offset.zero, p.size / 2, paint);
      }
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_ConfettiPainter old) => old.progress != progress;
}

class _ConfettiParticle {
  final double x, startY, size, speed, wobble, rotation;
  final Color color;
  final bool isRect;

  const _ConfettiParticle({
    required this.x,
    required this.startY,
    required this.color,
    required this.size,
    required this.speed,
    required this.wobble,
    required this.isRect,
    required this.rotation,
  });
}
