'use client';

import React, { useEffect, useRef } from 'react';

interface Hero3DCanvasProps {
  className?: string;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
}

export function Hero3DCanvas({ className }: Hero3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for 3D perspective rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetMouseX = x * 0.001;
      targetMouseY = y * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Particles initialization
    const particleCount = Math.min(width < 768 ? 35 : 75, 90);
    const particles: Particle3D[] = [];
    const colors = [
      'rgba(59, 130, 246, ',   // Blue
      'rgba(147, 51, 234, ',   // Violet
      'rgba(99, 102, 241, ',   // Indigo
      'rgba(236, 72, 153, ',   // Pink accent
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = mediaQuery.matches;

    let rotX = 0;
    let rotY = 0;

    const focalLength = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (!isReducedMotion) {
        rotX += 0.002 + mouseY * 0.1;
        rotY += 0.003 + mouseX * 0.1;
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle background glowing radial gradient
      const bgGrad = ctx.createRadialGradient(
        centerX + mouseX * 200,
        centerY + mouseY * 200,
        50,
        centerX,
        centerY,
        width * 0.6
      );
      bgGrad.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
      bgGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.04)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw connected 3D Nodes
      const projectedNodes: { px: number; py: number; pz: number; alpha: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Boundary wrapping
          if (p.x < -width) p.x = width;
          if (p.x > width) p.x = -width;
          if (p.y < -height) p.y = height;
          if (p.y > height) p.y = -height;
          if (p.z < 50) p.z = 900;
          if (p.z > 900) p.z = 50;
        }

        // Apply 3D rotation matrix
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // 3D Perspective Projection
        const scale = focalLength / (focalLength + z2);
        const px = x1 * scale + centerX;
        const py = y1 * scale + centerY;
        const alpha = Math.max(0.1, Math.min(1, scale * 0.9));

        projectedNodes.push({ px, py, pz: z2, alpha });

        if (px > 0 && px < width && py > 0 && py < height && scale > 0) {
          const radius = Math.max(0.8, p.size * scale);
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha})`;
          ctx.fill();
        }
      }

      // Draw constellation connections between nearby 3D nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.18 * Math.min(n1.alpha, n2.alpha);
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none -z-10 transition-opacity duration-700 ${className || ''}`}
    />
  );
}
