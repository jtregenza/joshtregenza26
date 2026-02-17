'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface AnimatedGradientProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedGradient({ 
  className = '', 
  style = {} 
}: AnimatedGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let app: PIXI.Application;
    let isDestroyed = false;

    const init = async () => {
      // Create PixiJS application
      app = new PIXI.Application();
      
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (isDestroyed || !containerRef.current) {
        app.destroy(true);
        return;
      }

      containerRef.current.appendChild(app.canvas);

      // Create gradient using Graphics for better compatibility
      const graphics = new PIXI.Graphics();
      
      // Mouse position tracking
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let targetMouseX = mouseX;
      let targetMouseY = mouseY;

      // Animation time
      let time = 0;

      // Color palette similar to Monopo
      const colors = [
        0x6366f1, // Indigo
        0x8b5cf6, // Violet
        0xec4899, // Pink
        0xf97316, // Orange
        0x06b6d4, // Cyan
      ];

      // Handle mouse movement
      const handleMouseMove = (e: MouseEvent) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          targetMouseX = e.touches[0].clientX;
          targetMouseY = e.touches[0].clientY;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);

      // Animation function
      const animate = (ticker: PIXI.Ticker) => {
        const delta = ticker.deltaTime;
        
        // Smooth mouse interpolation
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        time += 0.005 * delta;

        // Clear previous frame
        graphics.clear();

        const width = app.screen.width;
        const height = app.screen.height;

        // Create multiple gradient circles
        const numCircles = 5;
        
        for (let i = 0; i < numCircles; i++) {
          const offset = (i / numCircles) * Math.PI * 2;
          
          // Calculate circle position with mouse influence
          const baseX = width / 2 + Math.cos(time * 0.3 + offset) * width * 0.3;
          const baseY = height / 2 + Math.sin(time * 0.2 + offset) * height * 0.3;
          
          // Add mouse influence
          const mouseInfluence = 0.15;
          const dx = mouseX - width / 2;
          const dy = mouseY - height / 2;
          
          const x = baseX + dx * mouseInfluence;
          const y = baseY + dy * mouseInfluence;
          
          // Create radial gradient
          const radius = Math.min(width, height) * 0.6;
          
          graphics.circle(x, y, radius);
          graphics.fill({
            color: colors[i],
            alpha: 0.4,
          });
          
          // Add blur effect by drawing multiple times with decreasing opacity
          graphics.circle(x, y, radius * 0.8);
          graphics.fill({
            color: colors[i],
            alpha: 0.3,
          });
        }
      };

      app.stage.addChild(graphics);
      app.ticker.add(animate);

      // Apply blur filter for smoother gradient
      const blurFilter = new PIXI.BlurFilter();
      blurFilter.strength = 60;
      blurFilter.quality = 4;
      graphics.filters = [blurFilter];

      // Handle resize
      const handleResize = () => {
        if (isDestroyed) return;
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', handleResize);
        isDestroyed = true;
        app.destroy(true, { children: true });
      };
    };

    init();

    return () => {
      isDestroyed = true;
      if (app) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}