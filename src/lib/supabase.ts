import { createClient } from '@supabase/supabase-js';
import { Order, OrderStatus } from '../store/orderStore';
import { Product } from '../types/product';

const DEFAULT_SUPABASE_URL = 'https://pyjziyapuqamwhfyhvra.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_2zQDzMTStth2xuvRDbZzwg_L4Lx2yIG';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_KEY
).trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('dummy') &&
    supabaseUrl.startsWith('https://')
  );
};

// Singleton Supabase Client
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

const ORDERS_TABLE = 'orders';
const PRODUCTS_TABLE = 'products';

/**
 * Save new order to Supabase
 */
export const saveOrderToSupabase = async (order: Order): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from(ORDERS_TABLE).upsert({
      id: order.id,
      type: order.type,
      status: order.status,
      date: order.date,
      customer: order.customer,
      items: order.items,
      total: order.total,
      deposit_amount: order.depositAmount,
      remaining_balance: order.remainingBalance,
      payment_method: order.paymentMethod,
      receipt_image_base64: order.receiptImageBase64,
      special_request_details: order.specialRequestDetails,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[Supabase] Failed to save order:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Network or DB error saving order:', err);
    return false;
  }
};

/**
 * Update order status in Supabase
 */
export const updateOrderStatusInSupabase = async (
  id: string,
  status: OrderStatus
): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from(ORDERS_TABLE)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Failed to update status:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error updating status:', err);
    return false;
  }
};

/**
 * Delete order from Supabase
 */
export const deleteOrderFromSupabase = async (id: string): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from(ORDERS_TABLE).delete().eq('id', id);
    if (error) {
      console.warn('[Supabase] Failed to delete order:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error deleting order:', err);
    return false;
  }
};

/**
 * Purge all orders from Supabase
 */
export const purgeAllOrdersFromSupabase = async (): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from(ORDERS_TABLE).delete().neq('id', 'dummy_never_match');
    if (error) {
      console.warn('[Supabase] Failed to purge orders:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error purging orders:', err);
    return false;
  }
};

/**
 * Fetch all orders from Supabase
 */
export const fetchOrdersFromSupabase = async (): Promise<Order[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching orders:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      type: row.type,
      status: row.status,
      date: row.date,
      customer: row.customer,
      items: row.items || [],
      total: row.total,
      depositAmount: row.deposit_amount,
      remainingBalance: row.remaining_balance,
      paymentMethod: row.payment_method,
      receiptImageBase64: row.receipt_image_base64,
      specialRequestDetails: row.special_request_details,
    }));
  } catch (err) {
    console.warn('[Supabase] Network error fetching orders:', err);
    return null;
  }
};

/**
 * Realtime Subscription for live orders
 */
export const subscribeToOrdersFromSupabase = (onOrdersChange: () => void) => {
  if (!supabase || !isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: ORDERS_TABLE },
      () => {
        onOrdersChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * ============================================================
 * PRODUCTS CLOUD SYNC HELPERS
 * ============================================================
 */

export const saveProductToSupabase = async (product: Product): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const encodedSubCategory = product.sport
      ? `${product.sport} | ${product.subCategory || ''}`
      : product.subCategory;

    const { error } = await supabase.from(PRODUCTS_TABLE).upsert({
      id: product.id,
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      category: product.category,
      sub_category: encodedSubCategory,
      gender: product.gender,
      price: product.price,
      original_price: product.originalPrice,
      image: product.image,
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      accent: product.accent,
      description: product.description,
      details: product.details,
      is_new: product.isNew,
      is_best_seller: product.isBestSeller,
      is_featured: product.isFeatured,
      is_by_order: product.isByOrder,
      rating: product.rating,
      review_count: product.reviewCount,
      in_stock: product.inStock,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[Supabase] Failed to save product:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error saving product to Supabase:', err);
    return false;
  }
};

export const deleteProductFromSupabase = async (id: number): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id);
    if (error) {
      console.warn('[Supabase] Failed to delete product:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error deleting product from Supabase:', err);
    return false;
  }
};

export const purgeAllProductsFromSupabase = async (): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from(PRODUCTS_TABLE).delete().neq('id', -999999);
    if (error) {
      console.warn('[Supabase] Failed to purge all products:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error purging all products from Supabase:', err);
    return false;
  }
};

export const fetchProductsFromSupabase = async (): Promise<Product[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching products:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => {
      const rawSub = row.sub_category || '';
      let sport = undefined;
      let subCategory = rawSub;

      if (rawSub.includes(' | ')) {
        const parts = rawSub.split(' | ');
        sport = parts[0] as any;
        subCategory = parts.slice(1).join(' | ');
      }

      return {
        id: Number(row.id),
        slug: row.slug,
        brand: row.brand,
        name: row.name,
        category: row.category,
        sport: sport,
        subCategory: subCategory,
        gender: row.gender,
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        image: row.image,
        images: row.images || [row.image],
        sizes: row.sizes || [],
        colors: row.colors || [],
        accent: row.accent || '#111111',
        description: row.description,
        details: row.details || { en: [], ar: [] },
        isNew: Boolean(row.is_new),
        isBestSeller: Boolean(row.is_best_seller),
        isFeatured: Boolean(row.is_featured),
        isByOrder: Boolean(row.is_by_order),
        rating: Number(row.rating || 5.0),
        reviewCount: Number(row.review_count || 0),
        inStock: Boolean(row.in_stock),
      };
    });
  } catch (err) {
    console.warn('[Supabase] Error fetching products:', err);
    return null;
  }
};

/**
 * Realtime Subscription for Live Product Catalog Changes
 */
export const subscribeToProductsFromSupabase = (onProductsChange: () => void) => {
  if (!supabase || !isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('public:products_live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: PRODUCTS_TABLE },
      () => {
        onProductsChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

