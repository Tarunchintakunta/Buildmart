import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

class _Cert {
  final String title;
  final String issuedBy;
  final DateTime validUntil;
  final bool verified;
  final Color color;
  final IconData icon;

  const _Cert({
    required this.title,
    required this.issuedBy,
    required this.validUntil,
    required this.verified,
    required this.color,
    required this.icon,
  });
}

final _certs = [
  _Cert(
    title: 'Mason Proficiency Certificate',
    issuedBy: 'NSDC (National Skill Dev. Corp.)',
    validUntil: DateTime(2027, 6, 30),
    verified: true,
    color: const Color(0xFF6B7280),
    icon: Icons.architecture,
  ),
  _Cert(
    title: 'Construction Safety Training',
    issuedBy: 'Telangana Skill Authority',
    validUntil: DateTime(2026, 12, 31),
    verified: true,
    color: _success,
    icon: Icons.health_and_safety,
  ),
  _Cert(
    title: 'First Aid & Emergency Response',
    issuedBy: 'Red Cross Society',
    validUntil: DateTime(2025, 9, 15),
    verified: false,
    color: const Color(0xFFEF4444),
    icon: Icons.local_hospital_outlined,
  ),
];

final _dateFmt = DateFormat('dd MMM yyyy');

class CertificationsScreen extends StatefulWidget {
  const CertificationsScreen({super.key});

  @override
  State<CertificationsScreen> createState() => _CertificationsScreenState();
}

class _CertificationsScreenState extends State<CertificationsScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

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

  bool _isExpired(_Cert cert) =>
      cert.validUntil.isBefore(DateTime.now());

  void _showAddCertSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 24,
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: _border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Add Certificate',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: _navy)),
            const SizedBox(height: 16),
            _UploadArea(
              icon: Icons.upload_file,
              label: 'Upload Certificate',
              hint: 'PDF, JPG or PNG (max 5 MB)',
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('File upload coming soon'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            const Text('Fill in the details and upload a scan of your certificate. '
                'Our team will verify it within 2–3 business days.',
                style: TextStyle(fontSize: 12, color: _textSecondary)),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _amber,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Submit for Verification',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Certifications',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Colors.white),
            onPressed: _showAddCertSheet,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Info banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: _amber.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _amber.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, color: _amber, size: 18),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Verified certificates increase your hire rate by 3×. '
                    'Verification takes 2–3 business days.',
                    style: TextStyle(fontSize: 12, color: _textSecondary),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Your Certificates',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: _navy)),
          const SizedBox(height: 12),
          ..._certs.asMap().entries.map((e) {
            final i = e.key;
            final cert = e.value;
            final delay = (i * 0.12).clamp(0.0, 0.6);
            final anim = CurvedAnimation(
              parent: _ctrl,
              curve: Interval(delay, (delay + 0.4).clamp(0.0, 1.0),
                  curve: Curves.easeOutCubic),
            );
            final expired = _isExpired(cert);
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: FadeTransition(
                opacity: anim,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, 0.25),
                    end: Offset.zero,
                  ).animate(anim),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border(
                        left: BorderSide(color: cert.color, width: 4),
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
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: cert.color.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(cert.icon, color: cert.color, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(cert.title,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: _navy)),
                              const SizedBox(height: 2),
                              Text(cert.issuedBy,
                                  style: const TextStyle(
                                      fontSize: 11, color: _textSecondary)),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(
                                    expired ? Icons.warning_amber : Icons.event_available,
                                    size: 11,
                                    color: expired ? const Color(0xFFEF4444) : _textMuted,
                                  ),
                                  const SizedBox(width: 3),
                                  Text(
                                    expired
                                        ? 'Expired ${_dateFmt.format(cert.validUntil)}'
                                        : 'Valid until ${_dateFmt.format(cert.validUntil)}',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: expired ? const Color(0xFFEF4444) : _textMuted,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        Column(
                          children: [
                            if (cert.verified)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                decoration: BoxDecoration(
                                  color: _success.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.verified, size: 11, color: _success),
                                    SizedBox(width: 3),
                                    Text('Verified',
                                        style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w700,
                                            color: _success)),
                                  ],
                                ),
                              )
                            else
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                decoration: BoxDecoration(
                                  color: _amber.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text('Pending',
                                    style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                        color: _amber)),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 8),
          // Add new button
          GestureDetector(
            onTap: _showAddCertSheet,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: _amber.withValues(alpha: 0.4), style: BorderStyle.solid, width: 1.5),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.add_circle_outline, color: _amber, size: 20),
                  SizedBox(width: 8),
                  Text('Add New Certificate',
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: _amber)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _UploadArea extends StatelessWidget {
  final IconData icon;
  final String label;
  final String hint;
  final VoidCallback onTap;

  const _UploadArea({
    required this.icon,
    required this.label,
    required this.hint,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: _bg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _border, style: BorderStyle.solid),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: _textMuted),
            const SizedBox(height: 8),
            Text(label,
                style: const TextStyle(
                    fontSize: 14, fontWeight: FontWeight.w600, color: _navy)),
            const SizedBox(height: 4),
            Text(hint,
                style: const TextStyle(fontSize: 11, color: _textMuted)),
          ],
        ),
      ),
    );
  }
}
