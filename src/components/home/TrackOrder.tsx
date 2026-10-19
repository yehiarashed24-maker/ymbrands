import React, { useState } from 'react';
import { Package, Search, ChevronRight, CheckCircle2, Clock, PackageOpen, AlertCircle } from 'lucide-react';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Order, OrderStatus } from '../../store/orderStore';
import { useLanguageStore } from '../../store/languageStore';
import { sanitizeString, checkRateLimit } from '../../lib/security';

export const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const { language, isRTL } = useLanguageStore();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = sanitizeString(orderId, 30);
    if (!cleanId) return;

    // Rate limiting: max 8 tracking requests per minute to prevent brute force ID enumerations
    const rateLimit = checkRateLimit('track_order', 8, 60);
    if (!rateLimit.allowed) {
      setError(language === 'ar' 
        ? `يرجى الانتظار ${rateLimit.retryAfterSeconds} ثانية قبل إعادة البحث.`
        : `Please wait ${rateLimit.retryAfterSeconds} seconds before searching again.`);
      return;
    }
    
    setLoading(true);
    setError('');
    setOrder(null);

    if (!isFirebaseConfigured()) {
      // Fallback for local testing if Firebase is not yet set up
      const localData = localStorage.getItem('ym-orders-storage');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          const found = parsed.state.orders.find((o: Order) => o.id === orderId.trim());
          if (found) setOrder(found);
          else setError('Order not found. Please check your Order ID.');
        } catch(e) {
          setError('Order tracking is currently unavailable.');
        }
      } else {
        setError('Order tracking is currently unavailable.');
      }
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'orders', orderId.trim());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setOrder(docSnap.data() as Order);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while tracking. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'pending': 
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', text: language === 'ar' ? 'قيد المراجعة' : 'Pending Review' };
      case 'processing': 
        return { icon: PackageOpen, color: 'text-sky-500', bg: 'bg-sky-100', text: language === 'ar' ? 'جاري التجهيز' : 'Processing' };
      case 'completed': 
        return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100', text: language === 'ar' ? 'تم التوصيل' : 'Completed' };
      case 'cancelled': 
        return { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-100', text: language === 'ar' ? 'ملغي' : 'Cancelled' };
      default:
        return { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100', text: status };
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-ym-charcoal text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-ym-charcoal uppercase tracking-tight font-display mb-3">
              {language === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
            </h2>
            <p className="text-slate-500 font-medium">
              {language === 'ar' 
                ? 'أدخل رقم الطلب الخاص بك لمعرفة حالته وموعد التوصيل.' 
                : 'Enter your Order ID below to check the real-time status of your delivery.'}
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className={`w-5 h-5 absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input
                type="text"
                placeholder="e.g. YM-EG-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className={`w-full py-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold uppercase tracking-wider outline-none focus:border-ym-charcoal transition-all placeholder:normal-case placeholder:font-medium placeholder:tracking-normal`}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !orderId.trim()}
              className="py-4 px-8 bg-ym-charcoal hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {language === 'ar' ? 'تتبع' : 'Track'}
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold text-center animate-scale-in">
              {error}
            </div>
          )}

          {order && (
            <div className="mt-8 pt-8 border-t border-slate-100 animate-scale-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-ym-charcoal uppercase tracking-wider">
                    {order.id}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    Placed on: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                
                {(() => {
                  const statusInfo = getStatusDisplay(order.status);
                  const Icon = statusInfo.icon;
                  return (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg} ${statusInfo.color} font-black text-xs uppercase tracking-wider`}>
                      <Icon className="w-4 h-4" />
                      {statusInfo.text}
                    </div>
                  );
                })()}
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-sm space-y-4">
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-medium">Customer</span>
                  <span className="font-bold text-ym-charcoal">{order.customer.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-medium">Destination</span>
                  <span className="font-bold text-ym-charcoal">{order.customer.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Items</span>
                  <span className="font-bold text-ym-charcoal text-right leading-relaxed max-w-[200px]">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
