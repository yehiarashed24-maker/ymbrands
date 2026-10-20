import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOrderStore, OrderStatus, Order } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { Product, ProductCategory, ProductSport } from '../types/product';
import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  PackageOpen,
  ChevronDown,
  Plus,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Upload,
  Download,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Phone,
  MessageSquare,
  Edit3,
  Printer,
  X,
  Check,
  DollarSign,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Filter,
  Layers,
  ChevronRight,
  Maximize2,
  Loader2,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import {
  sanitizeString,
  sha256,
  generateAdminSessionTicket,
  verifyAdminSessionTicket,
  timingDelay,
  checkStrictRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
} from '../lib/security';
import { CloudLayer } from '@/components/hero/CloudLayer';
import shoePink from '@/assets/shoes/nike-airmax-pink.png';

// Default Master SHA-256 Hash of 'YM-2026-HQ'
const MASTER_HASH = 'f22ff36d7636866e5a8cb5a55687c840c8d549491eafbf60b169ff630f3b2166';
const RAW_ENV_PIN = (import.meta.env.VITE_ADMIN_PIN_HASH || import.meta.env.VITE_ADMIN_PIN || '').trim();

// Normalizes input: handles case-insensitivity, trims, and converts any smart dashes (–, —) to ASCII '-'
const normalizePin = (str: string): string => {
  return str
    .trim()
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE63\uFF0D_]/g, '-')
    .toUpperCase();
};

const AUTH_TICKET_KEY = 'ym_hq_admin_ticket_v2';
const AUTH_TIMESTAMP_KEY = 'ym_hq_admin_auth_time_v2';
const SESSION_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes strict session expiration

const ALL_SPORTS_CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'Sportswear', label: 'Sportswear (ملابس وترنجات رياضية)', icon: '👕' },
  { id: 'Sport Shoes', label: 'Sport Shoes (أحذية رياضية كورة وباسكت وجري)', icon: '⚽' },
  { id: 'Sneakers', label: 'Sneakers (سنيكرز لايف ستايل)', icon: '👟' },
  { id: 'Accessories', label: 'Accessories (إكسسوارات ومعدات)', icon: '🎒' },
];

const ALL_SPORTS_ACTIVITIES: { id: ProductSport; label: string; icon: string }[] = [
  { id: 'Basketball', label: 'Basketball (كرة السلة)', icon: '🏀' },
  { id: 'Football', label: 'Football (كرة القدم)', icon: '⚽' },
  { id: 'Running', label: 'Running (الجري)', icon: '🏃' },
  { id: 'Training', label: 'Training & Gym (تمارين وجيم)', icon: '🏋️' },
  { id: 'Lifestyle', label: 'Lifestyle & Casual (لايف ستايل وسنيكرز)', icon: '👟' },
  { id: 'General', label: 'General / All (عام لجميع الرياضات)', icon: '⚡' },
];

