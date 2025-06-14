"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration des particules flottantes
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      angle: number;
      rotationSpeed: number;
    }> = [];

    const particleCount = 30;
    let animationId: number;

    // Initialiser les particules géométriques
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    // Redimensionner le canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
    };

    // Animation des formes géométriques
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner les particules géométriques
      particles.forEach((particle) => {
        // Mise à jour de la position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.angle += particle.rotationSpeed;

        // Rebond sur les bords
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }

        // Garder dans les limites
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Dessiner des formes géométriques variées
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.globalAlpha = particle.opacity;

        // Alternance entre différentes formes
        const shapeType = Math.floor(particle.size) % 3;

        if (shapeType === 0) {
          // Triangle
          ctx.fillStyle = `hsl(220, 70%, 70%)`;
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(-particle.size, particle.size);
          ctx.lineTo(particle.size, particle.size);
          ctx.closePath();
          ctx.fill();
        } else if (shapeType === 1) {
          // Carré
          ctx.fillStyle = `hsl(280, 60%, 70%)`;
          ctx.fillRect(
            -particle.size / 2,
            -particle.size / 2,
            particle.size,
            particle.size
          );
        } else {
          // Hexagone
          ctx.fillStyle = `hsl(200, 80%, 70%)`;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * particle.size;
            const y = Math.sin(angle) * particle.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    // Initialisation
    resizeCanvas();
    animate();

    // Event listeners
    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "transparent" }}
      />
      {/* Gradient overlay pour plus de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/50" />
    </>
  );
}
