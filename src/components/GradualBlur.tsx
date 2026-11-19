"use client";

import { CSSProperties, useEffect, useRef, useState, useMemo, PropsWithChildren } from 'react';

type GradualBlurProps = PropsWithChildren<{
  position?: 'top' | 'bottom' | 'left' | 'right';
  strength?: number;
  height?: string;
  divCount?: number;
  zIndex?: number;
  className?: string;
}>;

export function GradualBlur({
  position = 'bottom',
  strength = 2,
  height = '8rem',
  divCount = 6,
  zIndex = 10,
  className = '',
  children,
}: GradualBlurProps) {
  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;
    const direction = position === 'top' ? 'to top' : position === 'bottom' ? 'to bottom' : position === 'left' ? 'to left' : 'to right';

    for (let i = 1; i <= divCount; i++) {
      const progress = i / divCount;
      const blurValue = 0.0625 * (progress * divCount + 1) * strength;
      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;

      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      };

      divs.push(<div key={i} style={divStyle} />);
    }
    return divs;
  }, [divCount, position, strength]);

  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = ['top', 'bottom'].includes(position);
    const base: CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex,
    };

    if (isVertical) {
      base.height = height;
      base.width = '100%';
      base.left = 0;
      base.right = 0;
      if (position === 'top') base.top = 0;
      else base.bottom = 0;
    } else {
      base.width = height;
      base.height = '100%';
      base.top = 0;
      base.bottom = 0;
      if (position === 'left') base.left = 0;
      else base.right = 0;
    }

    return base;
  }, [position, height, zIndex]);

  return (
    <div className={`gradual-blur ${className}`} style={containerStyle}>
      <div className="relative w-full h-full">{blurDivs}</div>
      {children && <div className="relative">{children}</div>}
    </div>
  );
}
