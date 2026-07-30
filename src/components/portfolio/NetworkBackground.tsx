"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseOpacity: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();

  const getColors = useCallback(() => {
    const isDark = resolvedTheme === "dark";
    return {
      primary: isDark ? "0, 212, 255" : "0, 140, 200",
      secondary: isDark ? "120, 80, 255" : "80, 50, 200",
      accent: isDark ? "0, 255, 180" : "0, 180, 130",
      warm: isDark ? "255, 100, 60" : "200, 80, 50",
    };
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 100;
    const CONNECTION_DISTANCE = 180;
    const MOUSE_RADIUS = 250;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          vz: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2.5 + 0.8,
          baseOpacity: Math.random() * 0.6 + 0.15,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.015,
        });
      }
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      const colors = getColors();
      timeRef.current++;
      const time = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Pulse
        p.pulsePhase += p.pulseSpeed;

        // Wrap around edges with padding
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        if (p.y < -30) p.y = canvas.height + 30;
        if (p.y > canvas.height + 30) p.y = -30;
        if (p.z < 0) p.z = 1000;
        if (p.z > 1000) p.z = 0;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.012;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Damping
        p.vx *= 0.993;
        p.vy *= 0.993;
        p.vz *= 0.993;

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
        if (speed > 0.6) {
          p.vx *= 0.6 / speed;
          p.vy *= 0.6 / speed;
          p.vz *= 0.6 / speed;
        }
      }

      // Draw connections with gradient lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const zAvg = (particles[i].z + particles[j].z) / 2000;
            const depthFactor = 1 - zAvg;
            const distFactor = 1 - dist / CONNECTION_DISTANCE;
            const baseOpacity = distFactor * depthFactor * 0.25;

            // Color based on distance and time
            const colorMix = (Math.sin(time * 0.005 + i * 0.1) + 1) / 2;

            // Create gradient along the line
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );

            const c1 = colorMix > 0.5 ? colors.primary : colors.secondary;
            const c2 = colorMix > 0.5 ? colors.accent : colors.primary;

            gradient.addColorStop(0, `rgba(${c1}, ${baseOpacity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(${c2}, ${baseOpacity})`);
            gradient.addColorStop(1, `rgba(${c1}, ${baseOpacity * 0.6})`);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.3 + depthFactor * 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw particles with enhanced glow
      for (const p of particles) {
        const zFactor = 1 - p.z / 1000;
        const pulse = Math.sin(p.pulsePhase) * 0.3 + 0.7;
        const size = p.size * zFactor * pulse;
        const opacity = p.baseOpacity * zFactor * pulse;

        // Color cycling based on position and time
        const colorPhase = (Math.sin(time * 0.008 + p.x * 0.005 + p.y * 0.003) + 1) / 2;
        const color = colorPhase > 0.6
          ? colors.primary
          : colorPhase > 0.3
            ? colors.secondary
            : colors.accent;

        // Outer glow
        const outerGlow = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, size * 8
        );
        outerGlow.addColorStop(0, `rgba(${color}, ${opacity * 0.4})`);
        outerGlow.addColorStop(0.3, `rgba(${color}, ${opacity * 0.15})`);
        outerGlow.addColorStop(0.7, `rgba(${color}, ${opacity * 0.03})`);
        outerGlow.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 8, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner glow
        const innerGlow = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, size * 3
        );
        innerGlow.addColorStop(0, `rgba(${color}, ${opacity})`);
        innerGlow.addColorStop(0.5, `rgba(${color}, ${opacity * 0.5})`);
        innerGlow.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();

        // Core bright dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.fill();
      }

      // Mouse glow - enhanced
      if (mouse.x > 0 && mouse.y > 0) {
        // Large ambient glow
        const ambientGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, MOUSE_RADIUS
        );
        ambientGlow.addColorStop(0, `rgba(${colors.primary}, 0.06)`);
        ambientGlow.addColorStop(0.3, `rgba(${colors.secondary}, 0.03)`);
        ambientGlow.addColorStop(0.6, `rgba(${colors.accent}, 0.01)`);
        ambientGlow.addColorStop(1, `rgba(${colors.primary}, 0)`);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = ambientGlow;
        ctx.fill();

        // Tight bright core
        const coreGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 60
        );
        coreGlow.addColorStop(0, `rgba(${colors.primary}, 0.08)`);
        coreGlow.addColorStop(0.5, `rgba(${colors.primary}, 0.03)`);
        coreGlow.addColorStop(1, `rgba(${colors.primary}, 0)`);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.fillStyle = coreGlow;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();

    // Use ResizeObserver for the parent container
    const parentEl = canvas.parentElement;
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (parentEl) {
      resizeObserver.observe(parentEl);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [getColors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
