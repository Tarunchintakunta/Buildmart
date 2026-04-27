import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _error = Color(0xFFEF4444);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

enum _JobStatus { completed, cancelled }

class _HistoryJob {
  final String title;
  final String employer;
  final String location;
  final int pay;
  final _JobStatus status;
  final DateTime date;
  final int daysWorked;
  final double rating;

  const _HistoryJob({
    required this.title,
    required this.employer,
    required this.location,
    required this.pay,
    required this.status,
    required this.date,
    required this.daysWorked,
    required this.rating,
  });
}

final _mockHistory = [
  _HistoryJob(title: 'Masonry Work', employer: 'Arjun Builders', location: 'Hitech City', pay: 17000, status: _JobStatus.completed, date: DateTime(2026, 4, 10), daysWorked: 20, rating: 4.8),
  _HistoryJob(title: 'Plastering', employer: 'NK Interiors', location: 'Banjara Hills', pay: 8400, status: _JobStatus.completed, date: DateTime(2026, 3, 18), daysWorked: 12, rating: 4.5),
  _HistoryJob(title: 'Tile Fitting', employer: 'Ravi Constructions', location: 'Gachibowli', pay: 5700, status: _JobStatus.completed, date: DateTime(2026, 3, 1), daysWorked: 6, rating: 5.0),
  _HistoryJob(title: 'Foundation Work', employer: 'Sai Infra', location: 'Kukatpally', pay: 0, status: _JobStatus.cancelled, date: DateTime(2026, 2, 14), daysWorked: 0, rating: 0),
  _HistoryJob(title: 'Concrete Pouring', employer: 'VK Builders', location: 'Madhapur', pay: 12600, status: _JobStatus.completed, date: DateTime(2026, 2, 1), daysWorked: 14, rating: 4.6),
  _HistoryJob(title: 'Brick Laying', employer: 'Greenfield Homes', location: 'Kompally', pay: 9500, status: _JobStatus.completed, date: DateTime(2026, 1, 15), daysWorked: 10, rating: 4.7),
];

final _dateFmt = DateFormat('dd MMM yyyy');
final _moneyFmt = NumberFormat('##,##,###', 'en_IN');

class JobHistoryScreen extends StatefulWidget {
  const JobHistoryScreen({super.key});

  @override
  State<JobHistoryScreen> createState() => _JobHistoryScreenState();
}

