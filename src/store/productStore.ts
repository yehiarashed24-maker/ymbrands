import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { products as defaultProducts } from '../data/products';
import {
  saveProductToSupabase,
  deleteProductFromSupabase,
  purgeAllProductsFromSupabase,
  fetchProductsFromSupabase,
  subscribeToProductsFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

interface ProductStore {
  products: Product[];
  isLoadingCloud: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: number, product: Product) => Promise<void>;
  toggleStock: (id: number) => Promise<void>;
  toggleFeatured: (id: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  importProducts: (products: Product[]) => Promise<void>;
  resetToDefault: () => void;
  seedSportsCatalog: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
  initProductSync: () => () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [], // Completely clean catalog controlled directly by admin
      isLoadingCloud: false,

      addProduct: async (product) => {
        set((state) => ({
          products: [product, ...state.products.filter((p) => p.id !== product.id)],
        }));
        if (isSupabaseConfigured()) {
          try {
            await saveProductToSupabase(product);
          } catch (e) {
            console.warn('[Supabase] Background save failed:', e);
          }
        }
      },

      updateProduct: async (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        }));
        if (isSupabaseConfigured()) {
          try {
            await saveProductToSupabase(updatedProduct);
          } catch (e) {
            console.warn('[Supabase] Background update failed:', e);
          }
        }
      },

      toggleStock: async (id) => {
        const { products } = get();
        const target = products.find((p) => p.id === id);
        if (target) {
          const updated = { ...target, inStock: !target.inStock };
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updated : p)),
          }));
          if (isSupabaseConfigured()) {
            await saveProductToSupabase(updated).catch(() => {});
          }
        }
      },

      toggleFeatured: async (id) => {
        const { products } = get();
        const target = products.find((p) => p.id === id);
        if (target) {
          const updated = { ...target, isFeatured: !target.isFeatured };
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updated : p)),
          }));
          if (isSupabaseConfigured()) {
            await saveProductToSupabase(updated).catch(() => {});
          }
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        if (isSupabaseConfigured()) {
          try {
            await deleteProductFromSupabase(id);
          } catch (e) {
            console.warn('[Supabase] Error deleting product from cloud:', e);
          }
        }
      },

      clearAllProducts: async () => {
        set({ products: [] });
        try {
          localStorage.removeItem('ym-products-storage-v5');
          localStorage.removeItem('ym-products-storage-v4');
        } catch {
          // ignore
        }
        if (isSupabaseConfigured()) {
          try {
            await purgeAllProductsFromSupabase();
          } catch (e) {
            console.warn('[Supabase] Error purging all products from cloud:', e);
          }
        }
      },

      importProducts: async (newProducts) => {
        set((state) => ({
          products: [...newProducts, ...state.products],
        }));
        if (isSupabaseConfigured()) {
          for (const p of newProducts) {
            await saveProductToSupabase(p).catch(() => {});
          }
        }
      },

      resetToDefault: () => {
        set(() => ({
          products: defaultProducts,
        }));
      },

      seedSportsCatalog: async () => {
        set(() => ({
          products: defaultProducts,
        }));
        if (isSupabaseConfigured()) {
          for (const p of defaultProducts) {
            await saveProductToSupabase(p).catch(() => {});
          }
        }
      },

      syncWithCloud: async () => {
        if (!isSupabaseConfigured()) return;
        set({ isLoadingCloud: true });
        try {
          const cloudProducts = await fetchProductsFromSupabase();
          if (cloudProducts !== null) {
            // Cloud is authoritative source of truth for all connected devices
            set({ products: cloudProducts, isLoadingCloud: false });
          } else {
            set({ isLoadingCloud: false });
          }
        } catch (e) {
          console.warn('[Supabase] Error syncing products from cloud:', e);
          set({ isLoadingCloud: false });
        }
      },

      initProductSync: () => {
        // 1. Initial Cloud Sync on boot
        get().syncWithCloud();

        // 2. Mobile & desktop window focus / visibility change sync
        const handleSyncTrigger = () => {
          if (document.visibilityState === 'visible') {
            get().syncWithCloud();
          }
        };

        window.addEventListener('focus', handleSyncTrigger);
        document.addEventListener('visibilitychange', handleSyncTrigger);

        // 3. Periodic background sync (every 12 seconds) so mobile stays 100% in sync
        const intervalId = setInterval(() => {
          get().syncWithCloud();
        }, 12000);

        // 4. Realtime Supabase listener
        const unsubscribeRealtime = isSupabaseConfigured()
          ? subscribeToProductsFromSupabase(async () => {
              const cloudProducts = await fetchProductsFromSupabase();
              if (cloudProducts !== null) {
                set({ products: cloudProducts });
              }
            })
          : () => {};

        return () => {
          window.removeEventListener('focus', handleSyncTrigger);
          document.removeEventListener('visibilitychange', handleSyncTrigger);
          clearInterval(intervalId);
          unsubscribeRealtime();
        };
      },
    }),
    {
      name: 'ym-products-storage-v5',
      version: 5,
    }
  )
);
