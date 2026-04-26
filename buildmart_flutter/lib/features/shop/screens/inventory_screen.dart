import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

const _navy = Color(0xFF1A1D2E);
const _amber = Color(0xFFF2960D);
const _amberBg = Color(0xFFFEF3C7);
const _bg = Color(0xFFF5F6FA);
const _border = Color(0xFFE5E7EB);
const _success = Color(0xFF10B981);
const _error = Color(0xFFEF4444);
const _textSecondary = Color(0xFF6B7280);
const _textMuted = Color(0xFF9CA3AF);

class _InventoryItem {
  final String id;
  final String name;
  final String category;
  int stock;
  double price;
  bool available;

  _InventoryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.stock,
    required this.price,
    required this.available,
  });
}

final List<_InventoryItem> _inventoryItems = [
  _InventoryItem(id: 'i1', name: 'UltraTech PPC Cement', category: 'Cement', stock: 240, price: 385, available: true),
  _InventoryItem(id: 'i2', name: 'SAIL TMT Steel Fe500D', category: 'Steel', stock: 8, price: 72, available: true),
  _InventoryItem(id: 'i3', name: 'Red Clay Bricks', category: 'Bricks', stock: 1200, price: 7, available: true),
  _InventoryItem(id: 'i4', name: 'Asian Paints Apex Ultima', category: 'Paint', stock: 0, price: 3400, available: false),
  _InventoryItem(id: 'i5', name: 'Astral CPVC Pipe 1"', category: 'Pipes', stock: 45, price: 285, available: true),
  _InventoryItem(id: 'i6', name: 'Havells HRFR Cable', category: 'Electric', stock: 5, price: 2200, available: true),
  _InventoryItem(id: 'i7', name: 'Sintex Water Tank 1000L', category: 'Hardware', stock: 12, price: 8200, available: true),
  _InventoryItem(id: 'i8', name: 'River Sand', category: 'Sand', stock: 30, price: 1800, available: true),
  _InventoryItem(id: 'i9', name: 'M-Sand', category: 'Sand', stock: 3, price: 1200, available: true),
  _InventoryItem(id: 'i10', name: 'Fly Ash Bricks', category: 'Bricks', stock: 0, price: 8.5, available: false),
];

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  String _filter = 'All';
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();
  final List<bool> _visible = List.filled(_inventoryItems.length, false);

  static const _filters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  @override
  void initState() {
    super.initState();
    for (int i = 0; i < _inventoryItems.length; i++) {
      Future.delayed(Duration(milliseconds: 80 * i), () {
        if (mounted) setState(() => _visible[i] = true);
      });
    }
    _searchController.addListener(() {
      setState(() => _searchQuery = _searchController.text.toLowerCase());
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<_InventoryItem> get _filtered {
    return _inventoryItems.where((item) {
      final matchSearch = _searchQuery.isEmpty ||
          item.name.toLowerCase().contains(_searchQuery) ||
          item.category.toLowerCase().contains(_searchQuery);
      final matchFilter = switch (_filter) {
        'In Stock' => item.stock > 10,
        'Low Stock' => item.stock > 0 && item.stock <= 10,
        'Out of Stock' => item.stock == 0,
        _ => true,
      };
      return matchSearch && matchFilter;
    }).toList();
  }

  double get _totalStockValue => _inventoryItems.fold(0, (sum, item) => sum + item.stock * item.price);

  void _showEditPriceDialog(_InventoryItem item) {
    final controller = TextEditingController(text: item.price.toStringAsFixed(0));
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Edit Price', style: TextStyle(fontWeight: FontWeight.w700, color: _navy, fontSize: 17)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.name, style: const TextStyle(color: _textSecondary, fontSize: 13)),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              autofocus: true,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: _navy),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(fontSize: 16, color: _textSecondary),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: _amber, width: 2),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              controller.dispose();
              Navigator.pop(ctx);
            },
            child: const Text('Cancel', style: TextStyle(color: _textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              final val = double.tryParse(controller.text);
              if (val != null) setState(() => item.price = val);
              controller.dispose();
              Navigator.pop(ctx);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: _amber,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showAddProductDialog() {
    final nameCtrl = TextEditingController();
    final priceCtrl = TextEditingController();
    final stockCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Add Product', style: TextStyle(fontWeight: FontWeight.w700, color: _navy, fontSize: 17)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _DialogField(controller: nameCtrl, hint: 'Product Name', icon: Icons.inventory_2_outlined),
              const SizedBox(height: 10),
              _DialogField(
                controller: priceCtrl,
                hint: 'Price (₹)',
                icon: Icons.currency_rupee,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              ),
              const SizedBox(height: 10),
              _DialogField(
                controller: stockCtrl,
                hint: 'Stock Count',
                icon: Icons.numbers,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              nameCtrl.dispose();
              priceCtrl.dispose();
              stockCtrl.dispose();
              Navigator.pop(ctx);
            },
            child: const Text('Cancel', style: TextStyle(color: _textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                setState(() {
                  _inventoryItems.add(_InventoryItem(
                    id: 'i${_inventoryItems.length + 1}',
                    name: nameCtrl.text,
                    category: 'Other',
                    stock: int.tryParse(stockCtrl.text) ?? 0,
                    price: double.tryParse(priceCtrl.text) ?? 0,
                    available: true,
                  ));
                  _visible.add(true);
                });
              }
              nameCtrl.dispose();
              priceCtrl.dispose();
              stockCtrl.dispose();
              Navigator.pop(ctx);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: _amber,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _navy,
        elevation: 0,
        title: const Text('Inventory', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddProductDialog,
        backgroundColor: _amber,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Product', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
      ),
      body: Column(
        children: [
          _buildHeaderCard(),
          _buildSearchBar(),
          _buildFilterChips(),
          Expanded(
            child: filtered.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.inventory_2_outlined, size: 56, color: _textMuted),
                        SizedBox(height: 12),
                        Text('No items found', style: TextStyle(color: _textSecondary, fontSize: 16)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 88),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      final globalIndex = _inventoryItems.indexOf(item);
                      final vis = globalIndex >= 0 && globalIndex < _visible.length ? _visible[globalIndex] : true;
                      return AnimatedOpacity(
                        opacity: vis ? 1.0 : 0.0,
                        duration: const Duration(milliseconds: 400),
                        child: AnimatedSlide(
                          offset: vis ? Offset.zero : const Offset(0, 0.1),
                          duration: const Duration(milliseconds: 400),
                          curve: Curves.easeOut,
                          child: _InventoryCard(
                            item: item,
                            onToggle: (v) => setState(() => item.available = v),
                            onEditPrice: () => _showEditPriceDialog(item),
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

  Widget _buildHeaderCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [_navy, Color(0xFF252838)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: _navy.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Total Stock Value', style: TextStyle(color: Colors.white70, fontSize: 13)),
                const SizedBox(height: 4),
                Text(
                  '₹${_totalStockValue.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}',
                  style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${_inventoryItems.where((i) => i.stock > 0).length} in stock',
                  style: const TextStyle(color: Colors.white70, fontSize: 12)),
              Text('${_inventoryItems.where((i) => i.stock == 0).length} out of stock',
                  style: const TextStyle(color: Colors.white54, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: _border),
          borderRadius: BorderRadius.circular(10),
        ),
        child: TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: 'Search products...',
            hintStyle: const TextStyle(color: _textMuted, fontSize: 14),
            prefixIcon: const Icon(Icons.search, color: _textMuted, size: 20),
            suffixIcon: _searchQuery.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.close, color: _textMuted, size: 18),
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

  Widget _buildFilterChips() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: _filters.map((f) {
            final selected = _filter == f;
            return GestureDetector(
              onTap: () => setState(() => _filter = f),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                decoration: BoxDecoration(
                  color: selected ? _navy : Colors.white,
                  border: Border.all(color: selected ? _navy : _border),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  f,
                  style: TextStyle(
                    color: selected ? Colors.white : _navy,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    fontSize: 12,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class _InventoryCard extends StatelessWidget {
  final _InventoryItem item;
  final ValueChanged<bool> onToggle;
  final VoidCallback onEditPrice;

  const _InventoryCard({required this.item, required this.onToggle, required this.onEditPrice});

  bool get _isLowStock => item.stock > 0 && item.stock <= 10;
  bool get _isOutOfStock => item.stock == 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _isOutOfStock ? _error.withOpacity(0.2) : _isLowStock ? _amber.withOpacity(0.3) : _border,
        ),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 6, offset: const Offset(0, 2))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: _navy.withOpacity(0.06),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.inventory_2_outlined, color: _textMuted, size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.name,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: _navy),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text('₹${item.price.toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: _navy)),
                      const SizedBox(width: 10),
                      if (_isLowStock)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: _amberBg, borderRadius: BorderRadius.circular(4)),
                          child: Text('Low: ${item.stock}', style: const TextStyle(color: _amber, fontSize: 10, fontWeight: FontWeight.bold)),
                        )
                      else if (_isOutOfStock)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: _error.withOpacity(0.1), borderRadius: BorderRadius.circular(4)),
                          child: const Text('Out of Stock', style: TextStyle(color: _error, fontSize: 10, fontWeight: FontWeight.bold)),
                        )
                      else
                        Text('${item.stock} units', style: const TextStyle(color: _textSecondary, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Switch(
                  value: item.available,
                  onChanged: onToggle,
                  activeColor: _success,
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                TextButton(
                  onPressed: onEditPrice,
                  style: TextButton.styleFrom(
                    foregroundColor: _amber,
                    padding: EdgeInsets.zero,
                    minimumSize: const Size(40, 24),
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: const Text('Edit Price', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DialogField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final IconData icon;
  final TextInputType keyboardType;
  final List<TextInputFormatter>? inputFormatters;

  const _DialogField({
    required this.controller,
    required this.hint,
    required this.icon,
    this.keyboardType = TextInputType.text,
    this.inputFormatters,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      style: const TextStyle(fontSize: 14, color: _navy),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: _textMuted, fontSize: 14),
        prefixIcon: Icon(icon, color: _textSecondary, size: 18),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: _border)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: _amber, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 10),
      ),
    );
  }
}
