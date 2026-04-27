import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/shop/screens/shop_screen.dart';
import '../../features/shop/screens/product_detail_screen.dart';
import '../../features/shop/screens/search_screen.dart';
import '../../features/orders/screens/orders_screen.dart';
import '../../features/orders/screens/order_detail_screen.dart';
import '../../features/workers/screens/workers_screen.dart';
import '../../features/workers/screens/worker_detail_screen.dart';
import '../../features/jobs/screens/jobs_screen.dart';
import '../../features/agreements/screens/agreements_screen.dart';
import '../../features/wallet/screens/wallet_screen.dart';
import '../../features/deliveries/screens/deliveries_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/notifications/screens/notifications_screen.dart';
import '../../features/chat/screens/chat_screen.dart';
import '../../features/admin/screens/verifications_screen.dart';
import '../../features/admin/screens/users_screen.dart';
import '../../features/shop/screens/checkout_screen.dart';
import '../../features/workers/screens/hire_screen.dart';
import '../../features/workers/screens/job_history_screen.dart';
import '../../features/workers/screens/skills_screen.dart';
import '../../features/workers/screens/certifications_screen.dart';
import '../../features/jobs/screens/availability_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    routes: [
      // ── Auth ─────────────────────────────────────────────────────────────
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),

      // ── Main shell (persistent bottom nav) ───────────────────────────────
      ShellRoute(
        builder: (context, state, child) => HomeScreen(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const RoleDashboard(),
          ),
          GoRoute(
            path: '/shop',
            builder: (context, state) => const ShopScreen(),
          ),
          GoRoute(
            path: '/orders',
            builder: (context, state) => const OrdersScreen(),
          ),
          GoRoute(
            path: '/workers',
            builder: (context, state) => const WorkersScreen(),
          ),
          GoRoute(
            path: '/jobs',
            builder: (context, state) => const JobsScreen(),
          ),
          GoRoute(
            path: '/agreements',
            builder: (context, state) => const AgreementsScreen(),
          ),
          GoRoute(
            path: '/wallet',
            builder: (context, state) => const WalletScreen(),
          ),
          GoRoute(
            path: '/deliveries',
            builder: (context, state) => const DeliveriesScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationsScreen(),
          ),
          GoRoute(
            path: '/chat',
            builder: (context, state) => const ChatListScreen(),
          ),
          GoRoute(
            path: '/users',
            builder: (context, state) => const UsersScreen(),
          ),
          GoRoute(
            path: '/verifications',
            builder: (context, state) => const VerificationsScreen(),
          ),
          GoRoute(
            path: '/search',
            builder: (context, state) => const SearchScreen(),
          ),
        ],
      ),

      // ── Detail screens (full-screen, no bottom nav) ───────────────────────
      GoRoute(
        path: '/product/:id',
        builder: (context, state) =>
            ProductDetailScreen(productId: state.pathParameters['id'] ?? ''),
      ),
      // /order/:id  and  /orders/:id  both resolve to OrderDetailScreen
      GoRoute(
        path: '/order/:id',
        builder: (context, state) =>
            OrderDetailScreen(orderId: state.pathParameters['id'] ?? '', extra: state.extra),
      ),
      GoRoute(
        path: '/orders/:id',
        builder: (context, state) =>
            OrderDetailScreen(orderId: state.pathParameters['id'] ?? '', extra: state.extra),
      ),
      // /worker/:id  and  /workers/:id  both resolve to WorkerDetailScreen
      GoRoute(
        path: '/worker/:id',
        builder: (context, state) =>
            WorkerDetailScreen(workerId: state.pathParameters['id'] ?? '', extra: state.extra),
      ),
      GoRoute(
        path: '/workers/:id',
        builder: (context, state) =>
            WorkerDetailScreen(workerId: state.pathParameters['id'] ?? '', extra: state.extra),
        routes: [
          GoRoute(
            path: 'hire',
            builder: (context, state) =>
                HireScreen(workerId: state.pathParameters['id'] ?? '', extra: state.extra),
          ),
        ],
      ),
      // Checkout
      GoRoute(
        path: '/shop/checkout',
        builder: (context, state) => const CheckoutScreen(),
      ),
      GoRoute(
        path: '/agreement/:id',
        builder: (context, state) =>
            AgreementDetailScreen(agreementId: state.pathParameters['id'] ?? ''),
      ),
      GoRoute(
        path: '/chat/:id',
        builder: (context, state) =>
            ChatDetailScreen(chatId: state.pathParameters['id'] ?? ''),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/availability',
        builder: (context, state) => const AvailabilityScreen(),
      ),
      GoRoute(
        path: '/job-history',
        builder: (context, state) => const JobHistoryScreen(),
      ),
      GoRoute(
        path: '/skills',
        builder: (context, state) => const SkillsScreen(),
      ),
      GoRoute(
        path: '/certifications',
        builder: (context, state) => const CertificationsScreen(),
      ),
    ],
  );
});