class _JobHistoryScreenState extends State<JobHistoryScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  _JobStatus? _filter; // null = All

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800))
      ..forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  List<_HistoryJob> get _filtered =>
      _filter == null ? _mockHistory : _mockHistory.where((j) => j.status == _filter).toList();

  int get _totalEarnings => _mockHistory
      .where((j) => j.status == _JobStatus.completed)
      .fold(0, (sum, j) => sum + j.pay);

  int get _completedCount =>
      _mockHistory.where((j) => j.status == _JobStatus.completed).length;

  double get _avgRating {
    final rated = _mockHistory.where((j) => j.rating > 0).toList();
    if (rated.isEmpty) return 0;
    return rated.fold(0.0, (sum, j) => sum + j.rating) / rated.length;
  }

  @override
  Widget build(BuildContext context) {
    final jobs = _filtered;
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Job History',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: Column(
        children: [
          // Summary banner
          _buildSummaryBanner(),
          // Filter chips
          _buildFilters(),
          // Job list
          Expanded(
            child: jobs.isEmpty
                ? _buildEmptyState()
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: jobs.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, i) {
                      final delay = (i * 0.1).clamp(0.0, 0.7);
                      final anim = CurvedAnimation(
                        parent: _ctrl,
                        curve: Interval(delay, (delay + 0.4).clamp(0.0, 1.0),
                            curve: Curves.easeOutCubic),
                      );
                      return FadeTransition(
                        opacity: anim,
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.3),
                            end: Offset.zero,
                          ).animate(anim),
                          child: _JobHistoryCard(job: jobs[i]),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryBanner() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [_navy, Color(0xFF252838)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          _SummaryTile(
            label: 'Total Earned',
            value: '₹${_moneyFmt.format(_totalEarnings)}',
            icon: Icons.account_balance_wallet,
            color: _amber,
          ),
          _SummaryTile(
            label: 'Jobs Done',
            value: '$_completedCount',
            icon: Icons.check_circle_outline,
            color: _success,
          ),
          _SummaryTile(
            label: 'Avg Rating',
            value: _avgRating.toStringAsFixed(1),
            icon: Icons.star,
            color: const Color(0xFFFBBF24),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    final filters = [null, _JobStatus.completed, _JobStatus.cancelled];
    final labels = ['All', 'Completed', 'Cancelled'];
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: List.generate(filters.length, (i) {
            final sel = _filter == filters[i];
            return GestureDetector(
              onTap: () => setState(() => _filter = filters[i]),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                decoration: BoxDecoration(
                  color: sel ? _navy : Colors.white,
                  border: Border.all(color: sel ? _navy : _border, width: sel ? 1.5 : 1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  labels[i],
                  style: TextStyle(
                    color: sel ? Colors.white : _navy,
                    fontWeight: sel ? FontWeight.w700 : FontWeight.w400,
                    fontSize: 13,
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: _navy.withValues(alpha: 0.06),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.history, size: 40, color: _textMuted),
          ),
          const SizedBox(height: 16),
          const Text('No jobs found',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: _navy)),
          const SizedBox(height: 6),
          const Text('No jobs match the selected filter.',
              style: TextStyle(fontSize: 13, color: _textSecondary)),
        ],
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _SummaryTile({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.18),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(height: 6),
          Text(value,
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 2),
          Text(label,
              style: TextStyle(fontSize: 10, color: Colors.white.withValues(alpha: 0.6))),
        ],
      ),
    );
  }
}

class _JobHistoryCard extends StatelessWidget {
  final _HistoryJob job;
  const _JobHistoryCard({required this.job});

  Color get _statusColor => job.status == _JobStatus.completed ? _success : _error;
  String get _statusLabel => job.status == _JobStatus.completed ? 'Completed' : 'Cancelled';
  IconData get _statusIcon =>
      job.status == _JobStatus.completed ? Icons.check_circle : Icons.cancel;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(
          left: BorderSide(color: _statusColor, width: 4),
          top: const BorderSide(color: _border),
          right: const BorderSide(color: _border),
          bottom: const BorderSide(color: _border),
        ),
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
              Expanded(
                child: Text(job.title,
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w700, color: _navy)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(_statusIcon, size: 11, color: _statusColor),
                    const SizedBox(width: 4),
                    Text(_statusLabel,
                        style: TextStyle(
                            fontSize: 11, fontWeight: FontWeight.w700, color: _statusColor)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.person_outline, size: 12, color: _textMuted),
              const SizedBox(width: 4),
              Text(job.employer,
                  style: const TextStyle(fontSize: 12, color: _textSecondary)),
              const SizedBox(width: 12),
              const Icon(Icons.location_on_outlined, size: 12, color: _textMuted),
              const SizedBox(width: 4),
              Text(job.location,
                  style: const TextStyle(fontSize: 12, color: _textSecondary)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              if (job.status == _JobStatus.completed) ...[
                const Icon(Icons.calendar_today, size: 12, color: _textMuted),
                const SizedBox(width: 4),
                Text('${job.daysWorked} days',
                    style: const TextStyle(fontSize: 12, color: _textSecondary)),
                const SizedBox(width: 12),
              ],
              const Icon(Icons.event, size: 12, color: _textMuted),
              const SizedBox(width: 4),
              Text(_dateFmt.format(job.date),
                  style: const TextStyle(fontSize: 12, color: _textSecondary)),
              const Spacer(),
              if (job.status == _JobStatus.completed) ...[
                Text('₹${_moneyFmt.format(job.pay)}',
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w800, color: _navy)),
              ],
            ],
          ),
          if (job.status == _JobStatus.completed && job.rating > 0) ...[
            const SizedBox(height: 8),
            const Divider(height: 1, color: _border),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text('Your rating:',
                    style: TextStyle(fontSize: 12, color: _textSecondary)),
                const SizedBox(width: 8),
                ...List.generate(
                  5,
                  (i) => Icon(
                    i < job.rating.floor()
                        ? Icons.star
                        : (i < job.rating ? Icons.star_half : Icons.star_border),
                    size: 14,
                    color: _amber,
                  ),
                ),
                const SizedBox(width: 6),
                Text(job.rating.toStringAsFixed(1),
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w600, color: _navy)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
