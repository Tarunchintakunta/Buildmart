import 'app_images.dart';

// ---------------------------------------------------------------------------
// MockProduct
// ---------------------------------------------------------------------------

class MockProduct {
  final String id;
  final String name;
  final String brand;
  final String category;
  final String unit;
  final String image;
  final double price;
  final double rating;
  final int reviews;
  final int stock;
  final bool inStock;
  final String? badge;

  const MockProduct({
    required this.id,
    required this.name,
    required this.brand,
    required this.category,
    required this.unit,
    required this.image,
    required this.price,
    required this.rating,
    required this.reviews,
    required this.stock,
    required this.inStock,
    this.badge,
  });

  factory MockProduct.fromMap(Map<String, dynamic> map) {
    return MockProduct(
      id: map['id'] as String,
      name: map['name'] as String,
      brand: map['brand'] as String,
      category: map['category'] as String,
      unit: map['unit'] as String,
      image: map['image'] as String,
      price: (map['price'] as num).toDouble(),
      rating: (map['rating'] as num).toDouble(),
      reviews: map['reviews'] as int,
      stock: map['stock'] as int,
      inStock: map['inStock'] as bool,
      badge: map['badge'] as String?,
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'name': name,
        'brand': brand,
        'category': category,
        'unit': unit,
        'image': image,
        'price': price,
        'rating': rating,
        'reviews': reviews,
        'stock': stock,
        'inStock': inStock,
        'badge': badge,
      };
}

const List<MockProduct> mockProducts = [
  MockProduct(
    id: 'prod_001',
    name: 'UltraTech PPC Cement',
    brand: 'UltraTech',
    category: 'Cement',
    unit: '50 kg bag',
    image: AppImages.cementBags,
    price: 385,
    rating: 4.7,
    reviews: 1243,
    stock: 500,
    inStock: true,
    badge: 'Best Seller',
  ),
  MockProduct(
    id: 'prod_002',
    name: 'SAIL TMT Steel Bar (Fe500)',
    brand: 'SAIL',
    category: 'Steel',
    unit: 'per kg',
    image: AppImages.steelBars,
    price: 72,
    rating: 4.6,
    reviews: 876,
    stock: 2000,
    inStock: true,
    badge: 'ISI Certified',
  ),
  MockProduct(
    id: 'prod_003',
    name: 'Red Clay Bricks (First Class)',
    brand: 'Deccan Bricks',
    category: 'Bricks',
    unit: 'per brick',
    image: AppImages.bricks,
    price: 7,
    rating: 4.4,
    reviews: 532,
    stock: 10000,
    inStock: true,
  ),
  MockProduct(
    id: 'prod_004',
    name: 'Asian Paints Apex Exterior',
    brand: 'Asian Paints',
    category: 'Paint',
    unit: '20 L bucket',
    image: AppImages.paint,
    price: 3400,
    rating: 4.8,
    reviews: 2108,
    stock: 150,
    inStock: true,
    badge: 'Top Rated',
  ),
  MockProduct(
    id: 'prod_005',
    name: 'Astral CPVC Pipe (1 inch)',
    brand: 'Astral',
    category: 'Plumbing',
    unit: 'per 3m length',
    image: AppImages.pipes,
    price: 285,
    rating: 4.5,
    reviews: 694,
    stock: 800,
    inStock: true,
  ),
  MockProduct(
    id: 'prod_006',
    name: 'Havells FRLS Cable (2.5 sq mm)',
    brand: 'Havells',
    category: 'Electrical',
    unit: '100m coil',
    image: AppImages.cables,
    price: 2200,
    rating: 4.9,
    reviews: 1567,
    stock: 300,
    inStock: true,
    badge: 'Premium',
  ),
  MockProduct(
    id: 'prod_007',
    name: 'Sintex Reno Water Tank',
    brand: 'Sintex',
    category: 'Storage',
    unit: '1000 L',
    image: AppImages.waterTank,
    price: 8200,
    rating: 4.6,
    reviews: 423,
    stock: 45,
    inStock: true,
  ),
  MockProduct(
    id: 'prod_008',
    name: 'River Sand (Washed)',
    brand: 'Local Quarry',
    category: 'Aggregates',
    unit: 'per tonne',
    image: AppImages.sand,
    price: 1800,
    rating: 4.2,
    reviews: 312,
    stock: 500,
    inStock: true,
  ),
  MockProduct(
    id: 'prod_009',
    name: 'M-Sand (Manufactured Sand)',
    brand: 'Krishna Aggregates',
    category: 'Aggregates',
    unit: 'per tonne',
    image: AppImages.sand,
    price: 1200,
    rating: 4.3,
    reviews: 289,
    stock: 1000,
    inStock: true,
    badge: 'Eco Friendly',
  ),
  MockProduct(
    id: 'prod_010',
    name: 'Fly Ash Bricks',
    brand: 'Hyderabad Bricks',
    category: 'Bricks',
    unit: 'per brick',
    image: AppImages.bricks,
    price: 8.5,
    rating: 4.5,
    reviews: 671,
    stock: 20000,
    inStock: true,
    badge: 'Green Product',
  ),
  MockProduct(
    id: 'prod_011',
    name: 'AAC Blocks (600x200x200mm)',
    brand: 'Aerocon',
    category: 'Blocks',
    unit: 'per block',
    image: AppImages.bricks,
    price: 65,
    rating: 4.7,
    reviews: 384,
    stock: 5000,
    inStock: true,
  ),
  MockProduct(
    id: 'prod_012',
    name: 'Birla White Putty',
    brand: 'Birla White',
    category: 'Finishing',
    unit: '25 kg bag',
    image: AppImages.hardware,
    price: 520,
    rating: 4.6,
    reviews: 921,
    stock: 250,
    inStock: true,
  ),
];

// ---------------------------------------------------------------------------
// MockWorker
// ---------------------------------------------------------------------------

class MockWorker {
  final String id;
  final String name;
  final String skill;
  final String location;
  final String image;
  final double rating;
  final double dailyRate;
  final int experience;
  final int totalJobs;
  final bool available;

