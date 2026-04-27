import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:shimmer/shimmer.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _surface = Colors.white;
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

final _rateFmt = NumberFormat('##,##,###', 'en_IN');

// ─── Model ────────────────────────────────────────────────────────────────────

class WorkerModel {
  final String id;
  final String name;
  final String skill;
  final String location;
  final double rating;
  final int dailyRate;
  final bool isAvailable;
  final String photoUrl;
  final String bio;
  final int jobsDone;
  final int experienceYears;

  const WorkerModel({
    required this.id,
    required this.name,
    required this.skill,
    required this.location,
    required this.rating,
    required this.dailyRate,
    required this.isAvailable,
    required this.photoUrl,
    required this.bio,
    required this.jobsDone,
    required this.experienceYears,
  });
}

final List<WorkerModel> mockWorkers = [
  WorkerModel(
    id: 'w1', name: 'Ravi Kumar', skill: 'Mason', location: 'Gachibowli, Hyd',
    rating: 4.8, dailyRate: 950, isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    bio: 'Expert mason with 12 years of experience in residential and commercial construction. Specializes in brick laying and plastering.',
    jobsDone: 187, experienceYears: 12,
  ),
  WorkerModel(
    id: 'w2', name: 'Suresh Reddy', skill: 'Electrician', location: 'Madhapur, Hyd',
    rating: 4.6, dailyRate: 1100, isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    bio: 'Certified electrician specializing in residential wiring, switchboard fitting, and solar panel installation.',
    jobsDone: 134, experienceYears: 8,
  ),
  WorkerModel(
    id: 'w3', name: 'Mohammed Ali', skill: 'Plumber', location: 'Tolichowki, Hyd',
    rating: 4.5, dailyRate: 900, isAvailable: false,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    bio: 'Experienced plumber skilled in pipe fitting, bathroom installation, and drainage solutions for modern homes.',
    jobsDone: 210, experienceYears: 10,
  ),
  WorkerModel(
    id: 'w4', name: 'Venkat Naidu', skill: 'Carpenter', location: 'Kukatpally, Hyd',
    rating: 4.9, dailyRate: 1200, isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    bio: 'Master carpenter with expertise in modular furniture, false ceilings, and custom wood work for interiors.',
    jobsDone: 256, experienceYears: 15,
  ),
  WorkerModel(
    id: 'w5', name: 'Anand Sharma', skill: 'Painter', location: 'HITEC City, Hyd',
    rating: 4.4, dailyRate: 800, isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    bio: 'Professional painter with experience in interior and exterior painting, texture finishes, and waterproofing coatings.',
    jobsDone: 145, experienceYears: 7,
  ),
  WorkerModel(
    id: 'w6', name: 'Ramesh Yadav', skill: 'Welder', location: 'Uppal, Hyd',
    rating: 4.7, dailyRate: 1050, isAvailable: false,
    photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80',
    bio: 'Certified welder proficient in MIG, TIG, and arc welding for structural steel, gates, and metal fabrication.',
    jobsDone: 92, experienceYears: 9,
  ),
  WorkerModel(
    id: 'w7', name: 'Kishore Babu', skill: 'Mason', location: 'Begumpet, Hyd',
    rating: 4.3, dailyRate: 850, isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
    bio: 'Skilled mason experienced in foundation work, column casting, and finishing for budget residential projects.',
    jobsDone: 108, experienceYears: 6,
  ),
  WorkerModel(
    id: 'w8', name: 'Prakash Tiwari', skill: 'Electrician', location: 'LB Nagar, Hyd',
    rating: 4.5, dailyRate: 1000, isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80',
    bio: 'Industrial and residential electrician with expertise in DB panel installation, earthing, and load testing.',
    jobsDone: 163, experienceYears: 11,
  ),
];

const List<String> _skills = ['All', 'Mason', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder'];

// ─── Pulsing Dot ──────────────────────────────────────────────────────────────

class _PulsingDot extends StatefulWidget {
  const _PulsingDot();

  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (_, __) => Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.green.withValues(alpha: 0.3 + 0.7 * _ctrl.value),
        ),
        child: Center(
          child: Container(
            width: 6,
            height: 6,
            decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.green),
          ),
        ),
      ),
    );
  }
}

// ─── Workers Screen ───────────────────────────────────────────────────────────

class WorkersScreen extends ConsumerStatefulWidget {
  const WorkersScreen({super.key});

  @override
  ConsumerState<WorkersScreen> createState() => _WorkersScreenState();
}

