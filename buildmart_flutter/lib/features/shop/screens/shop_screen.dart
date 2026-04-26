import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:shimmer/shimmer.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
// ignore: unused_element
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _surface = Colors.white;
const _border = Color(0xFFE5E7EB);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

final _fmt = NumberFormat('##,##,###', 'en_IN');

class _Product {
  final String id;
  final String name;
  final String brand;
  final double price;
  final String unit;
  final double rating;
  final String imageUrl;
  final String category;
  final String? badge;

  const _Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.unit,
    required this.rating,
    required this.imageUrl,
    required this.category,
    this.badge,
  });
}

const _cementImg = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80';
const _steelImg = 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&q=80';
const _bricksImg = 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80';
const _paintImg = 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80';
const _pipeImg = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80';
const _electricImg = 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80';
const _tankImg = 'https://images.unsplash.com/photo-1544511916-0148ccdeb877?w=400&q=80';
const _sandImg = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80';
const _aacImg = 'https://images.unsplash.com/photo-1581147036324-c17ac41c001f?w=400&q=80';

final List<_Product> _mockProducts = [
  _Product(id: 'p1', name: 'UltraTech PPC Cement', brand: 'UltraTech', price: 385, unit: '50kg bag', rating: 4.5, imageUrl: _cementImg, category: 'Cement', badge: 'HOT'),
  _Product(id: 'p2', name: 'SAIL TMT Steel Fe500D', brand: 'SAIL', price: 72, unit: 'per kg', rating: 4.3, imageUrl: _steelImg, category: 'Steel'),
  _Product(id: 'p3', name: 'Red Clay Bricks', brand: 'Local Kiln', price: 7, unit: 'per brick', rating: 4.0, imageUrl: _bricksImg, category: 'Bricks'),
  _Product(id: 'p4', name: 'Asian Paints Apex Ultima', brand: 'Asian Paints', price: 3400, unit: '20L', rating: 4.7, imageUrl: _paintImg, category: 'Paint', badge: 'NEW'),
  _Product(id: 'p5', name: 'Astral CPVC Pipe 1"', brand: 'Astral', price: 285, unit: 'per pipe', rating: 4.4, imageUrl: _pipeImg, category: 'Pipes'),
  _Product(id: 'p6', name: 'Havells HRFR Cable', brand: 'Havells', price: 2200, unit: 'per coil', rating: 4.6, imageUrl: _electricImg, category: 'Electric'),
  _Product(id: 'p7', name: 'Sintex Water Tank 1000L', brand: 'Sintex', price: 8200, unit: 'unit', rating: 4.5, imageUrl: _tankImg, category: 'Hardware'),
  _Product(id: 'p8', name: 'River Sand', brand: 'Natural', price: 1800, unit: 'per tonne', rating: 3.9, imageUrl: _sandImg, category: 'Sand'),
  _Product(id: 'p9', name: 'M-Sand', brand: 'Crushed Stone', price: 1200, unit: 'per tonne', rating: 4.1, imageUrl: _sandImg, category: 'Sand'),
  _Product(id: 'p10', name: 'Fly Ash Bricks', brand: 'EcoBricks', price: 8.5, unit: 'per brick', rating: 4.2, imageUrl: _bricksImg, category: 'Bricks'),
  _Product(id: 'p11', name: 'AAC Blocks', brand: 'Siporex', price: 65, unit: 'per block', rating: 4.3, imageUrl: _aacImg, category: 'Bricks', badge: 'HOT'),
  _Product(id: 'p12', name: 'Birla White Putty', brand: 'Birla White', price: 520, unit: 'per bag', rating: 4.4, imageUrl: _paintImg, category: 'Paint'),
];

const List<String> _categories = ['All', 'Cement', 'Steel', 'Bricks', 'Paint', 'Pipes', 'Hardware', 'Electric', 'Sand'];

const List<String> _bannerImages = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
  'https://images.unsplash.com/photo-1581147036324-c17ac41c001f?w=800&q=80',
];

class ShopScreen extends ConsumerStatefulWidget {
  const ShopScreen({super.key});

