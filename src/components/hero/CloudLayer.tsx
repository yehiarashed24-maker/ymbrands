import React from 'react';
import cloudPink from '../../assets/clouds/cloud-pink.png';
import cloudBlue from '../../assets/clouds/cloud-blue.png';

interface CloudLayerProps {
  depth: 'far' | 'middle' | 'foreground';
  mouseOffset?: { x: number; y: number };
  theme?: 'pink' | 'blue';
}

export const CloudLayer: React.FC<CloudLayerProps> = ({
  depth,
  mouseOffset = { x: 0, y: 0 },
  theme = 'pink',
}) => {
  const isPink = theme === 'pink';
  const activeCloud = isPink ? cloudPink : cloudBlue;

  // Optimized cloud bed heights - resting gently at the bottom without covering sneaker
  const config = {
    far: {
      duration: '45s',
      opacity: 'opacity-30',
      blur: 'blur-none',
      scale: 'scale-90',
      height: 'h-[20vh] sm:h-[24vh]',
      bottom: '-bottom-4 sm:-bottom-6',
      parallaxFactor: 5,
      cloudImg: activeCloud,
    },
    middle: {
      duration: '28s',
      opacity: 'opacity-45',
      blur: 'blur-none',
      scale: 'scale-95',
      height: 'h-[24vh] sm:h-[28vh]',
      bottom: '-bottom-8 sm:-bottom-12',
      parallaxFactor: 10,
      cloudImg: activeCloud,
    },
    foreground: {
      duration: '18s',
      opacity: 'opacity-55',
      blur: 'blur-none',
      scale: 'scale-100',
      height: 'h-[26vh] sm:h-[30vh]',
      bottom: '-bottom-12 sm:-bottom-16',
      parallaxFactor: 16,
      cloudImg: activeCloud,
    },
  }[depth];

  return (
    <div
      className={`absolute inset-x-0 ${config.bottom} ${config.height} pointer-events-none overflow-hidden select-none will-change-transform`}
    >
      {/* Seamless looping dual-container */}
      <div
        className={`flex w-[200%] h-full pointer-events-none animate-cloud-${depth}`}
        style={{
          animation: `cloudDrift ${config.duration} linear infinite`,
          WebkitAnimation: `cloudDrift ${config.duration} linear infinite`,
        }}
      >
        {/* Strip 1 */}
        <div className={`relative w-1/2 h-full flex items-end justify-between ${config.opacity} ${config.blur} ${config.scale}`}>
          <div className="relative w-2/5 h-full -ml-8 flex items-end">
            <img
              src={config.cloudImg}
              alt=""
              className="w-full h-full object-contain object-bottom pointer-events-none"
              loading="eager"
            />
          </div>

          <div className="relative w-2/5 h-full -mr-8 flex items-end">
            <img
              src={config.cloudImg}
              alt=""
              className="w-full h-full object-contain object-bottom scale-x-[-1] pointer-events-none"
              loading="eager"
            />
          </div>
        </div>

        {/* Strip 2 (Clone for seamless 100% loop) */}
        <div className={`relative w-1/2 h-full flex items-end justify-between ${config.opacity} ${config.blur} ${config.scale}`}>
          <div className="relative w-2/5 h-full -ml-8 flex items-end">
            <img
              src={config.cloudImg}
              alt=""
              className="w-full h-full object-contain object-bottom pointer-events-none"
              loading="eager"
            />
          </div>

          <div className="relative w-2/5 h-full -mr-8 flex items-end">
            <img
              src={config.cloudImg}
              alt=""
              className="w-full h-full object-contain object-bottom scale-x-[-1] pointer-events-none"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
