"use client";

import { useEffect, useRef } from "react";
import MusingsIcon from "./svgs/musingsIcon";

interface EyeMoveProps {
  size?: string | number; // e.g. "3rem", "40px", or 40 (treated as px)
}

function toPixels(size: string | number): number {
  if (typeof size === "number") return size;
  if (size.endsWith("rem")) {
    const rem = parseFloat(size);
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem * rootFontSize;
  }
  return parseFloat(size); // fallback: strip unit and treat as px
}

export default function EyeMove({ size = "2.5rem" }: EyeMoveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      posRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const tick = () => {
      const ball = container.querySelector<HTMLElement>(".eye-ball");
      if (ball) {
        const rect = container.getBoundingClientRect();
        const ballPx = toPixels(size);

        const clampedX = Math.min(Math.max(posRef.current.x, ballPx / 2.25), rect.width - ballPx / 2.25);
        const clampedY = Math.min(Math.max(posRef.current.y, ballPx / 2.25), rect.height - ballPx / 2.25);

        ball.style.transform = `translate(${clampedX - ballPx / 2.25}px, ${clampedY - ballPx / 2.25}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  const cssSize = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        className="eye-ball"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: cssSize,
          height: cssSize,
          pointerEvents: "none",
          zIndex: 10,
          willChange: "transform",
          transition: "transform 0.8s ease-out",
        }}
      >
        <MusingsIcon width={cssSize} height={cssSize} />
      </div>
    </div>
  );
}