/**
 * Compresses and resizes an image file from the user's laptop using HTML5 Canvas.
 * Keeps aspect ratio, max 1200x1200px, quality 0.85 JPEG.
 * Produces an ultra-crisp web image of ~70-150KB that saves quickly to Supabase.
 */
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve((e.target?.result as string) || '');
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } catch {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

interface ProductImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  images,
  onChange,
  label = 'Product Images / صور المنتج',
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file);
        if (compressed) {
          newImages.push(compressed);
        }
      }
      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    } catch (e) {
      console.error('Failed to process image files:', e);
      alert('حدث خطأ أثناء قراءة الصور');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  const handleRemove = (idxToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSetPrimary = (idxToPromote: number) => {
    if (idxToPromote === 0) return;
    const promoted = images[idxToPromote];
    const rest = images.filter((_, idx) => idx !== idxToPromote);
    onChange([promoted, ...rest]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] font-bold text-slate-500">
          {images.length} {images.length === 1 ? 'صورة مضافة' : 'صور مضافة'}
        </span>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
          isProcessing
            ? 'bg-slate-100 border-slate-300 pointer-events-none'
            : 'border-slate-300 hover:border-ym-charcoal bg-slate-50 hover:bg-slate-100/80'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 py-2">
            <Loader2 className="w-5 h-5 animate-spin text-ym-charcoal" />
            <span>جاري معالجة وضغط الصور من اللاب...</span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:text-ym-charcoal transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                اضغط لاختيار صور من جهازك أو اسحبها هنا (يدعم رفع عدة صور معاً)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, WEBP (يتم تحسينها وضغطها تلقائياً لأعلى جودة وسرعة تصفح)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Alternative Direct URL Input */}
      <div className="flex items-center gap-2">
        <input
          type="url"
          placeholder="أو أضف رابط صورة مباشر (https://...)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          + إضافة الرابط
        </button>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative group rounded-xl overflow-hidden bg-white border-2 aspect-square flex items-center justify-center ${
                idx === 0 ? 'border-ym-charcoal ring-2 ring-ym-charcoal/20' : 'border-slate-200'
              }`}
            >
              <img
                src={img}
                alt={`Product preview ${idx + 1}`}
                className="w-full h-full object-contain p-1"
              />

              {/* Primary Label */}
              {idx === 0 && (
                <div className="absolute top-1 left-1 bg-black/85 text-ym-lime text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-ym-lime text-ym-lime" />
                  <span>الرئيسية (الغلاف)</span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="px-2 py-0.5 bg-ym-lime hover:bg-lime-400 text-black text-[9px] font-black rounded cursor-pointer shadow flex items-center gap-1"
                  >
                    <Star className="w-2.5 h-2.5" />
                    <span>اجعلها رئيسية</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full cursor-pointer shadow"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200/60 rounded-xl p-2.5 text-center font-medium">
          ⚠️ يجب إضافة صورة واحدة على الأقل من جهازك أو عبر رابط لإظهار المنتج للزبائن
        </p>
      )}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const routeTicket = searchParams.get('ticket') || searchParams.get('unlock') || searchParams.get('ops') || searchParams.get('a');
  const isDirectAaaRoute = typeof window !== 'undefined' && window.location.pathname === '/aaa';
  const hasValidRouteTicket = isDirectAaaRoute || routeTicket === 'aaa' || routeTicket === 'ym-ops' || routeTicket === 'ym-admin' || routeTicket === 'ym2026';

  // Authentication & Stealth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isStealthDisguiseActive, setIsStealthDisguiseActive] = useState<boolean>(() => !hasValidRouteTicket);
  const [decoyClickCount, setDecoyClickCount] = useState<number>(0);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Stores
  const { orders, updateOrderStatus, deleteOrder, purgeAllOrders, listenToOrders } = useOrderStore();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    importProducts,
    seedSportsCatalog,
    toggleStock,
    toggleFeatured
  } = useProductStore();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true); // Default to Privacy Mode ON for data security

  // Orders Controls & Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'standard' | 'special'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'instapay' | 'cod'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Products Controls & Filters
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Modals
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [viewingReceiptImage, setViewingReceiptImage] = useState<string | null>(null);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<Order | null>(null);

  // New Product Form State
  const initialNewProdState = {
    nameEn: '',
    nameAr: '',
    brand: 'NIKE',
    category: 'Sportswear' as ProductCategory,
    sport: 'Lifestyle' as ProductSport,
    subCategory: 'Apparel',
    gender: 'Unisex' as 'Men' | 'Women' | 'Unisex' | 'Kids',
    price: 5900,
    originalPrice: 6500,
    image: '',
    images: '',
    sizes: '40, 41, 42, 43, 44, 45',
    colorNameEn: 'Original',
    colorNameAr: 'أصلي',
    colorHex: '#111111',
    descriptionEn: '100% Verified Authentic, brand new in original box.',
    descriptionAr: 'أصلي 100% جديد بالعلبة الأصلية مع كود التحقق والباركود.',
    isByOrder: false,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    inStock: true,
  };
  const [newProd, setNewProd] = useState(initialNewProdState);

  // Edit Product Form State
  const [editForm, setEditForm] = useState(initialNewProdState);

  // Uploaded & Managed Images State
  const [newProdImages, setNewProdImages] = useState<string[]>([]);
  const [editProdImages, setEditProdImages] = useState<string[]>([]);

  // 1. Verify Cryptographic Session Ticket on Mount
  useEffect(() => {
    let isMounted = true;

    const verifyExistingSession = async () => {
      try {
        const ticket = sessionStorage.getItem(AUTH_TICKET_KEY);
        const time = sessionStorage.getItem(AUTH_TIMESTAMP_KEY);
        if (ticket && time) {
          const isValid = await verifyAdminSessionTicket(ticket, MASTER_HASH, time, SESSION_MAX_AGE_MS);
          if (isValid && isMounted) {
            setIsAuthenticated(true);
            setIsStealthDisguiseActive(false);
            setIsCheckingAuth(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      if (isMounted) {
        sessionStorage.removeItem(AUTH_TICKET_KEY);
        sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
        sessionStorage.removeItem('ym_hq_admin_authenticated');
        sessionStorage.removeItem('ym_hq_admin_auth_time');
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
      }
    };

    verifyExistingSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Check Persistent Lockout Status
  useEffect(() => {
    const checkLockout = async () => {
      const rateLimit = await checkStrictRateLimit('admin_auth_attempts');
      if (!rateLimit.allowed) {
        setIsLockedOut(true);
        setLockoutTime(rateLimit.retryAfterSeconds);
        setPinError(`Security lockdown active. Try again in ${rateLimit.retryAfterSeconds}s.`);
      }
    };
    checkLockout();
  }, []);

  // 3. Lockout Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setPinError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  // 4. Secret Stealth Keyboard Shortcut: Ctrl+Shift+A or Alt+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && (e.key === 'a' || e.key === 'A') && !isAuthenticated) {
        e.preventDefault();
        setIsStealthDisguiseActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  // 4.5 Anti-DevTools & Source Code Inspection Shield
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleInspectShortcuts = (e: KeyboardEvent) => {
      // Block F12 DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+Shift+I / J / C / U / S (Inspect / Console / View Source)
      if (
        (e.ctrlKey || e.metaKey) &&
        ['i', 'I', 'j', 'J', 'c', 'C', 'u', 'U', 's', 'S'].includes(e.key)
      ) {
        // Keep our stealth shortcut Ctrl+Shift+A active
        if ((e.key === 'a' || e.key === 'A') && e.shiftKey) {
          return;
        }
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleInspectShortcuts);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleInspectShortcuts);
    };
  }, []);

  // 5. Inactivity Auto-Logout (15 minutes idle timer)
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastActivity = Date.now();
    const resetActivity = () => {
      lastActivity = Date.now();
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetActivity, { passive: true }));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_MAX_AGE_MS) {
        handleLogout();
      }
    }, 15000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetActivity));
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // 6. Listen to Realtime Orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      listenToOrders();
    }
  }, [isAuthenticated, listenToOrders]);

  // Handle Admin Login with Cryptographic SHA-256 Passcode, Timing Delay & Rate Limiting
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut || isSubmitting) return;

    setPinError('');
    setIsSubmitting(true);

    // 1. Strict persistent rate limit check
    const rateLimit = await checkStrictRateLimit('admin_auth_attempts');
    if (!rateLimit.allowed) {
      setIsLockedOut(true);
      setLockoutTime(rateLimit.retryAfterSeconds);
      setPinError(`Too many failed attempts. Security lockout active for ${rateLimit.retryAfterSeconds}s.`);
      setIsSubmitting(false);
      return;
    }

    // 3. Cryptographic Verification & Multi-Format Normalization
    const cleanInput = normalizePin(pinInput);
    const inputHash = await sha256(cleanInput);

    let isMatch = false;
    if (inputHash === MASTER_HASH || cleanInput === 'YM-2026-HQ') {
      isMatch = true;
    } else if (RAW_ENV_PIN) {
      if (inputHash === RAW_ENV_PIN || cleanInput === normalizePin(RAW_ENV_PIN)) {
        isMatch = true;
      } else {
        const envPinHash = await sha256(normalizePin(RAW_ENV_PIN));
        if (inputHash === envPinHash) {
          isMatch = true;
        }
      }
    }

    if (isMatch) {
      clearFailedAttempts('admin_auth_attempts');
      const now = Date.now();
      const ticket = await generateAdminSessionTicket(MASTER_HASH, now);

      try {
        sessionStorage.setItem(AUTH_TICKET_KEY, ticket);
        sessionStorage.setItem(AUTH_TIMESTAMP_KEY, now.toString());
      } catch {
        // ignore
      }

      setIsAuthenticated(true);
      setPinInput('');
      setPinError('');
      setIsLockedOut(false);
      setLockoutTime(0);
    } else {
      const penaltySeconds = await recordFailedAttempt('admin_auth_attempts');
      if (penaltySeconds > 0) {
        setIsLockedOut(true);
        setLockoutTime(penaltySeconds);
        setPinError(`Security lockdown triggered. Locked for ${penaltySeconds}s.`);
      } else {
        setPinError('Invalid Security Passcode. Access denied.');
      }
    }

    setIsSubmitting(false);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_TICKET_KEY);
      sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
      sessionStorage.removeItem('ym_hq_admin_authenticated');
      sessionStorage.removeItem('ym_hq_admin_auth_time');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setIsStealthDisguiseActive(true);
    setPinInput('');
    setPinError('');
  };

  // Mask sensitive data if privacyMode is enabled
  const maskPhone = (phone: string) => {
    if (!privacyMode || phone.length < 6) return phone;
    return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
  };

  const maskAddress = (address?: string) => {
    if (!privacyMode || !address) return address;
    return `${address.slice(0, 8)}... [Hidden in Privacy Mode]`;
  };

  // WhatsApp 1-Click Link Generator
  const getWhatsAppLink = (order: Order) => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0')
      ? '2' + cleanPhone
      : cleanPhone.startsWith('2')
      ? cleanPhone
      : '20' + cleanPhone;
    const msg = `مرحباً يا ${order.customer.name}، معك إدارة YM BRANDS بخصوص طلبك رقم #${order.id}. إجمالي الأوردر: ${
      order.total ? order.total.toLocaleString() + ' ج.م' : 'طلب خاص'
    }. هل تود تأكيد خروج الشحنة لحضرتك؟`;
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Calculate Metrics & Financial Statistics
  const metrics = useMemo(() => {
    const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
    const totalSales = nonCancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const processingCount = orders.filter((o) => o.status === 'processing').length;
    const completedCount = orders.filter((o) => o.status === 'completed').length;
    const specialCount = orders.filter((o) => o.type === 'special').length;
    const instapayCount = orders.filter((o) => o.paymentMethod === 'instapay').length;
    const codCount = orders.filter((o) => o.paymentMethod === 'cod').length;

    // Categories breakdown
    const categoryCounts: Record<string, number> = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return {
      totalSales,
      pendingCount,
      processingCount,
      completedCount,
      specialCount,
      instapayCount,
      codCount,
      categoryCounts,
    };
  }, [orders, products]);

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matches =
          order.id.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.includes(q) ||
          (order.customer.city || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
        return false;
      }

      // Type
      if (orderTypeFilter !== 'all' && order.type !== orderTypeFilter) {
        return false;
      }

      // Payment
      if (paymentFilter !== 'all') {
        if (paymentFilter === 'instapay' && order.paymentMethod !== 'instapay') return false;
        if (paymentFilter === 'cod' && order.paymentMethod !== 'cod') return false;
      }

      return true;
    });
  }, [orders, searchTerm, orderStatusFilter, orderTypeFilter, paymentFilter]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matches =
          p.name.en.toLowerCase().includes(q) ||
          p.name.ar.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.subCategory || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, productCategoryFilter]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Pending
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 bg-sky-100 text-sky-900 border border-sky-200 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <PackageOpen className="w-3.5 h-3.5 text-sky-600" /> Processing
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-[11px] font-black uppercase tracking-wider shadow-2xs">
            Cancelled
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Create Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.nameEn) {
      alert('Please provide product English name.');
      return;
    }

    if (newProdImages.length === 0) {
      alert('برجاء إضافة صورة واحدة على الأقل للمنتج (ارفعها من جهازك أو أضف رابط مباشر).');
      return;
    }

    const sizesArr = newProd.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (isNaN(Number(s)) ? s : Number(s)));

    const generatedSlug =
      newProd.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const createdProduct: Product = {
      id: Date.now(),
      slug: generatedSlug,
      brand: newProd.brand.toUpperCase(),
      name: {
        en: sanitizeString(newProd.nameEn, 100),
        ar: sanitizeString(newProd.nameAr || newProd.nameEn, 100),
      },
      category: newProd.category,
      sport: newProd.sport || 'General',
      subCategory: newProd.subCategory,
      gender: newProd.gender,
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      image: newProdImages[0],
      images: newProdImages,
      sizes: sizesArr.length > 0 ? sizesArr : [40, 41, 42, 43, 44, 45],
      colors: [
        {
          name: {
            en: newProd.colorNameEn || 'Original',
            ar: newProd.colorNameAr || 'أصلي',
          },
          hex: newProd.colorHex || '#111111',
        },
      ],
      accent: newProd.colorHex || '#111111',
      description: {
        en: sanitizeString(newProd.descriptionEn, 300),
        ar: sanitizeString(newProd.descriptionAr, 300),
      },
      details: {
        en: ['100% Verified Authentic', 'Original barcode verification', 'Fast insured delivery in Egypt'],
        ar: ['أصلي 100% معتمد ومفحوص', 'الباركود وسيريال المصنع الأصلي', 'شحن سريع ومؤمن لكافة المحافظات'],
      },
      isByOrder: newProd.isByOrder,
      isNew: newProd.isNew,
      isBestSeller: newProd.isBestSeller,
      isFeatured: newProd.isFeatured,
      rating: 5.0,
      reviewCount: 0,
      inStock: newProd.inStock,
    };

    await addProduct(createdProduct);
    setShowAddProductModal(false);
    setNewProd(initialNewProdState);
    setNewProdImages([]);
    alert('تمت إضافة المنتج بنجاح مع كافة الصور إلى المتجر والسحابة!');
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const existingImgs = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
    setEditProdImages(existingImgs);
    setEditForm({
      nameEn: p.name.en,
      nameAr: p.name.ar,
      brand: p.brand,
      category: p.category,
      sport: (p.sport || 'General') as ProductSport,
      subCategory: p.subCategory || '',
      gender: p.gender,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      image: p.image,
      images: existingImgs.slice(1).join(', '),
      sizes: p.sizes.join(', '),
      colorNameEn: p.colors[0]?.name.en || 'Original',
      colorNameAr: p.colors[0]?.name.ar || 'أصلي',
      colorHex: p.colors[0]?.hex || '#111111',
      descriptionEn: p.description.en,
      descriptionAr: p.description.ar,
      isByOrder: Boolean(p.isByOrder),
      isNew: Boolean(p.isNew),
      isBestSeller: Boolean(p.isBestSeller),
      isFeatured: Boolean(p.isFeatured),
      inStock: p.inStock,
    });
    setShowEditProductModal(true);
  };

  // Save Edited Product
  const handleSaveEditedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editProdImages.length === 0) {
      alert('برجاء إضافة صورة واحدة على الأقل للمنتج.');
      return;
    }

    const sizesArr = editForm.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (isNaN(Number(s)) ? s : Number(s)));

    const updated: Product = {
      ...editingProduct,
      brand: editForm.brand.toUpperCase(),
      name: {
        en: sanitizeString(editForm.nameEn, 100),
        ar: sanitizeString(editForm.nameAr || editForm.nameEn, 100),
      },
      category: editForm.category,
      sport: editForm.sport || 'General',
      subCategory: editForm.subCategory,
      gender: editForm.gender,
      price: Number(editForm.price),
      originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
      image: editProdImages[0],
      images: editProdImages,
      sizes: sizesArr.length > 0 ? sizesArr : editingProduct.sizes,
      colors: [
        {
          name: {
            en: editForm.colorNameEn || 'Original',
            ar: editForm.colorNameAr || 'أصلي',
          },
          hex: editForm.colorHex || '#111111',
        },
      ],
      description: {
        en: sanitizeString(editForm.descriptionEn, 300),
        ar: sanitizeString(editForm.descriptionAr, 300),
      },
      isByOrder: editForm.isByOrder,
      isNew: editForm.isNew,
      isBestSeller: editForm.isBestSeller,
      isFeatured: editForm.isFeatured,
      inStock: editForm.inStock,
    };

    await updateProduct(editingProduct.id, updated);
    setShowEditProductModal(false);
    setEditingProduct(null);
    setEditProdImages([]);
    alert(`تم تحديث منتج "${updated.name.en}" بنجاح مع الصور الجديدة!`);
  };

  // Export Catalog JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ym-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Bulk Import Products JSON
  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON content must be an array of products.');
      }
      importProducts(parsed);
      setShowImportModal(false);
      setImportJsonText('');
      alert(`Successfully imported ${parsed.length} products!`);
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Invalid JSON syntax.');
    }
  };

  // Quick Size Fillers for Modal
  const setQuickSizes = (type: 'shoes' | 'apparel') => {
    if (type === 'shoes') {
      setNewProd((prev) => ({ ...prev, sizes: '40, 41, 42, 43, 44, 45' }));
    } else {
      setNewProd((prev) => ({ ...prev, sizes: 'S, M, L, XL, XXL' }));
    }
  };

  // ==========================================
  // 1. AUTHENTICATION & STEALTH GATEKEEPER
  // ==========================================

  // A. Checking session ticket
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-ym-lime animate-pulse mb-4 shadow-xl">
          <Lock className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">
          Verifying Cryptographic Handshake...
        </p>
      </div>
    );
  }

  // B. Route Disguise Mode (Decoy 404 screen to unauthenticated visitors)
  if (!isAuthenticated && isStealthDisguiseActive) {
    return (
      <div
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none"
        style={{
          background: 'linear-gradient(180deg, #38BDF8 0%, #BAE6FD 50%, #FDE8EF 100%)',
        }}
      >
        {/* Moving Clouds */}
        <CloudLayer depth="far" />
        <CloudLayer depth="middle" />

        {/* Content */}
        <div className="relative z-20 max-w-xl mx-auto flex flex-col items-center">
          {/* Floating Shoe */}
          <div className="w-64 sm:w-80 animate-float-slow mb-4">
            <img
              src={shoePink}
              alt="Lost Shoe"
              className="w-full h-auto object-contain filter drop-shadow-2xl"
            />
          </div>

          {/* 3-click subtle trigger on 404 header */}
          <span
            onClick={() => {
              const next = decoyClickCount + 1;
              setDecoyClickCount(next);
              if (next >= 3) {
                setIsStealthDisguiseActive(false);
                setDecoyClickCount(0);
              }
            }}
            className="text-8xl sm:text-9xl font-black text-ym-charcoal font-display tracking-tighter leading-none block cursor-default select-none transition-transform active:scale-95"
            title="YM 404"
          >
            404
          </span>

          <h1 className="text-2xl sm:text-4xl font-black uppercase text-ym-charcoal font-display tracking-tight mt-2 mb-4">
            LOST IN THE CLOUDS?
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 max-w-sm mb-8 font-medium">
            The page you are looking for has drifted away or does not exist.
          </p>

          <Link
            to="/"
            className="px-8 py-4 rounded-full bg-ym-lime hover:bg-ym-lime-hover text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
          >
            BACK TO YM
          </Link>
        </div>

        <div className="relative z-30 pointer-events-none">
          <CloudLayer depth="foreground" />
        </div>

        {/* Discreet stealth unlock trigger in bottom corner (or press Ctrl+Shift+A) */}
        <button
          type="button"
          onClick={() => setIsStealthDisguiseActive(false)}
          className="absolute bottom-3 right-3 text-slate-400/20 hover:text-slate-600/70 p-2.5 rounded-full transition-all cursor-pointer z-40"
          title="Terminal (Ctrl+Shift+A)"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // C. Hardened Terminal Gatekeeper Passcode Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        {/* Ambient cyber glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ym-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
          {/* Header Icon with Live Guard Dot */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-ym-lime flex items-center justify-center shadow-xl ring-4 ring-ym-lime/10">
              <Lock className="w-7 h-7" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ym-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-ym-lime" />
            </span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display tracking-tight">
              YM HQ Terminal
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300 font-mono font-bold tracking-wider uppercase mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-ym-lime" />
              <span>SHA-256 Handshake Guard</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Security Passcode
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  disabled={isLockedOut || isSubmitting}
                  placeholder="Enter Security Passcode"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-700 focus:border-ym-lime rounded-2xl text-sm font-mono tracking-widest text-white outline-none focus:ring-2 focus:ring-ym-lime/20 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Error & Lockout Live Alerts */}
            {isLockedOut ? (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono text-center flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="uppercase">Lockout Enforced</span>
                </div>
                <span>Retry available in {lockoutTime} seconds</span>
              </div>
            ) : pinError ? (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs font-bold font-mono text-center">
                {pinError}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
                Rate Limit Defense • Persistent Exponential Penalty
              </div>
            )}

            <button
              type="submit"
              disabled={isLockedOut || isSubmitting}
              className="w-full py-4 bg-ym-lime hover:bg-ym-lime-hover text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isLockedOut ? (
                <>
                  <Lock className="w-4 h-4 text-black" />
                  <span>Locked Out ({lockoutTime}s)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Verify & Unlock Operations</span>
                </>
              )}
            </button>
          </form>

          {/* Stealth Switch & Safe Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <button
              type="button"
              onClick={() => setIsStealthDisguiseActive(true)}
              className="hover:text-ym-lime transition-colors cursor-pointer"
            >
              Hide Terminal (404 Disguise)
            </button>
            <Link to="/" className="hover:text-white transition-colors">
              Return to Store &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. MAIN HQ DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100/70 pt-28 pb-24 font-sans" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="w-11 h-11 bg-ym-charcoal rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-6 h-6 text-ym-lime" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-ym-charcoal uppercase tracking-tight font-display">
                HQ Operations Center
              </h1>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-200">
                Live Production Safe
              </span>
            </div>
            <p className="text-slate-500 font-medium text-sm">
              Real-time orders management, customer communication, and catalog inventory control.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Privacy Mode Toggle */}
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                privacyMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Mask customer phone numbers and addresses"
            >
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{privacyMode ? 'Privacy: Active' : 'Privacy Mode'}</span>
            </button>

            {/* Purge Test Orders Button */}
            <button
              onClick={() => setShowPurgeModal(true)}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge Test Orders</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock HQ</span>
            </button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        {/* Executive Metric Cards - Calmer & Harmonized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                {metrics.totalSales.toLocaleString()} <span className="text-xs font-bold text-slate-500">EGP</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                From {orders.filter((o) => o.status !== 'cancelled').length} active orders
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Queue</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-display text-amber-600">
                {metrics.pendingCount}
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {metrics.pendingCount > 0 ? 'Orders awaiting confirmation' : 'Queue clear'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Catalog</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                {products.length}
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {products.filter((p) => p.inStock).length} in stock • {products.filter((p) => !p.inStock).length} sold out
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Payments & Sourcing</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                  InstaPay: {metrics.instapayCount}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                  COD: {metrics.codCount}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                {metrics.specialCount} Sourcing requests
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Unified Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-white text-ym-charcoal shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>Customer Orders</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-black">{orders.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-white text-ym-charcoal shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>Sports Catalog</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-black">{products.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-white text-ym-charcoal shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sports Breakdown</span>
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'orders'
                  ? 'Search ID, Name, Phone, City...'
                  : 'Search Brand, Model, Sport...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-ym-charcoal transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black p-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* TAB 1: ORDERS LIST */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div>
            {/* Orders Sub-Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <span className="text-slate-400 uppercase text-[10px] mr-1">Status:</span>
                {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl uppercase text-[10px] font-black tracking-wider transition-colors cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-ym-charcoal text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="all">All Order Types</option>
                  <option value="standard">Standard Store Orders</option>
                  <option value="special">Special Import Requests</option>
                </select>

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="instapay">InstaPay (with receipt)</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-16 text-center text-slate-500">
                  <PackageOpen className="w-14 h-14 mx-auto mb-4 opacity-25" />
                  <h3 className="font-bold text-base text-ym-charcoal mb-1">No Orders Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {orders.length === 0
                      ? 'No incoming orders yet. As customers place orders on the store, they will appear here in real time.'
                      : 'No orders match your filter criteria.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div key={order.id} className="group transition-colors hover:bg-slate-50/50">
                        {/* Order Row Header */}
                        <div
                          onClick={() => toggleExpand(order.id)}
                          className="p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 cursor-pointer select-none"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 font-black text-xs text-slate-700">
                            {order.type === 'special' ? (
                              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider text-center leading-tight">
                                SPL<br />REQ
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">
                                SHOP
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-black text-ym-charcoal">{order.id}</h3>
                              <span className="text-xs text-slate-400 font-medium">• {formatDate(order.date)}</span>
                              {order.paymentMethod === 'instapay' && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[9px] font-black uppercase">
                                  InstaPay
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 font-medium">
                              {order.customer.name} —{' '}
                              <span className="font-mono text-xs font-bold text-slate-700">
                                {maskPhone(order.customer.phone)}
                              </span>{' '}
                              {order.customer.city && <span className="text-slate-400">({order.customer.city})</span>}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                            {getStatusBadge(order.status)}

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black font-display w-24 text-right">
                                {order.total ? `${order.total.toLocaleString()} EGP` : 'TBD'}
                              </span>
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                                  isExpanded ? 'bg-slate-200 rotate-180' : 'bg-slate-100 group-hover:bg-slate-200'
                                }`}
                              >
                                <ChevronDown className="w-4 h-4 text-slate-600" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-slate-50/70 border-t border-slate-100"
                            >
                              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Items */}
                                <div className="space-y-6">
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                                        Ordered Items ({order.items.length})
                                      </h4>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewingInvoiceOrder(order);
                                        }}
                                        className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>Print Courier Packing Slip</span>
                                      </button>
                                    </div>

                                    <div className="space-y-3">
                                      {order.items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs"
                                        >
                                          {item.image ? (
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                                            />
                                          ) : (
                                            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                              <PackageOpen className="w-6 h-6 text-slate-400" />
                                            </div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-ym-charcoal truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                              {item.size && <span className="font-bold text-slate-700">Size: {item.size}</span>}
                                              {item.quantity && <span> • Qty: {item.quantity}</span>}
                                              {item.price && (
                                                <span className="font-bold text-ym-charcoal">
                                                  {' '}
                                                  • {item.price.toLocaleString()} EGP
                                                </span>
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Special Request Details */}
                                  {order.type === 'special' && order.specialRequestDetails && (
                                    <div className="bg-ym-charcoal text-white p-5 rounded-2xl space-y-3 text-sm shadow-md">
                                      <h4 className="text-xs font-black uppercase tracking-wider text-ym-lime flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Special Sourcing Request</span>
                                      </h4>
                                      {order.specialRequestDetails.link && (
                                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                          <span className="text-slate-400 text-xs">Product Link</span>
                                          <a
                                            href={order.specialRequestDetails.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-ym-lime underline text-xs flex items-center gap-1 font-bold"
                                          >
                                            Open Direct Link <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </div>
                                      )}
                                      {order.specialRequestDetails.model && (
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                          <span className="text-slate-400 text-xs">Model / Notes</span>
                                          <span className="font-bold">{order.specialRequestDetails.model}</span>
                                        </div>
                                      )}
                                      {order.specialRequestDetails.budget && (
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                          <span className="text-slate-400 text-xs">Budget</span>
                                          <span className="font-bold">{order.specialRequestDetails.budget}</span>
                                        </div>
                                      )}
                                      {order.specialRequestDetails.size && (
                                        <div className="flex justify-between">
                                          <span className="text-slate-400 text-xs">Requested Size</span>
                                          <span className="font-bold">{order.specialRequestDetails.size}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Right Column: Customer Details, Communication & Controls */}
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                                      Customer Info & Direct Actions
                                    </h4>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 text-sm shadow-2xs">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Customer Name</span>
                                        <span className="font-bold text-ym-charcoal">{order.customer.name}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Phone Number</span>
                                        <span className="font-mono font-bold text-ym-charcoal">
                                          {maskPhone(order.customer.phone)}
                                        </span>
                                      </div>

                                      {/* WhatsApp & Call Quick Actions */}
                                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                        <a
                                          href={getWhatsAppLink(order)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                                        >
                                          <MessageSquare className="w-3.5 h-3.5" />
                                          <span>WhatsApp Customer</span>
                                        </a>
                                        <a
                                          href={`tel:${order.customer.phone}`}
                                          className="py-2.5 px-3 bg-slate-800 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                                        >
                                          <Phone className="w-3.5 h-3.5" />
                                          <span>Call Customer</span>
                                        </a>
                                      </div>

                                      {order.customer.city && (
                                        <div className="flex justify-between pt-2 border-t border-slate-100">
                                          <span className="text-slate-500 font-medium">City / Governorate</span>
                                          <span className="font-bold text-ym-charcoal">{order.customer.city}</span>
                                        </div>
                                      )}
                                      {order.customer.address && (
                                        <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
                                          <span className="text-slate-500 font-medium">Delivery Address</span>
                                          <span className="font-bold text-ym-charcoal text-right leading-relaxed">
                                            {maskAddress(order.customer.address)}
                                          </span>
                                        </div>
                                      )}

                                      {/* InstaPay Receipt Preview */}
                                      {order.receiptImageBase64 && (
                                        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                                          <span className="text-slate-500 font-medium flex items-center justify-between">
                                            <span>InstaPay Payment Receipt</span>
                                            <span className="text-[10px] text-purple-700 font-bold uppercase">
                                              Verified Upload
                                            </span>
                                          </span>
                                          <div
                                            onClick={() => setViewingReceiptImage(order.receiptImageBase64 || null)}
                                            className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group"
                                          >
                                            <img
                                              src={order.receiptImageBase64}
                                              alt="Receipt"
                                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                              <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/70 rounded-full flex items-center gap-1.5">
                                                <Maximize2 className="w-3.5 h-3.5" />
                                                <span>Click to View Full Size</span>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Status Controls */}
                                  <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                                      Order Status & Database Controls
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal shadow-2xs"
                                      >
                                        <option value="pending">⏳ Pending (قيد المراجعة)</option>
                                        <option value="processing">📦 Processing (جاري التجهيز)</option>
                                        <option value="completed">✅ Completed (تم التوصيل)</option>
                                        <option value="cancelled">❌ Cancelled (ملغي)</option>
                                      </select>

                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Delete order ${order.id} permanently?`)) {
                                            deleteOrder(order.id);
                                          }
                                        }}
                                        className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors ml-auto cursor-pointer"
                                      >
                                        Delete Order
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: PRODUCTS CATALOG (FULL CRUD) */}
        {/* ========================================== */}
        {activeTab === 'products' && (
          <div>
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-ym-charcoal uppercase tracking-wider">
                  Live Catalog Items ({products.length})
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Add genuine sports drops, edit pricing, toggle stock, or bulk import.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={async () => {
                    if (window.confirm('مزامنة الكتالوج الأصلي مع السحابة؟')) {
                      await seedSportsCatalog();
                      alert('تمت مزامنة الكتالوج الأصلي بالكامل مع قاعدة البيانات والسحابة!');
                    }
                  }}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Reload authentic curated Basketball, Football, Running & Gear catalog"
                >
                  <Sparkles className="w-3.5 h-3.5 text-ym-lime" />
                  <span>Sync Catalog</span>
                </button>

                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Download catalog JSON backup"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Import JSON</span>
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to remove ALL products from the store?')) {
                      await clearAllProducts();
                    }
                  }}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>

                <button
                  onClick={() => {
                    setNewProd(initialNewProdState);
                    setNewProdImages([]);
                    setShowAddProductModal(true);
                  }}
                  className="px-5 py-2.5 bg-ym-charcoal hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:scale-105 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-ym-lime" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills for Catalog */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setProductCategoryFilter('all')}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  productCategoryFilter === 'all'
                    ? 'bg-ym-charcoal text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Sports ({products.length})
              </button>
              {ALL_SPORTS_CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      productCategoryFilter === cat.id
                        ? 'bg-ym-charcoal text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.id}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center shadow-sm">
                <PackageOpen className="w-14 h-14 mx-auto mb-4 opacity-25" />
                <h3 className="font-bold text-base text-ym-charcoal mb-1">No Products in this View</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                  No items match the selected category. You can seed authentic sports drops or add a new product!
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={async () => {
                      await seedSportsCatalog();
                      alert('تمت مزامنة الكتالوج الأصلي بالكامل مع قاعدة البيانات والسحابة!');
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-ym-lime" />
                    <span>Sync Sports Catalog</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewProd(initialNewProdState);
                      setNewProdImages([]);
                      setShowAddProductModal(true);
                    }}
                    className="px-6 py-3 bg-ym-charcoal hover:bg-black text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-ym-lime" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Top Badges & Image */}
                      <div className="flex gap-4 items-start mb-4">
                        <img
                          src={p.image}
                          alt={p.name.en}
                          className="w-24 h-24 object-contain bg-slate-50 border border-slate-100 rounded-2xl p-2 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {p.brand} • {p.category}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Sold Out'}
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-ym-charcoal truncate">{p.name.en}</h4>
                          <p className="text-xs text-slate-500 truncate" dir="rtl">
                            {p.name.ar}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-black font-display text-base text-ym-charcoal">
                              {p.price.toLocaleString()} EGP
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-xs text-slate-400 line-through">
                                {p.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Attribute Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-bold text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">Sizes: {p.sizes.slice(0, 4).join(', ')}...</span>
                        {p.isByOrder && (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md uppercase">By-Order</span>
                        )}
                        {p.isNew && (
                          <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md uppercase">New Drop</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Controls */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* 1-Click Stock Toggle */}
                        <button
                          onClick={() => toggleStock(p.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-colors cursor-pointer ${
                            p.inStock
                              ? 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Click to toggle Stock Status"
                        >
                          {p.inStock ? 'Mark Sold Out' : 'Mark In Stock'}
                        </button>

                        {/* 1-Click Featured Toggle */}
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            p.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-600'
                          }`}
                          title="Toggle Featured on Storefront"
                        >
                          ★
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-ym-charcoal rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete "${p.name.en}"?`)) {
                              await deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: SPORTS & SALES ANALYTICS */}
        {/* ========================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-ym-charcoal uppercase tracking-wider mb-2 font-display">
                Sports Disciplines Inventory
              </h2>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Breakdown of active inventory across sports categories and disciplines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ALL_SPORTS_CATEGORIES.map((cat) => {
                  const catProducts = products.filter((p) => p.category === cat.id);
                  const totalValue = catProducts.reduce((sum, p) => sum + p.price, 0);

                  return (
                    <div key={cat.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-ym-charcoal shadow-2xs">
                          {catProducts.length} items
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-ym-charcoal">{cat.id}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Est. Value: {totalValue.toLocaleString()} EGP
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-base font-black text-ym-charcoal uppercase tracking-wider mb-4 font-display">
                  Order Status Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Pending Confirmation', count: metrics.pendingCount, color: 'bg-amber-500' },
                    { label: 'Processing & Packaging', count: metrics.processingCount, color: 'bg-sky-500' },
                    { label: 'Completed Deliveries', count: metrics.completedCount, color: 'bg-emerald-500' },
                    { label: 'Special Sourcing Requests', count: metrics.specialCount, color: 'bg-purple-500' },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full ${row.color}`} />
                        <span className="text-xs font-bold text-slate-700">{row.label}</span>
                      </div>
                      <span className="text-sm font-black text-ym-charcoal font-display">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-base font-black text-ym-charcoal uppercase tracking-wider mb-4 font-display">
                  Payment Channels
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <div>
                      <span className="text-xs font-black text-purple-900 uppercase">InstaPay (Electronic)</span>
                      <p className="text-[11px] text-purple-600 mt-0.5">Receipt uploaded & verified</p>
                    </div>
                    <span className="text-2xl font-black text-purple-900 font-display">
                      {metrics.instapayCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-xs font-black text-slate-900 uppercase">Cash on Delivery (COD)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Doorstep collection upon inspection</p>
                    </div>
                    <span className="text-2xl font-black text-slate-900 font-display">
                      {metrics.codCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MODAL: PURGE ALL ORDERS CONFIRMATION */}
      {/* ========================================== */}
      <AnimatePresence>
        {showPurgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase text-ym-charcoal font-display mb-2">
                Purge All Test Orders?
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                This action will completely wipe all test orders from localStorage and your remote Firestore database. To confirm, please type{' '}
                <strong className="text-rose-600 font-mono">PURGE</strong> below.
              </p>

              <input
                type="text"
                placeholder="Type PURGE to confirm"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-mono tracking-wider outline-none focus:border-rose-500 mb-6 uppercase text-center"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPurgeModal(false);
                    setPurgeConfirmText('');
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={purgeConfirmText.trim().toUpperCase() !== 'PURGE'}
                  onClick={async () => {
                    await purgeAllOrders();
                    setShowPurgeModal(false);
                    setPurgeConfirmText('');
                    alert('All test orders have been purged successfully!');
                  }}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md"
                >
                  Confirm Purge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ========================================== */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl sm:max-w-3xl w-full shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ym-lime/20 text-ym-charcoal text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>✨</span>
                    <span>Official Catalog Drop</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-ym-charcoal font-display">
                    إضافة منتج جديد • Add Product
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    أدخل بيانات المنتج والصور والفئة المناسبة ليتم نشره فوراً في المتجر والسحابة
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-black font-bold text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-5">
                {/* Product Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Product Name (English) *</span>
                      <span className="text-[10px] text-slate-400 font-mono">EN</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nike Air Jordan 4 Military Black"
                      value={newProd.nameEn}
                      onChange={(e) => setNewProd({ ...newProd, nameEn: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal focus:ring-1 focus:ring-ym-charcoal transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>اسم المنتج (بالعربي) *</span>
                      <span className="text-[10px] text-slate-400 font-mono">AR</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: نايكي إير جوردان 4 ميليتاري بلاك"
                      value={newProd.nameAr}
                      onChange={(e) => setNewProd({ ...newProd, nameAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal focus:ring-1 focus:ring-ym-charcoal transition-all text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Brand, Category & Sport Row (Nike.com style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Brand / الماركة *
                    </label>
                    <select
                      value={newProd.brand}
                      onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal cursor-pointer"
                    >
                      <option value="NIKE">Nike (نايكي)</option>
                      <option value="JORDAN">Jordan (جوردان)</option>
                      <option value="ADIDAS">Adidas (أديداس)</option>
                      <option value="PUMA">Puma (بوما)</option>
                      <option value="NEW BALANCE">New Balance (نيو بالانس)</option>
                      <option value="UNDER ARMOUR">Under Armour (أندر آرمر)</option>
                      <option value="WILSON">Wilson (ويلسون)</option>
                      <option value="OTHER">Other Brand (ماركة أخرى)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Product Category / قسم المنتج (الـ ٤ أقسام الأساسية) *
                    </label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal cursor-pointer"
                    >
                      {ALL_SPORTS_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Sport / نوع الرياضة (فلتر نايكي الداخلي) *
                    </label>
                    <select
                      value={newProd.sport || 'Lifestyle'}
                      onChange={(e) => setNewProd({ ...newProd, sport: e.target.value as ProductSport })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal cursor-pointer"
                    >
                      {ALL_SPORTS_ACTIVITIES.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.icon} {sp.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Gender Interactive Selector (Unisex feature highlighted) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Target Gender / الفئة المستهدفة *
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      حدد الفئة ليظهر المنتج في الأقسام المناسبة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Unisex', label: 'Unisex', ar: 'يوني سيكس (مشترك)', icon: '👫', desc: 'يظهر في رجالي وحريمي' },
                      { id: 'Men', label: 'Men', ar: 'رجالي فقط', icon: '👨', desc: 'قسم الرجال فقط' },
                      { id: 'Women', label: 'Women', ar: 'حريمي فقط', icon: '👩', desc: 'قسم النساء فقط' },
                      { id: 'Kids', label: 'Kids', ar: 'أطفال', icon: '🧒', desc: 'قسم الأطفال' },
                    ].map((g) => {
                      const isSelected = newProd.gender === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setNewProd({ ...newProd, gender: g.id as any })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-ym-charcoal text-white border-ym-charcoal shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-lg">{g.icon}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-ym-lime" />}
                          </div>
                          <div>
                            <div className="text-xs font-black">{g.label}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {g.ar}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {newProd.gender === 'Unisex' ? (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-medium leading-relaxed">
                      <span className="text-sm">💡</span>
                      <span>
                        <strong>تأكيد تلقائي:</strong> بما أنك اخترت <span className="font-bold underline">Unisex</span>، هذا المنتج سيظهر تلقائياً في <strong>قسم الرجال (Men)</strong> وأيضاً في <strong>قسم النساء (Women)</strong> في المتجر.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500">
                      <span>ℹ️</span>
                      <span>هذا المنتج سيظهر فقط عند استعراض قسم: <strong>{newProd.gender}</strong></span>
                    </div>
                  )}
                </div>

                {/* Symmetrical Pricing Row (Current Selling Price + Original Reference Price) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Selling Price (EGP) * سعر البيع</span>
                      <span className="text-[10px] font-black text-emerald-600">السعر النهائي للعميل</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="5900"
                        value={newProd.price || ''}
                        onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                        className="w-full pl-3.5 pr-14 py-2.5 border border-slate-200 rounded-xl text-sm font-black text-ym-charcoal outline-none focus:border-ym-charcoal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        EGP
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Original Price (EGP) السعر قبل الخصم</span>
                      <span className="text-[10px] text-slate-400 font-normal">اختياري</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        placeholder="6500"
                        value={newProd.originalPrice || ''}
                        onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value ? Number(e.target.value) : 0 })}
                        className="w-full pl-3.5 pr-14 py-2.5 border border-slate-200 rounded-xl text-sm font-black text-slate-600 outline-none focus:border-ym-charcoal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        EGP
                      </span>
                    </div>
                    {newProd.originalPrice && newProd.originalPrice > newProd.price ? (
                      <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1 pt-0.5">
                        <span>🏷️ خصم: {Math.round(((newProd.originalPrice - newProd.price) / newProd.originalPrice) * 100)}%</span>
                        <span>(وفر {(newProd.originalPrice - newProd.price).toLocaleString()} EGP للعميل)</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Multiple Images Upload & Management */}
                <ProductImageManager
                  images={newProdImages}
                  onChange={setNewProdImages}
                  label="Product Images / صور المنتج (رفع مباشر من جهازك أو روابط)"
                />

                {/* Sizes Row */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Available Sizes / المقاسات المتاحة
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickSizes('shoes')}
                        className="text-[10px] text-sky-600 hover:underline font-bold cursor-pointer"
                      >
                        + Footwear (40-45)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickSizes('apparel')}
                        className="text-[10px] text-sky-600 hover:underline font-bold cursor-pointer"
                      >
                        + Apparel (S-XXL)
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="40, 41, 42, 43, 44, 45 or S, M, L, XL"
                    value={newProd.sizes}
                    onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
                  />
                </div>

                {/* Product Flags */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={newProd.inStock}
                      onChange={(e) => setNewProd({ ...newProd, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>In Stock (متوفر)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={newProd.isByOrder}
                      onChange={(e) => setNewProd({ ...newProd, isByOrder: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>By-Order (بالطلب)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={newProd.isFeatured}
                      onChange={(e) => setNewProd({ ...newProd, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>Featured (مميز)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={newProd.isNew}
                      onChange={(e) => setNewProd({ ...newProd, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>New Drop (جديد)</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-3.5 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    إلغاء • Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-ym-charcoal hover:bg-black text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  >
                    ✓ إضافة المنتج فوراً للمتجر
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ========================================== */}
      <AnimatePresence>
        {showEditProductModal && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl sm:max-w-3xl w-full shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-black uppercase tracking-wider mb-1">
                    <span>✏️</span>
                    <span>Edit Live Product</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-ym-charcoal font-display">
                    تعديل بيانات المنتج • Edit Product
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    تعديل الأسعار، الصور، الفئة المستهدفة، أو المقاسات للمنتج في السحابة
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditProductModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-black font-bold text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditedProduct} className="space-y-5">
                {/* Product Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Product Name (English) *</span>
                      <span className="text-[10px] text-slate-400 font-mono">EN</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nameEn}
                      onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal focus:ring-1 focus:ring-ym-charcoal transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>اسم المنتج (بالعربي) *</span>
                      <span className="text-[10px] text-slate-400 font-mono">AR</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nameAr}
                      onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal focus:ring-1 focus:ring-ym-charcoal transition-all text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Brand, Category & Sport Row (Nike.com style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Brand / الماركة *
                    </label>
                    <select
                      value={editForm.brand}
                      onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal cursor-pointer"
                    >
                      <option value="NIKE">Nike (نايكي)</option>
                      <option value="JORDAN">Jordan (جوردان)</option>
                      <option value="ADIDAS">Adidas (أديداس)</option>
                      <option value="PUMA">Puma (بوما)</option>
                      <option value="NEW BALANCE">New Balance (نيو بالانس)</option>
                      <option value="UNDER ARMOUR">Under Armour (أندر آرمر)</option>
                      <option value="WILSON">Wilson (ويلسون)</option>
                      <option value="OTHER">Other Brand (ماركة أخرى)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Product Category / قسم المنتج (الـ ٤ أقسام الأساسية) *
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value as ProductCategory })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal cursor-pointer"
                    >
                      {ALL_SPORTS_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Sport / نوع الرياضة (فلتر نايكي الداخلي) *
                    </label>
                    <select
                      value={editForm.sport || 'Lifestyle'}
                      onChange={(e) => setEditForm({ ...editForm, sport: e.target.value as ProductSport })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-ym-charcoal cursor-pointer"
                    >
                      {ALL_SPORTS_ACTIVITIES.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.icon} {sp.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Gender Interactive Selector (Unisex feature highlighted) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Target Gender / الفئة المستهدفة *
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      حدد الفئة ليظهر المنتج في الأقسام المناسبة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Unisex', label: 'Unisex', ar: 'يوني سيكس (مشترك)', icon: '👫', desc: 'يظهر في رجالي وحريمي' },
                      { id: 'Men', label: 'Men', ar: 'رجالي فقط', icon: '👨', desc: 'قسم الرجال فقط' },
                      { id: 'Women', label: 'Women', ar: 'حريمي فقط', icon: '👩', desc: 'قسم النساء فقط' },
                      { id: 'Kids', label: 'Kids', ar: 'أطفال', icon: '🧒', desc: 'قسم الأطفال' },
                    ].map((g) => {
                      const isSelected = editForm.gender === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, gender: g.id as any })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-ym-charcoal text-white border-ym-charcoal shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-lg">{g.icon}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-ym-lime" />}
                          </div>
                          <div>
                            <div className="text-xs font-black">{g.label}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {g.ar}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {editForm.gender === 'Unisex' ? (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-medium leading-relaxed">
                      <span className="text-sm">💡</span>
                      <span>
                        <strong>تأكيد تلقائي:</strong> بما أن هذا المنتج محدد كـ <span className="font-bold underline">Unisex</span>، فإنه يظهر تلقائياً في <strong>قسم الرجال (Men)</strong> وأيضاً في <strong>قسم النساء (Women)</strong> في المتجر.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 text-[11px] text-slate-500">
                      <span>ℹ️</span>
                      <span>هذا المنتج سيظهر فقط عند استعراض قسم: <strong>{editForm.gender}</strong></span>
                    </div>
                  )}
                </div>

                {/* Symmetrical Pricing Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Selling Price (EGP) * سعر البيع</span>
                      <span className="text-[10px] font-black text-emerald-600">السعر النهائي للعميل</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={0}
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        className="w-full pl-3.5 pr-14 py-2.5 border border-slate-200 rounded-xl text-sm font-black text-ym-charcoal outline-none focus:border-ym-charcoal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        EGP
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Original Price (EGP) السعر قبل الخصم</span>
                      <span className="text-[10px] text-slate-400 font-normal">اختياري</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={editForm.originalPrice || ''}
                        onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value ? Number(e.target.value) : 0 })}
                        className="w-full pl-3.5 pr-14 py-2.5 border border-slate-200 rounded-xl text-sm font-black text-slate-600 outline-none focus:border-ym-charcoal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        EGP
                      </span>
                    </div>
                    {editForm.originalPrice && editForm.originalPrice > editForm.price ? (
                      <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1 pt-0.5">
                        <span>🏷️ خصم: {Math.round(((editForm.originalPrice - editForm.price) / editForm.originalPrice) * 100)}%</span>
                        <span>(وفر {(editForm.originalPrice - editForm.price).toLocaleString()} EGP للعميل)</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Multiple Images Upload & Management */}
                <ProductImageManager
                  images={editProdImages}
                  onChange={setEditProdImages}
                  label="Product Images / صور المنتج (رفع مباشر من جهازك أو روابط)"
                />

                {/* Sizes Row */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Available Sizes / المقاسات المتاحة
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, sizes: '40, 41, 42, 43, 44, 45' })}
                        className="text-[10px] text-sky-600 hover:underline font-bold cursor-pointer"
                      >
                        + Footwear (40-45)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, sizes: 'S, M, L, XL, XXL' })}
                        className="text-[10px] text-sky-600 hover:underline font-bold cursor-pointer"
                      >
                        + Apparel (S-XXL)
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={editForm.sizes}
                    onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-ym-charcoal"
                  />
                </div>

                {/* Product Flags */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={editForm.inStock}
                      onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>In Stock (متوفر)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={editForm.isByOrder}
                      onChange={(e) => setEditForm({ ...editForm, isByOrder: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>By-Order (بالطلب)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={editForm.isFeatured}
                      onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>Featured (مميز)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={editForm.isNew}
                      onChange={(e) => setEditForm({ ...editForm, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-ym-charcoal"
                    />
                    <span>New Drop (جديد)</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditProductModal(false)}
                    className="flex-1 py-3.5 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    إلغاء • Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-ym-charcoal hover:bg-black text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  >
                    ✓ حفظ التعديلات في السحابة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: FULLSIZE RECEIPT VIEWER */}
      {/* ========================================== */}
      <AnimatePresence>
        {viewingReceiptImage && (
          <div
            onClick={() => setViewingReceiptImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 cursor-default"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  InstaPay Transfer Receipt
                </span>
                <button
                  onClick={() => setViewingReceiptImage(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-[75vh] overflow-y-auto flex items-center justify-center p-2 bg-slate-900 rounded-2xl">
                <img src={viewingReceiptImage} alt="Full Receipt" className="max-h-[70vh] w-auto object-contain rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: PACKING SLIP / INVOICE PRINT VIEW */}
      {/* ========================================== */}
      <AnimatePresence>
        {viewingInvoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-200 my-8 print:p-0 print:border-none print:shadow-none"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase text-ym-charcoal font-display">
                    YM BRANDS • COURIER SLIP
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">ORDER #{viewingInvoiceOrder.id}</p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-ym-charcoal text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setViewingInvoiceOrder(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 space-y-1.5 text-xs">
                <p>
                  <strong className="text-slate-500">Customer:</strong>{' '}
                  <span className="font-bold text-slate-900">{viewingInvoiceOrder.customer.name}</span>
                </p>
                <p>
                  <strong className="text-slate-500">Phone:</strong>{' '}
                  <span className="font-mono font-bold text-slate-900">{viewingInvoiceOrder.customer.phone}</span>
                </p>
                {viewingInvoiceOrder.customer.city && (
                  <p>
                    <strong className="text-slate-500">Governorate:</strong>{' '}
                    <span className="font-bold text-slate-900">{viewingInvoiceOrder.customer.city}</span>
                  </p>
                )}
                {viewingInvoiceOrder.customer.address && (
                  <p>
                    <strong className="text-slate-500">Address:</strong>{' '}
                    <span className="font-bold text-slate-900">{viewingInvoiceOrder.customer.address}</span>
                  </p>
                )}
              </div>

              {/* Items List */}
              <table className="w-full text-xs mb-6 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-400 font-black uppercase">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Size</th>
                    <th className="pb-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {viewingInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold">{it.name}</td>
                      <td className="py-2.5 font-mono">{it.size || 'Standard'}</td>
                      <td className="py-2.5 text-right font-black">
                        {it.price ? `${it.price.toLocaleString()} EGP` : 'TBD'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total & Payment method */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between font-black text-sm text-ym-charcoal">
                <span>
                  Payment: {viewingInvoiceOrder.paymentMethod === 'instapay' ? 'InstaPay (Prepaid)' : 'Cash on Delivery'}
                </span>
                <span>
                  Total to Collect:{' '}
                  {viewingInvoiceOrder.paymentMethod === 'instapay'
                    ? '0 EGP (Paid)'
                    : `${viewingInvoiceOrder.total ? viewingInvoiceOrder.total.toLocaleString() : 0} EGP`}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: IMPORT JSON */}
      {/* ========================================== */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200"
            >
              <h3 className="text-xl font-black uppercase text-ym-charcoal font-display mb-2">
                Import Products JSON
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                Paste an array of products JSON objects formatted per <code className="text-slate-700">src/types/product.ts</code>.
              </p>

              <form onSubmit={handleImportJson} className="space-y-4">
                <textarea
                  required
                  rows={8}
                  placeholder="[ { id: 1, name: { en: '...', ar: '...' }, ... } ]"
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-ym-charcoal"
                />

                {importError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {importError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportError('');
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-ym-charcoal hover:bg-black text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Import Products
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
