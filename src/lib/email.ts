import emailjs from '@emailjs/browser';
import { Order } from '../store/orderStore';

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim();
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();

export const isEmailConfigured = () =>
  Boolean(
    SERVICE_ID &&
    TEMPLATE_ID &&
    PUBLIC_KEY &&
    SERVICE_ID !== 'dummy_service' &&
    !SERVICE_ID.includes('dummy')
  );

export const sendOrderConfirmationEmail = async (order: Order, customerEmail: string) => {
  if (!isEmailConfigured()) {
    console.warn('[EmailJS] Keys not configured in .env. Skipping confirmation email.');
    return false;
  }

  const templateParams = {
    to_email: customerEmail,
    to_name: order.customer.name,
    order_id: order.id,
    order_date: new Date(order.date).toLocaleDateString(),
    order_total: order.total ? `${order.total.toLocaleString()} EGP` : 'TBD',
    shipping_address: order.customer.address || order.customer.city || '',
    items_html: order.items.map(i => `${i.name} (x${i.quantity || 1})`).join(', ')
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error('[EmailJS] Failed to send confirmation email:', error);
    return false;
  }
};
