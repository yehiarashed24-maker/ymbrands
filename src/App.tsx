import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchOverlay } from './components/common/SearchOverlay';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { NotFound } from './pages/NotFound';
import { Sourcing } from './pages/Sourcing';
import { FAQ } from './pages/FAQ';
import { Reviews } from './pages/Reviews';
import { Contact } from './pages/Contact';
import { AIAssistant } from './components/common/AIAssistant';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useLanguageStore } from './store/languageStore';
import { useProductStore } from './store/productStore';

// Code-split AdminDashboard so its code is never downloaded by regular users
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguageStore();

  // Live Cloud Synchronization: Syncs products across all devices in real-time
  useEffect(() => {
    const unsubscribe = useProductStore.getState().initProductSync();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Sync RTL attributes on document element
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-ym-charcoal">
      {/* Cinematic Flying Sneaker Intro Preloader */}
      <LoadingScreen />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Routed Page Content */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/:categorySlug" element={<Shop />} />
          <Route path="/:categorySlug/:genderSlug" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/aaa"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-ym-lime animate-pulse mb-3">
                      <span className="font-mono text-xs font-black">YM</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Initializing Terminal...
                    </p>
                  </div>
                }
              >
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="/ym-hq-ops-909"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-ym-lime animate-pulse mb-3">
                      <span className="font-mono text-xs font-black">YM</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Initializing Terminal...
                    </p>
                  </div>
                }
              >
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {location.pathname !== '/aaa' && location.pathname !== '/ym-hq-ops-909' && <AIAssistant />}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
