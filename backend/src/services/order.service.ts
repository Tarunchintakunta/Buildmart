import { supabaseAdmin } from '../config/supabase.js';
import { generateOrderNumber } from './auth.service.js';
import { createNotification } from './notification.service.js';

interface OrderItem {
  inventory_id: string;
  quantity: number;
}

interface CreateOrderParams {
  customerId: string;
  shopId: string;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryNotes?: string;
}

export async function createOrder(params: CreateOrderParams) {
  // Validate inventory and compute totals
  const inventoryIds = params.items.map((i) => i.inventory_id);
  const { data: inventoryItems, error: invErr } = await supabaseAdmin
    .from('inventory')
    .select('*, products(*)')
    .in('id', inventoryIds)
    .eq('shop_id', params.shopId)
    .eq('is_available', true);

  if (invErr || !inventoryItems) {
    throw new Error('Failed to fetch inventory');
  }

  let subtotal = 0;
  const orderItems: any[] = [];

  for (const reqItem of params.items) {
    const inv = inventoryItems.find((i: any) => i.id === reqItem.inventory_id);
    if (!inv) throw new Error(`Inventory item ${reqItem.inventory_id} not found or unavailable`);
    if (inv.stock_quantity < reqItem.quantity) {
      throw new Error(`Insufficient stock for ${inv.products?.name}`);
    }
    if (reqItem.quantity < inv.min_order_quantity || reqItem.quantity > inv.max_order_quantity) {
      throw new Error(`Invalid quantity for ${inv.products?.name}. Min: ${inv.min_order_quantity}, Max: ${inv.max_order_quantity}`);
    }

    const itemTotal = inv.price * reqItem.quantity;
    subtotal += itemTotal;
    orderItems.push({
      product_id: inv.product_id,
      inventory_id: inv.id,
      quantity: reqItem.quantity,
      unit_price: inv.price,
      total_price: itemTotal,
      concierge_required: inv.products?.is_heavy || false,
    });
  }

  const deliveryFee = subtotal >= 2000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const totalAmount = subtotal + deliveryFee + tax;

  const orderNumber = generateOrderNumber();

  // Insert order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: params.customerId,
      shop_id: params.shopId,
      status: 'pending',
      delivery_address: params.deliveryAddress,
      delivery_latitude: params.deliveryLatitude,
      delivery_longitude: params.deliveryLongitude,
      subtotal,
      delivery_fee: deliveryFee,
      tax,
      total_amount: totalAmount,
      delivery_notes: params.deliveryNotes,
    })
    .select()
    .single();

  if (orderErr || !order) throw new Error('Failed to create order');

  // Insert order items
  const itemsWithOrderId = orderItems.map((item) => ({ ...item, order_id: order.id }));
  await supabaseAdmin.from('order_items').insert(itemsWithOrderId);

  // Decrement stock
  for (const reqItem of params.items) {
    const inv = inventoryItems.find((i: any) => i.id === reqItem.inventory_id);
    if (inv) {
      await supabaseAdmin
        .from('inventory')
        .update({ stock_quantity: inv.stock_quantity - reqItem.quantity })
        .eq('id', inv.id);
    }
  }

  // Get shop owner for notification
  const { data: shop } = await supabaseAdmin.from('shops').select('owner_id, name').eq('id', params.shopId).single();
  if (shop) {
    await createNotification({
      userId: shop.owner_id,
      title: 'New Order Received',
      message: `Order ${orderNumber} received for ₹${totalAmount.toFixed(2)}`,
      type: 'order',
      referenceType: 'order',
      referenceId: order.id,
    });
  }

  return order;
}
