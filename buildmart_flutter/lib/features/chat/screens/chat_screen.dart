import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

const Color _navy = Color(0xFF1A1D2E);
const Color _amber = Color(0xFFF2960D);
const Color _bg = Color(0xFFF5F6FA);
const Color _border = Color(0xFFE5E7EB);
const Color _success = Color(0xFF10B981);
const Color _textSecondary = Color(0xFF6B7280);
const Color _textMuted = Color(0xFF9CA3AF);

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

class _Convo {
  final String id;
  final String name;
  final String role;
  final String lastMessage;
  final String time;
  final int unread;
  final Color avatarColor;
  final bool online;

  const _Convo({
    required this.id,
    required this.name,
    required this.role,
    required this.lastMessage,
    required this.time,
    required this.unread,
    required this.avatarColor,
    this.online = false,
  });
}

final _mockConvos = [
  const _Convo(
    id: 'c1',
    name: 'Rahul Contractor',
    role: 'Contractor',
    lastMessage: 'Please confirm the delivery time for tomorrow',
    time: '10:42 AM',
    unread: 3,
    avatarColor: Color(0xFF8B5CF6),
    online: true,
  ),
  const _Convo(
    id: 'c2',
    name: 'Vijay Kumar',
    role: 'Worker',
    lastMessage: 'Site work completed, photos attached',
    time: '9:30 AM',
    unread: 0,
    avatarColor: Color(0xFFF59E0B),
    online: true,
  ),
  const _Convo(
    id: 'c3',
    name: 'BuildMart Shop',
    role: 'Shopkeeper',
    lastMessage: 'Your order #ORD-1042 is ready for pickup',
    time: 'Yesterday',
    unread: 1,
    avatarColor: Color(0xFF10B981),
    online: false,
  ),
  const _Convo(
    id: 'c4',
    name: 'Ramesh Driver',
    role: 'Driver',
    lastMessage: 'I am 10 minutes away from the site',
    time: 'Yesterday',
    unread: 0,
    avatarColor: Color(0xFFEF4444),
    online: false,
  ),
  const _Convo(
    id: 'c5',
    name: 'Anita Customer',
    role: 'Customer',
    lastMessage: 'Can I change the delivery address?',
    time: 'Mon',
    unread: 2,
    avatarColor: Color(0xFF3B82F6),
    online: true,
  ),
  const _Convo(
    id: 'c6',
    name: 'Admin Support',
    role: 'Admin',
    lastMessage: 'Your account verification is complete',
    time: 'Sun',
    unread: 0,
    avatarColor: Color(0xFF6366F1),
    online: false,
  ),
];

