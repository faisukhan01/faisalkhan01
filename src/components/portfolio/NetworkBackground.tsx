"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// ─── Types ───────────────────────────────────────────────────────
interface Node {
  x: number;
  y: number;
  z: number; // depth layer 0-1
  vx: number;
  vy: number;
  radius: number;        // visual radius
  type: "hub" | "satellite" | "micro";
  pulsePhase: number;
  pulseSpeed: number;
  hue: number;           // color hue offset
  ringPhase: number;     // for expanding ring animation
  ringActive: boolean;
  ringTimer: number;
}

interface DataPacket {
  fromNode: number;
  toNode: number;
  progress: number;      // 0-1 along the path
  speed: number;
  size: number;
  hue: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface Connection {
  from: number;
  to: number;
  strength: number;      // 0-1
  curveOffset: number;   // bezier control point offset
  hue: number;
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const dustRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const { resolvedTheme } = useTheme();

  const isDark = useCallback(() => resolvedTheme === "dark", [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ─── Configuration ─────────────────────────────────────────
    const HUB_COUNT = 8;
    const SATELLITE_COUNT = 55;
    const MICRO_COUNT = 40;
    const DUST_COUNT = 80;
    const CONNECTION_DISTANCE = 220;
    const MOUSE_RADIUS = 300;
    const PACKET_SPAWN_RATE = 0.03; // probability per frame per connection

    // ─── Color Palette ─────────────────────────────────────────
    const getHue = (base: number, offset: number) => (base + offset) % 360;

    // ─── Resize ────────────────────────────────────────────────
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * (window.devicePixelRatio || 1);
        canvas.height = rect.height * (window.devicePixelRatio || 1);
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    };

    // ─── Create Nodes ──────────────────────────────────────────
    const createNodes = () => {
      const nodes: Node[] = [];
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Hub nodes - large, prominent
      for (let i = 0; i < HUB_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.2 + Math.random() * 0.3,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: 3 + Math.random() * 2,
          type: "hub",
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.012,
          hue: getHue(180, Math.random() * 60), // cyan-teal range
          ringPhase: 0,
          ringActive: false,
          ringTimer: Math.random() * 300,
        });
      }

      // Satellite nodes - medium
      for (let i = 0; i < SATELLITE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.3 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: 1.5 + Math.random() * 1.5,
          type: "satellite",
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          hue: getHue(200, Math.random() * 80), // blue-cyan-purple range
          ringPhase: 0,
          ringActive: false,
          ringTimer: 0,
        });
      }

      // Micro nodes - tiny atmosphere particles
      for (let i = 0; i < MICRO_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.5 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 0.6 + Math.random() * 0.8,
          type: "micro",
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          hue: getHue(260, Math.random() * 40), // purple-magenta range
          ringPhase: 0,
          ringActive: false,
          ringTimer: 0,
        });
      }

      nodesRef.current = nodes;
    };

    // ─── Create Connections ────────────────────────────────────
    const buildConnections = () => {
      const nodes = nodesRef.current;
      const connections: Connection[] = [];
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const maxDist = Math.min(CONNECTION_DISTANCE, Math.min(w, h) * 0.35);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect hubs to nearby satellites
          if (dist < maxDist) {
            // Prefer hub-to-satellite connections
            const isHubConnection = nodes[i].type === "hub" || nodes[j].type === "hub";
            const bothMicro = nodes[i].type === "micro" && nodes[j].type === "micro";

            // Skip most micro-to-micro connections
            if (bothMicro && Math.random() > 0.15) continue;

            const strength = isHubConnection
              ? (1 - dist / maxDist) * 0.8
              : (1 - dist / maxDist) * 0.4;

            if (strength > 0.1) {
              connections.push({
                from: i,
                to: j,
                strength,
                curveOffset: (Math.random() - 0.5) * 60,
                hue: (nodes[i].hue + nodes[j].hue) / 2,
              });
            }
          }
        }
      }

      connectionsRef.current = connections;
    };

    // ─── Create Dust Particles ─────────────────────────────────
    const createDust = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const dust: typeof dustRef.current = [];

      for (let i = 0; i < DUST_COUNT; i++) {
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          size: 0.3 + Math.random() * 0.6,
          opacity: 0.1 + Math.random() * 0.2,
        });
      }

      dustRef.current = dust;
    };

    // ─── Mouse handlers ────────────────────────────────────────
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

    // ─── Bezier helper ─────────────────────────────────────────
    const getBezierPoint = (
      x1: number, y1: number,
      x2: number, y2: number,
      offset: number,
      t: number
    ) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      // Perpendicular offset for control point
      const cx = mx + (-dy / Math.sqrt(dx * dx + dy * dy + 0.001)) * offset;
      const cy = my + (dx / Math.sqrt(dx * dx + dy * dy + 0.001)) * offset;

      const u = 1 - t;
      const px = u * u * x1 + 2 * u * t * cx + t * t * x2;
      const py = u * u * y1 + 2 * u * t * cy + t * t * y2;
      return { x: px, y: py };
    };

    // ─── Main Animation Loop ───────────────────────────────────
    const animate = () => {
      const dark = isDark();
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      timeRef.current++;
      const time = timeRef.current;

      ctx.save();
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const packets = packetsRef.current;
      const dust = dustRef.current;
      const mouse = mouseRef.current;

      // ─── Update Nodes ──────────────────────────────────────
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += node.pulseSpeed;

        // Wrap edges
        const pad = 40;
        if (node.x < -pad) node.x = w + pad;
        if (node.x > w + pad) node.x = -pad;
        if (node.y < -pad) node.y = h + pad;
        if (node.y > h + pad) node.y = -pad;

        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.008;
          node.vx += dx * force;
          node.vy += dy * force;
        }

        // Damping
        node.vx *= 0.995;
        node.vy *= 0.995;

        // Speed limit
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        const maxSpeed = node.type === "hub" ? 0.3 : node.type === "satellite" ? 0.5 : 0.7;
        if (speed > maxSpeed) {
          node.vx *= maxSpeed / speed;
          node.vy *= maxSpeed / speed;
        }

        // Hub ring animation
        if (node.type === "hub") {
          node.ringTimer++;
          if (node.ringTimer > 200 + Math.random() * 200) {
            node.ringActive = true;
            node.ringPhase = 0;
            node.ringTimer = 0;
          }
          if (node.ringActive) {
            node.ringPhase += 0.015;
            if (node.ringPhase > 1) {
              node.ringActive = false;
            }
          }
        }
      }

      // ─── Update Dust ──────────────────────────────────────
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
      }

      // ─── Spawn Data Packets ────────────────────────────────
      for (const conn of connections) {
        if (conn.strength > 0.3 && Math.random() < PACKET_SPAWN_RATE * conn.strength) {
          // Limit total packets
          if (packets.length < 50) {
            const direction = Math.random() > 0.5;
            packets.push({
              fromNode: direction ? conn.from : conn.to,
              toNode: direction ? conn.to : conn.from,
              progress: 0,
              speed: 0.003 + Math.random() * 0.008,
              size: 1.2 + Math.random() * 1.5,
              hue: conn.hue,
              trail: [],
            });
          }
        }
      }

      // ─── Update Data Packets ───────────────────────────────
      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.progress += pkt.speed;

        // Calculate current position for trail
        const fromNode = nodes[pkt.fromNode];
        const toNode = nodes[pkt.toNode];
        if (fromNode && toNode) {
          const conn = connections.find(
            c => (c.from === pkt.fromNode && c.to === pkt.toNode) ||
                 (c.from === pkt.toNode && c.to === pkt.fromNode)
          );
          const offset = conn?.curveOffset || 0;
          const pos = getBezierPoint(fromNode.x, fromNode.y, toNode.x, toNode.y, offset, pkt.progress);

          // Add to trail
          pkt.trail.push({ x: pos.x, y: pos.y, opacity: 1 });
          // Fade trail
          for (let t = pkt.trail.length - 1; t >= 0; t--) {
            pkt.trail[t].opacity -= 0.04;
            if (pkt.trail[t].opacity <= 0) {
              pkt.trail.splice(t, 1);
            }
          }
        }

        if (pkt.progress >= 1) {
          packets.splice(i, 1);
        }
      }

      // ─── Rebuild connections periodically ──────────────────
      if (time % 120 === 0) {
        buildConnections();
      }

      // ─── DRAW ───────────────────────────────────────────────

      // 1. Draw dust particles (atmosphere)
      for (const d of dust) {
        const dustOpacity = d.opacity * (dark ? 0.6 : 0.4);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(150, 200, 255, ${dustOpacity})`
          : `rgba(100, 140, 200, ${dustOpacity})`;
        ctx.fill();
      }

      // 2. Draw connections with bezier curves
      for (const conn of connections) {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        if (!fromNode || !toNode) continue;

        const dx = fromNode.x - toNode.x;
        const dy = fromNode.y - toNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Mouse proximity boost
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const mouseDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
        const mouseBoost = mouseDist < MOUSE_RADIUS ? (1 - mouseDist / MOUSE_RADIUS) * 0.5 : 0;

        const baseOpacity = conn.strength * (dark ? 0.35 : 0.2) + mouseBoost;
        const depthFactor = 1 - ((fromNode.z + toNode.z) / 2) * 0.5;
        const opacity = baseOpacity * depthFactor;

        // Control point for bezier
        const mx = (fromNode.x + toNode.x) / 2;
        const my = (fromNode.y + toNode.y) / 2;
        const len = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const cx = mx + (-dy / len) * conn.curveOffset;
        const cy = my + (dx / len) * conn.curveOffset;

        // Draw curved connection
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.quadraticCurveTo(cx, cy, toNode.x, toNode.y);

        // Gradient along the curve
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        const hue1 = conn.hue;
        const hue2 = (conn.hue + 30) % 360;
        const sat = dark ? "80%" : "60%";
        const light = dark ? "65%" : "45%";

        gradient.addColorStop(0, `hsla(${hue1}, ${sat}, ${light}, ${opacity * 0.6})`);
        gradient.addColorStop(0.5, `hsla(${hue2}, ${sat}, ${light}, ${opacity})`);
        gradient.addColorStop(1, `hsla(${hue1}, ${sat}, ${light}, ${opacity * 0.4})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = (0.3 + conn.strength * 1.2) * depthFactor;
        ctx.stroke();

        // Glow effect for strong connections
        if (conn.strength > 0.5 && mouseBoost > 0.1) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.quadraticCurveTo(cx, cy, toNode.x, toNode.y);
          ctx.strokeStyle = `hsla(${hue1}, ${sat}, ${light}, ${opacity * 0.3})`;
          ctx.lineWidth = (2 + conn.strength * 3) * depthFactor;
          ctx.stroke();
        }
      }

      // 3. Draw data packets with trails
      for (const pkt of packets) {
        const fromNode = nodes[pkt.fromNode];
        const toNode = nodes[pkt.toNode];
        if (!fromNode || !toNode) continue;

        const conn = connections.find(
          c => (c.from === pkt.fromNode && c.to === pkt.toNode) ||
               (c.from === pkt.toNode && c.to === pkt.fromNode)
        );
        const offset = conn?.curveOffset || 0;

        // Draw trail
        for (const t of pkt.trail) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, pkt.size * 0.5 * t.opacity, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `hsla(${pkt.hue}, 90%, 70%, ${t.opacity * 0.4})`
            : `hsla(${pkt.hue}, 70%, 50%, ${t.opacity * 0.3})`;
          ctx.fill();
        }

        // Draw packet head
        const pos = getBezierPoint(fromNode.x, fromNode.y, toNode.x, toNode.y, offset, pkt.progress);

        // Outer glow
        const glowRadius = pkt.size * 6;
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        glow.addColorStop(0, dark
          ? `hsla(${pkt.hue}, 90%, 75%, 0.6)`
          : `hsla(${pkt.hue}, 70%, 55%, 0.4)`);
        glow.addColorStop(0.3, dark
          ? `hsla(${pkt.hue}, 80%, 60%, 0.2)`
          : `hsla(${pkt.hue}, 60%, 45%, 0.15)`);
        glow.addColorStop(1, `hsla(${pkt.hue}, 80%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pkt.size, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `hsla(${pkt.hue}, 95%, 85%, 0.9)`
          : `hsla(${pkt.hue}, 80%, 60%, 0.8)`;
        ctx.fill();

        // White center
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pkt.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dark ? 0.9 : 0.7})`;
        ctx.fill();
      }

      // 4. Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        const depthFactor = 1 - node.z * 0.4;
        const size = node.radius * pulse * depthFactor;
        const opacity = (dark ? 0.8 : 0.5) * pulse * depthFactor;

        // Mouse proximity
        const mouseDist = Math.sqrt((mouse.x - node.x) ** 2 + (mouse.y - node.y) ** 2);
        const mouseProximity = mouseDist < MOUSE_RADIUS ? (1 - mouseDist / MOUSE_RADIUS) : 0;
        const mouseGlow = mouseProximity * 0.5;

        const sat = dark ? "85%" : "65%";
        const light = dark ? "70%" : "50%";

        if (node.type === "hub") {
          // ─── Hub Node: Large, prominent, with rings ───

          // Expanding ring animation
          if (node.ringActive) {
            const ringRadius = node.ringPhase * 80;
            const ringOpacity = (1 - node.ringPhase) * (dark ? 0.3 : 0.2);
            ctx.beginPath();
            ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${node.hue}, ${sat}, ${light}, ${ringOpacity})`;
            ctx.lineWidth = 1.5 * (1 - node.ringPhase);
            ctx.stroke();

            // Second ring
            if (node.ringPhase > 0.15) {
              const ringRadius2 = (node.ringPhase - 0.15) * 80;
              const ringOpacity2 = (1 - node.ringPhase) * (dark ? 0.2 : 0.12);
              ctx.beginPath();
              ctx.arc(node.x, node.y, ringRadius2, 0, Math.PI * 2);
              ctx.strokeStyle = `hsla(${node.hue}, ${sat}, ${light}, ${ringOpacity2})`;
              ctx.lineWidth = 1 * (1 - node.ringPhase);
              ctx.stroke();
            }
          }

          // Outer ambient glow
          const outerGlow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, size * 12
          );
          outerGlow.addColorStop(0, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.3 + mouseGlow})`);
          outerGlow.addColorStop(0.3, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.1})`);
          outerGlow.addColorStop(0.7, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.02})`);
          outerGlow.addColorStop(1, `hsla(${node.hue}, ${sat}, ${light}, 0)`);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 12, 0, Math.PI * 2);
          ctx.fillStyle = outerGlow;
          ctx.fill();

          // Inner glow
          const innerGlow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, size * 4
          );
          innerGlow.addColorStop(0, `hsla(${node.hue}, ${sat}, ${light}, ${opacity + mouseGlow})`);
          innerGlow.addColorStop(0.5, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.4})`);
          innerGlow.addColorStop(1, `hsla(${node.hue}, ${sat}, ${light}, 0)`);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = innerGlow;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 95%, ${dark ? "80%" : "60%"}, ${opacity + mouseGlow})`;
          ctx.fill();

          // White center
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${dark ? 0.95 : 0.8})`;
          ctx.fill();

        } else if (node.type === "satellite") {
          // ─── Satellite Node: Medium ───

          // Subtle glow
          const satGlow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, size * 6
          );
          satGlow.addColorStop(0, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.3 + mouseGlow * 0.5})`);
          satGlow.addColorStop(0.4, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.08})`);
          satGlow.addColorStop(1, `hsla(${node.hue}, ${sat}, ${light}, 0)`);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 6, 0, Math.PI * 2);
          ctx.fillStyle = satGlow;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 90%, ${dark ? "75%" : "55%"}, ${opacity + mouseGlow * 0.3})`;
          ctx.fill();

          // White dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${dark ? 0.8 : 0.6})`;
          ctx.fill();

        } else {
          // ─── Micro Node: Tiny sparkle ───

          const microGlow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, size * 4
          );
          microGlow.addColorStop(0, `hsla(${node.hue}, ${sat}, ${light}, ${opacity * 0.5})`);
          microGlow.addColorStop(1, `hsla(${node.hue}, ${sat}, ${light}, 0)`);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = microGlow;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 80%, ${dark ? "70%" : "50%"}, ${opacity * 0.8})`;
          ctx.fill();
        }
      }

      // 5. Mouse ambient glow
      if (mouse.x > 0 && mouse.y > 0) {
        const ambientGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, MOUSE_RADIUS * 0.8
        );
        ambientGlow.addColorStop(0, dark
          ? `hsla(200, 90%, 70%, 0.06)`
          : `hsla(200, 70%, 50%, 0.04)`);
        ambientGlow.addColorStop(0.3, dark
          ? `hsla(220, 80%, 60%, 0.03)`
          : `hsla(220, 60%, 40%, 0.02)`);
        ambientGlow.addColorStop(1, `hsla(200, 80%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = ambientGlow;
        ctx.fill();
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    // ─── Initialize ────────────────────────────────────────────
    resizeCanvas();
    createNodes();
    buildConnections();
    createDust();

    const parentEl = canvas.parentElement;
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      createNodes();
      buildConnections();
      createDust();
    });
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
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
