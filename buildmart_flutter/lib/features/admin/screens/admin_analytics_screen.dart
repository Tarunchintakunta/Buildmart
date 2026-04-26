import 'package:flutter/material.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _error = Color(0xFFEF4444);
const _info = Color(0xFF3B82F6);
const _purple = Color(0xFF8B5CF6);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

class _BarData {
  final String label;
  final double value;
  final double max;
  const _BarData(this.label, this.value, this.max);
}

const _weekBars = [
  _BarData('Mon', 52, 80),
  _BarData('Tue', 68, 80),
  _BarData('Wed', 45, 80),
  _BarData('Thu', 80, 80),
  _BarData('Fri', 72, 80),
  _BarData('Sat', 60, 80),
  _BarData('Sun', 38, 80),
];

const _monthBars = [
  _BarData('W1', 210, 350),
  _BarData('W2', 280, 350),
  _BarData('W3', 350, 350),
  _BarData('W4', 295, 350),
];

const _yearBars = [
  _BarData('Q1', 860, 1200),
  _BarData('Q2', 1050, 1200),
  _BarData('Q3', 1200, 1200),
  _BarData('Q4', 980, 1200),
];

class _TopProduct {
  final String name;
  final double progress;
  final String revenue;
  final Color color;
  const _TopProduct(this.name, this.progress, this.revenue, this.color);
}

const _topProducts = [
  _TopProduct('UltraTech PPC Cement', 0.82, '₹1,24,600', _amber),
  _TopProduct('SAIL TMT Steel Fe500D', 0.65, '₹98,200', _info),
  _TopProduct('Asian Paints Apex Ultima', 0.48, '₹72,400', _success),
];

// Sparkline data points (normalized 0..1)
const _sparklinePoints = [
  0.3, 0.45, 0.38, 0.55, 0.5, 0.68, 0.6, 0.72, 0.65, 0.8, 0.75, 0.9,
];

