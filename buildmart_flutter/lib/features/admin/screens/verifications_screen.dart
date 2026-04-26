import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _error = Color(0xFFEF4444);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

class _KycItem {
  final String id;
  final String name;
  final String role;
  final String docType;
  final String submittedDate;
  final Color roleColor;

  const _KycItem({
    required this.id,
    required this.name,
    required this.role,
    required this.docType,
    required this.submittedDate,
    required this.roleColor,
  });
}

const _kycItems = [
  _KycItem(id: 'k1', name: 'Ravi Kumar', role: 'Worker', docType: 'Aadhaar Card', submittedDate: '24 Apr 2026', roleColor: Color(0xFFF59E0B)),
  _KycItem(id: 'k2', name: 'Sunita Devi', role: 'Worker', docType: 'PAN Card', submittedDate: '24 Apr 2026', roleColor: Color(0xFFF59E0B)),
  _KycItem(id: 'k3', name: 'Mohammed Irfan', role: 'Driver', docType: 'Driving License', submittedDate: '23 Apr 2026', roleColor: Color(0xFFEF4444)),
  _KycItem(id: 'k4', name: 'Lakshmi Reddy', role: 'Shopkeeper', docType: 'Aadhaar Card', submittedDate: '23 Apr 2026', roleColor: Color(0xFF10B981)),
  _KycItem(id: 'k5', name: 'Venkat Rao', role: 'Driver', docType: 'Driving License', submittedDate: '22 Apr 2026', roleColor: Color(0xFFEF4444)),
  _KycItem(id: 'k6', name: 'Priya Sharma', role: 'Shopkeeper', docType: 'PAN Card', submittedDate: '22 Apr 2026', roleColor: Color(0xFF10B981)),
  _KycItem(id: 'k7', name: 'Suresh Nair', role: 'Worker', docType: 'Aadhaar Card', submittedDate: '21 Apr 2026', roleColor: Color(0xFFF59E0B)),
  _KycItem(id: 'k8', name: 'Ananya Patel', role: 'Shopkeeper', docType: 'PAN Card', submittedDate: '21 Apr 2026', roleColor: Color(0xFF10B981)),
];

class VerificationsScreen extends StatefulWidget {
  const VerificationsScreen({super.key});

  @override
  State<VerificationsScreen> createState() => _VerificationsScreenState();
}