// ─────────────────────────────────────────────────────────────────────────────
// Chat List Screen
// ─────────────────────────────────────────────────────────────────────────────

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen>
    with SingleTickerProviderStateMixin {
  bool _loading = true;
  final List<bool> _visible = List.filled(_mockConvos.length, false);
  final List<_Convo> _convos = List.from(_mockConvos);
  bool _searchFocused = false;
  final FocusNode _searchFocus = FocusNode();
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    // Show shimmer for 800ms, then real content with stagger
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() => _loading = false);
      for (var i = 0; i < _mockConvos.length; i++) {
        Future.delayed(Duration(milliseconds: i * 80), () {
          if (mounted) setState(() => _visible[i] = true);
        });
      }
    });
    _searchFocus.addListener(() {
      setState(() => _searchFocused = _searchFocus.hasFocus);
    });
    _searchCtrl.addListener(() {
      setState(() => _searchQuery = _searchCtrl.text.toLowerCase());
    });
  }

  @override
  void dispose() {
    _searchFocus.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  List<_Convo> get _filtered => _searchQuery.isEmpty
      ? _convos
      : _convos
          .where((c) =>
              c.name.toLowerCase().contains(_searchQuery) ||
              c.role.toLowerCase().contains(_searchQuery))
          .toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        title: const Text('Messages',
            style: TextStyle(
                color: _navy, fontWeight: FontWeight.w700, fontSize: 20)),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_square, color: _navy),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Animated search bar
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOut,
            height: _searchFocused ? 60 : 52,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
            color: Colors.white,
            child: Center(
              child: Container(
                decoration: BoxDecoration(
                  color: _bg,
                  border: Border.all(
                      color: _searchFocused ? _amber : _border,
                      width: _searchFocused ? 1.5 : 1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TextField(
                  controller: _searchCtrl,
                  focusNode: _searchFocus,
                  decoration: InputDecoration(
                    hintText: 'Search conversations...',
                    hintStyle:
                        const TextStyle(color: _textMuted, fontSize: 13),
                    prefixIcon:
                        const Icon(Icons.search, color: _textMuted, size: 18),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.close,
                                color: _textMuted, size: 16),
                            onPressed: () => _searchCtrl.clear(),
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: _loading ? _buildShimmer() : _buildList(),
          ),
        ],
      ),
    );
  }

  Widget _buildShimmer() {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: ListView.builder(
        itemCount: 5,
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemBuilder: (_, __) => Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(
                    color: Colors.white, shape: BoxShape.circle),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                        height: 12,
                        width: 140,
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(6))),
                    const SizedBox(height: 8),
                    Container(
                        height: 10,
                        width: double.infinity,
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(6))),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildList() {
    final filtered = _filtered;
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: filtered.length,
      itemBuilder: (ctx, i) {
        final c = filtered[i];
        final globalIndex = _convos.indexOf(c);
        final vis =
            globalIndex >= 0 && globalIndex < _visible.length
                ? _visible[globalIndex]
                : true;
        final hasUnread = c.unread > 0;

        return AnimatedSlide(
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeOutCubic,
          offset: vis ? Offset.zero : const Offset(0.1, 0),
          child: AnimatedOpacity(
            duration: const Duration(milliseconds: 350),
            opacity: vis ? 1 : 0,
            child: Dismissible(
              key: Key(c.id),
              direction: DismissDirection.endToStart,
              background: Container(
                alignment: Alignment.centerRight,
                padding: const EdgeInsets.only(right: 20),
                color: const Color(0xFFEF4444).withValues(alpha: 0.9),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.delete_outline, color: Colors.white, size: 22),
                    SizedBox(width: 8),
                    Text('Delete',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
              onDismissed: (_) =>
                  setState(() => _convos.removeWhere((cv) => cv.id == c.id)),
              child: GestureDetector(
                onTap: () => Navigator.push(
                  ctx,
                  MaterialPageRoute(
                    builder: (_) =>
                        ChatDetailScreen(chatId: c.id, name: c.name),
                  ),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(
                      left: hasUnread
                          ? const BorderSide(color: _amber, width: 3)
                          : BorderSide.none,
                      bottom: const BorderSide(color: _border),
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      // Avatar with online indicator
                      Stack(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: c.avatarColor.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                c.name[0],
                                style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  color: c.avatarColor,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ),
                          if (c.online)
                            Positioned(
                              right: 1,
                              bottom: 1,
                              child: _PulsingDot(color: _success),
                            ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(c.name,
                                      style: TextStyle(
                                        fontWeight: hasUnread
                                            ? FontWeight.w700
                                            : FontWeight.w600,
                                        color: _navy,
                                        fontSize: 14,
                                      )),
                                ),
                                Text(c.time,
                                    style: TextStyle(
                                        fontSize: 11,
                                        color: hasUnread
                                            ? _amber
                                            : _textMuted,
                                        fontWeight: hasUnread
                                            ? FontWeight.w600
                                            : FontWeight.w400)),
                              ],
                            ),
                            const SizedBox(height: 3),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 6, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: c.avatarColor
                                        .withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(c.role,
                                      style: TextStyle(
                                          fontSize: 9,
                                          color: c.avatarColor,
                                          fontWeight: FontWeight.w700)),
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    c.lastMessage,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: hasUnread
                                          ? _navy
                                          : _textSecondary,
                                      fontWeight: hasUnread
                                          ? FontWeight.w500
                                          : FontWeight.w400,
                                    ),
                                  ),
                                ),
                                if (c.unread > 0) ...[
                                  const SizedBox(width: 6),
                                  _PulsingBadge(count: c.unread),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

// Pulsing amber badge for unread count
class _PulsingBadge extends StatefulWidget {
  final int count;
  const _PulsingBadge({required this.count});

  @override
  State<_PulsingBadge> createState() => _PulsingBadgeState();
}

class _PulsingBadgeState extends State<_PulsingBadge>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900))
      ..repeat(reverse: true);
    _scale = Tween<double>(begin: 1.0, end: 1.1).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: Container(
        width: 20,
        height: 20,
        decoration: const BoxDecoration(
          color: _amber,
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text('${widget.count}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.w800,
              )),
        ),
      ),
    );
  }
}

