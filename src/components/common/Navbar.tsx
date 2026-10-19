import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, Globe, ChevronDown } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useScrollProgress } from '../../hooks/useWindowSize';
// @ts-ignore
import { MobileMenu } from './MobileMenu';
import { GenderMegaMenu, CategoryNavConfig } from './GenderMegaMenu';
import ymBrandsLogo from '../../assets/ym-brands-logo.png';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { language, toggleLanguage } = useLanguageStore();
  const t = translations[language].nav;
  const { isScrolled } = useScrollProgress();
  const { getTotalCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryNavConfig | null>(null);

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  // The exact 4 top-level categories required
  const categories: CategoryNavConfig[] = [
    {
      id: 'sportswear',
      slug: 'sportswear',
      label: { en: 'SPORTSWEAR', ar: 'ملابس رياضية' },
    },
    {
      id: 'sport-shoes',
      slug: 'sport-shoes',
      label: { en: 'SPORT SHOES', ar: 'أحذية رياضية' },
    },
    {
      id: 'sneakers',
      slug: 'sneakers',
      label: { en: 'SNEAKERS', ar: 'سنيكرز' },
    },
    {
      id: 'accessories',
      slug: 'accessories',
      label: { en: 'ACCESSORIES', ar: 'إكسسوارات' },
    },
  ];

  const handleCategoryClick = (cat: CategoryNavConfig) => {
    // If clicking same category, toggle it closed. Otherwise open it.
    setActiveCategory((prev) => (prev?.id === cat.id ? null : cat));
  };

  return (
    <header className="fixed top-0 inset-x-0 z-[100] pointer-events-none">
      <div
        className={`w-full transition-all duration-300 pointer-events-auto ${isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-3 sm:py-3.5'
          : 'bg-white/40 backdrop-blur-[6px] border-b border-white/20 py-4 sm:py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Official YM BRANDS Logo */}
          <Link
            to="/"
            onClick={() => setActiveCategory(null)}
            className="group flex items-center select-none"
            aria-label="YM BRANDS Home"
          >
            <img
              src={ymBrandsLogo}
              alt="YM BRANDS"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            />
          </Link>

          {/* Center 4 Category Buttons (Click opens Gender Selector) */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => {
              const isActive = activeCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`group flex items-center gap-1.5 text-xs font-black tracking-wider uppercase transition-all py-1.5 px-3 rounded-full cursor-pointer select-none ${isActive
                    ? 'bg-ym-charcoal text-white shadow-sm'
                    : 'text-ym-charcoal/90 hover:text-black hover:bg-black/5'
                    }`}
                >
                  <span>{cat.label[language]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'rotate-180 text-ym-lime' : 'text-slate-400 group-hover:text-black'
                      }`}
                  />
                </button>
              );
            })}

            {/* Special Order Link */}
            <Link
              to="/sourcing"
              onClick={() => setActiveCategory(null)}
              className="text-xs font-black tracking-wider uppercase bg-ym-lime text-black hover:bg-black hover:text-white transition-colors py-1.5 px-4 rounded-full ml-4 shadow-sm"
            >
              {language === 'en' ? 'SPECIAL ORDER' : 'طلبات خاصة'}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => {
                setActiveCategory(null);
                onOpenSearch();
              }}
              aria-label={t.search}
              className="p-2 text-ym-charcoal hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              onClick={() => setActiveCategory(null)}
              aria-label={t.wishlist}
              className="relative p-2 text-ym-charcoal hover:bg-black/5 rounded-full transition-colors hidden sm:inline-flex"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ym-charcoal text-white text-[9px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => {
                setActiveCategory(null);
                openCart();
              }}
              aria-label={t.cart}
              className="relative p-2 text-ym-charcoal hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ym-lime text-black text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black tracking-wider uppercase rounded-full border border-black/15 bg-white/70 backdrop-blur-sm hover:bg-white text-ym-charcoal transition-all cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 text-ym-charcoal hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop Gender Mega Menu Dropdown */}
        <div className="relative w-full">
          <GenderMegaMenu
            activeCategory={activeCategory}
            onClose={() => setActiveCategory(null)}
          />
        </div>
      </div>

      {/* Mobile Accordion Navigation Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        onOpenSearch={() => {
          setMobileMenuOpen(false);
          onOpenSearch();
        }}
      />
    </header>
  );
};
