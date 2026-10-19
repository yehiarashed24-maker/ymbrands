/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ym: {
          blue: {
            DEFAULT: '#0284C7',
            light: '#38BDF8',
            sky: '#BAE6FD',
            soft: '#E0F2FE',
            deep: '#0369A1',
          },
          pink: {
            DEFAULT: '#F472B6',
            soft: '#FBCFE8',
            haze: '#FFF1F2',
            cloud: '#FCE7F3',
          },
          lime: {
            DEFAULT: '#CCFF00',
            glow: '#D4FF00',
            hover: '#B8E600',
            soft: '#F4FFE0',
          },
          charcoal: {
            DEFAULT: '#111111',
            soft: '#1F2937',
            muted: '#4B5563',
          },
          sand: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      animation: {
        'cloud-far': 'cloudDrift 60s linear infinite',
        'cloud-mid': 'cloudDrift 35s linear infinite',
        'cloud-fore': 'cloudDrift 20s linear infinite',
        'float-slow': 'floatSneaker 6s ease-in-out infinite',
        'float-shadow': 'floatShadow 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        cloudDrift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatSneaker: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) translateX(4px) rotate(1.5deg)' },
        },
        floatShadow: {
          '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '0.45' },
          '50%': { transform: 'scale(0.85) translateY(12px)', opacity: '0.2' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