class _VerificationsScreenState extends State<VerificationsScreen>
    with SingleTickerProviderStateMixin {
  String _selectedFilter = 'All';
  bool _loading = true;
  final List<bool> _visible = List.filled(_kycItems.length, false);
  final Set<String> _approved = {};
  final Set<String> _rejected = {};
  final Set<String> _expanded = {};

  // For sliding tab indicator
  late TabController _tabController;
  static const _filters = ['All', 'Workers', 'Drivers', 'Shopkeepers'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _filters.length, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        setState(() => _selectedFilter = _filters[_tabController.index]);
      }
    });
    // Shimmer for 800ms
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() => _loading = false);
      for (int i = 0; i < _kycItems.length; i++) {
        Future.delayed(Duration(milliseconds: 80 * i), () {
          if (mounted) setState(() => _visible[i] = true);
        });
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<_KycItem> get _filtered {
    if (_selectedFilter == 'All') return _kycItems;
    final roleMap = {
      'Workers': 'Worker',
      'Drivers': 'Driver',
      'Shopkeepers': 'Shopkeeper',
    };
    final role = roleMap[_selectedFilter] ?? '';
    return _kycItems.where((k) => k.role == role).toList();
  }

  void _showConfirmDialog(BuildContext context, _KycItem item, bool isApprove) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(
              isApprove ? Icons.check_circle : Icons.cancel,
              color: isApprove ? _success : _error,
              size: 24,
            ),
            const SizedBox(width: 8),
            Text(
              isApprove ? 'Approve KYC' : 'Reject KYC',
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: _navy),
            ),
          ],
        ),
        content: Text(
          isApprove
              ? 'Are you sure you want to approve KYC for ${item.name}?'
              : 'Are you sure you want to reject KYC for ${item.name}?',
          style:
              const TextStyle(color: _textSecondary, fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel',
                style: TextStyle(color: _textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                if (isApprove) {
                  _approved.add(item.id);
                  _rejected.remove(item.id);
                } else {
                  _rejected.add(item.id);
                  _approved.remove(item.id);
                }
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(isApprove
                      ? '${item.name} KYC approved'
                      : '${item.name} KYC rejected'),
                  backgroundColor: isApprove ? _success : _error,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: isApprove ? _success : _error,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
              elevation: 0,
            ),
            child: Text(isApprove ? 'Approve' : 'Reject'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pendingCount = _kycItems
        .where((k) => !_approved.contains(k.id) && !_rejected.contains(k.id))
        .length;
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: Row(
          children: [
            const Text('KYC Verifications',
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18)),
            const SizedBox(width: 10),
            // Count-up pending badge
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: pendingCount.toDouble()),
              duration: const Duration(milliseconds: 800),
              curve: Curves.easeOutCubic,
              builder: (_, val, __) => Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                    color: _amber,
                    borderRadius: BorderRadius.circular(12)),
                child: Text(
                  'Pending ${val.round()}',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: _amber,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white54,
          labelStyle:
              const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          unselectedLabelStyle:
              const TextStyle(fontWeight: FontWeight.w400, fontSize: 13),
          tabs: _filters.map((f) => Tab(text: f)).toList(),
        ),
      ),
      body: _loading
          ? _buildShimmer()
          : filtered.isEmpty
              ? const _EmptyVerifications()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final item = filtered[index];
                    final globalIndex = _kycItems.indexOf(item);
                    final vis = globalIndex >= 0 &&
                            globalIndex < _visible.length
                        ? _visible[globalIndex]
                        : true;
                    return AnimatedSlide(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeOutCubic,
                      offset:
                          vis ? Offset.zero : const Offset(0, 0.15),
                      child: AnimatedOpacity(
                        opacity: vis ? 1.0 : 0.0,
                        duration: const Duration(milliseconds: 400),
                        child: _KycCard(
                          item: item,
                          isApproved: _approved.contains(item.id),
                          isRejected: _rejected.contains(item.id),
                          isExpanded: _expanded.contains(item.id),
                          onToggleExpand: () {
                            setState(() {
                              if (_expanded.contains(item.id)) {
                                _expanded.remove(item.id);
                              } else {
                                _expanded.add(item.id);
                              }
                            });
                          },
                          onApprove: () =>
                              _showConfirmDialog(context, item, true),
                          onReject: () =>
                              _showConfirmDialog(context, item, false),
                        ),
                      ),
                    );
                  },
                ),
    );
  }

  Widget _buildShimmer() {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (_, __) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          height: 100,
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}

class _EmptyVerifications extends StatelessWidget {
  const _EmptyVerifications();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.verified_user, size: 56, color: _textMuted),
          SizedBox(height: 12),
          Text('No verifications found',
              style: TextStyle(color: _textSecondary, fontSize: 16)),
        ],
      ),
    );
  }
}

class _KycCard extends StatefulWidget {
  final _KycItem item;
  final bool isApproved;
  final bool isRejected;
  final bool isExpanded;
  final VoidCallback onToggleExpand;
  final VoidCallback onApprove;
  final VoidCallback onReject;

  const _KycCard({
    required this.item,
    required this.isApproved,
    required this.isRejected,
    required this.isExpanded,
    required this.onToggleExpand,
    required this.onApprove,
    required this.onReject,
  });

  @override
  State<_KycCard> createState() => _KycCardState();
}

