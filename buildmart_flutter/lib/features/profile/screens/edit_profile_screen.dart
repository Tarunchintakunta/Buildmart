import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
// ignore: unused_element
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

const _allSkills = [
  'Mason',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Welder',
  'Tiler',
  'Fabricator'
];

class EditProfileScreen extends StatefulWidget {
  final bool isWorker;

  const EditProfileScreen({super.key, this.isWorker = false});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameController =
      TextEditingController(text: 'Ravi Kumar');
  final _emailController =
      TextEditingController(text: 'ravi.kumar@email.com');
  final _cityController =
      TextEditingController(text: 'Hyderabad');
  final _addressController = TextEditingController(
      text: 'Flat 202, Sunrise Apartments, Madhapur');
  final _dailyRateController =
      TextEditingController(text: '800');
  final _bioController = TextEditingController(
      text:
          'Experienced mason with 8 years in residential construction.');
  final _experienceController =
      TextEditingController(text: '8');

  final Set<String> _selectedSkills = {'Mason', 'Plumber'};
  bool _isLoading = false;
  bool _showSuccess = false;

  // Stagger animation for form fields
  late AnimationController _fieldsCtrl;
  final List<Animation<double>> _fieldFade = [];
  final List<Animation<Offset>> _fieldSlide = [];

  // Submit button pulse
  late AnimationController _pulseCtrl;
  late Animation<double> _pulse;

  // Avatar bounce on tap
  late AnimationController _avatarCtrl;
  late Animation<double> _avatarScale;

