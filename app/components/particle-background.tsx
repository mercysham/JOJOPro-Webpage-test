'use client';

import { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      shape: 'circle' | 'diamond' | 'triangle';
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      particles = [];
      for (let i = 0; i < count; i++) {
        const shapes: Array<'circle' | 'diamond' | 'triangle'> = ['circle', 'diamond', 'triangle'];
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
    };

    const drawShape = (x: number, y: number, size: number, shape: 'circle' | 'diamond' | 'triangle', opacity: number) => {
      ctx!.beginPath();
      ctx!.globalAlpha = opacity;

      if (shape === 'circle') {
        ctx!.arc(x, y, size, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx!.fill();
      } else if (shape === 'diamond') {
        ctx!.moveTo(x, y - size);
        ctx!.lineTo(x + size, y);
        ctx!.lineTo(x, y + size);
        ctx!.lineTo(x - size, y);
        ctx!.closePath();
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx!.fill();
      } else {
        ctx!.moveTo(x, y - size);
        ctx!.lineTo(x + size, y + size);
        ctx!.lineTo(x - size, y + size);
        ctx!.closePath();
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        drawShape(p.x, p.y, p.size, p.shape, p.opacity);
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
