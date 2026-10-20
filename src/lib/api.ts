import { Product } from '../types/product';
import { Order, OrderStatus } from '../store/orderStore';

const BASE_URL = '';

/**
 * ============================================================
 * PRODUCTS API CLIENT (MongoDB Atlas via Vercel Edge API)
 * ============================================================
 */

export const apiFetchProducts = async (): Promise<Product[] | null> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      console.warn('[API] /api/products returned status:', res.status);
      return null;
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[API] Failed to fetch products:', err);
    return null;
  }
};

export const apiSaveProduct = async (product: Product): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to save product:', err);
    return false;
  }
};

export const apiUpdateProduct = async (product: Product): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to update product:', err);
    return false;
  }
};

export const apiDeleteProduct = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products?id=${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to delete product:', err);
    return false;
  }
};

export const apiPurgeProducts = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'purge' }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to purge products:', err);
    return false;
  }
};

export const apiSeedProducts = async (products: Product[]): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to seed products:', err);
    return false;
  }
};

/**
 * ============================================================
 * ORDERS API CLIENT (MongoDB Atlas via Vercel Edge API)
 * ============================================================
 */

export const apiFetchOrders = async (): Promise<Order[] | null> => {
  try {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[API] Failed to fetch orders:', err);
    return null;
  }
};

export const apiSaveOrder = async (order: Order): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to save order:', err);
    return false;
  }
};

export const apiUpdateOrderStatus = async (id: string, status: OrderStatus): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to update order status:', err);
    return false;
  }
};

export const apiDeleteOrder = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/orders?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to delete order:', err);
    return false;
  }
};

export const apiPurgeOrders = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'purge' }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] Failed to purge orders:', err);
    return false;
  }
};