  @override
  void initState() {
    super.initState();

    // Field stagger: ~14 fields (sections + rows)
    const fieldCount = 14;
    _fieldsCtrl = AnimationController(
        vsync: this,
        duration:
            const Duration(milliseconds: 800));
    for (var i = 0; i < fieldCount; i++) {
      final start = (i * 0.06).clamp(0.0, 0.7);
      final end = (start + 0.35).clamp(0.0, 1.0);
      final interval = Interval(start, end, curve: Curves.easeOut);
      _fieldFade.add(Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _fieldsCtrl, curve: interval)));
      _fieldSlide.add(Tween<Offset>(
        begin: const Offset(0, 0.25),
        end: Offset.zero,
      ).animate(
          CurvedAnimation(parent: _fieldsCtrl, curve: interval)));
    }
    _fieldsCtrl.forward();

    // Submit pulse
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
    _pulse = Tween<double>(begin: 1.0, end: 1.03).animate(
        CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));

    // Avatar bounce
    _avatarCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
      lowerBound: 0.9,
      upperBound: 1.0,
      value: 1.0,
    );
    _avatarScale = _avatarCtrl;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _cityController.dispose();
    _addressController.dispose();
    _dailyRateController.dispose();
    _bioController.dispose();
    _experienceController.dispose();
    _fieldsCtrl.dispose();
    _pulseCtrl.dispose();
    _avatarCtrl.dispose();
    super.dispose();
  }

  Widget _animated(int index, Widget child) {
    final safeIdx = index.clamp(0, _fieldFade.length - 1);
    return FadeTransition(
      opacity: _fieldFade[safeIdx],
      child: SlideTransition(
        position: _fieldSlide[safeIdx],
        child: child,
      ),
    );
  }

  void _showImageOptions() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        title: const Text('Change Photo',
            style: TextStyle(
                fontWeight: FontWeight.w700, color: _navy)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _ImageOption(
                icon: Icons.camera_alt,
                label: 'Take a Photo',
                onTap: () => Navigator.pop(ctx)),
            _ImageOption(
                icon: Icons.photo_library,
                label: 'Choose from Gallery',
                onTap: () => Navigator.pop(ctx)),
            _ImageOption(
                icon: Icons.delete_outline,
                label: 'Remove Photo',
                color: Colors.red,
                onTap: () => Navigator.pop(ctx)),
          ],
        ),
      ),
    );
  }

  Future<void> _saveChanges() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    setState(() {
      _isLoading = false;
      _showSuccess = true;
    });
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Edit Profile',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Avatar with bounce on tap
            _animated(
              0,
              Center(
                child: ScaleTransition(
                  scale: _avatarScale,
                  child: Stack(
                    children: [
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFFF59E0B), _amber],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          border:
                              Border.all(color: Colors.white, width: 3),
                          boxShadow: [
                            BoxShadow(
                                color: _amber.withValues(alpha: 0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 4)),
                          ],
                        ),
                        child: const Center(
                          child: Text('RK',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: GestureDetector(
                          onTapDown: (_) => _avatarCtrl.reverse(),
                          onTapUp: (_) {
                            _avatarCtrl.forward();
                            _showImageOptions();
                          },
                          onTapCancel: () => _avatarCtrl.forward(),
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: _navy,
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: Colors.white, width: 2),
                            ),
                            child: const Icon(Icons.camera_alt,
                                color: Colors.white, size: 15),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Personal Info section
            _animated(
              1,
              _buildSection('Personal Info', [
                _buildField(
                    'Full Name', _nameController, Icons.person_outline,
                    validator: (v) => v == null || v.isEmpty
                        ? 'Name is required'
                        : null),
                const SizedBox(height: 12),
                _buildField(
                    'Email', _emailController, Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    validator: (v) {
                      if (v == null || v.isEmpty) {
                        return 'Email is required';
                      }
                      if (!v.contains('@')) {
                        return 'Enter a valid email';
                      }
                      return null;
                    }),
              ]),
            ),
            const SizedBox(height: 4),
            _animated(
              2,
              _buildSection('', [
                _buildField(
                    'City', _cityController, Icons.location_city_outlined),
                const SizedBox(height: 12),
                _buildField(
                    'Address', _addressController, Icons.home_outlined,
                    maxLines: 2),
              ]),
            ),

            if (widget.isWorker) ...[
              const SizedBox(height: 20),
              _animated(
                3,
                _buildSection('Worker Details', [
                  Row(
                    children: [
                      Expanded(
                        child: _buildField(
                            'Daily Rate (₹)',
                            _dailyRateController,
                            Icons.currency_rupee,
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly
                            ],
                            validator: (v) => v == null || v.isEmpty
                                ? 'Rate is required'
                                : null),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildField(
                            'Experience (yrs)',
                            _experienceController,
                            Icons.work_outline,
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly
                            ]),
                      ),
                    ],
                  ),
                ]),
              ),
              const SizedBox(height: 4),
              _animated(
                4,
                _buildSection('', [
                  const Text('Skills',
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: _navy)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _allSkills.map((skill) {
                      final selected = _selectedSkills.contains(skill);
                      return GestureDetector(
                        onTap: () => setState(() {
                          if (selected) {
                            _selectedSkills.remove(skill);
                          } else {
                            _selectedSkills.add(skill);
                          }
                        }),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: selected ? _amber : Colors.white,
                            border: Border.all(
                                color: selected ? _amber : _border),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            skill,
                            style: TextStyle(
                              color: selected ? Colors.white : _navy,
                              fontSize: 13,
                              fontWeight: selected
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  const Text('Bio',
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: _navy)),
                  const SizedBox(height: 8),
                  _buildField(
                      'Tell customers about yourself...',
                      _bioController,
                      null,
                      maxLines: 4),
                ]),
              ),
            ],

            const SizedBox(height: 28),

            // Save button: pulse + loading + success checkmark
            _animated(
              widget.isWorker ? 5 : 3,
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _showSuccess
                    ? Container(
                        key: const ValueKey('success'),
                        width: double.infinity,
                        height: 52,
                        decoration: BoxDecoration(
                          color: _success,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.check_circle,
                                color: Colors.white, size: 22),
                            SizedBox(width: 8),
                            Text('Profile Updated!',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700)),
                          ],
                        ),
                      )
                    : ScaleTransition(
                        key: const ValueKey('save'),
                        scale: _isLoading
                            ? const AlwaysStoppedAnimation(1.0)
                            : _pulse,
                        child: SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _saveChanges,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _amber,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.circular(12)),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2.5),
                                  )
                                : const Text('Save Changes',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700)),
                          ),
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title.isNotEmpty) ...[
            Text(title,
                style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: _navy)),
            const SizedBox(height: 14),
          ],
          ...children,
        ],
      ),
    );
  }

  Widget _buildField(
    String hint,
    TextEditingController controller,
    IconData? icon, {
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      validator: validator,
      style: const TextStyle(color: _navy, fontSize: 14),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle:
            const TextStyle(color: _textMuted, fontSize: 14),
        prefixIcon: icon != null
            ? Icon(icon, color: _textSecondary, size: 20)
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: _border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: _border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              const BorderSide(color: _amber, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Colors.red),
        ),
        filled: true,
        fillColor: _bg,
        contentPadding: EdgeInsets.symmetric(
            horizontal: icon != null ? 0 : 14, vertical: 12),
      ),
    );
  }
}

class _ImageOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? color;

  const _ImageOption(
      {required this.icon,
      required this.label,
      required this.onTap,
      this.color});

  @override
  Widget build(BuildContext context) {
    final c = color ?? _navy;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding:
            const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        child: Row(
          children: [
            Icon(icon, color: c, size: 22),
            const SizedBox(width: 14),
            Text(label,
                style: TextStyle(
                    fontSize: 15,
                    color: c,
                    fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }
}
