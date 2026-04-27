import 'package:flutter/material.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
// ignore: unused_element
const _textMuted = Color(0xFF9CA3AF);

class _Skill {
  final String name;
  final String description;
  final IconData icon;
  final Color color;

  const _Skill({
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
  });
}

const _allSkills = [
  _Skill(
    name: 'Mason',
    description: 'Brick laying, plastering, concrete work',
    icon: Icons.architecture,
    color: Color(0xFF6B7280),
  ),
  _Skill(
    name: 'Electrician',
    description: 'Wiring, switchboards, solar panels',
    icon: Icons.electrical_services,
    color: Color(0xFFF59E0B),
  ),
  _Skill(
    name: 'Plumber',
    description: 'Pipes, fittings, sanitation',
    icon: Icons.plumbing,
    color: Color(0xFF3B82F6),
  ),
  _Skill(
    name: 'Carpenter',
    description: 'Furniture, doors, false ceiling',
    icon: Icons.carpenter,
    color: Color(0xFFD97706),
  ),
  _Skill(
    name: 'Painter',
    description: 'Interior, exterior, waterproofing',
    icon: Icons.format_paint,
    color: Color(0xFF8B5CF6),
  ),
  _Skill(
    name: 'Welder',
    description: 'Steel gates, grills, fabrication',
    icon: Icons.handyman,
    color: Color(0xFFEF4444),
  ),
  _Skill(
    name: 'Tiler',
    description: 'Floor, wall, and bathroom tiles',
    icon: Icons.grid_view,
    color: Color(0xFF06B6D4),
  ),
  _Skill(
    name: 'Helper',
    description: 'General site assistance',
    icon: Icons.construction,
    color: Color(0xFF10B981),
  ),
];

class SkillsScreen extends StatefulWidget {
  const SkillsScreen({super.key});

  @override
  State<SkillsScreen> createState() => _SkillsScreenState();
}

class _SkillsScreenState extends State<SkillsScreen>
    with SingleTickerProviderStateMixin {
  final Set<String> _selected = {'Mason', 'Plumber'};
  bool _isSaving = false;
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

  Future<void> _save() async {
    if (_selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select at least one skill'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }
    setState(() => _isSaving = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    setState(() => _isSaving = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white, size: 18),
            SizedBox(width: 8),
            Text('Skills updated!'),
          ],
        ),
        backgroundColor: _success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
    Navigator.pop(context);
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
        title: const Text('Manage Skills',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: TextButton(
              onPressed: () => setState(() => _selected.clear()),
              child: const Text('Clear', style: TextStyle(color: Colors.white70, fontSize: 13)),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Header pill
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: Colors.white,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: _amber.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${_selected.length} selected',
                    style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w700, color: _amber),
                  ),
                ),
                const SizedBox(width: 10),
                const Text('Select all that apply to you',
                    style: TextStyle(fontSize: 12, color: _textSecondary)),
              ],
            ),
          ),
          // Skills grid
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _allSkills.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, i) {
                final skill = _allSkills[i];
                final selected = _selected.contains(skill.name);
                final delay = (i * 0.08).clamp(0.0, 0.7);
                final anim = CurvedAnimation(
                  parent: _ctrl,
                  curve: Interval(delay, (delay + 0.4).clamp(0.0, 1.0),
                      curve: Curves.easeOutCubic),
                );
                return FadeTransition(
                  opacity: anim,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, 0.25),
                      end: Offset.zero,
                    ).animate(anim),
                    child: GestureDetector(
                      onTap: () => setState(() {
                        if (selected) {
                          _selected.remove(skill.name);
                        } else {
                          _selected.add(skill.name);
                        }
                      }),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: selected ? skill.color.withValues(alpha: 0.06) : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: selected ? skill.color : _border,
                            width: selected ? 2 : 1,
                          ),
                          boxShadow: selected
                              ? [BoxShadow(color: skill.color.withValues(alpha: 0.12), blurRadius: 8, offset: const Offset(0, 3))]
                              : [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 4, offset: const Offset(0, 2))],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: skill.color.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(skill.icon, color: skill.color, size: 22),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(skill.name,
                                      style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: selected ? skill.color : _navy)),
                                  const SizedBox(height: 2),
                                  Text(skill.description,
                                      style: const TextStyle(
                                          fontSize: 12, color: _textSecondary)),
                                ],
                              ),
                            ),
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                color: selected ? skill.color : Colors.transparent,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: selected ? skill.color : _border,
                                  width: 2,
                                ),
                              ),
                              child: selected
                                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                                  : const SizedBox.shrink(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Save button
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
            child: SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isSaving ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _amber,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isSaving
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                      )
                    : const Text('Save Skills',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