  const MockWorker({
    required this.id,
    required this.name,
    required this.skill,
    required this.location,
    required this.image,
    required this.rating,
    required this.dailyRate,
    required this.experience,
    required this.totalJobs,
    required this.available,
  });

  factory MockWorker.fromMap(Map<String, dynamic> map) {
    return MockWorker(
      id: map['id'] as String,
      name: map['name'] as String,
      skill: map['skill'] as String,
      location: map['location'] as String,
      image: map['image'] as String,
      rating: (map['rating'] as num).toDouble(),
      dailyRate: (map['dailyRate'] as num).toDouble(),
      experience: map['experience'] as int,
      totalJobs: map['totalJobs'] as int,
      available: map['available'] as bool,
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'name': name,
        'skill': skill,
        'location': location,
        'image': image,
        'rating': rating,
        'dailyRate': dailyRate,
        'experience': experience,
        'totalJobs': totalJobs,
        'available': available,
      };
}

final List<MockWorker> mockWorkers = [
  MockWorker(
    id: 'worker_001',
    name: 'Ramesh Kumar',
    skill: 'Mason',
    location: 'Kukatpally, Hyderabad',
    image: AppImages.workers[0],
    rating: 4.8,
    dailyRate: 900,
    experience: 12,
    totalJobs: 348,
    available: true,
  ),
  MockWorker(
    id: 'worker_002',
    name: 'Venkatesh Reddy',
    skill: 'Electrician',
    location: 'Madhapur, Hyderabad',
    image: AppImages.workers[1],
    rating: 4.9,
    dailyRate: 1100,
    experience: 8,
    totalJobs: 212,
    available: true,
  ),
  MockWorker(
    id: 'worker_003',
    name: 'Srinivas Rao',
    skill: 'Plumber',
    location: 'Ameerpet, Hyderabad',
    image: AppImages.workers[2],
    rating: 4.6,
    dailyRate: 850,
    experience: 6,
    totalJobs: 178,
    available: false,
  ),
  MockWorker(
    id: 'worker_004',
    name: 'Mahesh Babu',
    skill: 'Carpenter',
    location: 'Begumpet, Hyderabad',
    image: AppImages.workers[3],
    rating: 4.7,
    dailyRate: 950,
    experience: 10,
    totalJobs: 267,
    available: true,
  ),
  MockWorker(
    id: 'worker_005',
    name: 'Raju Naidu',
    skill: 'Painter',
    location: 'Jubilee Hills, Hyderabad',
    image: AppImages.workers[4],
    rating: 4.5,
    dailyRate: 800,
    experience: 7,
    totalJobs: 195,
    available: true,
  ),
  MockWorker(
    id: 'worker_006',
    name: 'Suresh Varma',
    skill: 'Welder',
    location: 'Secunderabad',
    image: AppImages.workers[0],
    rating: 4.8,
    dailyRate: 1000,
    experience: 15,
    totalJobs: 423,
    available: false,
  ),
  MockWorker(
    id: 'worker_007',
    name: 'Prasad Goud',
    skill: 'Tiler',
    location: 'LB Nagar, Hyderabad',
    image: AppImages.workers[1],
    rating: 4.4,
    dailyRate: 820,
    experience: 5,
    totalJobs: 134,
    available: true,
  ),
  MockWorker(
    id: 'worker_008',
    name: 'Anand Sharma',
    skill: 'Civil Engineer',
    location: 'Banjara Hills, Hyderabad',
    image: AppImages.workers[2],
    rating: 4.9,
    dailyRate: 2500,
    experience: 18,
    totalJobs: 89,
    available: true,
  ),
];

// ---------------------------------------------------------------------------
// MockOrder
// ---------------------------------------------------------------------------

class MockOrder {
  final String id;
  final String productName;
  final String productImage;
  final int quantity;
  final double totalAmount;
  final String status;
  final DateTime placedAt;
  final String deliveryAddress;
  final String? trackingId;

