import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase,
  purgeAllOrdersFromSupabase,
  fetchOrdersFromSupabase,
  subscribeToOrdersFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';
import { collection, setDoc, doc, deleteDoc, updateDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { sanitizeString, sanitizePhone } from '../lib/security';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type OrderType = 'standard' | 'special';

export interface OrderItem {
  productId?: string | number;
  name: string;
  price?: number;
  quantity?: number;
  size?: string | number;
  image?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  date: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total?: number;
  depositAmount?: number;
  remainingBalance?: number;
  paymentMethod?: 'cod' | 'instapay';
  receiptImageBase64?: string;
  specialRequestDetails?: {
    brand?: string;
    model?: string;
    budget?: string;
    link?: string;
    color?: string;
    country?: string;
    size?: string;
    phone?: string;
  };
}

interface OrderStore {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  purgeAllOrders: () => Promise<void>;
  listenToOrders: () => void;
}

const ORDERS_COLLECTION = 'orders';

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      setOrders: (orders) => set({ orders }),

      addOrder: async (order) => {
        // Sanitize sensitive order content to protect against stored XSS
        const sanitizedOrder: Order = {
          ...order,
          customer: {
            name: sanitizeString(order.customer.name, 100),
            phone: sanitizePhone(order.customer.phone),
            address: order.customer.address ? sanitizeString(order.customer.address, 300) : undefined,
            city: order.customer.city ? sanitizeString(order.customer.city, 100) : undefined,
          },
          items: order.items.map((item) => ({
            ...item,
            name: sanitizeString(item.name, 150),
            size: item.size ? sanitizeString(String(item.size), 20) : undefined,
          })),
          specialRequestDetails: order.specialRequestDetails
            ? {
                brand: sanitizeString(order.specialRequestDetails.brand || '', 50),
                model: sanitizeString(order.specialRequestDetails.model || '', 100),
                budget: sanitizeString(order.specialRequestDetails.budget || '', 50),
                link: sanitizeString(order.specialRequestDetails.link || '', 500),
                color: sanitizeString(order.specialRequestDetails.color || '', 50),
                size: sanitizeString(order.specialRequestDetails.size || '', 20),
                phone: sanitizePhone(order.specialRequestDetails.phone || ''),
              }
            : undefined,
        };

        // 1. Optimistic UI update
        set((state) => ({ orders: [sanitizedOrder, ...state.orders] }));

        // 2. Save to Supabase (Primary Cloud Database)
        if (isSupabaseConfigured()) {
          try {
            await saveOrderToSupabase(sanitizedOrder);
          } catch (e) {
            console.error('Failed to save order to Supabase:', e);
          }
        }

        // 3. Save to Firebase if configured
        if (isFirebaseConfigured()) {
          try {
            await setDoc(doc(db, ORDERS_COLLECTION, sanitizedOrder.id), sanitizedOrder);
          } catch (e) {
            console.error('Failed to save to Firebase:', e);
          }
        }
      },

      updateOrderStatus: async (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        }));

        if (isSupabaseConfigured()) {
          try {
            await updateOrderStatusInSupabase(id, status);
          } catch (e) {
            console.error('Failed to update status in Supabase:', e);
          }
        }

        if (isFirebaseConfigured()) {
          try {
            await updateDoc(doc(db, ORDERS_COLLECTION, id), { status });
          } catch (e) {
            console.error('Failed to update status in Firebase:', e);
          }
        }
      },

      deleteOrder: async (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));

        if (isSupabaseConfigured()) {
          try {
            await deleteOrderFromSupabase(id);
          } catch (e) {
            console.error('Failed to delete from Supabase:', e);
          }
        }

        if (isFirebaseConfigured()) {
          try {
            await deleteDoc(doc(db, ORDERS_COLLECTION, id));
          } catch (e) {
            console.error('Failed to delete from Firebase:', e);
          }
        }
      },

      clearAll: async () => {
        const { orders } = get();
        set({ orders: [] });
        try {
          localStorage.removeItem('ym-orders-storage');
        } catch {
          // ignore
        }

        if (isSupabaseConfigured()) {
          try {
            await purgeAllOrdersFromSupabase();
          } catch (e) {
            console.error('Failed to clear Supabase orders:', e);
          }
        }

        if (isFirebaseConfigured()) {
          try {
            const batchPromises = orders.map((o) => deleteDoc(doc(db, ORDERS_COLLECTION, o.id)));
            await Promise.all(batchPromises);
          } catch (e) {
            console.error('Failed to clear Firebase:', e);
          }
        }
      },

      purgeAllOrders: async () => {
        // Absolute full purge of all test/fake orders from memory, localStorage, Supabase, and Firestore
        set({ orders: [] });
        try {
          localStorage.removeItem('ym-orders-storage');
        } catch {
          // ignore
        }

        if (isSupabaseConfigured()) {
          try {
            await purgeAllOrdersFromSupabase();
            console.log('[Supabase] Purged all orders from Supabase.');
          } catch (e) {
            console.error('Failed to purge Supabase orders:', e);
          }
        }

        if (isFirebaseConfigured()) {
          try {
            const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
            const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);
            console.log('[Security] Purged all orders from Firestore database.');
          } catch (e) {
            console.error('Failed to purge Firebase orders:', e);
          }
        }
      },

      listenToOrders: () => {
        // 1. Supabase Realtime Listener & Initial Sync
        if (isSupabaseConfigured()) {
          const loadInitialOrders = async () => {
            const remoteOrders = await fetchOrdersFromSupabase();
            if (remoteOrders && remoteOrders.length > 0) {
              set({ orders: remoteOrders });
            }
          };

          loadInitialOrders();

          subscribeToOrdersFromSupabase(async () => {
            const updated = await fetchOrdersFromSupabase();
            if (updated) {
              set({ orders: updated });
            }
          });
        }

        // 2. Firebase Listener (Fallback/Secondary)
        if (isFirebaseConfigured()) {
          const q = query(collection(db, ORDERS_COLLECTION), orderBy('date', 'desc'));
          onSnapshot(
            q,
            (snapshot) => {
              const fetchedOrders = snapshot.docs.map((doc) => doc.data() as Order);
              set({ orders: fetchedOrders });
            },
            (error) => {
              console.error('Error listening to orders in Firebase:', error);
            }
          );
        }
      },
    }),
    {
      name: 'ym-orders-storage',
    }
  )
);
