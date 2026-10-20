import emailjs from '@emailjs/browser';
import { Order } from '../store/orderStore';

const DEFAULT_SERVICE_ID = 'service_5vkipba';
const DEFAULT_TEMPLATE_ID = 'template_mzj560a';
const DEFAULT_PUBLIC_KEY = '8vxleu_VFyVWnQTJ-';

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID || DEFAULT_SERVICE_ID).trim();
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || DEFAULT_TEMPLATE_ID).trim();
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || DEFAULT_PUBLIC_KEY).trim();

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

  const itemsList = order.items
    .map(i => `${i.name} (Size: ${i.size || 'N/A'}, Qty: ${i.quantity || 1}, Price: ${i.price?.toLocaleString()} EGP)`)
    .join('\n');

  const templateParams = {
    // Recipient email aliases (supports standard EmailJS recipient variables)
    email: customerEmail.trim(),
    user_email: customerEmail.trim(),
    to_email: customerEmail.trim(),
    recipient: customerEmail.trim(),
    reply_to: customerEmail.trim(),
    customer_email: customerEmail.trim(),

    // Customer details
    to_name: order.customer.name,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone || '',
    phone: order.customer.phone || '',

    // Order specifics
    order_id: order.id,
    order_date: new Date(order.date).toLocaleDateString('ar-EG', { dateStyle: 'long' }),
    order_total: order.total ? `${order.total.toLocaleString()} EGP` : 'TBD',
    total: order.total ? `${order.total.toLocaleString()} EGP` : 'TBD',
    payment_method: order.paymentMethod === 'instapay' ? 'InstaPay (إنستاباي)' : 'Cash on Delivery (دفع عند الاستلام)',
    shipping_address: `${order.customer.city || ''} - ${order.customer.address || ''}`,
    address: `${order.customer.city || ''} - ${order.customer.address || ''}`,
    items_html: itemsList,
    message: `طلب جديد رقم #${order.id} بمبلغ ${order.total?.toLocaleString()} جنيه مصري.\nالمنتجات:\n${itemsList}`,
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('[EmailJS] Confirmation email sent successfully to:', customerEmail);
    return true;
  } catch (error) {
    console.error('[EmailJS] Failed to send confirmation email:', error);
    return false;
  }
};
