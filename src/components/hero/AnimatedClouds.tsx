import React from 'react';
import { CloudLayer } from './CloudLayer';

interface AnimatedCloudsProps {
  children?: React.ReactNode;
  mouseOffset?: { x: number; y: number };
}

export const AnimatedClouds: React.FC<AnimatedCloudsProps> = ({ children, mouseOffset }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {children || (
        <>
          <CloudLayer depth="far" mouseOffset={mouseOffset} />
          <CloudLayer depth="middle" mouseOffset={mouseOffset} />
          <CloudLayer depth="foreground" mouseOffset={mouseOffset} />
        </>
      )}
    </div>
  );
};
