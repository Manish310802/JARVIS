// components/ui/sparkles.jsx
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function SparklesCore({
  className,
  background = "transparent",
  minSize = 1,
  maxSize = 2,
  particleDensity = 100,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = Array.from({ length: particleDensity }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (maxSize - minSize) + minSize,
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    }));

    function animate() {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      for (let p of particles) {
        p.x += p.velocity.x;
        p.y += p.velocity.y;

        if (p.x < 0 || p.x > width) p.velocity.x *= -1;
        if (p.y < 0 || p.y > height) p.velocity.y *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [background, minSize, maxSize, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed top-0 left-0 z-0 pointer-events-none", className)}
    />
  );
}
