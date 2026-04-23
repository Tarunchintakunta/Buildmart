import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import type { Product, Inventory } from '../../types';

export interface ProductCardProps {
  product: Product;
  inventoryItem: Inventory;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onNotifyMe?: () => void;
  isWishlisted?: boolean;
  cartQuantity?: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  style?: ViewStyle;
}

function formatIndian(num: number): string {
  const parts = Math.abs(num).toFixed(0).split('').reverse();
  const groups: string[] = [];
  parts.forEach((d, i) => {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) groups.push(',');
    groups.push(d);
  });
  return '₹' + groups.reverse().join('');
}

export default function ProductCard({
  product,
  inventoryItem,
  onAddToCart,
  onWishlist,
  onIncrement,
  onDecrement,
  onNotifyMe,
  isWishlisted = false,
  cartQuantity = 0,
  isBestSeller = false,
  isNew = false,
  style,
}: ProductCardProps) {
  const isOutOfStock = !inventoryItem.is_available || inventoryItem.stock_quantity === 0;

  return (
    <View style={[styles.card, style]}>
      {/* Image area */}
      <View style={styles.imageWrap}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={product.name}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={36} color={Colors.textMuted} />
          </View>
        )}

        {/* Badges */}
        {isBestSeller ? (
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>Best Seller</Text>
          </View>
        ) : isNew ? (
          <View style={[styles.badgePill, styles.newBadge]}>
            <Text style={styles.badgePillText}>New</Text>
          </View>
        ) : null}

        {/* Wishlist */}
        {onWishlist ? (
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={onWishlist}
            accessibilityRole="button"
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? Colors.error : Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}

        {/* Out of stock overlay */}
        {isOutOfStock ? (
          <View style={styles.oosBg}>
            <TouchableOpacity
              style={styles.notifyBtn}
              onPress={onNotifyMe}
              accessibilityRole="button"
              accessibilityLabel="Notify me when in stock"
            >
              <Text style={styles.notifyText}>Notify Me</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatIndian(inventoryItem.price)}/{product.unit}
          </Text>
          {!isOutOfStock ? (
            <Text style={styles.inStock}>In Stock</Text>
          ) : null}
        </View>

        {/* Cart controls */}
        {!isOutOfStock ? (
          cartQuantity === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={onAddToCart}
              accessibilityRole="button"
              accessibilityLabel={`Add ${product.name} to cart`}
            >
              <Text style={styles.addBtnText}>Add</Text>
              <Ionicons name="add" size={16} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={onDecrement}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{cartQuantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={onIncrement}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    width: 164,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageWrap: {
    height: 140,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newBadge: {
    backgroundColor: Colors.info,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.surface,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  oosBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  notifyText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  details: {
    padding: 10,
    gap: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  inStock: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.success,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 7,
    gap: 4,
    marginTop: 2,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginTop: 2,
    overflow: 'hidden',
  },
  qtyBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  qtyText: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