// Pulsing online dot
class _PulsingDot extends StatefulWidget {
  final Color color;
  const _PulsingDot({required this.color});

  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat(reverse: true);
    _scale = Tween<double>(begin: 0.85, end: 1.15).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: Container(
        width: 11,
        height: 11,
        decoration: BoxDecoration(
          color: widget.color,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 1.5),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat Detail Screen
// ─────────────────────────────────────────────────────────────────────────────

class _ChatMessage {
  final String text;
  final bool isSent;
  final String time;

  const _ChatMessage(
      {required this.text, required this.isSent, required this.time});
}

final _mockMessages = [
  const _ChatMessage(
      text: 'Hi, are the materials ready for pickup?',
      isSent: true,
      time: '10:01 AM'),
  const _ChatMessage(
      text: 'Yes, everything is packed and ready at the warehouse.',
      isSent: false,
      time: '10:03 AM'),
  const _ChatMessage(
      text: 'Great! What\'s the total weight?',
      isSent: true,
      time: '10:04 AM'),
  const _ChatMessage(
      text: 'Around 240 kg. You\'ll need a truck.',
      isSent: false,
      time: '10:05 AM'),
  const _ChatMessage(
      text: 'Understood. Our driver Ramesh will arrive by 2 PM.',
      isSent: true,
      time: '10:06 AM'),
  const _ChatMessage(
      text: 'Perfect, I\'ll be here. See you then!',
      isSent: false,
      time: '10:08 AM'),
];

class ChatDetailScreen extends StatefulWidget {
  final String chatId;
  final String name;

  const ChatDetailScreen(
      {super.key, required this.chatId, this.name = 'Chat'});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen>
    with SingleTickerProviderStateMixin {
  final _msgCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final List<_ChatMessage> _messages = List.from(_mockMessages);
  // Track which messages are newly sent (animate only newest)
  final Set<int> _newMessages = {};
  bool _showTyping = false;
  bool _isSending = false;

  // Slide-up animation for input bar
  late AnimationController _inputBarCtrl;
  late Animation<Offset> _inputBarSlide;

  @override
  void initState() {
    super.initState();
    _inputBarCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));
    _inputBarSlide = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _inputBarCtrl, curve: Curves.easeOutCubic));
    _inputBarCtrl.forward();

    WidgetsBinding.instance
        .addPostFrameCallback((_) => _scrollToBottom());

    // Simulate typing indicator after 1s
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() => _showTyping = true);
        Future.delayed(const Duration(milliseconds: 2500), () {
          if (mounted) setState(() => _showTyping = false);
        });
      }
    });
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollCtrl.dispose();
    _inputBarCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_scrollCtrl.hasClients) {
      _scrollCtrl.animateTo(
        _scrollCtrl.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  void _sendMessage() {
    final text = _msgCtrl.text.trim();
    if (text.isEmpty || _isSending) return;
    setState(() {
      _isSending = true;
      final newIndex = _messages.length;
      _messages.add(_ChatMessage(text: text, isSent: true, time: 'Now'));
      _newMessages.add(newIndex);
      _msgCtrl.clear();
    });
    // Brief send animation
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) setState(() => _isSending = false);
    });
    WidgetsBinding.instance
        .addPostFrameCallback((_) => _scrollToBottom());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _navy),
          onPressed: () => Navigator.pop(context),
        ),
        titleSpacing: 0,
        title: Row(
          children: [
            Stack(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      widget.name[0],
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF8B5CF6),
                        fontSize: 15,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  right: 0,
                  bottom: 0,
                  child: _PulsingDot(color: _success),
                ),
              ],
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.name,
                    style: const TextStyle(
                        color: _navy,
                        fontWeight: FontWeight.w700,
                        fontSize: 14)),
                Row(
                  children: [
                    Container(
                      width: 7,
                      height: 7,
                      decoration: const BoxDecoration(
                        color: _success,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Text('Online',
                        style: TextStyle(
                            fontSize: 10, color: _success)),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.call_outlined, color: _navy),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              keyboardDismissBehavior:
                  ScrollViewKeyboardDismissBehavior.onDrag,
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: _messages.length + (_showTyping ? 1 : 0),
              itemBuilder: (ctx, i) {
                if (_showTyping && i == _messages.length) {
                  return AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: Align(
                      key: const ValueKey('typing'),
                      alignment: Alignment.centerLeft,
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 10, left: 36),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(16),
                              topRight: Radius.circular(16),
                              bottomLeft: Radius.circular(4),
                              bottomRight: Radius.circular(16),
                            ),
                            border: Border.all(color: _border),
                          ),
                          child: const _TypingIndicator(),
                        ),
                      ),
                    ),
                  );
                }
                final msg = _messages[i];
                final isNew = _newMessages.contains(i);
                return _AnimatedMessageBubble(
                  message: msg,
                  isNew: isNew,
                );
              },
            ),
          ),

          // Typing indicator placeholder area handled in list above

          // Slide-up input bar
          SlideTransition(
            position: _inputBarSlide,
            child: Container(
              padding: EdgeInsets.only(
                left: 16,
                right: 12,
                top: 10,
                bottom: MediaQuery.of(context).viewInsets.bottom + 12,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: _border)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgCtrl,
                      decoration: InputDecoration(
                        hintText: 'Type a message...',
                        hintStyle:
                            const TextStyle(color: _textMuted, fontSize: 14),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(color: _border)),
                        enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(color: _border)),
                        focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(
                                color: _amber, width: 1.5)),
                        filled: true,
                        fillColor: _bg,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 10),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  _SendButton(
                    onTap: _sendMessage,
                    isSending: _isSending,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Animated send button with scale + rotation
class _SendButton extends StatefulWidget {
  final VoidCallback onTap;
  final bool isSending;
  const _SendButton({required this.onTap, required this.isSending});

  @override
  State<_SendButton> createState() => _SendButtonState();
}

class _SendButtonState extends State<_SendButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;
  late Animation<double> _rotate;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 250));
    _scale = Tween<double>(begin: 1.0, end: 0.9)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
    _rotate = Tween<double>(begin: 0.0, end: -0.3)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(_SendButton old) {
    super.didUpdateWidget(old);
    if (widget.isSending && !old.isSending) {
      _ctrl.forward().then((_) => _ctrl.reverse());
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) {
        _ctrl.reverse();
        widget.onTap();
      },
      onTapCancel: () => _ctrl.reverse(),
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (_, child) => Transform.scale(
          scale: _scale.value,
          child: Transform.rotate(
            angle: _rotate.value,
            child: child,
          ),
        ),
        child: Container(
          width: 44,
          height: 44,
          decoration: const BoxDecoration(
            color: _amber,
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
        ),
      ),
    );
  }
}

