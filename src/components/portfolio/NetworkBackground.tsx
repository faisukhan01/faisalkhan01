"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  pulsePhase: number;
  pulseSpeed: number;
  energyLevel: number;
  energyTarget: number;
  ringPhase: number;
  type: "core" | "relay" | "edge";
}

interface Pulse {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();

  const getPalette = useCallback(() => {
    const isDark = resolvedTheme === "dark";
    return {
      cyan: isDark ? [0, 220, 255] : [0, 150, 210],
      purple: isDark ? [140, 90, 255] : [100, 60, 210],
      green: isDark ? [0, 255, 170] : [0, 190, 140],
      pink: isDark ? [255, 100, 200] : [210, 70, 160],
      white: [255, 255, 255],
      bgBase: isDark ? 10 : 250,
      opacityMult: isDark ? 1.0 : 0.6,
    };
  }, [resolvedTheme]);

  const lerpColor = (a: number[], b: number[], t: number): string => {
    return `${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const NODE_COUNT = 65;
    const CONNECTION_DIST = 200;
    const MOUSE_RADIUS = 280;
    let W = 0, H = 0;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const createNodes = () => {
      const nodes: Node[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const typeRand = Math.random();
        const type: Node["type"] =
          typeRand < 0.15 ? "core" : typeRand < 0.5 ? "relay" : "edge";
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: Math.random() * 800,
          vx: (Math.random() - 0.5) * (type === "edge" ? 0.4 : 0.15),
          vy: (Math.random() - 0.5) * (type === "edge" ? 0.4 : 0.15),
          vz: (Math.random() - 0.5) * 0.1,
          baseSize: type === "core" ? 2.5 + Math.random() * 1.5 : type === "relay" ? 1.5 + Math.random() * 1 : 0.8 + Math.random() * 0.7,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.02,
          energyLevel: 0,
          energyTarget: 0,
          ringPhase: Math.random() * Math.PI * 2,
          type,
        });
      }
      nodesRef.current = nodes;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const spawnPulse = (from: Node, to: Node, palette: ReturnType<typeof getPalette>) => {
      const colors = [palette.cyan, palette.purple, palette.green, palette.pink];
      const c = colors[Math.floor(Math.random() * colors.length)];
      pulsesRef.current.push({
        x: from.x, y: from.y,
        fromX: from.x, fromY: from.y,
    progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: `${c[0]}, ${c[1]}, ${c[2]}`,
        size: 1.5 + Math.random() * 2,
      });
      // Store target for interpolation
      (pulsesRef.current[pulsesRef.current.length - 1] as any).toX = to.x;
      (pulsesRef.current[pulsesRef.current.length - 1] as any).toY = to.y;
    };

    const animate = () => {
      const palette = getPalette();
      const time = ++timeRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, W, H);

      // === UPDATE NODES ===
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        n.pulsePhase += n.pulseSpeed;
        n.ringPhase += 0.015;

        // Wrap
        if (n.x < -50) n.x = W + 50;
        if (n.x > W + 50) n.x = -50;
        if (n.y < -50) n.y = H + 50;
        if (n.y > H + 50) n.y = -50;
        if (n.z < 0) n.z = 800;
        if (n.z > 800) n.z = 0;

        // Mouse attraction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.008;
          n.vx += dx * force;
          n.vy += dy * force;
          n.energyTarget = 1.0;
        } else {
          n.energyTarget *= 0.99;
        }

        // Damping
        n.vx *= 0.995;
        n.vy *= 0.995;
        n.vz *= 0.995;

        // Speed limit
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 0.5) {
          n.vx *= 0.5 / speed;
          n.vy *= 0.5 / speed;
        }

        // Smooth energy
        n.energyLevel += (n.energyTarget - n.energyLevel) * 0.05;
      }

      // === BUILD CONNECTION MAP ===
      const connections: { i: number; j: number; dist: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            connections.push({ i, j, dist: d });
          }
        }
      }

      // === SPAWN PULSES ===
      if (Math.random() < 0.06 && connections.length > 0) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        const fromNode = nodes[conn.i];
        const toNode = nodes[conn.j];
        if (Math.random() > 0.5) {
          spawnPulse(fromNode, toNode, palette);
        } else {
          spawnPulse(toNode, fromNode, palette);
        }
      }

      // === DRAW: Flowing wire connections with curve ===
      for (const conn of connections) {
        const a = nodes[conn.i];
        const b = nodes[conn.j];
        const zAvg = (a.z + b.z) / 1600;
        const depthFactor = 1 - zAvg;
        const distFactor = 1 - conn.dist / CONNECTION_DIST;
        const baseAlpha = distFactor * depthFactor * 0.35 * palette.opacityMult;

        if (baseAlpha < 0.01) continue;

        // Curved line for organic feel
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const perpX = -(b.y - a.y) * 0.12;
        const perpY = (b.x - a.x) * 0.12;
        const wave = Math.sin(time * 0.012 + conn.i * 0.5) * 15 * depthFactor;
        const cx1 = midX + perpX + wave;
        const cy1 = midY + perpY + wave;

        // Color based on depth + time
        const colorT = (Math.sin(time * 0.006 + conn.i * 0.3 + conn.j * 0.2) + 1) / 2;
        let c1: string, c2: string;
        if (colorT < 0.33) {
          c1 = lerpColor(palette.cyan, palette.purple, colorT * 3);
          c2 = lerpColor(palette.purple, palette.green, colorT * 3);
        } else if (colorT < 0.66) {
          c1 = lerpColor(palette.purple, palette.green, (colorT - 0.33) * 3);
          c2 = lerpColor(palette.green, palette.cyan, (colorT - 0.33) * 3);
        } else {
          c1 = lerpColor(palette.green, palette.pink, (colorT - 0.66) * 3);
          c2 = lerpColor(palette.pink, palette.cyan, (colorT - 0.66) * 3);
        }

        // Draw the curved connection line
        const lineAlpha = baseAlpha * (0.6 + depthFactor * 0.4);
        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        gradient.addColorStop(0, `rgba(${c1}, ${lineAlpha * 0.3})`);
        gradient.addColorStop(0.3, `rgba(${c2}, ${lineAlpha})`);
        gradient.addColorStop(0.7, `rgba(${c1}, ${lineAlpha})`);
        gradient.addColorStop(1, `rgba(${c2}, ${lineAlpha * 0.3})`);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx1, cy1, b.x, b.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.4 + depthFactor * 1.0;
        ctx.stroke();

        // Secondary faint parallel line for depth
        if (depthFactor > 0.5 && baseAlpha > 0.05) {
          const offset = 3 * depthFactor;
          const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
          const nx = perpX / perpLen;
          const ny = perpY / perpLen;

          ctx.beginPath();
          ctx.moveTo(a.x + nx * offset, a.y + ny * offset);
          ctx.quadraticCurveTo(cx1 + nx * offset, cy1 + ny * offset, b.x + nx * offset, b.y + ny * offset);
          ctx.strokeStyle = `rgba(${c1}, ${lineAlpha * 0.15})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }

