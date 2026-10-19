import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types/product';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: string | null;
  discountRate: number; // e.g. 0.1 for 10%
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, selectedSize: number | string, selectedColor?: string) => void;
  removeItem: (productId: number, selectedSize: number | string) => void;
  updateQuantity: (productId: number, selectedSize: number | string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: { en: string; ar: string } };
  removeCoupon: () => void;
  clearCart: () => void;
  
  // Computed values
  getTotalCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getFinalTotal: () => number;
}

export const FREE_SHIPPING_THRESHOLD = 3000; // EGP
export const STANDARD_SHIPPING_FEE = 120; // EGP

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      discountRate: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, selectedSize: number | string, selectedColor?: string) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedSize === selectedSize
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated, isOpen: true };
          } else {
            return {
              items: [...state.items, { product, selectedSize, selectedColor, quantity: 1 }],
              isOpen: true,
            };
          }
        });
      },

      removeItem: (productId: number, selectedSize: number | string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
          ),
        }));
      },

      updateQuantity: (productId: number, selectedSize: number | string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedSize);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.selectedSize === selectedSize) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'YM10') {
          set({ appliedCoupon: 'YM10', discountRate: 0.1 });
          return {
            success: true,
            message: { en: '10% discount applied!', ar: 'تم تطبيق خصم 10٪!' },
          };
        } else if (clean === 'EGYPT20') {
          set({ appliedCoupon: 'EGYPT20', discountRate: 0.2 });
          return {
            success: true,
            message: { en: '20% Welcome discount applied!', ar: 'تم تطبيق خصم الترحيب 20٪!' },
          };
        }
        return {
          success: false,
          message: { en: 'Invalid voucher code.', ar: 'كوبون الخصم غير صالح.' },
        };
      },

      removeCoupon: () => set({ appliedCoupon: null, discountRate: 0 }),

      clearCart: () => set({ items: [], appliedCoupon: null, discountRate: 0 }),

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * get().discountRate);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      },

      getFinalTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'ym_cart_storage',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        discountRate: state.discountRate,
      }),
    }
  )
);
