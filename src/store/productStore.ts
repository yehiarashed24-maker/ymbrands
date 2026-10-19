import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { products as defaultProducts } from '../data/products';
import {
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, product: Product) => void;
  toggleStock: (id: number) => void;
  toggleFeatured: (id: number) => void;
  deleteProduct: (id: number) => void;
  clearAllProducts: () => void;
  importProducts: (products: Product[]) => void;
  resetToDefault: () => void;
  seedSportsCatalog: () => void;
  syncWithCloud: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // Initialize with our rich curated sports catalog
      products: defaultProducts,

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products.filter((p) => p.id !== product.id)],
        }));
        if (isSupabaseConfigured()) {
          saveProductToSupabase(product).catch((e) =>
            console.warn('[Supabase] Background save failed:', e)
          );
        }
      },

      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        }));
        if (isSupabaseConfigured()) {
          saveProductToSupabase(updatedProduct).catch((e) =>
            console.warn('[Supabase] Background update failed:', e)
          );
        }
      },

      toggleStock: (id) => {
        const { products } = get();
        const target = products.find((p) => p.id === id);
        if (target) {
          const updated = { ...target, inStock: !target.inStock };
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updated : p)),
          }));
          if (isSupabaseConfigured()) {
            saveProductToSupabase(updated).catch(() => {});
          }
        }
      },

      toggleFeatured: (id) => {
        const { products } = get();
        const target = products.find((p) => p.id === id);
        if (target) {
          const updated = { ...target, isFeatured: !target.isFeatured };
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updated : p)),
          }));
          if (isSupabaseConfigured()) {
            saveProductToSupabase(updated).catch(() => {});
          }
        }
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        if (isSupabaseConfigured()) {
          deleteProductFromSupabase(id).catch(() => {});
        }
      },

      clearAllProducts: () => {
        set({ products: [] });
        try {
          localStorage.removeItem('ym-products-storage');
        } catch {
          // ignore
        }
      },

      importProducts: (newProducts) => {
        set((state) => ({
          products: [...newProducts, ...state.products],
        }));
        if (isSupabaseConfigured()) {
          newProducts.forEach((p) => saveProductToSupabase(p).catch(() => {}));
        }
      },

      resetToDefault: () => {
        set(() => ({
          products: defaultProducts,
        }));
      },

      seedSportsCatalog: () => {
        set(() => ({
          products: defaultProducts,
        }));
        if (isSupabaseConfigured()) {
          defaultProducts.forEach((p) => saveProductToSupabase(p).catch(() => {}));
        }
      },

      syncWithCloud: async () => {
        if (!isSupabaseConfigured()) return;
        try {
          const cloudProducts = await fetchProductsFromSupabase();
          if (cloudProducts && cloudProducts.length > 0) {
            set({ products: cloudProducts });
          }
        } catch (e) {
          console.warn('[Supabase] Error syncing products from cloud:', e);
        }
      },
    }),
    {
      name: 'ym-products-storage',
      version: 2,
    }
  )
);
