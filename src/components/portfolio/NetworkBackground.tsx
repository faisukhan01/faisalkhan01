"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

/*
 * Performance notes (this component used to be the main source of scroll jank):
 *
 * 1. The canvas used to span the FULL page height (the glass card contains the
 *    entire page), i.e. a ~12000px-tall bitmap cleared and redrawn every frame.
 *    It is now `position: sticky; top: 0; height: 100svh` inside the card, so
 *    it stays pinned to the viewport while the page scrolls over it — a
 *    viewport-sized bitmap instead of a page-sized one (~10x fewer pixels).
 *    The card clips it via clip-path, so the visual result is identical.
 *
 * 2. All radial/linear gradients are pre-rendered once into small sprite
 *    canvases and stamped with drawImage() — creating dozens of gradient
 *    objects per frame was a major GC/allocation cost.
 *
 * 3. Connection lines use solid rgba strokes instead of a fresh
 *    createLinearGradient per connection per frame.
 *
 * 4. The mouse position no longer calls getBoundingClientRect() on every
 *    mousemove (layout thrash). The canvas rect is cached and refreshed only
 *    when a scroll/resize actually happened.
 */

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
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  size: number;
  sprite: HTMLCanvasElement;
}

type Palette = {
  cyan: [number, number, number];
  purple: [number, number, number];
  green: [number, number, number];
  pink: [number, number, number];
  white: [number, number, number];
  opacityMult: number;
};

