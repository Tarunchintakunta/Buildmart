import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _surface = Colors.white;
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

final _fmt = NumberFormat('##,##,###', 'en_IN');

// Model matching what ShopScreen passes via GoRouter extra
class ProductDetailArgs {
  final String id;
  final String name;
  final String brand;
  final double price;
  final String unit;
  final double rating;
  final String imageUrl;
  final String category;
  final String? badge;

  const ProductDetailArgs({
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

class _BulkTier {
  final String qty;
  final String discount;
  final double price;
  const _BulkTier(this.qty, this.discount, this.price);
}

class ProductDetailScreen extends ConsumerStatefulWidget {
  final String productId;
  final Object? extra;

  const ProductDetailScreen({super.key, required this.productId, this.extra});

  @override
  ConsumerState<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen>
    with TickerProviderStateMixin {
  int _quantity = 1;

  // 3 states: idle, loading, success
  String _cartState = 'idle'; // 'idle' | 'loading' | 'success'

  // Stagger controller for content sections
  late AnimationController _contentCtrl;
  // Qty bounce controller
  late AnimationController _qtyCtrl;
  // Bottom bar slide-up controller
  late AnimationController _bottomBarCtrl;

  ProductDetailArgs? _product;

  @override
  void initState() {
    super.initState();

    _contentCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _qtyCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 180),
      lowerBound: 0.85,
      upperBound: 1.0,
    )..value = 1.0;
    _bottomBarCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    // Resolve product from extra
    if (widget.extra != null) {
      final e = widget.extra;
      try {
        _product = ProductDetailArgs(
          id: _getField(e, 'id') ?? widget.productId,
          name: _getField(e, 'name') ?? 'Product',
          brand: _getField(e, 'brand') ?? '',
          price: (_getField(e, 'price') as num?)?.toDouble() ?? 0,
          unit: _getField(e, 'unit') ?? '',
          rating: (_getField(e, 'rating') as num?)?.toDouble() ?? 4.0,
          imageUrl: _getField(e, 'imageUrl') ?? '',
          category: _getField(e, 'category') ?? '',
          badge: _getField(e, 'badge'),
        );
      } catch (_) {}
    }
    _product ??= _fallbackProduct(widget.productId);

    // Start stagger animations after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _contentCtrl.forward();
        _bottomBarCtrl.forward();
      }
    });
  }

  dynamic _getField(Object? obj, String field) {
    try {
      final mirror = (obj as dynamic);
      switch (field) {
        case 'id': return mirror.id;
        case 'name': return mirror.name;
        case 'brand': return mirror.brand;
        case 'price': return mirror.price;
        case 'unit': return mirror.unit;
        case 'rating': return mirror.rating;
        case 'imageUrl': return mirror.imageUrl;
        case 'category': return mirror.category;
        case 'badge': return mirror.badge;
      }
    } catch (_) {}
    return null;
  }

  ProductDetailArgs _fallbackProduct(String id) {
    return const ProductDetailArgs(
      id: 'p1',
      name: 'UltraTech PPC Cement',
      brand: 'UltraTech',
      price: 385,
      unit: '50kg bag',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      category: 'Cement',
      badge: 'Best Seller',
    );
  }

  @override
  void dispose() {
    _contentCtrl.dispose();
    _qtyCtrl.dispose();
    _bottomBarCtrl.dispose();
    super.dispose();
  }

  void _changeQty(int delta) {
    final newQty = _quantity + delta;
    if (newQty < 1 || newQty > 99) return;
    setState(() => _quantity = newQty);
    _qtyCtrl.reverse().then((_) {
      if (mounted) _qtyCtrl.forward();
    });
  }

  void _addToCart() async {
    if (_cartState != 'idle') return;
    setState(() => _cartState = 'loading');
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _cartState = 'success');
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    setState(() => _cartState = 'idle');
  }

  // Content section stagger
  Animation<double> _sectionAnim(int i) => CurvedAnimation(
        parent: _contentCtrl,
        curve: Interval(
          (i * 0.1).clamp(0.0, 0.7),
          ((i * 0.1) + 0.4).clamp(0.0, 1.0),
          curve: Curves.easeOutCubic,
        ),
      );

  List<_BulkTier> get _bulkTiers {
    final p = _product!;
    return [
      _BulkTier('1–9 ${p.unit}', 'List price', p.price),
      _BulkTier('10–49 ${p.unit}', '5% off', p.price * 0.95),
      _BulkTier('50+ ${p.unit}', '10% off', p.price * 0.90),
    ];
  }

  Widget _staggered(int i, Widget child) {
    final anim = _sectionAnim(i);
    return FadeTransition(
      opacity: anim,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.15),
          end: Offset.zero,
        ).animate(anim),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final p = _product!;
    final total = p.price * _quantity;

    return Scaffold(
      backgroundColor: _bg,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 300,
                pinned: true,
                backgroundColor: _navy,
                iconTheme: const IconThemeData(color: Colors.white),
                leading: GestureDetector(
                  onTap: () => context.pop(),
                  child: Container(
                    margin: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.35),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                  ),
                ),
                flexibleSpace: FlexibleSpaceBar(
                  background: Hero(
                    tag: 'product_${p.id}',
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        CachedNetworkImage(
                          imageUrl: p.imageUrl,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(color: _navy),
                          errorWidget: (context, url, err) => Container(
                            color: _bg,
                            child: const Icon(Icons.image_not_supported, size: 48, color: _textMuted),
                          ),
                        ),
                        // Gradient overlay for readability
                        Positioned(
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 80,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [Colors.transparent, Colors.black.withValues(alpha: 0.3)],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Section 0: badge
                      if (p.badge != null) ...[
                        _staggered(
                          0,
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _amberBg,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              p.badge!,
                              style: const TextStyle(color: _amber, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                      ],
                      // Section 1: name + brand
                      _staggered(
                        1,
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(p.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: _navy)),
                            const SizedBox(height: 4),
                            Text(p.brand, style: const TextStyle(fontSize: 14, color: _textSecondary)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Section 2: price
                      _staggered(
                        2,
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '₹${_fmt.format(p.price)}',
                              style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: _navy),
                            ),
                            const SizedBox(width: 6),
                            Padding(
                              padding: const EdgeInsets.only(bottom: 4),
                              child: Text(
                                '/ ${p.unit}',
                                style: const TextStyle(fontSize: 14, color: _textSecondary),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      // Section 3: rating stars (staggered per star)
                      _staggered(3, _buildRatingRow(p)),
                      const SizedBox(height: 20),
                      // Section 4: quantity
                      _staggered(4, _buildQuantitySelector()),
                      const SizedBox(height: 24),
                      // Section 5: bulk pricing
                      _staggered(5, _buildBulkPricingTable(p)),
                      const SizedBox(height: 24),
                      // Section 6: specs
                      _staggered(6, _buildSpecsSection(p)),
                      const SizedBox(height: 24),
                      // Section 7: description
                      _staggered(7, _buildDescription(p)),
                      const SizedBox(height: 110),
                    ],
                  ),
                ),
              ),
            ],
          ),
          // Sticky bottom bar slides up from bottom
          SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, 1),
              end: Offset.zero,
            ).animate(CurvedAnimation(
              parent: _bottomBarCtrl,
              curve: Curves.easeOutCubic,
            )),
            child: _buildBottomBar(p, total),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingRow(ProductDetailArgs p) {
    return Row(
      children: [
        ...List.generate(5, (i) {
          final starAnim = CurvedAnimation(
            parent: _contentCtrl,
            curve: Interval(
              (0.3 + i * 0.06).clamp(0.0, 1.0),
              (0.3 + i * 0.06 + 0.25).clamp(0.0, 1.0),
              curve: Curves.easeOut,
            ),
          );
          return FadeTransition(
            opacity: starAnim,
            child: Icon(
              i < p.rating.floor()
                  ? Icons.star
                  : (i < p.rating ? Icons.star_half : Icons.star_border),
              size: 18,
              color: _amber,
            ),
          );
        }),
        const SizedBox(width: 8),
        Text(
          p.rating.toStringAsFixed(1),
          style: const TextStyle(fontWeight: FontWeight.bold, color: _navy),
        ),
        const SizedBox(width: 6),
        const Text(
          '(128 reviews)',
          style: TextStyle(color: _textSecondary, fontSize: 13),
        ),
      ],
    );
  }

  Widget _buildQuantitySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Quantity', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Row(
          children: [
            _AnimatedQtyButton(
              icon: Icons.remove,
              onTap: () => _changeQty(-1),
            ),
            const SizedBox(width: 4),
            ScaleTransition(
              scale: _qtyCtrl,
              child: Container(
                width: 52,
                height: 44,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: _surface,
                  border: Border.all(color: _border),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 150),
                  transitionBuilder: (child, anim) => ScaleTransition(
                    scale: anim,
                    child: child,
                  ),
                  child: Text(
                    '$_quantity',
                    key: ValueKey(_quantity),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: _navy),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 4),
            _AnimatedQtyButton(
              icon: Icons.add,
              onTap: () => _changeQty(1),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBulkPricingTable(ProductDetailArgs p) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Bulk Pricing', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: [
              _buildTableHeader(),
              ..._bulkTiers.asMap().entries.map(
                    (e) => _buildTableRow(e.value, e.key == _bulkTiers.length - 1),
                  ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTableHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: const BoxDecoration(
        color: _bg,
        borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
      ),
      child: const Row(
        children: [
          Expanded(child: Text('Quantity', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: _textSecondary))),
          Expanded(child: Text('Discount', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: _textSecondary))),
          Expanded(
            child: Text('Price',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: _textSecondary),
                textAlign: TextAlign.right),
          ),
        ],
      ),
    );
  }

  Widget _buildTableRow(_BulkTier tier, bool isLast) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        border: isLast
            ? null
            : const Border(bottom: BorderSide(color: _border, width: 0.5)),
      ),
      child: Row(
        children: [
          Expanded(child: Text(tier.qty, style: const TextStyle(fontSize: 13, color: _navy))),
          Expanded(
            child: Text(
              tier.discount,
              style: TextStyle(
                fontSize: 13,
                color: tier.discount == 'List price' ? _textSecondary : _success,
                fontWeight: tier.discount == 'List price' ? FontWeight.normal : FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              '₹${_fmt.format(tier.price)}',
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: _navy),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecsSection(ProductDetailArgs p) {
    final specs = [
      ['Category', p.category],
      ['Brand', p.brand],
      ['Unit', p.unit],
      ['In Stock', 'Yes — Fast Delivery'],
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Specifications', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: specs.asMap().entries.map((e) {
              final isLast = e.key == specs.length - 1;
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  border: isLast
                      ? null
                      : const Border(bottom: BorderSide(color: _border, width: 0.5)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: Text(e.value[0], style: const TextStyle(color: _textSecondary, fontSize: 13)),
                    ),
                    Expanded(
                      flex: 3,
                      child: Text(e.value[1],
                          style: const TextStyle(color: _navy, fontSize: 13, fontWeight: FontWeight.w500)),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildDescription(ProductDetailArgs p) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Description', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: _navy)),
        const SizedBox(height: 10),
        Text(
          '${p.name} by ${p.brand} is a premium quality construction material trusted by builders across India. '
          'Sourced from certified manufacturers, this product meets BIS standards and provides excellent durability. '
          'Ideal for residential and commercial construction projects in Hyderabad and surrounding regions. '
          'Bulk orders ship within 24–48 hours with doorstep delivery available.',
          style: const TextStyle(color: _textSecondary, fontSize: 14, height: 1.6),
        ),
      ],
    );
  }

  Widget _buildBottomBar(ProductDetailArgs p, double total) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 12,
          bottom: MediaQuery.of(context).padding.bottom + 12,
        ),
        decoration: BoxDecoration(
          color: _surface,
          border: const Border(top: BorderSide(color: _border)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.07),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Total', style: TextStyle(fontSize: 12, color: _textSecondary)),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  transitionBuilder: (child, anim) => FadeTransition(
                    opacity: anim,
                    child: SlideTransition(
                      position: Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(anim),
                      child: child,
                    ),
                  ),
                  child: Text(
                    '₹${_fmt.format(total)}',
                    key: ValueKey(total),
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: _navy),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: GestureDetector(
                onTap: _cartState == 'idle' ? _addToCart : null,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  height: 50,
                  decoration: BoxDecoration(
                    color: _cartState == 'success' ? _success : _amber,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: (_cartState == 'success' ? _success : _amber).withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    switchInCurve: Curves.easeOut,
                    child: _cartState == 'loading'
                        ? const SizedBox(
                            key: ValueKey('loading'),
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                          )
                        : _cartState == 'success'
                            ? const Row(
                                key: ValueKey('success'),
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.check_circle_outline, color: Colors.white, size: 20),
                                  SizedBox(width: 8),
                                  Text('Added to Cart!',
                                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                                ],
                              )
                            : const Row(
                                key: ValueKey('idle'),
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.shopping_cart_outlined, color: Colors.white, size: 20),
                                  SizedBox(width: 8),
                                  Text('Add to Cart',
                                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                                ],
                              ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Animated Qty Button ─────────────────────────────────────────────────────

class _AnimatedQtyButton extends StatefulWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _AnimatedQtyButton({required this.icon, required this.onTap});

  @override
  State<_AnimatedQtyButton> createState() => _AnimatedQtyButtonState();
}

class _AnimatedQtyButtonState extends State<_AnimatedQtyButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      lowerBound: 0.88,
      upperBound: 1.0,
    )..value = 1.0;
    _scale = _ctrl;
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _onTap() {
    _ctrl.reverse().then((_) {
      if (mounted) {
        _ctrl.forward();
        widget.onTap();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scale,
      child: GestureDetector(
        onTap: _onTap,
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: _surface,
            border: Border.all(color: _border),
            borderRadius: BorderRadius.circular(8),
          ),
          alignment: Alignment.center,
          child: Icon(widget.icon, size: 20, color: _navy),
        ),
      ),
    );
  }
}
