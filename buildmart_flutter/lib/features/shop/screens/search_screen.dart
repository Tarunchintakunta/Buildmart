import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

class _Product {
  final String id;
  final String name;
  final String brand;
  final double price;
  final String unit;
  final double rating;
  final String category;

  const _Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.unit,
    required this.rating,
    required this.category,
  });
}

const _searchProducts = [
  _Product(id: 'p1', name: 'UltraTech PPC Cement', brand: 'UltraTech', price: 385, unit: '50kg bag', rating: 4.5, category: 'Cement'),
  _Product(id: 'p2', name: 'SAIL TMT Steel Fe500D', brand: 'SAIL', price: 72, unit: 'per kg', rating: 4.3, category: 'Steel'),
  _Product(id: 'p3', name: 'Red Clay Bricks', brand: 'Local Kiln', price: 7, unit: 'per brick', rating: 4.0, category: 'Bricks'),
  _Product(id: 'p4', name: 'Asian Paints Apex Ultima', brand: 'Asian Paints', price: 3400, unit: '20L', rating: 4.7, category: 'Paint'),
  _Product(id: 'p5', name: 'Astral CPVC Pipe 1"', brand: 'Astral', price: 285, unit: 'per pipe', rating: 4.4, category: 'Pipes'),
  _Product(id: 'p6', name: 'Havells HRFR Cable', brand: 'Havells', price: 2200, unit: 'per coil', rating: 4.6, category: 'Electric'),
  _Product(id: 'p7', name: 'Sintex Water Tank 1000L', brand: 'Sintex', price: 8200, unit: 'unit', rating: 4.5, category: 'Hardware'),
  _Product(id: 'p8', name: 'River Sand', brand: 'Natural', price: 1800, unit: 'per tonne', rating: 3.9, category: 'Sand'),
  _Product(id: 'p9', name: 'M-Sand', brand: 'Crushed Stone', price: 1200, unit: 'per tonne', rating: 4.1, category: 'Sand'),
  _Product(id: 'p10', name: 'Fly Ash Bricks', brand: 'EcoBricks', price: 8.5, unit: 'per brick', rating: 4.2, category: 'Bricks'),
  _Product(id: 'p11', name: 'AAC Blocks', brand: 'Siporex', price: 65, unit: 'per block', rating: 4.3, category: 'Bricks'),
  _Product(id: 'p12', name: 'Birla White Putty', brand: 'Birla White', price: 520, unit: 'per bag', rating: 4.4, category: 'Paint'),
  _Product(id: 'p13', name: 'ACC OPC Cement 53 Grade', brand: 'ACC', price: 395, unit: '50kg bag', rating: 4.4, category: 'Cement'),
  _Product(id: 'p14', name: 'Tata Tiscon TMT Bars', brand: 'Tata Steel', price: 68, unit: 'per kg', rating: 4.5, category: 'Steel'),
  _Product(id: 'p15', name: 'Berger WeatherCoat Paints', brand: 'Berger', price: 2800, unit: '20L', rating: 4.3, category: 'Paint'),
];

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen>
    with TickerProviderStateMixin {
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  String _query = '';
  bool _isSearching = false; // simulated search delay
  Timer? _debounce;

  // Dismissible recent searches
  final List<String> _recentSearches = ['Cement bags', 'TMT steel', 'Red bricks', 'Asian Paints'];

  // Search bar slide-down controller
  late AnimationController _barCtrl;
  // Results stagger controller - keyed per query to re-trigger
  late AnimationController _resultsCtrl;

  @override
  void initState() {
    super.initState();

    _barCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    )..forward();

    _resultsCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _controller.addListener(_onQueryChanged);
  }

  void _onQueryChanged() {
    final text = _controller.text.toLowerCase().trim();
    if (text == _query) return;

    _debounce?.cancel();
    if (text.isEmpty) {
      setState(() {
        _query = text;
        _isSearching = false;
      });
      return;
    }

    // Start shimmer
    setState(() {
      _query = text;
      _isSearching = true;
    });

    _debounce = Timer(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      setState(() => _isSearching = false);
      _resultsCtrl.reset();
      _resultsCtrl.forward();
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.removeListener(_onQueryChanged);
    _controller.dispose();
    _focusNode.dispose();
    _barCtrl.dispose();
    _resultsCtrl.dispose();
    super.dispose();
  }

  List<_Product> get _results {
    if (_query.isEmpty) return [];
    return _searchProducts.where((p) {
      return p.name.toLowerCase().contains(_query) ||
          p.brand.toLowerCase().contains(_query) ||
          p.category.toLowerCase().contains(_query);
    }).toList();
  }

  void _setSearch(String text) {
    _controller.text = text;
    _controller.selection = TextSelection.fromPosition(
      TextPosition(offset: text.length),
    );
  }

  void _clearSearch() {
    _controller.clear();
    _debounce?.cancel();
    setState(() {
      _query = '';
      _isSearching = false;
    });
  }

  Animation<double> _resultItemAnim(int i) => CurvedAnimation(
        parent: _resultsCtrl,
        curve: Interval(
          (i * 0.08).clamp(0.0, 0.7),
          ((i * 0.08) + 0.4).clamp(0.0, 1.0),
          curve: Curves.easeOutCubic,
        ),
      );

  @override
  Widget build(BuildContext context) {
    final results = _isSearching ? <_Product>[] : _results;
    final showEmpty = !_isSearching && _query.isNotEmpty && results.isEmpty;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        titleSpacing: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, -1),
            end: Offset.zero,
          ).animate(CurvedAnimation(parent: _barCtrl, curve: Curves.easeOutCubic)),
          child: Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Container(
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.13),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white.withValues(alpha: 0.22)),
              ),
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                autofocus: true,
                style: const TextStyle(color: Colors.white, fontSize: 15),
                decoration: InputDecoration(
                  hintText: 'Search products...',
                  hintStyle: TextStyle(
                    color: Colors.white.withValues(alpha: 0.6),
                    fontSize: 14,
                  ),
                  prefixIcon: const Icon(Icons.search, color: Colors.white70, size: 20),
                  suffixIcon: _query.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                          onPressed: _clearSearch,
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ),
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        switchInCurve: Curves.easeOut,
        child: _query.isEmpty
            ? _buildRecentSearches()
            : _isSearching
                ? _buildShimmerResults(key: const ValueKey('shimmer'))
                : showEmpty
                    ? _buildEmptyState()
                    : _buildResults(results),
      ),
    );
  }

  Widget _buildRecentSearches() {
    return SingleChildScrollView(
      key: const ValueKey('recent'),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('Recent Searches',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: _navy)),
              const Spacer(),
              TextButton(
                onPressed: () => setState(() => _recentSearches.clear()),
                child: const Text('Clear', style: TextStyle(color: _textSecondary, fontSize: 13)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Dismissible recent searches (slide-out on dismiss)
          ..._recentSearches.asMap().entries.map((entry) {
            final i = entry.key;
            final s = entry.value;
            return _SlideInItem(
              delay: Duration(milliseconds: i * 60),
              child: Dismissible(
                key: Key('recent_$s'),
                direction: DismissDirection.endToStart,
                onDismissed: (_) => setState(() => _recentSearches.remove(s)),
                background: Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 16),
                  child: const Icon(Icons.delete_outline, color: Colors.red, size: 22),
                ),
                child: GestureDetector(
                  onTap: () => _setSearch(s),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: _border),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.history, size: 16, color: _textMuted),
                        const SizedBox(width: 10),
                        Text(s, style: const TextStyle(color: _navy, fontSize: 14, fontWeight: FontWeight.w500)),
                        const Spacer(),
                        const Icon(Icons.north_west, size: 14, color: _textMuted),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 24),
          const Text('Popular Categories',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: _navy)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: ['Cement', 'Steel', 'Bricks', 'Paint', 'Pipes', 'Electricals', 'Sand', 'Hardware']
                .asMap()
                .entries
                .map((entry) {
              final i = entry.key;
              final cat = entry.value;
              return _SlideInItem(
                delay: Duration(milliseconds: 200 + i * 50),
                direction: const Offset(0.3, 0),
                child: GestureDetector(
                  onTap: () => _setSearch(cat),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: _navy.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(cat,
                        style: const TextStyle(color: _navy, fontSize: 13, fontWeight: FontWeight.w500)),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildShimmerResults({Key? key}) {
    return Shimmer.fromColors(
      key: key,
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 0.72,
          ),
          itemCount: 6,
          itemBuilder: (context, index) => Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      key: const ValueKey('empty'),
      child: TweenAnimationBuilder<double>(
        duration: const Duration(milliseconds: 500),
        curve: Curves.elasticOut,
        tween: Tween(begin: 0.0, end: 1.0),
        builder: (context, scale, child) => Transform.scale(scale: scale, child: child),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_off, size: 72, color: _textMuted.withValues(alpha: 0.5)),
            const SizedBox(height: 16),
            const Text('No products found',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: _navy)),
            const SizedBox(height: 8),
            const Text(
              'Try searching for cement, steel,\nbricks, paint or pipes',
              textAlign: TextAlign.center,
              style: TextStyle(color: _textSecondary, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResults(List<_Product> results) {
    return Column(
      key: ValueKey('results_$_query'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: Text(
            '${results.length} results for "$_query"',
            style: const TextStyle(fontSize: 13, color: _textSecondary),
          ),
        ),
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.72,
            ),
            itemCount: results.length,
            itemBuilder: (context, index) {
              final p = results[index];
              final anim = _resultItemAnim(index);
              return FadeTransition(
                opacity: anim,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, 0.2),
                    end: Offset.zero,
                  ).animate(anim),
                  child: _SearchProductCard(product: p),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ─── Slide-in helper ────────────────────────────────────────────────────────

class _SlideInItem extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Offset direction;

  const _SlideInItem({
    required this.child,
    this.delay = Duration.zero,
    this.direction = const Offset(-0.3, 0),
  });

  @override
  State<_SlideInItem> createState() => _SlideInItemState();
}

class _SlideInItemState extends State<_SlideInItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fade;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    _slide = Tween<Offset>(begin: widget.direction, end: Offset.zero).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic),
    );

    if (widget.delay == Duration.zero) {
      _ctrl.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) _ctrl.forward();
      });
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
      opacity: _fade,
      child: SlideTransition(position: _slide, child: widget.child),
    );
  }
}

// ─── Search Product Card ─────────────────────────────────────────────────────

class _SearchProductCard extends StatefulWidget {
  final _Product product;

  const _SearchProductCard({required this.product});

  @override
  State<_SearchProductCard> createState() => _SearchProductCardState();
}

class _SearchProductCardState extends State<_SearchProductCard> {
  bool _added = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _border),
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
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: Container(
              height: 110,
              width: double.infinity,
              color: _navy.withValues(alpha: 0.06),
              child: const Icon(Icons.image_outlined, color: _textMuted, size: 36),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.product.name,
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w600, color: _navy),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(widget.product.brand,
                      style: const TextStyle(fontSize: 11, color: _textSecondary)),
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: _amber.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(widget.product.category,
                        style: const TextStyle(
                            color: _amber, fontSize: 10, fontWeight: FontWeight.w600)),
                  ),
                  const Spacer(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('₹${widget.product.price.toStringAsFixed(0)}',
                              style: const TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.bold, color: _navy)),
                          Text(widget.product.unit,
                              style: const TextStyle(fontSize: 10, color: _textMuted)),
                        ],
                      ),
                      GestureDetector(
                        onTap: () {
                          setState(() => _added = true);
                          Future.delayed(const Duration(milliseconds: 1200), () {
                            if (mounted) setState(() => _added = false);
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: _added ? const Color(0xFF10B981) : _amber,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 200),
                            child: _added
                                ? const Icon(Icons.check, color: Colors.white, size: 14, key: ValueKey('check'))
                                : const Text('Add',
                                    key: ValueKey('add'),
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ),
                    ],
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