/** Pre-render a soft radial glow sprite (white-hot core → color → transparent). */
function createGlowSprite(color: [number, number, number], size = 64): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const [r, g, b] = color;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(0.18, `rgba(${r}, ${g}, ${b}, 0.85)`);
  grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.28)`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const spritesRef = useRef<HTMLCanvasElement[]>([]);
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();

  const getPalette = useCallback((): Palette => {
    const isDark = resolvedTheme === "dark";
    return {
      cyan: isDark ? [0, 220, 255] : [0, 150, 210],
      purple: isDark ? [140, 90, 255] : [100, 60, 210],
      green: isDark ? [0, 255, 170] : [0, 190, 140],
      pink: isDark ? [255, 100, 200] : [210, 70, 160],
      white: [255, 255, 255],
      opacityMult: isDark ? 1.0 : 0.6,
    };
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const NODE_COUNT = isMobile ? 26 : 70;
    const CONNECTION_DIST = isMobile ? 150 : 210;
    const MOUSE_RADIUS = 280;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    let rectDirty = true;
    let canvasRect: DOMRect | null = null;

    const palette = getPalette();
    const colorList: [number, number, number][] = [
      palette.cyan,
      palette.purple,
      palette.green,
      palette.pink,
    ];
    // Sprites: 4 palette colors + white
    spritesRef.current = [...colorList, palette.white].map((c) => createGlowSprite(c));
    const [cyanSprite, purpleSprite, greenSprite, pinkSprite, whiteSprite] = spritesRef.current;
    const colorSprites = [cyanSprite, purpleSprite, greenSprite, pinkSprite];
    const rgbStrings = colorList.map(([r, g, b]) => `${r}, ${g}, ${b}`);

    const resizeCanvas = () => {
      // The sticky canvas IS the viewport-sized drawing surface —
      // size the bitmap to its own CSS box.
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      W = w;
      H = h;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      rectDirty = true;
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
          baseSize:
            type === "core"
              ? 2.5 + Math.random() * 1.5
              : type === "relay"
                ? 1.5 + Math.random()
                : 0.8 + Math.random() * 0.7,
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

    // Mouse coordinates are stored in *viewport* space and converted to canvas
    // space once per frame using a cached rect (refreshed only when dirty).
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    const markRectDirty = () => {
      rectDirty = true;
    };

    const spawnPulse = (from: Node, to: Node) => {
      if (pulsesRef.current.length > (isMobile ? 12 : 32)) return;
      const sprite = colorSprites[Math.floor(Math.random() * colorSprites.length)];
      pulsesRef.current.push({
        fromX: from.x,
        fromY: from.y,
        toX: to.x,
        toY: to.y,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 2,
        sprite,
      });
    };

    const animate = () => {
      const time = ++timeRef.current;
      const nodes = nodesRef.current;

      // Mobile: skip every other frame (30fps) to save battery
      if (isMobile && time % 2 === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (rectDirty) {
        canvasRect = canvas.getBoundingClientRect();
        rectDirty = false;
      }

      // Convert mouse from viewport space to canvas space
      const mouse = { x: -1000, y: -1000 };
      if (canvasRect && mouseRef.current.x > -500) {
        mouse.x = mouseRef.current.x - canvasRect.left;
        mouse.y = mouseRef.current.y - canvasRect.top;
      }

      ctx.clearRect(0, 0, W, H);

      // === UPDATE NODES ===
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        n.pulsePhase += n.pulseSpeed;
        n.ringPhase += 0.015;

        if (n.x < -50) n.x = W + 50;
        if (n.x > W + 50) n.x = -50;
        if (n.y < -50) n.y = H + 50;
        if (n.y > H + 50) n.y = -50;
        if (n.z < 0) n.z = 800;
        if (n.z > 800) n.z = 0;

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

        n.vx *= 0.995;
        n.vy *= 0.995;
        n.vz *= 0.995;

        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 0.5) {
          n.vx *= 0.5 / speed;
          n.vy *= 0.5 / speed;
        }

        n.energyLevel += (n.energyTarget - n.energyLevel) * 0.05;
      }

      // === BUILD CONNECTION MAP ===
      const connections: { i: number; j: number; dist: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECTION_DIST * CONNECTION_DIST) {
            connections.push({ i, j, dist: Math.sqrt(d2) });
          }
        }
      }

      // === SPAWN PULSES ===
      if (Math.random() < (isMobile ? 0.03 : 0.1) && connections.length > 0) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        if (Math.random() > 0.5) {
          spawnPulse(nodes[conn.i], nodes[conn.j]);
        } else {
          spawnPulse(nodes[conn.j], nodes[conn.i]);
        }
      }

      // === DRAW: flowing curved connections (solid strokes, no gradients) ===
      for (let c = 0; c < connections.length; c++) {
        const conn = connections[c];
        const a = nodes[conn.i];
        const b = nodes[conn.j];
        const zAvg = (a.z + b.z) / 1600;
        const depthFactor = 1 - zAvg;
        const distFactor = 1 - conn.dist / CONNECTION_DIST;
        const baseAlpha = distFactor * depthFactor * 0.35 * palette.opacityMult;

        if (baseAlpha < 0.01) continue;

        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const perpX = -(b.y - a.y) * 0.12;
        const perpY = (b.x - a.x) * 0.12;
        const wave = Math.sin(time * 0.012 + conn.i * 0.5) * 15 * depthFactor;
        const cx1 = midX + perpX + wave;
        const cy1 = midY + perpY + wave;

        // Color cycles through the palette instead of a per-line gradient
        const colorIdx = Math.floor(
          ((Math.sin(time * 0.006 + conn.i * 0.3 + conn.j * 0.2) + 1) / 2) * 3.99
        );
        const lineAlpha = baseAlpha * (0.6 + depthFactor * 0.4);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx1, cy1, b.x, b.y);
        ctx.strokeStyle = `rgba(${rgbStrings[colorIdx]}, ${lineAlpha})`;
        ctx.lineWidth = 0.4 + depthFactor * 1.0;
        ctx.stroke();

        // Secondary faint parallel line for depth — desktop only
        if (!isMobile && depthFactor > 0.5 && baseAlpha > 0.05) {
          const offset = 3 * depthFactor;
          const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
          const nx = perpX / perpLen;
          const ny = perpY / perpLen;

          ctx.beginPath();
          ctx.moveTo(a.x + nx * offset, a.y + ny * offset);
          ctx.quadraticCurveTo(
            cx1 + nx * offset,
            cy1 + ny * offset,
            b.x + nx * offset,
            b.y + ny * offset
          );
          ctx.strokeStyle = `rgba(${rgbStrings[colorIdx]}, ${lineAlpha * 0.15})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }

      // === DRAW: data pulses (sprite-stamped, no gradients) ===
      const pulses = pulsesRef.current;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const t = pulse.progress;
        const midPX = (pulse.fromX + pulse.toX) / 2 + Math.sin(t * Math.PI) * 15;
        const midPY = (pulse.fromY + pulse.toY) / 2 + Math.sin(t * Math.PI) * 15;
        const bez = (tt: number) => ({
          x:
            (1 - tt) * (1 - tt) * pulse.fromX +
            2 * (1 - tt) * tt * midPX +
            tt * tt * pulse.toX,
          y:
            (1 - tt) * (1 - tt) * pulse.fromY +
            2 * (1 - tt) * tt * midPY +
            tt * tt * pulse.toY,
        });

        const fadeAlpha = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
        const trailLen = isMobile ? 2 : 4;

        for (let tr = trailLen - 1; tr >= 0; tr--) {
          const tt = Math.max(0, t - tr * 0.015);
          const pt = bez(tt);
          const trailAlpha = fadeAlpha * (1 - tr / trailLen) * 0.45;
          const r = pulse.size * 4 * (1 - (tr / trailLen) * 0.4);
          ctx.globalAlpha = trailAlpha;
          ctx.drawImage(pulse.sprite, pt.x - r, pt.y - r, r * 2, r * 2);
        }

        // Main pulse glow + white hot core
        const main = bez(t);
        const r = pulse.size * 5;
        ctx.globalAlpha = fadeAlpha * 0.9;
        ctx.drawImage(pulse.sprite, main.x - r, main.y - r, r * 2, r * 2);
        const cr = pulse.size * 1.2;
        ctx.globalAlpha = fadeAlpha * 0.9;
        ctx.drawImage(whiteSprite, main.x - cr, main.y - cr, cr * 2, cr * 2);
      }
      ctx.globalAlpha = 1;

      // === DRAW: nodes (sprite glow + white core, no gradients) ===
      for (const n of nodes) {
        const zFactor = 1 - n.z / 800;
        const pulse = Math.sin(n.pulsePhase) * 0.3 + 0.7;
        const energy = 0.3 + n.energyLevel * 0.7;
        const size = n.baseSize * zFactor * pulse * energy;
        const opacity = (0.2 + zFactor * 0.5 + n.energyLevel * 0.3) * palette.opacityMult * pulse;

        if (opacity < 0.02) continue;

        const cT =
          (Math.sin(time * 0.005 + n.x * 0.004 + n.y * 0.003 + n.pulsePhase) + 1) / 2;
        const sprite = colorSprites[Math.floor(cT * 3.99)];

        // Expanding ring for core nodes — desktop only
        if (!isMobile && n.type === "core" && zFactor > 0.4) {
          const ringRadius = 15 + Math.sin(n.ringPhase) * 8;
          const ringAlpha = (1 - (ringRadius - 7) / 20) * opacity * 0.3;
          if (ringAlpha > 0.01) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, ringRadius * zFactor, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgbStrings[0]}, ${ringAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            const ring2Radius = 25 + Math.cos(n.ringPhase * 0.7) * 10;
            const ring2Alpha = (1 - (ring2Radius - 15) / 20) * opacity * 0.15;
            if (ring2Alpha > 0.01) {
              ctx.beginPath();
              ctx.arc(n.x, n.y, ring2Radius * zFactor, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${rgbStrings[0]}, ${ring2Alpha})`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }

        // Glow sprite (replaces the old two radial gradients per node)
        const glowSize = (n.type === "core" ? size * 8 : n.type === "relay" ? size * 6 : size * 4) + 2;
        ctx.globalAlpha = Math.min(opacity * 0.9, 1);
        ctx.drawImage(sprite, n.x - glowSize, n.y - glowSize, glowSize * 2, glowSize * 2);

        // White core
        const coreSize = (n.type === "core" ? size : size * 0.7) + 0.5;
        ctx.globalAlpha = Math.min(opacity * 0.85, 1);
        ctx.drawImage(whiteSprite, n.x - coreSize, n.y - coreSize, coreSize * 2, coreSize * 2);
      }
      ctx.globalAlpha = 1;

      // === DRAW: mouse proximity effects — desktop only ===
      if (!isMobile && mouse.x > -500) {
        const mgr = MOUSE_RADIUS * 0.9;
        ctx.globalAlpha = 0.07;
        ctx.drawImage(cyanSprite, mouse.x - mgr, mouse.y - mgr, mgr * 2, mgr * 2);
        ctx.globalAlpha = 1;

        for (const n of nodes) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < (MOUSE_RADIUS * 0.6) * (MOUSE_RADIUS * 0.6)) {
            const alpha = (1 - Math.sqrt(d2) / (MOUSE_RADIUS * 0.6)) * 0.15 * palette.opacityMult;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = `rgba(${rgbStrings[0]}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // === DRAW: subtle flowing energy streams — desktop only ===
      if (!isMobile) {
        const streamCount = 5;
        for (let s = 0; s < streamCount; s++) {
          const phase = time * 0.003 + s * ((Math.PI * 2) / streamCount);
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

          const streamColor =
            s === 0 ? rgbStrings[0] : s === 1 ? rgbStrings[1] : rgbStrings[2];

          ctx.strokeStyle = `rgba(${streamColor}, ${0.06 * palette.opacityMult})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createNodes();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    window.addEventListener("scroll", markRectDirty, { passive: true });
    window.addEventListener("resize", markRectDirty);

    // Don't add mouse listeners on mobile — saves battery and CPU
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", markRectDirty);
      window.removeEventListener("resize", markRectDirty);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [getPalette]);

  return (
    <div
      className="sticky top-0 z-0 h-svh w-full -mb-[100svh] pointer-events-none"
      aria-hidden="true"
    >
      {/*
       * The wrapper is sticky (pinned to the viewport while the card scrolls)
       * but its negative bottom margin cancels its layout footprint, so the
       * page content flows as if the background weren't there at all.
       */}
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