  @override
  ConsumerState<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends ConsumerState<ShopScreen>
    with TickerProviderStateMixin {
  final PageController _bannerController = PageController();
  int _bannerIndex = 0;
  Timer? _bannerTimer;

  String _selectedCategory = 'All';
  int _cartCount = 0;

  // Shimmer loading state
  bool _loading = true;

  // Stagger animation controller for grid
  late AnimationController _gridCtrl;
  // FAB entrance animation
  late AnimationController _fabCtrl;
  // Category chips entrance
  late AnimationController _chipCtrl;

  @override
  void initState() {
    super.initState();

    _gridCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _fabCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _chipCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    // Simulate loading: shimmer for 1s, then reveal real content
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        setState(() => _loading = false);
        _gridCtrl.forward();
        _chipCtrl.forward();
        _fabCtrl.forward();
      }
    });

    _bannerTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (_bannerController.hasClients) {
        _bannerIndex = (_bannerIndex + 1) % _bannerImages.length;
        _bannerController.animateToPage(
          _bannerIndex,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _bannerTimer?.cancel();
    _bannerController.dispose();
    _gridCtrl.dispose();
    _fabCtrl.dispose();
    _chipCtrl.dispose();
    super.dispose();
  }

  List<_Product> get _filteredProducts {
    if (_selectedCategory == 'All') return _mockProducts;
    return _mockProducts.where((p) => p.category == _selectedCategory).toList();
  }

  void _selectCategory(String cat) {
    setState(() => _selectedCategory = cat);
    // Re-stagger the grid
    _gridCtrl.reset();
    _gridCtrl.forward();
  }

  void _addToCart(_Product product) {
    setState(() {
      _cartCount++;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product.name} added to cart!'),
        backgroundColor: _navy,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // Staggered animation for grid items
  Animation<double> _gridItemAnim(int i) => CurvedAnimation(
        parent: _gridCtrl,
        curve: Interval(
          (i * 0.08).clamp(0.0, 0.8),
          ((i * 0.08) + 0.5).clamp(0.0, 1.0),
          curve: Curves.easeOutCubic,
        ),
      );

  // Chip stagger animation
  Animation<double> _chipAnim(int i) => CurvedAnimation(
        parent: _chipCtrl,
        curve: Interval(
          (i * 0.07).clamp(0.0, 0.8),
          ((i * 0.07) + 0.4).clamp(0.0, 1.0),
          curve: Curves.easeOutCubic,
        ),
      );

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredProducts;

    return Scaffold(
      backgroundColor: _bg,
      floatingActionButton: ScaleTransition(
        scale: CurvedAnimation(parent: _fabCtrl, curve: Curves.elasticOut),
        child: FloatingActionButton(
          backgroundColor: _navy,
          onPressed: () => context.push('/shop/checkout'),
          child: Stack(
            alignment: Alignment.center,
            children: [
              const Icon(Icons.shopping_cart_outlined, color: Colors.white, size: 26),
              if (_cartCount > 0)
                Positioned(
                  top: 2,
                  right: 2,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (child, anim) => ScaleTransition(
                      scale: CurvedAnimation(parent: anim, curve: Curves.elasticOut),
                      child: child,
                    ),
                    child: Container(
                      key: ValueKey(_cartCount),
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(color: _amber, shape: BoxShape.circle),
                      child: Text(
                        '$_cartCount',
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Shop', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20)),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.white),
            onPressed: () => context.push('/shop/search'),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: RefreshIndicator(
        color: _amber,
        onRefresh: () async {
          setState(() => _loading = true);
          await Future.delayed(const Duration(milliseconds: 1200));
          if (mounted) {
            setState(() => _loading = false);
            _gridCtrl.reset();
            _gridCtrl.forward();
          }
        },
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          switchInCurve: Curves.easeOut,
          switchOutCurve: Curves.easeIn,
          child: _loading
              ? _buildShimmerContent()
              : _buildRealContent(filtered),
        ),
      ),
    );
  }

  Widget _buildShimmerContent() {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: SingleChildScrollView(
        physics: const NeverScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner shimmer
            Container(height: 180, color: Colors.white),
            const SizedBox(height: 8),
            // Category chips shimmer
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
              child: Row(
                children: List.generate(5, (i) => Container(
                  margin: const EdgeInsets.only(right: 8),
                  width: 64,
                  height: 32,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                )),
              ),
            ),
            // Grid shimmer
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 0.62,
                ),
                itemCount: 6,
                itemBuilder: (ctx, idx) => Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        height: 130,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(height: 12, width: double.infinity, color: Colors.white),
                            const SizedBox(height: 6),
                            Container(height: 10, width: 80, color: Colors.white),
                            const SizedBox(height: 8),
                            Container(height: 14, width: 60, color: Colors.white),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRealContent(List<_Product> filtered) {
    return CustomScrollView(
      key: const ValueKey('real_content'),
      slivers: [
        SliverToBoxAdapter(child: _buildBanner()),
        SliverToBoxAdapter(child: _buildCategoryPills()),
        SliverPadding(
          padding: const EdgeInsets.all(12),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.62,
            ),
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                if (index >= filtered.length) return null;
                final anim = _gridItemAnim(index);
                return FadeTransition(
                  opacity: anim,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, 0.25),
                      end: Offset.zero,
                    ).animate(anim),
                    child: _ProductCard(
                      product: filtered[index],
                      onAddToCart: () => _addToCart(filtered[index]),
                      onTap: () => context.push(
                        '/shop/product/${filtered[index].id}',
                        extra: filtered[index],
                      ),
                    ),
                  ),
                );
              },
              childCount: filtered.length,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBanner() {
    return Container(
      height: 180,
      color: _navy,
      child: Stack(
        children: [
          PageView.builder(
            controller: _bannerController,
            onPageChanged: (i) => setState(() => _bannerIndex = i),
            itemCount: _bannerImages.length,
            itemBuilder: (context, index) {
              return CachedNetworkImage(
                imageUrl: _bannerImages[index],
                fit: BoxFit.cover,
                width: double.infinity,
                placeholder: (context, url) => Container(color: _navy),
                errorWidget: (context, url, err) => Container(color: _navy),
              );
            },
          ),
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    _navy.withValues(alpha: 0.5),
                    Colors.transparent,
                    _navy.withValues(alpha: 0.3),
                  ],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 12,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_bannerImages.length, (i) {
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: _bannerIndex == i ? 20 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: _bannerIndex == i ? _amber : Colors.white.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(3),
                  ),
                );
              }),
            ),
          ),
          Positioned(
            bottom: 36,
            left: 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: _amber, borderRadius: BorderRadius.circular(4)),
                  child: const Text('UP TO 15% OFF', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 4),
                const Text('Construction Materials', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryPills() {
    return Container(
      color: _surface,
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: AnimatedBuilder(
          animation: _chipCtrl,
          builder: (context, _) {
            return Row(
              children: _categories.asMap().entries.map((entry) {
                final i = entry.key;
                final cat = entry.value;
                final selected = _selectedCategory == cat;
                final chipAnim = _chipAnim(i);
                return FadeTransition(
                  opacity: chipAnim,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(-0.4, 0),
                      end: Offset.zero,
                    ).animate(chipAnim),
                    child: GestureDetector(
                      onTap: () => _selectCategory(cat),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 220),
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: selected ? _navy : _surface,
                          border: Border.all(
                            color: selected ? _navy : _border,
                            width: selected ? 1.5 : 1,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: selected
                              ? [BoxShadow(color: _navy.withValues(alpha: 0.15), blurRadius: 6, offset: const Offset(0, 2))]
                              : [],
                        ),
                        child: AnimatedDefaultTextStyle(
                          duration: const Duration(milliseconds: 220),
                          style: TextStyle(
                            color: selected ? Colors.white : _navy,
                            fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
                            fontSize: 13,
                          ),
                          child: Text(cat),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ),
    );
  }
}

// ─── Pulsing Badge Widget ───────────────────────────────────────────────────

class _PulsingBadge extends StatefulWidget {
  final String text;
  const _PulsingBadge({required this.text});

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
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
    _scale = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
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
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: _amber,
          borderRadius: BorderRadius.circular(4),
          boxShadow: [
            BoxShadow(color: _amber.withValues(alpha: 0.4), blurRadius: 4, spreadRadius: 0),
          ],
        ),
        child: Text(
          widget.text,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 9,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}

// ─── Product Card ───────────────────────────────────────────────────────────

class _ProductCard extends StatefulWidget {
  final _Product product;
  final VoidCallback onAddToCart;
  final VoidCallback onTap;

  const _ProductCard({
    required this.product,
    required this.onAddToCart,
    required this.onTap,
  });

  @override
  State<_ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<_ProductCard>
    with SingleTickerProviderStateMixin {
  double _scale = 1.0;
  bool _addedToCart = false;

  void _handleAddToCart() {
    widget.onAddToCart();
    setState(() => _addedToCart = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) setState(() => _addedToCart = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _scale = 0.96),
      onTapUp: (_) {
        setState(() => _scale = 1.0);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _scale = 1.0),
      child: AnimatedScale(
        scale: _scale,
        duration: const Duration(milliseconds: 130),
        curve: Curves.easeOut,
        child: Container(
          decoration: BoxDecoration(
            color: _surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _border),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
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
                child: Stack(
                  children: [
                    Hero(
                      tag: 'product_${widget.product.id}',
                      child: CachedNetworkImage(
                        imageUrl: widget.product.imageUrl,
                        height: 130,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          height: 130,
                          color: _bg,
                        ),
                        errorWidget: (context, url, err) => Container(
                          height: 130,
                          color: _bg,
                          child: const Icon(Icons.image_not_supported, color: _textMuted),
                        ),
                      ),
                    ),
                    if (widget.product.badge != null)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: _PulsingBadge(text: widget.product.badge!),
                      ),
                  ],
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.product.name,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: _navy,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.product.brand,
                        style: const TextStyle(fontSize: 11, color: _textSecondary),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: List.generate(5, (i) {
                          return Icon(
                            i < widget.product.rating.floor()
                                ? Icons.star
                                : (i < widget.product.rating
                                    ? Icons.star_half
                                    : Icons.star_border),
                            size: 11,
                            color: _amber,
                          );
                        }),
                      ),
                      const Spacer(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '₹${_fmt.format(widget.product.price)}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: _navy,
                                ),
                              ),
                              Text(
                                widget.product.unit,
                                style: const TextStyle(fontSize: 10, color: _textMuted),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: _handleAddToCart,
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 250),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: _addedToCart ? const Color(0xFF10B981) : _amber,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: AnimatedSwitcher(
                                duration: const Duration(milliseconds: 200),
                                child: _addedToCart
                                    ? const Icon(Icons.check, color: Colors.white, size: 14, key: ValueKey('check'))
                                    : const Text(
                                        'Add',
                                        key: ValueKey('add'),
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
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
        ),
      ),
    );
  }
}