// Animated message bubble — only newest animates
class _AnimatedMessageBubble extends StatefulWidget {
  final _ChatMessage message;
  final bool isNew;
  const _AnimatedMessageBubble(
      {required this.message, required this.isNew});

  @override
  State<_AnimatedMessageBubble> createState() => _AnimatedMessageBubbleState();
}

class _AnimatedMessageBubbleState extends State<_AnimatedMessageBubble>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 300));
    _opacity =
        Tween<double>(begin: 0.0, end: 1.0).animate(_ctrl);
    _slide = Tween<Offset>(
      begin: widget.message.isSent
          ? const Offset(0.3, 0)
          : const Offset(-0.3, 0),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));
    _scale = Tween<double>(begin: 0.8, end: 1.0).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));

    if (widget.isNew) {
      _ctrl.forward();
    } else {
      _ctrl.value = 1.0;
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(
        position: _slide,
        child: ScaleTransition(
          scale: _scale,
          alignment: widget.message.isSent
              ? Alignment.centerRight
              : Alignment.centerLeft,
          child: _MessageBubble(message: widget.message),
        ),
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final _ChatMessage message;
  const _MessageBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: message.isSent
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!message.isSent)
            Container(
              width: 28,
              height: 28,
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: Text('R',
                    style: TextStyle(
                        color: Color(0xFF8B5CF6),
                        fontWeight: FontWeight.w700,
                        fontSize: 11)),
              ),
            ),
          Column(
            crossAxisAlignment: message.isSent
                ? CrossAxisAlignment.end
                : CrossAxisAlignment.start,
            children: [
              Container(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.of(context).size.width * 0.65,
                ),
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: message.isSent ? _navy : Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(message.isSent ? 16 : 4),
                    bottomRight: Radius.circular(message.isSent ? 4 : 16),
                  ),
                  border:
                      message.isSent ? null : Border.all(color: _border),
                ),
                child: Text(
                  message.text,
                  style: TextStyle(
                    color: message.isSent ? Colors.white : _navy,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: 3),
              Text(message.time,
                  style:
                      const TextStyle(fontSize: 10, color: _textMuted)),
            ],
          ),
        ],
      ),
    );
  }
}

// Typing indicator: 3 bouncing dots
class _TypingIndicator extends StatefulWidget {
  const _TypingIndicator();

  @override
  State<_TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<_TypingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900))
      ..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(3, (i) {
        return AnimatedBuilder(
          animation: _ctrl,
          builder: (_, __) {
            final t = (_ctrl.value - i * 0.2).clamp(0.0, 1.0);
            final scale = 1.0 + 0.4 * math.sin(t * math.pi);
            return Transform.scale(
              scale: scale,
              child: Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 2),
                decoration: const BoxDecoration(
                    shape: BoxShape.circle, color: _textMuted),
              ),
            );
          },
        );
      }),
    );
  }
}