class _WorkersScreenState extends ConsumerState<WorkersScreen>
    with TickerProviderStateMixin {
  String _selectedSkill = 'All';
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = true;
  bool _searchFocused = false;
  final FocusNode _searchFocus = FocusNode();

  // Search bar slide-in
  late AnimationController _searchSlideCtrl;
  late Animation<Offset> _searchSlideAnim;

  // Skill chips stagger
  late AnimationController _chipStaggerCtrl;

  // Worker cards stagger
  late AnimationController _cardsCtrl;

  @override
  void initState() {
    super.initState();

    _searchSlideCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _searchSlideAnim = Tween<Offset>(
      begin: const Offset(0, -1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _searchSlideCtrl, curve: Curves.easeOutCubic));

    _chipStaggerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _cardsCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _searchController.addListener(() {
      setState(() => _searchQuery = _searchController.text.toLowerCase());
    });

    _searchFocus.addListener(() {
      setState(() => _searchFocused = _searchFocus.hasFocus);
    });

    // Simulate shimmer loading then reveal content
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        setState(() => _isLoading = false);
        _searchSlideCtrl.forward();
        _chipStaggerCtrl.forward();
        _cardsCtrl.forward();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocus.dispose();
    _searchSlideCtrl.dispose();
    _chipStaggerCtrl.dispose();
    _cardsCtrl.dispose();
    super.dispose();
  }

  List<WorkerModel> get _filteredWorkers {
    return mockWorkers.where((w) {
      final matchesSkill = _selectedSkill == 'All' || w.skill == _selectedSkill;
      final matchesSearch = _searchQuery.isEmpty ||
          w.name.toLowerCase().contains(_searchQuery) ||
          w.skill.toLowerCase().contains(_searchQuery) ||
          w.location.toLowerCase().contains(_searchQuery);
      return matchesSkill && matchesSearch;
    }).toList();
  }

  Animation<double> _chipAnim(int i) => CurvedAnimation(
    parent: _chipStaggerCtrl,
    curve: Interval(
      (i * 0.08).clamp(0.0, 0.7),
      (i * 0.08 + 0.3).clamp(0.0, 1.0),
      curve: Curves.easeOutCubic,
    ),
  );

  @override
  Widget build(BuildContext context) {
    final workers = _filteredWorkers;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text(
          'Find Workers',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
        ),
      ),
      body: Column(
        children: [
          SlideTransition(
            position: _searchSlideAnim,
            child: _buildSearchBar(),
          ),
          _buildSkillFilter(),
          Expanded(
            child: _isLoading
                ? _buildShimmerList()
                : _WorkerList(workers: workers, cardsCtrl: _cardsCtrl),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      color: _navy,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(12),
          boxShadow: _searchFocused
              ? [BoxShadow(color: _amber.withValues(alpha: 0.4), blurRadius: 8, spreadRadius: 1)]
              : [],
        ),
        child: TextField(
          controller: _searchController,
          focusNode: _searchFocus,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Search workers, skills, location...',
            hintStyle: TextStyle(color: Colors.white54),
            prefixIcon: Icon(Icons.search, color: Colors.white54),
            border: InputBorder.none,
            contentPadding: EdgeInsets.symmetric(vertical: 14),
          ),
        ),
      ),
    );
  }

  Widget _buildSkillFilter() {
    return Container(
      color: _surface,
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: _skills.asMap().entries.map((entry) {
            final i = entry.key;
            final skill = entry.value;
            final selected = _selectedSkill == skill;

            return AnimatedBuilder(
              animation: _chipAnim(i),
              builder: (_, child) => Transform.translate(
                offset: Offset(-30 * (1 - _chipAnim(i).value), 0),
                child: Opacity(opacity: _chipAnim(i).value.clamp(0.0, 1.0), child: child),
              ),
              child: GestureDetector(
                onTap: () => setState(() => _selectedSkill = skill),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: selected ? _amber : _surface,
                    border: Border.all(color: selected ? _amber : _border),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: selected
                        ? [BoxShadow(color: _amber.withValues(alpha: 0.3), blurRadius: 6, offset: const Offset(0, 2))]
                        : [],
                  ),
                  child: Text(
                    skill,
                    style: TextStyle(
                      color: selected ? Colors.white : _navy,
                      fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildShimmerList() {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (_, __) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          height: 140,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(14),
                child: Container(
                  width: 64, height: 64,
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(0, 14, 14, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(height: 14, width: 140, color: Colors.white, margin: const EdgeInsets.only(bottom: 8)),
                      Container(height: 12, width: 80, color: Colors.white, margin: const EdgeInsets.only(bottom: 8)),
                      Container(height: 12, width: 120, color: Colors.white, margin: const EdgeInsets.only(bottom: 8)),
                      Container(height: 10, width: 160, color: Colors.white),
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

// ─── Worker List ──────────────────────────────────────────────────────────────

class _WorkerList extends StatelessWidget {
  final List<WorkerModel> workers;
  final AnimationController cardsCtrl;

  const _WorkerList({required this.workers, required this.cardsCtrl});

  Animation<double> _anim(int i) => CurvedAnimation(
    parent: cardsCtrl,
    curve: Interval(
      (i * 0.1).clamp(0.0, 0.6),
      (i * 0.1 + 0.4).clamp(0.0, 1.0),
      curve: Curves.easeOutCubic,
    ),
  );

  @override
  Widget build(BuildContext context) {
    if (workers.isEmpty) {
      return _EmptyState();
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: workers.length,
      itemBuilder: (context, i) {
        final anim = _anim(i);
        return AnimatedBuilder(
          animation: anim,
          builder: (_, child) => FadeTransition(
            opacity: anim,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.1, 0),
                end: Offset.zero,
              ).animate(anim),
              child: child,
            ),
          ),
          child: WorkerCard(worker: workers[i]),
        );
      },
    );
  }
}

// ─── Empty State ──────────────────────────────────────────────────────────────

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0.0, end: 1.0),
        duration: const Duration(milliseconds: 700),
        curve: Curves.elasticOut,
        builder: (_, v, child) => Transform.scale(scale: v, child: child),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Illustrated icon stack
              SizedBox(
                width: 120,
                height: 120,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: _navy.withValues(alpha: 0.04),
                        shape: BoxShape.circle,
                      ),
                    ),
                    Container(
                      width: 88,
                      height: 88,
                      decoration: BoxDecoration(
                        color: _navy.withValues(alpha: 0.06),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const Icon(Icons.people_outline, size: 48, color: _textMuted),
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: _amber,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(Icons.search_off, size: 14, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              const Text('No workers found',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: _navy)),
              const SizedBox(height: 8),
              const Text('Try a different skill, location\nor search term.',
                  style: TextStyle(color: _textSecondary, fontSize: 14),
                  textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Worker Card ──────────────────────────────────────────────────────────────

class WorkerCard extends StatefulWidget {
  final WorkerModel worker;
  const WorkerCard({super.key, required this.worker});

  @override
  State<WorkerCard> createState() => _WorkerCardState();
}

class _WorkerCardState extends State<WorkerCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final worker = widget.worker;

    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: () => context.push('/workers/${worker.id}', extra: worker),
      child: AnimatedScale(
        scale: _pressed ? 0.97 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Hero(
                tag: 'worker_${worker.id}',
                child: ClipOval(
                  child: CachedNetworkImage(
                    imageUrl: worker.photoUrl,
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                    placeholder: (context, url) =>
                        Container(width: 64, height: 64, color: _bg),
                    errorWidget: (context, url, err) => Container(
                      width: 64, height: 64, color: _bg,
                      child: const Icon(Icons.person, size: 32, color: _textMuted),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            worker.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                              color: _navy,
                            ),
                          ),
                        ),
                        _AvailabilityBadge(isAvailable: worker.isAvailable),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      worker.skill,
                      style: const TextStyle(
                        color: _amber,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, size: 13, color: _textSecondary),
                        const SizedBox(width: 3),
                        Text(
                          worker.location,
                          style: const TextStyle(color: _textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _StarRow(rating: worker.rating),
                        const SizedBox(width: 4),
                        Text(
                          worker.rating.toStringAsFixed(1),
                          style: const TextStyle(
                            fontSize: 12,
                            color: _navy,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          '₹${_rateFmt.format(worker.dailyRate)}/day',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: _navy,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton(
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            foregroundColor: _navy,
                            side: const BorderSide(color: _border),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8)),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          onPressed: () =>
                              context.push('/workers/${worker.id}', extra: worker),
                          child: const Text('View Profile', style: TextStyle(fontSize: 12)),
                        ),
                        GestureDetector(
                          onTap: () =>
                              context.push('/workers/${worker.id}/hire', extra: worker),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: _amber,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'Hire',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Availability Badge ───────────────────────────────────────────────────────

class _AvailabilityBadge extends StatelessWidget {
  final bool isAvailable;
  const _AvailabilityBadge({required this.isAvailable});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: isAvailable ? const Color(0xFFD1FAE5) : const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isAvailable) ...[
            const _PulsingDot(),
            const SizedBox(width: 4),
          ],
          Text(
            isAvailable ? 'Available' : 'Busy',
            style: TextStyle(
              color: isAvailable ? _success : _textMuted,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

class _StarRow extends StatelessWidget {
  final double rating;
  const _StarRow({required this.rating});

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        colors: [_amber, Color(0xFFFFD700)],
      ).createShader(bounds),
      blendMode: BlendMode.srcIn,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(5, (i) => Icon(
          i < rating.floor()
              ? Icons.star
              : (i < rating ? Icons.star_half : Icons.star_border),
          size: 13,
          color: Colors.white,
        )),
      ),
    );
  }
}
