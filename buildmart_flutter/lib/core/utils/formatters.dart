import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Formats a double as Indian currency string, e.g. 124500.0 → ₹1,24,500
String formatIndianCurrency(double amount) {
  final isNegative = amount < 0;
  final absAmount = amount.abs();
  final intPart = absAmount.truncate();
  final fracPart = absAmount - intPart;

  final formatted = _formatIndianInt(intPart);

  String result;
  if (fracPart > 0) {
    final fracStr = fracPart.toStringAsFixed(2).substring(1); // ".XX"
    result = '₹$formatted$fracStr';
  } else {
    result = '₹$formatted';
  }

  return isNegative ? '-$result' : result;
}

/// Formats an int as Indian number system, e.g. 124500 → 1,24,500
String formatIndianNumber(int n) {
  final isNegative = n < 0;
  final abs = n.abs();
  final result = _formatIndianInt(abs);
  return isNegative ? '-$result' : result;
}

String _formatIndianInt(int n) {
  final s = n.toString();
  if (s.length <= 3) return s;

  // Last 3 digits
  final last3 = s.substring(s.length - 3);
  final rest = s.substring(0, s.length - 3);

  // Group the rest in pairs from right to left
  final buffer = StringBuffer();
  for (var i = 0; i < rest.length; i++) {
    if (i > 0 && (rest.length - i) % 2 == 0) {
      buffer.write(',');
    }
    buffer.write(rest[i]);
  }
  buffer.write(',');
  buffer.write(last3);
  return buffer.toString();
}

/// Returns a human-readable relative time string, e.g. "2h ago", "3d ago"
String timeAgo(DateTime dt) {
  final now = DateTime.now();
  final diff = now.difference(dt);

  if (diff.inSeconds < 60) {
    return 'just now';
  } else if (diff.inMinutes < 60) {
    final m = diff.inMinutes;
    return '${m}m ago';
  } else if (diff.inHours < 24) {
    final h = diff.inHours;
    return '${h}h ago';
  } else if (diff.inDays < 7) {
    final d = diff.inDays;
    return '${d}d ago';
  } else if (diff.inDays < 30) {
    final w = (diff.inDays / 7).floor();
    return '${w}w ago';
  } else if (diff.inDays < 365) {
    final mo = (diff.inDays / 30).floor();
    return '${mo}mo ago';
  } else {
    final y = (diff.inDays / 365).floor();
    return '${y}y ago';
  }
}

/// Returns a color for a given order/job status string.
Color statusColor(String status) {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'accepted':
      return AppColors.info;
    case 'processing':
    case 'in_progress':
      return AppColors.warning;
    case 'out_for_delivery':
    case 'on_the_way':
      return AppColors.amber;
    case 'delivered':
    case 'completed':
    case 'success':
      return AppColors.success;
    case 'cancelled':
    case 'rejected':
    case 'failed':
      return AppColors.error;
    case 'pending':
      return AppColors.textMuted;
    default:
      return AppColors.textSecondary;
  }
}

/// Returns a human-readable label for a given status string.
String statusLabel(String status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'processing':
      return 'Processing';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'on_the_way':
      return 'On the Way';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    case 'accepted':
      return 'Accepted';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'rejected':
      return 'Rejected';
    case 'success':
      return 'Success';
    case 'failed':
      return 'Failed';
    case 'refunded':
      return 'Refunded';
    default:
      // Capitalise first letter, replace underscores with spaces
      return status
          .split('_')
          .map((w) => w.isEmpty ? '' : '${w[0].toUpperCase()}${w.substring(1)}')
          .join(' ');
  }
}
