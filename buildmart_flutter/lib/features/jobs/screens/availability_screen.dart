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

const _allSkills = ['Mason', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder'];
const _workZones = ['Madhapur', 'Kukatpally', 'Banjara Hills', 'Gachibowli', 'HITEC City', 'LB Nagar'];

class AvailabilityScreen extends StatefulWidget {
  const AvailabilityScreen({super.key});

  @override
  State<AvailabilityScreen> createState() => _AvailabilityScreenState();
}

class _AvailabilityScreenState extends State<AvailabilityScreen> {
  final _formKey = GlobalKey<FormState>();
  final _dailyRateController = TextEditingController(text: '800');

  bool _isAvailable = true;
  final Set<String> _selectedSkills = {'Mason', 'Plumber'};
  final Set<String> _selectedZones = {'Madhapur', 'Gachibowli'};
  bool _isLoading = false;

  @override
  void dispose() {
    _dailyRateController.dispose();
    super.dispose();
  }

  int get _weeklyRate {
    final daily = int.tryParse(_dailyRateController.text) ?? 0;
    return daily * 6;
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedSkills.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select at least one skill'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    setState(() => _isLoading = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white, size: 18),
            SizedBox(width: 8),
            Text('Availability updated!'),
          ],
        ),
        backgroundColor: _success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
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
        title: const Text('Availability', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _buildAvailabilityToggle(),
            const SizedBox(height: 16),
            _buildRatesSection(),
            const SizedBox(height: 16),
            _buildSkillsSection(),
            const SizedBox(height: 16),
            _buildZonesSection(),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _updateProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _amber,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                      )
                    : const Text('Update Profile', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildAvailabilityToggle() {
    return GestureDetector(
      onTap: () => setState(() => _isAvailable = !_isAvailable),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: _isAvailable
                ? [_success, const Color(0xFF059669)]
                : [const Color(0xFF6B7280), const Color(0xFF4B5563)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: (_isAvailable ? _success : const Color(0xFF6B7280)).withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: _isAvailable ? Colors.white : Colors.white54,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _isAvailable ? 'Available for Work' : 'Not Available',
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _isAvailable
                        ? 'You are visible to customers and can receive booking requests'
                        : 'You are hidden from customers and will not receive bookings',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Switch(
              value: _isAvailable,
              onChanged: (v) => setState(() => _isAvailable = v),
              activeColor: Colors.white,
              activeTrackColor: Colors.white.withOpacity(0.3),
              inactiveThumbColor: Colors.white,
              inactiveTrackColor: Colors.white.withOpacity(0.2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRatesSection() {
    return _SectionCard(
      title: 'Rates',
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Daily Rate', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: _navy)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _dailyRateController,
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: _navy),
                  onChanged: (_) => setState(() {}),
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  decoration: InputDecoration(
                    prefixText: '₹ ',
                    prefixStyle: const TextStyle(fontSize: 14, color: _textSecondary),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: _border)),
                    enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: _border)),
                    focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: _amber, width: 1.5)),
                    filled: true,
                    fillColor: _bg,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Weekly Rate', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: _navy)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                  decoration: BoxDecoration(
                    color: _amberBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: _amber.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Text(
                        '₹ $_weeklyRate',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: _amber),
                      ),
                      const SizedBox(width: 6),
                      const Text('(×6)', style: TextStyle(fontSize: 11, color: _textMuted)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSkillsSection() {
    return _SectionCard(
      title: 'Skills',
      child: Column(
        children: _allSkills.map((skill) {
          final selected = _selectedSkills.contains(skill);
          return CheckboxListTile(
            value: selected,
            onChanged: (v) => setState(() {
              if (v == true) {
                _selectedSkills.add(skill);
              } else {
                _selectedSkills.remove(skill);
              }
            }),
            title: Text(skill, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: _navy)),
            controlAffinity: ListTileControlAffinity.leading,
            activeColor: _amber,
            checkColor: Colors.white,
            contentPadding: EdgeInsets.zero,
            dense: true,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildZonesSection() {
    return _SectionCard(
      title: 'Work Zones',
      subtitle: 'Select areas in Hyderabad where you can work',
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: _workZones.map((zone) {
          final selected = _selectedZones.contains(zone);
          return GestureDetector(
            onTap: () => setState(() {
              if (selected) {
                _selectedZones.remove(zone);
              } else {
                _selectedZones.add(zone);
              }
            }),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
              decoration: BoxDecoration(
                color: selected ? _navy : Colors.white,
                border: Border.all(color: selected ? _navy : _border),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.location_on, size: 13, color: selected ? Colors.white : _textMuted),
                  const SizedBox(width: 5),
                  Text(
                    zone,
                    style: TextStyle(
                      color: selected ? Colors.white : _navy,
                      fontSize: 13,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget child;

  const _SectionCard({required this.title, required this.child, this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: _navy)),
          if (subtitle != null) ...[
            const SizedBox(height: 2),
            Text(subtitle!, style: const TextStyle(fontSize: 12, color: _textSecondary)),
          ],
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}
