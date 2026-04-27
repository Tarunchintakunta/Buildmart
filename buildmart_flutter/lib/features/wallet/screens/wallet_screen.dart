import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

// ─── Colors ──────────────────────────────────────────────────────────────────
const _navy   = Color(0xFF1A1D2E);
const _amber  = Color(0xFFF2960D);
const _bg     = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success= Color(0xFF10B981);
const _error  = Color(0xFFEF4444);
const _info   = Color(0xFF3B82F6);
const _hold   = Color(0xFFF59E0B);
const _textSec= Color(0xFF6B7280);
const _textMut= Color(0xFF9CA3AF);

final _fmt = NumberFormat('##,##,###', 'en_IN');

// ─── Models ───────────────────────────────────────────────────────────────────
enum _TxFilter { all, credits, debits, onHold }

enum _TxCategory { payment, withdrawal, order, bonus, hold, refund, topup }

class _Transaction {
  final String id;
  final String description;
  final String date;
  final String time;
  final double amount;
  final bool isCredit;
  final bool isHold;
  final String status;
  final _TxCategory category;
  const _Transaction({
    required this.id,
    required this.description,
    required this.date,
    required this.time,
    required this.amount,
    required this.isCredit,
    this.isHold = false,
    required this.status,
    required this.category,
  });
}

const _mockTransactions = [
  _Transaction(id: 't1', description: 'Payment from Rahul Contractor',
      date: '25 Apr 2026', time: '10:32 AM', amount: 8000, isCredit: true,
      status: 'Completed', category: _TxCategory.payment),
  _Transaction(id: 't2', description: 'Withdrawal to HDFC ****4521',
      date: '24 Apr 2026', time: '3:15 PM', amount: 5000, isCredit: false,
      status: 'Processed', category: _TxCategory.withdrawal),
  _Transaction(id: 't3', description: 'Cement order #ORD-1042',
      date: '23 Apr 2026', time: '11:00 AM', amount: 3200, isCredit: false,
      status: 'Completed', category: _TxCategory.order),
  _Transaction(id: 't4', description: 'Job bonus – Site A completion',
      date: '22 Apr 2026', time: '6:45 PM', amount: 1500, isCredit: true,
      status: 'Completed', category: _TxCategory.bonus),
  _Transaction(id: 't5', description: 'Agreement hold – AGR-2031',
      date: '21 Apr 2026', time: '9:00 AM', amount: 4000, isCredit: false,
      isHold: true, status: 'On Hold', category: _TxCategory.hold),
  _Transaction(id: 't6', description: 'Refund – cancelled order',
      date: '20 Apr 2026', time: '2:30 PM', amount: 750, isCredit: true,
      status: 'Refunded', category: _TxCategory.refund),
  _Transaction(id: 't7', description: 'Steel rods – order #ORD-0998',
      date: '19 Apr 2026', time: '8:20 AM', amount: 12000, isCredit: false,
      status: 'Completed', category: _TxCategory.order),
  _Transaction(id: 't8', description: 'Top-up via UPI',
      date: '18 Apr 2026', time: '1:10 PM', amount: 10000, isCredit: true,
      status: 'Completed', category: _TxCategory.topup),
];