class _KycCardState extends State<_KycCard> {
  String get _initials {
    final parts = widget.item.name.split(' ');
    if (parts.length >= 2) return '${parts[0][0]}${parts[1][0]}';
    return parts[0][0];
  }

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    return GestureDetector(
      onTap: widget.onToggleExpand,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: widget.isApproved
                ? _success.withValues(alpha: 0.3)
                : widget.isRejected
                    ? _error.withValues(alpha: 0.3)
                    : _border,
          ),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2)),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor:
                        item.roleColor.withValues(alpha: 0.15),
                    child: Text(
                      _initials,
                      style: TextStyle(
                          color: item.roleColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 15),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              item.name,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                  color: _navy),
                            ),
                            const SizedBox(width: 8),
                            if (widget.isApproved)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                    color:
                                        _success.withValues(alpha: 0.1),
                                    borderRadius:
                                        BorderRadius.circular(4)),
                                child: const Text('Approved',
                                    style: TextStyle(
                                        color: _success,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600)),
                              )
                            else if (widget.isRejected)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                    color:
                                        _error.withValues(alpha: 0.1),
                                    borderRadius:
                                        BorderRadius.circular(4)),
                                child: const Text('Rejected',
                                    style: TextStyle(
                                        color: _error,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600)),
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: item.roleColor
                                    .withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                item.role,
                                style: TextStyle(
                                    color: item.roleColor,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.description_outlined,
                                size: 13, color: _textMuted),
                            const SizedBox(width: 4),
                            Text(item.docType,
                                style: const TextStyle(
                                    color: _textSecondary,
                                    fontSize: 12)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  AnimatedRotation(
                    turns: widget.isExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 250),
                    child: const Icon(Icons.keyboard_arrow_down,
                        color: _textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.calendar_today_outlined,
                      size: 13, color: _textMuted),
                  const SizedBox(width: 4),
                  Text('Submitted: ${item.submittedDate}',
                      style:
                          const TextStyle(color: _textMuted, fontSize: 12)),
                ],
              ),

              // Expandable document details
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOutCubic,
                height: widget.isExpanded ? null : 0,
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 250),
                  opacity: widget.isExpanded ? 1 : 0,
                  child: widget.isExpanded
                      ? Column(
                          children: [
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: _bg,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: _border),
                              ),
                              child: Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  const Text('Document Details',
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: _navy)),
                                  const SizedBox(height: 8),
                                  _DocRow(
                                      label: 'Document Type',
                                      value: item.docType),
                                  _DocRow(
                                      label: 'Submitted',
                                      value: item.submittedDate),
                                  _DocRow(label: 'Status', value: 'Under Review'),
                                  _DocRow(label: 'ID', value: item.id.toUpperCase()),
                                ],
                              ),
                            ),
                          ],
                        )
                      : const SizedBox.shrink(),
                ),
              ),

              if (!widget.isApproved && !widget.isRejected) ...[
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _ActionButton(
                        label: 'Reject',
                        icon: Icons.close,
                        color: _error,
                        onTap: widget.onReject,
                        filled: false,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _ActionButton(
                        label: 'Approve',
                        icon: Icons.check,
                        color: _success,
                        onTap: widget.onApprove,
                        filled: true,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _DocRow extends StatelessWidget {
  final String label;
  final String value;
  const _DocRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          SizedBox(
            width: 110,
            child: Text(label,
                style: const TextStyle(
                    color: _textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.w500)),
          ),
          Expanded(
            child: Text(value,
                style: const TextStyle(
                    color: _navy,
                    fontSize: 11,
                    fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}

// Animated approve/reject button with spring scale + icon switcher
class _ActionButton extends StatefulWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  final bool filled;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
    required this.filled,
  });

  @override
  State<_ActionButton> createState() => _ActionButtonState();
}

class _ActionButtonState extends State<_ActionButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 150));
    _scale = Tween<double>(begin: 1.0, end: 0.94).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        setState(() => _pressed = true);
        _ctrl.forward();
      },
      onTapUp: (_) {
        setState(() => _pressed = false);
        _ctrl.reverse();
        widget.onTap();
      },
      onTapCancel: () {
        setState(() => _pressed = false);
        _ctrl.reverse();
      },
      child: ScaleTransition(
        scale: _scale,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: widget.filled
                ? (_pressed
                    ? widget.color.withValues(alpha: 0.8)
                    : widget.color)
                : Colors.transparent,
            border: Border.all(color: widget.color),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                transitionBuilder: (child, anim) =>
                    ScaleTransition(scale: anim, child: child),
                child: Icon(
                  _pressed
                      ? (widget.filled
                          ? Icons.check_circle
                          : Icons.cancel)
                      : widget.icon,
                  key: ValueKey(_pressed),
                  size: 16,
                  color: widget.filled ? Colors.white : widget.color,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                widget.label,
                style: TextStyle(
                  color: widget.filled ? Colors.white : widget.color,
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
