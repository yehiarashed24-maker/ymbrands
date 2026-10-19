import React, { useState } from 'react';
import { Ruler, AlertCircle, X } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

interface SizeSelectorProps {
  sizes: (number | string)[];
  selectedSize: number | string | null;
  onSelectSize: (size: number | string) => void;
  showError?: boolean;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  showError,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].product;
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <div className="space-y-3">
      {/* Top row: Label & Size Guide trigger */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-ym-charcoal">
          {t.selectSize}
        </label>
        <button
          type="button"
          onClick={() => setShowSizeGuide(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors cursor-pointer"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>{t.sizeGuide}</span>
        </button>
      </div>

      {/* Grid of sizes */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-ym-charcoal text-white border-black ring-2 ring-black shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {typeof size === 'number' ? `EU ${size}` : size}
            </button>
          );
        })}
      </div>

      {/* Validation Error Message */}
      {showError && (
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-bounce">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t.sizeRequired}</span>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black uppercase tracking-wider text-ym-charcoal">
                {t.sizeGuide} (Egypt & International)
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              YM athletic footwear and apparel adhere strictly to official European (EU) and US sizing standards. Sizing runs true to size.
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black">
                    <th className="p-2.5 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg">EU (Egypt)</th>
                    <th className="p-2.5">US Men</th>
                    <th className="p-2.5">US Women</th>
                    <th className="p-2.5 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg">Foot (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  <tr><td className="p-2.5 font-bold">40</td><td className="p-2.5">7</td><td className="p-2.5">8.5</td><td className="p-2.5">25.0 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">41</td><td className="p-2.5">8</td><td className="p-2.5">9.5</td><td className="p-2.5">26.0 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">42</td><td className="p-2.5">8.5</td><td className="p-2.5">10</td><td className="p-2.5">26.5 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">43</td><td className="p-2.5">9.5</td><td className="p-2.5">11</td><td className="p-2.5">27.5 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">44</td><td className="p-2.5">10</td><td className="p-2.5">11.5</td><td className="p-2.5">28.0 cm</td></tr>
                  <tr><td className="p-2.5 font-bold">45</td><td className="p-2.5">11</td><td className="p-2.5">12.5</td><td className="p-2.5">29.0 cm</td></tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-3 bg-ym-charcoal text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black cursor-pointer"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