      // === DRAW: Data pulses traveling along connections ===
      const pulses = pulsesRef.current;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const toX = (pulse as any).toX || pulse.fromX;
        const toY = (pulse as any).toY || pulse.fromY;
        // Bezier interpolation
        const t = pulse.progress;
        const midPX = (pulse.fromX + toX) / 2 + Math.sin(t * Math.PI) * 15;
        const midPY = (pulse.fromY + toY) / 2 + Math.sin(t * Math.PI) * 15;
        const px = (1 - t) * (1 - t) * pulse.fromX + 2 * (1 - t) * t * midPX + t * t * toX;
        const py = (1 - t) * (1 - t) * pulse.fromY + 2 * (1 - t) * t * midPY + t * t * toY;

        const fadeAlpha = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;

        // Trail
        const trailLen = 6;
        for (let tr = 0; tr < trailLen; tr++) {
          const tt = Math.max(0, t - tr * 0.015);
          const tpx = (1 - tt) * (1 - tt) * pulse.fromX + 2 * (1 - tt) * tt * midPX + tt * tt * toX;
          const tpy = (1 - tt) * (1 - tt) * pulse.fromY + 2 * (1 - tt) * tt * midPY + tt * tt * toY;
          const trailAlpha = fadeAlpha * (1 - tr / trailLen) * 0.5;
          const trailSize = pulse.size * (1 - tr / trailLen * 0.5);

          const tg = ctx.createRadialGradient(tpx, tpy, 0, tpx, tpy, trailSize * 4);
          tg.addColorStop(0, `rgba(${pulse.color}, ${trailAlpha * 0.8})`);
          tg.addColorStop(0.5, `rgba(${pulse.color}, ${trailAlpha * 0.2})`);
          tg.addColorStop(1, `rgba(${pulse.color}, 0)`);
          ctx.beginPath();
          ctx.arc(tpx, tpy, trailSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = tg;
          ctx.fill();
        }

        // Main pulse dot
        const mainGlow = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 6);
        mainGlow.addColorStop(0, `rgba(${pulse.color}, ${fadeAlpha * 0.9})`);
        mainGlow.addColorStop(0.2, `rgba(${pulse.color}, ${fadeAlpha * 0.5})`);
        mainGlow.addColorStop(0.5, `rgba(${pulse.color}, ${fadeAlpha * 0.15})`);
        mainGlow.addColorStop(1, `rgba(${pulse.color}, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = mainGlow;
        ctx.fill();

        // White hot core
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha * 0.9})`;
        ctx.fill();
      }
      // Cap pulses
      if (pulses.length > 40) pulses.splice(0, pulses.length - 40);