// ─── Wallet Screen ─────────────────────────────────────────────────────────────
class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});
  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen>
    with TickerProviderStateMixin {
  _TxFilter _filter = _TxFilter.all;

  // ── Animation controllers ──
  late AnimationController _cardCtrl;     // balance card slide+fade
  late AnimationController _iconCtrl;     // wallet icon spin
  late AnimationController _statsCtrl;   // stats count-up
  late AnimationController _actionsCtrl; // quick actions pop
  late AnimationController _txCtrl;      // transaction stagger

  late Animation<Offset> _cardSlide;
  late Animation<double>  _cardFade;

  final List<Animation<double>> _actionPop  = [];
  final List<Animation<double>> _actionFade = [];
  final List<Animation<double>> _txFade     = [];
  final List<Animation<double>> _txSlide    = [];

  @override
  void initState() {
    super.initState();

    // Balance card slides UP from slightly below
    _cardCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 650));
    _cardSlide = Tween<Offset>(begin: const Offset(0, 0.25), end: Offset.zero)
        .animate(CurvedAnimation(parent: _cardCtrl, curve: Curves.easeOutCubic));
    _cardFade = Tween<double>(begin: 0, end: 1)
        .animate(CurvedAnimation(parent: _cardCtrl, curve: Curves.easeOut));

    // Wallet icon rotates once
    _iconCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));

    // Stats
    _statsCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1000));

    // Quick actions pop in with elasticOut
    _actionsCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1100));
    for (var i = 0; i < 4; i++) {
      final s = i * 0.18;
      final e = (s + 0.5).clamp(0.0, 1.0);
      _actionPop.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _actionsCtrl, curve: Interval(s, e, curve: Curves.elasticOut))));
      _actionFade.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _actionsCtrl, curve: Interval(s, (s + 0.2).clamp(0.0, 1.0), curve: Curves.easeOut))));
    }

    // Transaction rows: fade + slide from BELOW (not horizontal — avoids clipping)
    _txCtrl = AnimationController(vsync: this,
        duration: Duration(milliseconds: 400 + _mockTransactions.length * 80));
    for (var i = 0; i < _mockTransactions.length; i++) {
      final s = (i * 0.09).clamp(0.0, 0.65);
      final e = (s + 0.35).clamp(0.0, 1.0);
      final interval = Interval(s, e, curve: Curves.easeOutCubic);
      _txFade.add(Tween<double>(begin: 0, end: 1)
          .animate(CurvedAnimation(parent: _txCtrl, curve: interval)));
      _txSlide.add(Tween<double>(begin: 24, end: 0)
          .animate(CurvedAnimation(parent: _txCtrl, curve: interval)));
    }

    // Stagger launch
    _cardCtrl.forward();
    _iconCtrl.forward();
    Future.delayed(const Duration(milliseconds: 200), () { if (mounted) _statsCtrl.forward(); });
    Future.delayed(const Duration(milliseconds: 350), () { if (mounted) _actionsCtrl.forward(); });
    Future.delayed(const Duration(milliseconds: 550), () { if (mounted) _txCtrl.forward(); });
  }

  @override
  void dispose() {
    _cardCtrl.dispose();
    _iconCtrl.dispose();
    _statsCtrl.dispose();
    _actionsCtrl.dispose();
    _txCtrl.dispose();
    super.dispose();
  }

  List<_Transaction> get _filtered => switch (_filter) {
    _TxFilter.credits => _mockTransactions.where((t) => t.isCredit && !t.isHold).toList(),
    _TxFilter.debits  => _mockTransactions.where((t) => !t.isCredit && !t.isHold).toList(),
    _TxFilter.onHold  => _mockTransactions.where((t) => t.isHold).toList(),
    _TxFilter.all     => _mockTransactions,
  };

  double get _totalIn  => _mockTransactions.where((t) => t.isCredit && !t.isHold).fold(0, (s, t) => s + t.amount);
  double get _totalOut => _mockTransactions.where((t) => !t.isCredit && !t.isHold).fold(0, (s, t) => s + t.amount);

  @override
  Widget build(BuildContext context) {
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        title: const Text('Wallet',
            style: TextStyle(color: _navy, fontWeight: FontWeight.w800, fontSize: 22)),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: _navy),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
        children: [

          // ── Balance Card ──────────────────────────────────────────────
          FadeTransition(
            opacity: _cardFade,
            child: SlideTransition(
              position: _cardSlide,
              child: _buildBalanceCard(),
            ),
          ),

          const SizedBox(height: 20),

          // ── Quick Actions ─────────────────────────────────────────────
          _buildQuickActions(),

          const SizedBox(height: 24),

          // ── Monthly Summary ───────────────────────────────────────────
          _buildMonthlySummary(),

          const SizedBox(height: 24),

          // ── Filter + Transactions ─────────────────────────────────────
          _buildFilterRow(),
          const SizedBox(height: 14),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${filtered.length} Transaction${filtered.length == 1 ? '' : 's'}',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: _navy)),
              Text('Apr 2026', style: const TextStyle(fontSize: 13, color: _textSec)),
            ],
          ),
          const SizedBox(height: 12),

          if (filtered.isEmpty)
            _buildEmpty()
          else
            ...filtered.asMap().entries.map((entry) {
              final globalIdx = _mockTransactions.indexOf(entry.value);
              final safeIdx = globalIdx >= 0 && globalIdx < _txFade.length ? globalIdx : 0;
              return AnimatedBuilder(
                animation: _txCtrl,
                builder: (_, child) => Opacity(
                  opacity: _txFade[safeIdx].value,
                  child: Transform.translate(
                    offset: Offset(0, _txSlide[safeIdx].value),
                    child: child,
                  ),
                ),
                child: _TransactionCard(tx: entry.value),
              );
            }),
        ],
      ),
    );
  }

  // ── Balance Card ─────────────────────────────────────────────────────────────
  Widget _buildBalanceCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1A1D2E), Color(0xFF2D3150), Color(0xFF1A1D2E)],
          stops: [0.0, 0.5, 1.0],
        ),
        boxShadow: [
          BoxShadow(color: _navy.withValues(alpha: 0.35), blurRadius: 24, offset: const Offset(0, 10)),
        ],
      ),
      child: Stack(
        children: [
          // Decorative circles
          Positioned(top: -30, right: -20,
            child: Container(width: 120, height: 120,
              decoration: BoxDecoration(shape: BoxShape.circle,
                color: _amber.withValues(alpha: 0.08)))),
          Positioned(bottom: -40, left: -20,
            child: Container(width: 150, height: 150,
              decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.04)))),

          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header row
                Row(
                  children: [
                    AnimatedBuilder(
                      animation: _iconCtrl,
                      builder: (_, child) => Transform.rotate(
                        angle: _iconCtrl.value * 2 * math.pi,
                        child: child,
                      ),
                      child: Container(
                        width: 36, height: 36,
                        decoration: BoxDecoration(
                          color: _amber.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.account_balance_wallet, color: _amber, size: 18),
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Text('Available Balance',
                        style: TextStyle(color: Colors.white60, fontSize: 14, letterSpacing: 0.3)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _success.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.circle, size: 6, color: _success),
                          SizedBox(width: 5),
                          Text('Active', style: TextStyle(color: _success, fontSize: 11, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Main balance with count-up
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 25000),
                  duration: const Duration(milliseconds: 1500),
                  curve: Curves.easeOutCubic,
                  builder: (_, v, __) => Text(
                    '₹${_fmt.format(v.round())}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 40,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                    ),
                  ),
                ),

                const SizedBox(height: 4),

                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: _hold.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.lock_outline, size: 10, color: _hold),
                          SizedBox(width: 4),
                          Text('₹4,000 on hold',
                              style: TextStyle(color: _hold, fontSize: 11, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
                Container(height: 1, color: Colors.white.withValues(alpha: 0.1)),
                const SizedBox(height: 16),

                // In / Out mini stats
                Row(
                  children: [
                    _buildCardStat('This Month In', _totalIn, _success, Icons.arrow_downward_rounded),
                    Container(width: 1, height: 36, color: Colors.white.withValues(alpha: 0.12),
                        margin: const EdgeInsets.symmetric(horizontal: 16)),
                    _buildCardStat('This Month Out', _totalOut, _error, Icons.arrow_upward_rounded),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardStat(String label, double amount, Color color, IconData icon) {
    return Expanded(
      child: Row(
        children: [
          Container(
            width: 30, height: 30,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.15), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 14),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Colors.white38, fontSize: 10)),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: amount),
                duration: const Duration(milliseconds: 1400),
                curve: Curves.easeOutCubic,
                builder: (_, v, __) => Text('₹${_fmt.format(v.round())}',
                    style: TextStyle(color: color, fontSize: 14, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Quick Actions ────────────────────────────────────────────────────────────
  Widget _buildQuickActions() {
    final actions = [
      _QA(icon: Icons.add_rounded,           label: 'Add Money', color: _amber,   onTap: _showAddMoney),
      _QA(icon: Icons.call_received_rounded,  label: 'Withdraw',  color: _info,    onTap: _showWithdraw),
      _QA(icon: Icons.send_rounded,           label: 'Pay',       color: _success, onTap: () {}),
      _QA(icon: Icons.history_rounded,        label: 'History',   color: _navy,    onTap: () {}),
    ];

    return Row(
      children: actions.asMap().entries.map((e) {
        final i = e.key;
        return Expanded(
          child: AnimatedBuilder(
            animation: _actionsCtrl,
            builder: (_, child) => Transform.scale(
              scale: _actionPop[i].value,
              child: Opacity(opacity: _actionFade[i].value.clamp(0.0, 1.0), child: child),
            ),
            child: _QuickActionBtn(qa: e.value),
          ),
        );
      }).toList(),
    );
  }

  // ── Monthly Summary ──────────────────────────────────────────────────────────
  Widget _buildMonthlySummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _border),
        boxShadow: [BoxShadow(color: _navy.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0,2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.bar_chart_rounded, color: _amber, size: 18),
              SizedBox(width: 6),
              Text('Monthly Summary', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: _navy)),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _buildSummaryBox('Total Credited', _totalIn, _success, Icons.trending_up),
              const SizedBox(width: 10),
              _buildSummaryBox('Total Debited', _totalOut, _error, Icons.trending_down),
              const SizedBox(width: 10),
              _buildSummaryBox('Net Balance', _totalIn - _totalOut, _info, Icons.account_balance_wallet_outlined),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryBox(String label, double amount, Color color, IconData icon) {
    final isNeg = amount < 0;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.15)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 16),
            const SizedBox(height: 6),
            AnimatedBuilder(
              animation: _statsCtrl,
              builder: (_, __) => Text(
                '${isNeg ? '-' : ''}₹${_fmt.format((amount.abs() * _statsCtrl.value).round())}',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: color),
              ),
            ),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 9, color: _textSec, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  // ── Filter Row ───────────────────────────────────────────────────────────────
  Widget _buildFilterRow() {
    const labels = {
      _TxFilter.all:     'All',
      _TxFilter.credits: '↓ Credits',
      _TxFilter.debits:  '↑ Debits',
      _TxFilter.onHold:  '🔒 On Hold',
    };
    const colors = {
      _TxFilter.all:     _navy,
      _TxFilter.credits: _success,
      _TxFilter.debits:  _error,
      _TxFilter.onHold:  _hold,
    };

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _TxFilter.values.map((f) {
          final sel = _filter == f;
          final col = colors[f]!;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => setState(() => _filter = f),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 220),
                curve: Curves.easeOutCubic,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                decoration: BoxDecoration(
                  color: sel ? col : Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: sel ? col : _border),
                  boxShadow: sel ? [BoxShadow(color: col.withValues(alpha: 0.2), blurRadius: 8, offset: const Offset(0, 3))] : [],
                ),
                child: Text(
                  labels[f]!,
                  style: TextStyle(
                    color: sel ? Colors.white : _textSec,
                    fontWeight: sel ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 13,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  Widget _buildEmpty() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: 1),
        duration: const Duration(milliseconds: 500),
        curve: Curves.elasticOut,
        builder: (_, v, child) => Transform.scale(scale: v, child: child),
        child: const Column(
          children: [
            Icon(Icons.account_balance_wallet_outlined, size: 64, color: _textMut),
            SizedBox(height: 12),
            Text('No transactions here', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: _navy)),
            SizedBox(height: 4),
            Text('Transactions matching this filter will appear here.',
                textAlign: TextAlign.center,
                style: TextStyle(color: _textSec, fontSize: 13)),
          ],
        ),
      ),
    );
  }

  // ── Add Money Bottom Sheet ────────────────────────────────────────────────────
  void _showAddMoney() {
    final ctrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(left: 24, right: 24, top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 40, height: 4,
                decoration: BoxDecoration(color: _border, borderRadius: BorderRadius.circular(2)))),
            const SizedBox(height: 20),
            const Text('Add Money to Wallet',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: _navy)),
            const SizedBox(height: 4),
            const Text('Choose amount and payment method',
                style: TextStyle(fontSize: 13, color: _textSec)),
            const SizedBox(height: 20),

            // Quick amounts
            const Text('Quick Select', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _textSec)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              children: [500, 1000, 2000, 5000, 10000].map((amt) =>
                GestureDetector(
                  onTap: () { ctrl.text = amt.toString(); HapticFeedback.selectionClick(); },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: _amber.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: _amber.withValues(alpha: 0.3)),
                    ),
                    child: Text('₹$amt',
                        style: const TextStyle(color: _amber, fontWeight: FontWeight.w700, fontSize: 13)),
                  ),
                ),
              ).toList(),
            ),
            const SizedBox(height: 16),

            // Amount field
            TextField(
              controller: ctrl,
              keyboardType: TextInputType.number,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: _navy),
              decoration: InputDecoration(
                labelText: 'Enter amount',
                prefixText: '₹ ',
                prefixStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: _navy),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: _border)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: _amber, width: 2)),
              ),
            ),
            const SizedBox(height: 20),

            const Text('Pay via', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _navy)),
            const SizedBox(height: 10),
            _SingleSelectPayMethods(),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () { Navigator.pop(ctx); HapticFeedback.mediumImpact(); },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _amber,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: const Text('Proceed to Pay',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Withdraw Bottom Sheet ─────────────────────────────────────────────────────
  void _showWithdraw() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(left: 24, right: 24, top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 40, height: 4,
                decoration: BoxDecoration(color: _border, borderRadius: BorderRadius.circular(2)))),
            const SizedBox(height: 20),
            const Text('Withdraw Money',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: _navy)),
            const SizedBox(height: 4),
            const Text('Transfer to your bank account',
                style: TextStyle(fontSize: 13, color: _textSec)),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: _info.withValues(alpha: 0.06),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _info.withValues(alpha: 0.2)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.account_balance, color: _info, size: 22),
                  SizedBox(width: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('HDFC Bank ****4521', style: TextStyle(fontWeight: FontWeight.w700, color: _navy, fontSize: 14)),
                    Text('Primary Account', style: TextStyle(color: _textSec, fontSize: 12)),
                  ]),
                  Spacer(),
                  Icon(Icons.check_circle, color: _success, size: 18),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const TextField(
              keyboardType: TextInputType.number,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: _navy),
              decoration: InputDecoration(
                labelText: 'Amount to withdraw',
                prefixText: '₹ ',
                helperText: 'Available: ₹25,000',
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () { Navigator.pop(ctx); HapticFeedback.mediumImpact(); },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _info,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: const Text('Withdraw Now',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Quick Action Data ────────────────────────────────────────────────────────
class _QA {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QA({required this.icon, required this.label, required this.color, required this.onTap});
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
class _QuickActionBtn extends StatefulWidget {
  final _QA qa;
  const _QuickActionBtn({required this.qa});
  @override
  State<_QuickActionBtn> createState() => _QuickActionBtnState();
}

class _QuickActionBtnState extends State<_QuickActionBtn>
    with SingleTickerProviderStateMixin {
  late AnimationController _press;
  @override
  void initState() {
    super.initState();
    _press = AnimationController(vsync: this,
        duration: const Duration(milliseconds: 80),
        reverseDuration: const Duration(milliseconds: 120),
        lowerBound: 0.88, upperBound: 1.0, value: 1.0);
  }
  @override
  void dispose() { _press.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) { _press.reverse(); HapticFeedback.selectionClick(); },
      onTapUp: (_) { _press.forward(); widget.qa.onTap(); },
      onTapCancel: () => _press.forward(),
      child: ScaleTransition(
        scale: _press,
        child: Column(
          children: [
            Container(
              width: 58, height: 58,
              decoration: BoxDecoration(
                color: widget.qa.color.withValues(alpha: 0.12),
                shape: BoxShape.circle,
                border: Border.all(color: widget.qa.color.withValues(alpha: 0.25), width: 1.5),
              ),
              child: Icon(widget.qa.icon, color: widget.qa.color, size: 26),
            ),
            const SizedBox(height: 6),
            Text(widget.qa.label,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _navy)),
          ],
        ),
      ),
    );
  }
}

