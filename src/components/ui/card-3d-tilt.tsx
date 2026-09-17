'use client';

import React, { useState, useRef } from 'react';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees
  glowColor?: string;
}

export function Card3DTilt({
  children,
  className = '',
  maxTilt = 8,
  glowColor = 'rgba(59, 130, 246, 0.15)',
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlowPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden rounded-2xl border bg-card transition-all ${className}`}
    >
      {/* Dynamic Cursor Light Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 rounded-2xl z-10"
        style={{
          opacity: glowPosition.opacity,
          background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}