// KPI data per period
const _kpiData = {
  '7D': [
    ('Orders', '342', Icons.shopping_bag_outlined, _amber, '+12%', true),
    ('Users', '1,247', Icons.people_outline, _info, '+8%', true),
    ('Revenue', '₹45.2K', Icons.account_balance_wallet_outlined, _success, '+22%', true),
    ('Avg Order', '₹1,321', Icons.receipt_long_outlined, _purple, '+5%', true),
  ],
  '30D': [
    ('Orders', '1,284', Icons.shopping_bag_outlined, _amber, '+18%', true),
    ('Users', '3,910', Icons.people_outline, _info, '+14%', true),
    ('Revenue', '₹1.8L', Icons.account_balance_wallet_outlined, _success, '+30%', true),
    ('Avg Order', '₹1,402', Icons.receipt_long_outlined, _purple, '-2%', false),
  ],
  '90D': [
    ('Orders', '3,842', Icons.shopping_bag_outlined, _amber, '+9%', true),
    ('Users', '11,200', Icons.people_outline, _info, '+21%', true),
    ('Revenue', '₹5.4L', Icons.account_balance_wallet_outlined, _success, '+16%', true),
    ('Avg Order', '₹1,405', Icons.receipt_long_outlined, _purple, '+1%', true),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

class AdminAnalyticsScreen extends StatefulWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  State<AdminAnalyticsScreen> createState() => _AdminAnalyticsScreenState();
}

class _AdminAnalyticsScreenState extends State<AdminAnalyticsScreen>
    with SingleTickerProviderStateMixin {
  String _period = '7D';
  // Used to force bar re-animation on period switch
  int _chartKey = 0;
  final List<bool> _visible = List.filled(10, false);
  bool _legendVisible = false;

  @override
  void initState() {
    super.initState();
    for (int i = 0; i < 10; i++) {
      Future.delayed(Duration(milliseconds: 80 * i), () {
        if (mounted) setState(() => _visible[i] = true);
      });
    }
    // Legend fades in last
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) setState(() => _legendVisible = true);
    });
  }

  bool _vis(int i) => i < _visible.length && _visible[i];

  Widget _animated(int index, Widget child) {
    return AnimatedOpacity(
      opacity: _vis(index) ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 450),
      child: AnimatedSlide(
        offset: _vis(index) ? Offset.zero : const Offset(0, 0.08),
        duration: const Duration(milliseconds: 450),
        curve: Curves.easeOut,
        child: child,
      ),
    );
  }

  List<_BarData> get _currentBars {
    switch (_period) {
      case '30D':
        return _monthBars;
      case '90D':
        return _yearBars;
      default:
        return _weekBars;
    }
  }

  String get _chartLabel {
    switch (_period) {
      case '30D':
        return 'Monthly Orders by Week';
      case '90D':
        return 'Quarterly Orders';
      default:
        return 'Weekly Orders';
    }
  }

  @override
  Widget build(BuildContext context) {
    final kpis = _kpiData[_period]!;
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Analytics',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _animated(0, _buildPeriodSelector()),
            const SizedBox(height: 16),
            _animated(1, _buildGmvCard()),
            const SizedBox(height: 16),
            _animated(2, _buildKpiGrid(kpis)),
            const SizedBox(height: 16),
            _animated(3, _buildBarChart()),
            const SizedBox(height: 16),
            _animated(4, _buildSparkline()),
            const SizedBox(height: 16),
            _animated(5, _buildTopProducts()),
          ],
        ),
      ),
    );
  }

  Widget _buildPeriodSelector() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _border),
      ),
      child: Stack(
        children: [
          // Sliding indicator
          Row(
            children: ['7D', '30D', '90D'].map((p) {
              return Expanded(
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  curve: Curves.easeInOut,
                  margin: const EdgeInsets.all(4),
                  height: 40,
                  decoration: BoxDecoration(
                    color: _period == p ? _navy : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              );
            }).toList(),
          ),
          Row(
            children: ['7D', '30D', '90D'].map((p) {
              final selected = _period == p;
              return Expanded(
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      _period = p;
                      _chartKey++;
                    });
                  },
                  child: Container(
                    color: Colors.transparent,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    child: Text(
                      p,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: selected ? Colors.white : _textSecondary,
                        fontWeight: selected
                            ? FontWeight.w700
                            : FontWeight.w500,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildGmvCard() {
    final gmvByPeriod = {
      '7D': ('₹4,52,000', '+18%'),
      '30D': ('₹18,40,000', '+24%'),
      '90D': ('₹54,20,000', '+31%'),
    };
    final gmv = gmvByPeriod[_period]!;

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 400),
      transitionBuilder: (child, anim) =>
          FadeTransition(opacity: anim, child: child),
      child: Container(
        key: ValueKey(_period),
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [_navy, Color(0xFF252838)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
                color: _navy.withValues(alpha: 0.3),
                blurRadius: 16,
                offset: const Offset(0, 6)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Gross Merchandise Value',
                style: TextStyle(color: Colors.white70, fontSize: 13)),
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                TweenAnimationBuilder<double>(
                  key: ValueKey(_period + '_gmv'),
                  tween: Tween(begin: 0.0, end: 1.0),
                  duration: const Duration(milliseconds: 800),
                  curve: Curves.easeOutCubic,
                  builder: (_, t, __) => Opacity(
                    opacity: t,
                    child: Text(gmv.$1,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.w800)),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _success.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.trending_up,
                          color: _success, size: 14),
                      const SizedBox(width: 4),
                      Text(gmv.$2,
                          style: const TextStyle(
                              color: _success,
                              fontWeight: FontWeight.bold,
                              fontSize: 13)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text('vs last $_period period',
                style:
                    const TextStyle(color: Colors.white54, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiGrid(
      List<(String, String, IconData, Color, String, bool)> kpis) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.5,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: List.generate(kpis.length, (index) {
        final kpi = kpis[index];
        return TweenAnimationBuilder<double>(
          key: ValueKey('${_period}_kpi_$index'),
          tween: Tween(begin: 0.8, end: 1.0),
          duration: Duration(milliseconds: 400 + index * 200),
          curve: Curves.easeOutBack,
          builder: (_, scale, child) =>
              Transform.scale(scale: scale, child: child),
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 0.0, end: 1.0),
            duration: Duration(milliseconds: 400 + index * 200),
            builder: (_, opacity, child) =>
                Opacity(opacity: opacity, child: child),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _border),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 6,
                      offset: const Offset(0, 2))
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: kpi.$4.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(kpi.$3,
                            color: kpi.$4, size: 16),
                      ),
                      const Spacer(),
                      // Trend arrow with spring scale
                      TweenAnimationBuilder<double>(
                        key: ValueKey(
                            '${_period}_trend_$index'),
                        tween: Tween(begin: 0.0, end: 1.0),
                        duration: Duration(
                            milliseconds: 600 + index * 200),
                        curve: Curves.elasticOut,
                        builder: (_, scale, child) =>
                            Transform.scale(
                                scale: scale, child: child),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: kpi.$6
                                ? _success.withValues(alpha: 0.1)
                                : _error.withValues(alpha: 0.1),
                            borderRadius:
                                BorderRadius.circular(4),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                kpi.$6
                                    ? Icons.arrow_upward
                                    : Icons.arrow_downward,
                                color: kpi.$6 ? _success : _error,
                                size: 10,
                              ),
                              const SizedBox(width: 2),
                              Text(kpi.$5,
                                  style: TextStyle(
                                      color: kpi.$6
                                          ? _success
                                          : _error,
                                      fontSize: 10,
                                      fontWeight:
                                          FontWeight.bold)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  Text(kpi.$2,
                      style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: _navy)),
                  Text(kpi.$1,
                      style: const TextStyle(
                          fontSize: 12,
                          color: _textSecondary)),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildBarChart() {
    final bars = _currentBars;
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
          Row(
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                transitionBuilder: (child, anim) =>
                    FadeTransition(opacity: anim, child: child),
                child: Text(
                  _chartLabel,
                  key: ValueKey(_chartLabel),
                  style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: _navy),
                ),
              ),
              const Spacer(),
              Text(
                _period == '7D'
                    ? 'This Week'
                    : _period == '30D'
                        ? 'This Month'
                        : 'This Year',
                style:
                    const TextStyle(fontSize: 12, color: _textMuted),
              ),
            ],
          ),
          const SizedBox(height: 20),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 400),
            transitionBuilder: (child, anim) =>
                FadeTransition(opacity: anim, child: child),
            child: SizedBox(
              key: ValueKey(_chartKey),
              height: 140,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: List.generate(bars.length, (i) {
                  return _StaggeredBar(
                    bar: bars[i],
                    index: i,
                    isHighlight: i == bars.length - (bars.length ~/ 2) - 1,
                  );
                }),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSparkline() {
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
          const Row(
            children: [
              Text('Revenue Trend',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: _navy)),
              Spacer(),
              Row(
                children: [
                  Icon(Icons.trending_up, color: _success, size: 14),
                  SizedBox(width: 4),
                  Text('+18%',
                      style: TextStyle(
                          color: _success,
                          fontWeight: FontWeight.bold,
                          fontSize: 12)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          TweenAnimationBuilder<double>(
            key: ValueKey(_period + '_sparkline'),
            tween: Tween(begin: 0.0, end: 1.0),
            duration: const Duration(milliseconds: 1200),
            curve: Curves.easeOutCubic,
            builder: (_, progress, __) => CustomPaint(
              size: const Size(double.infinity, 80),
              painter: _SparklinePainter(
                  points: _sparklinePoints, progress: progress),
            ),
          ),
          const SizedBox(height: 8),
          AnimatedOpacity(
            duration: const Duration(milliseconds: 800),
            opacity: _legendVisible ? 1.0 : 0.0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Start', style: TextStyle(fontSize: 10, color: _textMuted)),
                const Text('Mid', style: TextStyle(fontSize: 10, color: _textMuted)),
                const Text('Now', style: TextStyle(fontSize: 10, color: _textMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopProducts() {
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
          const Text('Top Products',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: _navy)),
          const SizedBox(height: 16),
          ..._topProducts.map((p) => _TopProductRow(product: p)),
        ],
      ),
    );
  }
}

// Bar that stagger-animates with index-based delay
class _StaggeredBar extends StatelessWidget {
  final _BarData bar;
  final int index;
  final bool isHighlight;

  const _StaggeredBar(
      {required this.bar,
      required this.index,
      required this.isHighlight});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: bar.value / bar.max),
          duration: Duration(milliseconds: 800 + index * 100),
          curve: Curves.easeOutCubic,
          builder: (context, progress, _) {
            return Container(
              width: 28,
              height: 120 * progress,
              decoration: BoxDecoration(
                color: isHighlight ? _amber : _navy.withValues(alpha: 0.7),
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(6)),
              ),
            );
          },
        ),
        const SizedBox(height: 6),
        Text(bar.label,
            style: const TextStyle(
                fontSize: 11, color: _textSecondary)),
      ],
    );
  }
}

class _TopProductRow extends StatelessWidget {
  final _TopProduct product;

  const _TopProductRow({required this.product});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(product.name,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: _navy)),
              ),
              Text(product.revenue,
                  style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: _navy)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: product.progress),
              duration: const Duration(milliseconds: 1000),
              curve: Curves.easeOutCubic,
              builder: (context, value, _) {
                return LinearProgressIndicator(
                  value: value,
                  backgroundColor: _bg,
                  color: product.color,
                  minHeight: 8,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Custom sparkline painter — draws line progressively using progress (0..1)
class _SparklinePainter extends CustomPainter {
  final List<double> points;
  final double progress;

  const _SparklinePainter({required this.points, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    // Draw area fill
    final fillPaint = Paint()
      ..color = _amber.withValues(alpha: 0.08)
      ..style = PaintingStyle.fill;

    // Draw line
    final linePaint = Paint()
      ..color = _amber
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..style = PaintingStyle.stroke;

    final n = points.length;
    final step = size.width / (n - 1);

    // Calculate how many segments to draw
    final totalSegments = (n - 1);
    final drawnSegments = (totalSegments * progress).floor();
    final partial = (totalSegments * progress) - drawnSegments;

    if (drawnSegments == 0 && partial == 0) return;

    // Build path for drawn portion
    final path = Path();
    final fillPath = Path();

    Offset getPoint(int i) => Offset(
          i * step,
          size.height - (points[i] * size.height * 0.85) - 4,
        );

    path.moveTo(getPoint(0).dx, getPoint(0).dy);
    fillPath.moveTo(getPoint(0).dx, size.height);
    fillPath.lineTo(getPoint(0).dx, getPoint(0).dy);

    for (int i = 0; i < drawnSegments; i++) {
      final p1 = getPoint(i);
      final p2 = getPoint(i + 1);
      // Simple cubic bezier for smooth curve
      final cp1 = Offset(p1.dx + step * 0.4, p1.dy);
      final cp2 = Offset(p2.dx - step * 0.4, p2.dy);
      path.cubicTo(cp1.dx, cp1.dy, cp2.dx, cp2.dy, p2.dx, p2.dy);
      fillPath.cubicTo(cp1.dx, cp1.dy, cp2.dx, cp2.dy, p2.dx, p2.dy);
    }

    // Draw partial last segment
    if (drawnSegments < totalSegments && partial > 0) {
      final p1 = getPoint(drawnSegments);
      final p2 = getPoint(drawnSegments + 1);
      final cp1 = Offset(p1.dx + step * 0.4, p1.dy);
      final cp2 = Offset(p2.dx - step * 0.4, p2.dy);
      final endX = p1.dx + (p2.dx - p1.dx) * partial;
      final endY = _cubicBezierY(
          p1.dy, cp1.dy, cp2.dy, p2.dy, partial);
      path.cubicTo(
          cp1.dx, cp1.dy, cp2.dx, cp2.dy, endX, endY);
      fillPath.cubicTo(
          cp1.dx, cp1.dy, cp2.dx, cp2.dy, endX, endY);
      fillPath.lineTo(endX, size.height);
    } else {
      fillPath.lineTo(getPoint(drawnSegments).dx, size.height);
    }
    fillPath.close();

    canvas.drawPath(fillPath, fillPaint);
    canvas.drawPath(path, linePaint);

    // Draw dot at current end
    final endIdx = drawnSegments < totalSegments ? drawnSegments : totalSegments;
    final endPoint = getPoint(endIdx);
    final dotPaint = Paint()
      ..color = _amber
      ..style = PaintingStyle.fill;
    canvas.drawCircle(endPoint, 4, dotPaint);
    canvas.drawCircle(
        endPoint,
        4,
        Paint()
          ..color = Colors.white
          ..style = PaintingStyle.fill);
    canvas.drawCircle(endPoint, 3, dotPaint);
  }

  double _cubicBezierY(
      double p0, double p1, double p2, double p3, double t) {
    final u = 1 - t;
    return u * u * u * p0 +
        3 * u * u * t * p1 +
        3 * u * t * t * p2 +
        t * t * t * p3;
  }

  @override
  bool shouldRepaint(_SparklinePainter old) =>
      old.progress != progress || old.points != points;
}