// ─── Transaction Card ─────────────────────────────────────────────────────────
class _TransactionCard extends StatefulWidget {
  final _Transaction tx;
  const _TransactionCard({required this.tx});
  @override
  State<_TransactionCard> createState() => _TransactionCardState();
}

class _TransactionCardState extends State<_TransactionCard>
    with SingleTickerProviderStateMixin {
  bool _pressed = false;
  late AnimationController _popCtrl;

  static IconData _catIcon(_TxCategory c) => switch (c) {
    _TxCategory.payment    => Icons.payments_rounded,
    _TxCategory.withdrawal => Icons.account_balance_rounded,
    _TxCategory.order      => Icons.shopping_cart_rounded,
    _TxCategory.bonus      => Icons.star_rounded,
    _TxCategory.hold       => Icons.lock_clock_rounded,
    _TxCategory.refund     => Icons.replay_rounded,
    _TxCategory.topup      => Icons.add_card_rounded,
  };

  static String _catLabel(_TxCategory c) => switch (c) {
    _TxCategory.payment    => 'Payment Received',
    _TxCategory.withdrawal => 'Bank Transfer',
    _TxCategory.order      => 'Purchase',
    _TxCategory.bonus      => 'Bonus',
    _TxCategory.hold       => 'Escrow Hold',
    _TxCategory.refund     => 'Refund',
    _TxCategory.topup      => 'Top-up',
  };

  @override
  void initState() {
    super.initState();
    _popCtrl = AnimationController(vsync: this,
        duration: const Duration(milliseconds: 350));
    // Amount "pop" for credits
    if (widget.tx.isCredit) {
      Future.delayed(const Duration(milliseconds: 700),
          () { if (mounted) _popCtrl.forward(); });
    }
  }

  @override
  void dispose() { _popCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final tx = widget.tx;
    final Color iconColor = tx.isHold ? _hold : (tx.isCredit ? _success : _error);
    final Color amtColor  = tx.isHold ? _hold : (tx.isCredit ? _success : _error);
    final String prefix   = tx.isCredit && !tx.isHold ? '+' : '-';

    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: () => _showDetail(context, tx),
      child: AnimatedScale(
        scale: _pressed ? 0.97 : 1.0,
        duration: const Duration(milliseconds: 80),
        child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border(
              left: BorderSide(color: iconColor, width: 4),
              top: const BorderSide(color: _border),
              right: const BorderSide(color: _border),
              bottom: const BorderSide(color: _border),
            ),
            boxShadow: [
              BoxShadow(color: _navy.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2)),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                // Icon
                Container(
                  width: 46, height: 46,
                  decoration: BoxDecoration(
                    color: iconColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(_catIcon(tx.category), color: iconColor, size: 22),
                ),
                const SizedBox(width: 12),

                // Description + meta
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(tx.description,
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: _navy),
                          maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            decoration: BoxDecoration(
                              color: iconColor.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(_catLabel(tx.category),
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: iconColor)),
                          ),
                          const SizedBox(width: 6),
                          Text('${tx.date} · ${tx.time}',
                              style: const TextStyle(fontSize: 11, color: _textMut)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // Amount + status
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // Animated pop for credits
                    AnimatedBuilder(
                      animation: _popCtrl,
                      builder: (_, child) {
                        final scale = tx.isCredit
                            ? TweenSequence<double>([
                                TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.18), weight: 1),
                                TweenSequenceItem(tween: Tween(begin: 1.18, end: 1.0), weight: 1),
                              ]).animate(CurvedAnimation(parent: _popCtrl, curve: Curves.easeInOut)).value
                            : 1.0;
                        return Transform.scale(scale: scale, child: child);
                      },
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (tx.isHold) const Icon(Icons.lock, size: 12, color: _hold),
                          if (tx.isHold) const SizedBox(width: 3),
                          Text(
                            '$prefix₹${_fmt.format(tx.amount.toInt())}',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: amtColor),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 5),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: iconColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(tx.status,
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: iconColor)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showDetail(BuildContext context, _Transaction tx) {
    final Color col = tx.isHold ? _hold : (tx.isCredit ? _success : _error);
    final String prefix = tx.isCredit && !tx.isHold ? '+' : '-';
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4,
                decoration: BoxDecoration(color: _border, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            Container(width: 64, height: 64,
              decoration: BoxDecoration(color: col.withValues(alpha: 0.1), shape: BoxShape.circle),
              child: Icon(_TransactionCardState._catIcon(tx.category), color: col, size: 30)),
            const SizedBox(height: 12),
            Text('$prefix₹${_fmt.format(tx.amount.toInt())}',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: col)),
            const SizedBox(height: 6),
            Text(tx.description, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: _navy),
                textAlign: TextAlign.center),
            const SizedBox(height: 20),
            _detailRow('Category', _TransactionCardState._catLabel(tx.category)),
            _detailRow('Date & Time', '${tx.date} · ${tx.time}'),
            _detailRow('Status', tx.status),
            _detailRow('Transaction ID', tx.id.toUpperCase()),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: _textSec, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, color: _navy, fontSize: 13)),
        ],
      ),
    );
  }
}