  const MockOrder({
    required this.id,
    required this.productName,
    required this.productImage,
    required this.quantity,
    required this.totalAmount,
    required this.status,
    required this.placedAt,
    required this.deliveryAddress,
    this.trackingId,
  });
}

final List<MockOrder> mockOrders = [
  MockOrder(
    id: 'ord_001',
    productName: 'UltraTech PPC Cement × 10 bags',
    productImage: AppImages.cementBags,
    quantity: 10,
    totalAmount: 3850,
    status: 'delivered',
    placedAt: DateTime.now().subtract(const Duration(days: 5)),
    deliveryAddress: '12-3-456, Kukatpally, Hyderabad - 500072',
    trackingId: 'BM2024001234',
  ),
  MockOrder(
    id: 'ord_002',
    productName: 'SAIL TMT Steel Bar × 50 kg',
    productImage: AppImages.steelBars,
    quantity: 50,
    totalAmount: 3600,
    status: 'out_for_delivery',
    placedAt: DateTime.now().subtract(const Duration(hours: 6)),
    deliveryAddress: '45 Madhapur Road, Hyderabad - 500081',
    trackingId: 'BM2024001235',
  ),
  MockOrder(
    id: 'ord_003',
    productName: 'Asian Paints Apex × 2 buckets',
    productImage: AppImages.paint,
    quantity: 2,
    totalAmount: 6800,
    status: 'processing',
    placedAt: DateTime.now().subtract(const Duration(hours: 2)),
    deliveryAddress: '7-1-28, Ameerpet, Hyderabad - 500016',
    trackingId: null,
  ),
  MockOrder(
    id: 'ord_004',
    productName: 'Sintex Water Tank 1000L',
    productImage: AppImages.waterTank,
    quantity: 1,
    totalAmount: 8200,
    status: 'confirmed',
    placedAt: DateTime.now().subtract(const Duration(hours: 12)),
    deliveryAddress: '34 Jubilee Hills, Hyderabad - 500033',
    trackingId: 'BM2024001236',
  ),
  MockOrder(
    id: 'ord_005',
    productName: 'Havells FRLS Cable × 2 coils',
    productImage: AppImages.cables,
    quantity: 2,
    totalAmount: 4400,
    status: 'cancelled',
    placedAt: DateTime.now().subtract(const Duration(days: 1)),
    deliveryAddress: '89 Begumpet, Hyderabad - 500003',
    trackingId: null,
  ),
];

// ---------------------------------------------------------------------------
// MockTransaction
// ---------------------------------------------------------------------------

class MockTransaction {
  final String id;
  final String title;
  final String subtitle;
  final double amount;
  final bool isCredit;
  final String type;
  final DateTime createdAt;
  final String status;

  const MockTransaction({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.isCredit,
    required this.type,
    required this.createdAt,
    required this.status,
  });
}

final List<MockTransaction> mockTransactions = [
  MockTransaction(
    id: 'txn_001',
    title: 'Wallet Recharge',
    subtitle: 'Added via UPI',
    amount: 5000,
    isCredit: true,
    type: 'recharge',
    createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_002',
    title: 'Order Payment',
    subtitle: 'Order #BM2024001235',
    amount: 3600,
    isCredit: false,
    type: 'order',
    createdAt: DateTime.now().subtract(const Duration(hours: 6)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_003',
    title: 'Cashback Reward',
    subtitle: 'Order #BM2024001234',
    amount: 192.5,
    isCredit: true,
    type: 'cashback',
    createdAt: DateTime.now().subtract(const Duration(days: 2)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_004',
    title: 'Order Payment',
    subtitle: 'Order #BM2024001234',
    amount: 3850,
    isCredit: false,
    type: 'order',
    createdAt: DateTime.now().subtract(const Duration(days: 5)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_005',
    title: 'Refund',
    subtitle: 'Order #BM2024001233 cancelled',
    amount: 2200,
    isCredit: true,
    type: 'refund',
    createdAt: DateTime.now().subtract(const Duration(days: 7)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_006',
    title: 'Wallet Recharge',
    subtitle: 'Added via Net Banking',
    amount: 10000,
    isCredit: true,
    type: 'recharge',
    createdAt: DateTime.now().subtract(const Duration(days: 10)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_007',
    title: 'Order Payment',
    subtitle: 'Order #BM2024001232',
    amount: 6800,
    isCredit: false,
    type: 'order',
    createdAt: DateTime.now().subtract(const Duration(days: 12)),
    status: 'success',
  ),
  MockTransaction(
    id: 'txn_008',
    title: 'Referral Bonus',
    subtitle: 'Friend joined BuildMart',
    amount: 200,
    isCredit: true,
    type: 'bonus',
    createdAt: DateTime.now().subtract(const Duration(days: 15)),
    status: 'success',
  ),
];
