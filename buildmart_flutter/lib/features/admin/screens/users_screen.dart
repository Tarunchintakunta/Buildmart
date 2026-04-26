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

class _User {
  final String id;
  final String name;
  final String phone;
  final String role;
  final String joinedDate;
  bool isActive;
  final Color roleColor;

  _User({
    required this.id,
    required this.name,
    required this.phone,
    required this.role,
    required this.joinedDate,
    required this.isActive,
    required this.roleColor,
  });
}

final List<_User> _mockUsers = [
  _User(id: 'u1', name: 'Arjun Mehta', phone: '+91 98765 43210', role: 'Customer', joinedDate: '10 Jan 2026', isActive: true, roleColor: _info),
  _User(id: 'u2', name: 'Ravi Kumar', phone: '+91 87654 32109', role: 'Worker', joinedDate: '15 Jan 2026', isActive: true, roleColor: Color(0xFFF59E0B)),
  _User(id: 'u3', name: 'Lakshmi Reddy', phone: '+91 76543 21098', role: 'Shopkeeper', joinedDate: '20 Jan 2026', isActive: true, roleColor: _success),
  _User(id: 'u4', name: 'Mohammed Irfan', phone: '+91 65432 10987', role: 'Driver', joinedDate: '25 Jan 2026', isActive: false, roleColor: _error),
  _User(id: 'u5', name: 'Priya Sharma', phone: '+91 54321 09876', role: 'Contractor', joinedDate: '01 Feb 2026', isActive: true, roleColor: _purple),
  _User(id: 'u6', name: 'Venkat Rao', phone: '+91 43210 98765', role: 'Customer', joinedDate: '05 Feb 2026', isActive: true, roleColor: _info),
  _User(id: 'u7', name: 'Sunita Devi', phone: '+91 32109 87654', role: 'Worker', joinedDate: '10 Feb 2026', isActive: true, roleColor: Color(0xFFF59E0B)),
  _User(id: 'u8', name: 'Ananya Patel', phone: '+91 21098 76543', role: 'Shopkeeper', joinedDate: '15 Feb 2026', isActive: false, roleColor: _success),
  _User(id: 'u9', name: 'Suresh Nair', phone: '+91 10987 65432', role: 'Driver', joinedDate: '20 Feb 2026', isActive: true, roleColor: _error),
  _User(id: 'u10', name: 'Kavitha Singh', phone: '+91 90876 54321', role: 'Customer', joinedDate: '25 Feb 2026', isActive: true, roleColor: _info),
  _User(id: 'u11', name: 'Rahul Verma', phone: '+91 80765 43210', role: 'Contractor', joinedDate: '01 Mar 2026', isActive: true, roleColor: _purple),
  _User(id: 'u12', name: 'Meena Krishnan', phone: '+91 70654 32109', role: 'Worker', joinedDate: '05 Mar 2026', isActive: true, roleColor: Color(0xFFF59E0B)),
  _User(id: 'u13', name: 'Deepak Joshi', phone: '+91 60543 21098', role: 'Customer', joinedDate: '10 Mar 2026', isActive: false, roleColor: _info),
  _User(id: 'u14', name: 'Shalini Gupta', phone: '+91 50432 10987', role: 'Shopkeeper', joinedDate: '15 Mar 2026', isActive: true, roleColor: _success),
  _User(id: 'u15', name: 'Kiran Babu', phone: '+91 40321 09876', role: 'Admin', joinedDate: '01 Jan 2026', isActive: true, roleColor: Color(0xFF6366F1)),
];

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen>
    with SingleTickerProviderStateMixin {
  String _selectedRole = 'All';
  String _searchQuery = '';
  bool _searchFocused = false;
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocus = FocusNode();
  final List<bool> _visible = List.filled(_mockUsers.length, false);
  // For role filter chip stagger
  final List<bool> _chipVisible = List.filled(7, false);

  static const _roleFilters = [
    'All',
    'Customer',
    'Worker',
    'Shopkeeper',
    'Contractor',
    'Driver',
    'Admin'
  ];

  @override
  void initState() {
    super.initState();
    for (int i = 0; i < _mockUsers.length; i++) {
      Future.delayed(Duration(milliseconds: 80 * i), () {
        if (mounted) setState(() => _visible[i] = true);
      });
    }
    for (int i = 0; i < _roleFilters.length; i++) {
      Future.delayed(Duration(milliseconds: 50 * i + 100), () {
        if (mounted) setState(() => _chipVisible[i] = true);
      });
    }
    _searchController.addListener(() {
      setState(() => _searchQuery = _searchController.text.toLowerCase());
    });
    _searchFocus.addListener(() {
      setState(() => _searchFocused = _searchFocus.hasFocus);
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocus.dispose();
    super.dispose();
  }

  List<_User> get _filteredUsers {
    return _mockUsers.where((u) {
      final matchRole = _selectedRole == 'All' || u.role == _selectedRole;
      final matchSearch = _searchQuery.isEmpty ||
          u.name.toLowerCase().contains(_searchQuery) ||
          u.phone.contains(_searchQuery) ||
          u.role.toLowerCase().contains(_searchQuery);
      return matchRole && matchSearch;
    }).toList();
  }

  void _showUserOptions(BuildContext context, _User user) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                    color: _border,
                    borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: user.roleColor.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(
                        color: user.roleColor.withValues(alpha: 0.4),
                        width: 2),
                  ),
                  child: Center(
                    child: Text(
                      user.name.split(' ').map((p) => p[0]).take(2).join(),
                      style: TextStyle(
                          color: user.roleColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 15),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user.name,
                        style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                            color: _navy)),
                    Text(user.phone,
                        style: const TextStyle(
                            color: _textSecondary, fontSize: 13)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            _SheetOption(
              icon: Icons.person_outline,
              label: 'View Profile',
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text('Opening profile...'),
                      behavior: SnackBarBehavior.floating),
                );
              },
            ),
            _SheetOption(
              icon: user.isActive ? Icons.block : Icons.check_circle_outline,
              label: user.isActive ? 'Suspend User' : 'Activate User',
              color: user.isActive ? _error : _success,
              onTap: () {
                Navigator.pop(ctx);
                setState(() => user.isActive = !user.isActive);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(user.isActive
                        ? '${user.name} activated'
                        : '${user.name} suspended'),
                    backgroundColor: user.isActive ? _success : _error,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8)),
                  ),
                );
              },
            ),
            _SheetOption(
              icon: Icons.notifications_outlined,
              label: 'Send Notification',
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text('Notification sent!'),
                      behavior: SnackBarBehavior.floating),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredUsers;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Users',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          _buildStatsRow(),
          _buildSearchBar(),
          _buildRoleFilters(),
          Expanded(
            child: filtered.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.people_outline, size: 56, color: _textMuted),
                        SizedBox(height: 12),
                        Text('No users found',
                            style: TextStyle(
                                color: _textSecondary, fontSize: 16)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final user = filtered[index];
                      final globalIndex = _mockUsers.indexOf(user);
                      final vis =
                          globalIndex >= 0 && globalIndex < _visible.length
                              ? _visible[globalIndex]
                              : true;
                      return AnimatedSlide(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeOutCubic,
                        offset:
                            vis ? Offset.zero : const Offset(0, 0.1),
                        child: AnimatedOpacity(
                          opacity: vis ? 1.0 : 0.0,
                          duration: const Duration(milliseconds: 400),
                          child: _UserCard(
                            user: user,
                            onTap: () =>
                                _showUserOptions(context, user),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          const Icon(Icons.people, color: _navy, size: 20),
          const SizedBox(width: 8),
          const Text('Total Users:',
              style: TextStyle(color: _textSecondary, fontSize: 14)),
          const SizedBox(width: 6),
          // Count-up animation
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: 1247),
            duration: const Duration(milliseconds: 1000),
            curve: Curves.easeOutCubic,
            builder: (_, val, __) => Text(
              val.round().toString().replaceAllMapped(
                  RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
                  (m) => '${m[1]},'),
              style: const TextStyle(
                  color: _navy,
                  fontWeight: FontWeight.bold,
                  fontSize: 16),
            ),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
                color: _success.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8)),
            child: Row(
              children: [
                Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                        color: _success, shape: BoxShape.circle)),
                const SizedBox(width: 5),
                const Text('1,198 Active',
                    style: TextStyle(
                        color: _success,
                        fontSize: 12,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        decoration: BoxDecoration(
          color: _bg,
          border: Border.all(
              color: _searchFocused ? _amber : _border,
              width: _searchFocused ? 1.5 : 1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: TextField(
          controller: _searchController,
          focusNode: _searchFocus,
          decoration: InputDecoration(
            hintText: 'Search by name, phone, role...',
            hintStyle: const TextStyle(color: _textMuted, fontSize: 14),
            prefixIcon:
                const Icon(Icons.search, color: _textMuted, size: 20),
            suffixIcon: _searchQuery.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.close,
                        color: _textMuted, size: 18),
                    onPressed: () {
                      _searchController.clear();
                      setState(() => _searchQuery = '');
                    },
                  )
                : null,
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleFilters() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(bottom: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: List.generate(_roleFilters.length, (i) {
            final r = _roleFilters[i];
            final selected = _selectedRole == r;
            final vis = i < _chipVisible.length && _chipVisible[i];
            return AnimatedOpacity(
              duration: const Duration(milliseconds: 300),
              opacity: vis ? 1.0 : 0.0,
              child: AnimatedSlide(
                duration: const Duration(milliseconds: 300),
                offset: vis ? Offset.zero : const Offset(0, 0.2),
                child: GestureDetector(
                  onTap: () => setState(() => _selectedRole = r),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 7),
                          decoration: BoxDecoration(
                            color: selected ? _navy : _bg,
                            border: Border.all(
                                color: selected ? _navy : _border),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            r,
                            style: TextStyle(
                              color: selected ? Colors.white : _navy,
                              fontWeight: selected
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        // Animated amber underline
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          height: 2,
                          width: selected ? 20 : 0,
                          margin: const EdgeInsets.only(top: 3),
                          decoration: BoxDecoration(
                            color: _amber,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

class _UserCard extends StatelessWidget {
  final _User user;
  final VoidCallback onTap;

  const _UserCard({required this.user, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
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
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              // Avatar with colored role ring
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: user.roleColor.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(
                      color: user.roleColor.withValues(alpha: 0.5),
                      width: 2),
                ),
                child: Center(
                  child: Text(
                    user.name.split(' ').map((p) => p[0]).take(2).join(),
                    style: TextStyle(
                        color: user.roleColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 14),
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
                        Text(user.name,
                            style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                                color: _navy)),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: user.roleColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            user.role,
                            style: TextStyle(
                                color: user.roleColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(Icons.phone,
                            size: 12, color: _textMuted),
                        const SizedBox(width: 4),
                        Text(user.phone,
                            style: const TextStyle(
                                color: _textSecondary, fontSize: 12)),
                        const SizedBox(width: 10),
                        const Icon(Icons.calendar_today_outlined,
                            size: 12, color: _textMuted),
                        const SizedBox(width: 4),
                        Text('Joined ${user.joinedDate}',
                            style: const TextStyle(
                                color: _textMuted, fontSize: 11)),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Animated status badge
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: user.isActive
                          ? _success.withValues(alpha: 0.1)
                          : _error.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 200),
                      transitionBuilder: (child, anim) =>
                          FadeTransition(opacity: anim, child: child),
                      child: Text(
                        user.isActive ? 'Active' : 'Suspended',
                        key: ValueKey(user.isActive),
                        style: TextStyle(
                          color: user.isActive ? _success : _error,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Icon(Icons.chevron_right,
                      color: _textMuted, size: 18),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SheetOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? color;

  const _SheetOption(
      {required this.icon,
      required this.label,
      required this.onTap,
      this.color});

  @override
  Widget build(BuildContext context) {
    final c = color ?? _navy;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                  color: c.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: c, size: 20),
            ),
            const SizedBox(width: 14),
            Text(label,
                style: TextStyle(
                    fontSize: 15, fontWeight: FontWeight.w500, color: c)),
            const Spacer(),
            const Icon(Icons.chevron_right, color: _textMuted, size: 18),
          ],
        ),
      ),
    );
  }
}