// ─── Single-select payment methods (fixes issue #19) ─────────────────────────
class _SingleSelectPayMethods extends StatefulWidget {
  const _SingleSelectPayMethods();
  @override
  State<_SingleSelectPayMethods> createState() => _SingleSelectPayMethodsState();
}

class _SingleSelectPayMethodsState extends State<_SingleSelectPayMethods> {
  int _selected = 0; // default: UPI selected

  static const _methods = [
    (Icons.qr_code_scanner_rounded, 'UPI / QR Code',      'Instant transfer',            _success),
    (Icons.credit_card_rounded,      'Debit / Credit Card', 'Visa • Mastercard • RuPay',   _info),
    (Icons.account_balance_rounded,  'Net Banking',         'All major banks supported',    Color(0xFF8B5CF6)),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: _methods.asMap().entries.map((e) {
        final i = e.key;
        final m = e.value;
        final sel = _selected == i;
        return Padding(
          padding: EdgeInsets.only(bottom: i < _methods.length - 1 ? 8 : 0),
          child: _PayMethodTile(
            icon: m.$1, label: m.$2, subtitle: m.$3, color: m.$4,
            isSelected: sel,
            onSelect: () => setState(() => _selected = i),
          ),
        );
      }).toList(),
    );
  }
}

// ─── Pay Method Tile (stateless — selection managed by parent) ────────────────
class _PayMethodTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final bool isSelected;
  final VoidCallback onSelect;

  const _PayMethodTile({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.isSelected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onSelect,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? color.withValues(alpha: 0.06) : Colors.white,
          border: Border.all(color: isSelected ? color : _border, width: isSelected ? 2 : 1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(width: 36, height: 36,
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, color: color, size: 18)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.w700, color: _navy, fontSize: 13)),
                Text(subtitle, style: const TextStyle(color: _textSec, fontSize: 11)),
              ]),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 20, height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: isSelected ? color : _border, width: 2),
                color: isSelected ? color : Colors.transparent,
              ),
              child: isSelected ? const Icon(Icons.check, size: 12, color: Colors.white) : null,
            ),
          ],
        ),
      ),
    );
  }
}
