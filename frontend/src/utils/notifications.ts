/**
 * BuildMart Push Notification Service
 * Phase 9 — expo-notifications
 *
 * Usage:
 *   import { setupNotificationHandler, scheduleLocalNotification } from './notifications';
 *   setupNotificationHandler(); // call once on app boot
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Core handler — must call before any scheduling ─────────────────────────
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// ─── Permission request ──────────────────────────────────────────────────────
export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('buildmart', {
      name: 'BuildMart',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F2960D',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Generic local notification ──────────────────────────────────────────────
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data: Record<string, unknown> = {},
  delaySeconds = 0,
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger:
        delaySeconds > 0
          ? { seconds: delaySeconds, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL }
          : null,
    });
    return id;
  } catch {
    return null;
  }
}

// ─── Domain-specific helpers ─────────────────────────────────────────────────

export async function sendOrderNotification(
  orderId: string,
  status: 'placed' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled',
) {
  const messages: Record<typeof status, { title: string; body: string }> = {
    placed:     { title: '🛒 Order Placed!',      body: `Order #${orderId} confirmed. Shopkeeper notified.` },
    confirmed:  { title: '✅ Order Confirmed',     body: `Order #${orderId} accepted by shopkeeper.` },
    dispatched: { title: '🚚 Out for Delivery',   body: `Order #${orderId} is on its way to you.` },
    delivered:  { title: '📦 Order Delivered!',   body: `Order #${orderId} delivered. Rate your experience.` },
    cancelled:  { title: '❌ Order Cancelled',    body: `Order #${orderId} has been cancelled. Refund initiated.` },
  };
  const { title, body } = messages[status];
  return scheduleLocalNotification(title, body, { orderId, status });
}

export async function sendJobNotification(
  jobId: string,
  workerName: string,
  type: 'new_offer' | 'accepted' | 'started' | 'completed' | 'cancelled',
) {
  const messages: Record<typeof type, { title: string; body: string }> = {
    new_offer:  { title: '💼 New Job Offer',       body: `${workerName} received your job offer #${jobId}.` },
    accepted:   { title: '✅ Job Accepted',         body: `${workerName} accepted the job offer. Work starts soon.` },
    started:    { title: '🔨 Work Started',        body: `${workerName} has started working on your project.` },
    completed:  { title: '🎉 Job Completed!',      body: `${workerName} marked job #${jobId} as complete. Please rate.` },
    cancelled:  { title: '❌ Job Cancelled',        body: `Job #${jobId} with ${workerName} was cancelled. Funds released.` },
  };
  const { title, body } = messages[type];
  return scheduleLocalNotification(title, body, { jobId, workerName, type });
}

export async function sendPaymentNotification(
  amount: number,
  type: 'received' | 'sent' | 'held' | 'released',
) {
  const formatted = `₹${amount.toLocaleString('en-IN')}`;
  const messages: Record<typeof type, { title: string; body: string }> = {
    received: { title: '💰 Payment Received',   body: `${formatted} has been credited to your wallet.` },
    sent:     { title: '📤 Payment Sent',       body: `${formatted} sent successfully from your wallet.` },
    held:     { title: '🔒 Amount Held',        body: `${formatted} held in escrow for your job agreement.` },
    released: { title: '✅ Escrow Released',    body: `${formatted} has been released from escrow to your wallet.` },
  };
  const { title, body } = messages[type];
  return scheduleLocalNotification(title, body, { amount, type });
}

export async function sendAgreementNotification(
  agreementId: string,
  type: 'created' | 'signed' | 'expired',
  partyName: string,
) {
  const messages: Record<typeof type, { title: string; body: string }> = {
    created: { title: '📝 Agreement Created',   body: `New agreement with ${partyName} is ready to sign.` },
    signed:  { title: '✍️ Agreement Signed',    body: `${partyName} signed agreement #${agreementId}.` },
    expired: { title: '⚠️ Agreement Expired',   body: `Agreement #${agreementId} with ${partyName} has expired.` },
  };
  const { title, body } = messages[type];
  return scheduleLocalNotification(title, body, { agreementId, type });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