      // === DRAW: Nodes ===
      for (const n of nodes) {
        const zFactor = (1 - n.z / 800);
        const pulse = Math.sin(n.pulsePhase) * 0.3 + 0.7;
        const energy = 0.3 + n.energyLevel * 0.7;
        const size = n.baseSize * zFactor * pulse * energy;
        const opacity = (0.2 + zFactor * 0.5 + n.energyLevel * 0.3) * palette.opacityMult * pulse;

        // Color cycling
        const cT = (Math.sin(time * 0.005 + n.x * 0.004 + n.y * 0.003 + n.pulsePhase) + 1) / 2;
        let nodeColor: string;
        if (cT < 0.33) {
          nodeColor = lerpColor(palette.cyan, palette.purple, cT * 3);
        } else if (cT < 0.66) {
          nodeColor = lerpColor(palette.purple, palette.green, (cT - 0.33) * 3);
        } else {
          nodeColor = lerpColor(palette.green, palette.pink, (cT - 0.66) * 3);
        }

        // Expanding ring for core nodes
        if (n.type === "core" && zFactor > 0.4) {
          const ringRadius = 15 + Math.sin(n.ringPhase) * 8;
          const ringAlpha = (1 - (ringRadius - 7) / 20) * opacity * 0.3;
          if (ringAlpha > 0.01) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, ringRadius * zFactor, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${nodeColor}, ${ringAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Second ring
            const ring2Radius = 25 + Math.cos(n.ringPhase * 0.7) * 10;
            const ring2Alpha = (1 - (ring2Radius - 15) / 20) * opacity * 0.15;
            if (ring2Alpha > 0.01) {
              ctx.beginPath();
              ctx.arc(n.x, n.y, ring2Radius * zFactor, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${nodeColor}, ${ring2Alpha})`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }

        // Outer soft glow
        const glowSize = n.type === "core" ? size * 12 : n.type === "relay" ? size * 8 : size * 5;
        const outerGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowSize);
        outerGlow.addColorStop(0, `rgba(${nodeColor}, ${opacity * 0.35})`);
        outerGlow.addColorStop(0.3, `rgba(${nodeColor}, ${opacity * 0.12})`);
        outerGlow.addColorStop(0.6, `rgba(${nodeColor}, ${opacity * 0.03})`);
        outerGlow.addColorStop(1, `rgba(${nodeColor}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner bright glow
        const innerSize = n.type === "core" ? size * 4 : size * 2.5;
        const innerGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, innerSize);
        innerGlow.addColorStop(0, `rgba(${nodeColor}, ${opacity * 0.9})`);
        innerGlow.addColorStop(0.4, `rgba(${nodeColor}, ${opacity * 0.4})`);
        innerGlow.addColorStop(1, `rgba(${nodeColor}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, innerSize, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();

        // White core
        const coreSize = n.type === "core" ? size * 1.0 : size * 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.85})`;
        ctx.fill();
      }

      // === DRAW: Mouse proximity effects ===
      if (mouse.x > 0 && mouse.y > 0) {
        // Soft large glow
        const mgr = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS * 0.8);
        const mColor = lerpColor(palette.cyan, palette.purple, (Math.sin(time * 0.01) + 1) / 2);
        mgr.addColorStop(0, `rgba(${mColor}, 0.06)`);
        mgr.addColorStop(0.3, `rgba(${mColor}, 0.025)`);
        mgr.addColorStop(0.6, `rgba(${palette.green}, 0.008)`);
        mgr.addColorStop(1, `rgba(${mColor}, 0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = mgr;
        ctx.fill();

        // Mouse connection lines to nearby nodes
        for (const n of nodes) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS * 0.6) {
            const alpha = (1 - d / (MOUSE_RADIUS * 0.6)) * 0.15 * palette.opacityMult;
            const lg = ctx.createLinearGradient(mouse.x, mouse.y, n.x, n.y);
            const nColor = lerpColor(palette.cyan, palette.pink, (Math.sin(time * 0.008 + n.pulsePhase) + 1) / 2);
            lg.addColorStop(0, `rgba(${mColor}, ${alpha})`);
            lg.addColorStop(1, `rgba(${nColor}, ${alpha * 0.3})`);
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = lg;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // === DRAW: Subtle flowing energy streams (long curved paths) ===
      const streamCount = 3;
      for (let s = 0; s < streamCount; s++) {
        const phase = time * 0.003 + s * (Math.PI * 2 / streamCount);
        ctx.beginPath();
        const startX = W * 0.2 + Math.sin(phase) * W * 0.3;
        const startY = H * (0.2 + s * 0.3);
        ctx.moveTo(startX, startY);

        const cp1x = W * 0.3 + Math.cos(phase * 1.3) * W * 0.2;
        const cp1y = H * (0.1 + s * 0.35) + Math.sin(phase * 0.7) * H * 0.15;
        const cp2x = W * 0.7 + Math.sin(phase * 0.9) * W * 0.15;
        const cp2y = H * (0.3 + s * 0.25) + Math.cos(phase * 1.1) * H * 0.15;
        const endX = W * 0.8 + Math.cos(phase * 0.6) * W * 0.15;
        const endY = H * (0.15 + s * 0.35);

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

        const streamColor = s === 0
          ? lerpColor(palette.cyan, palette.purple, (Math.sin(phase) + 1) / 2)
          : s === 1
            ? lerpColor(palette.purple, palette.green, (Math.cos(phase) + 1) / 2)
            : lerpColor(palette.green, palette.pink, (Math.sin(phase * 0.8) + 1) / 2);

        ctx.strokeStyle = `rgba(${streamColor}, ${0.04 * palette.opacityMult})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createNodes();

    const parentEl = canvas.parentElement;
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (parentEl) resizeObserver.observe(parentEl);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [getPalette]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
