import React from 'react';
import { Link } from 'react-router-dom';
import { CloudLayer } from '@/components/hero/CloudLayer';
import shoePink from '@/assets/shoes/nike-airmax-pink.png';

export const NotFound: React.FC = () => {
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

        <span className="text-8xl sm:text-9xl font-black text-ym-charcoal font-display tracking-tighter leading-none block">
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
    </div>
  );
};
