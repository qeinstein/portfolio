import { useEffect, useMemo, useRef } from "react";

import { portfolio } from "@/lib/portfolio-data";

type EntryPortalProps = {
  onEnter: () => void;
};

type Vec3 = { x: number; y: number; z: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rotateY(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function rotateX(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function parseCssRgb(value: string) {
  const match = /(\d+)\s+(\d+)\s+(\d+)/.exec(value);
  if (!match) {
    return { r: 137, g: 160, b: 145 };
  }
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

export function EntryPortal({ onEnter }: EntryPortalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = useMemo(() => ({ width: 860, height: 460 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      return;
    }
    const context = ctx;

    const accent = parseCssRgb(
      getComputedStyle(document.documentElement).getPropertyValue("--accent")
    );
    const ink = parseCssRgb(
      getComputedStyle(document.documentElement).getPropertyValue("--ink")
    );
    const surface = parseCssRgb(
      getComputedStyle(document.documentElement).getPropertyValue("--surface")
    );

    const dpr = clamp(window.devicePixelRatio ?? 1, 1, 2);
    canvas.width = Math.floor(size.width * dpr);
    canvas.height = Math.floor(size.height * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rand = seededRandom(42);
    const points: Array<{ p: Vec3; hueShift: number; size: number }> = [];

    const rings = 10;
    const pointsPerRing = 140;

    for (let r = 0; r < rings; r += 1) {
      const t = r / (rings - 1);
      const radius = 0.65 + 0.22 * Math.sin(t * Math.PI);
      const y = (t - 0.5) * 0.65;
      for (let i = 0; i < pointsPerRing; i += 1) {
        const a = (i / pointsPerRing) * Math.PI * 2;
        const wobble = (rand() - 0.5) * 0.045;
        const x = Math.cos(a) * (radius + wobble);
        const z = Math.sin(a) * (radius + wobble);
        points.push({
          p: { x, y: y + (rand() - 0.5) * 0.03, z },
          hueShift: rand(),
          size: 0.8 + rand() * 1.6,
        });
      }
    }

    let raf = 0;
    const start = performance.now();

    function frame(now: number) {
      raf = window.requestAnimationFrame(frame);
      const t = (now - start) / 1000;

      const w = size.width;
      const h = size.height;
      const cx = w / 2;
      const cy = h / 2;

      context.fillStyle = `rgb(${surface.r} ${surface.g} ${surface.b})`;
      context.fillRect(0, 0, w, h);

      // subtle vignette
      const gradient = context.createRadialGradient(
        cx,
        cy,
        40,
        cx,
        cy,
        Math.max(w, h) * 0.7
      );
      gradient.addColorStop(0, `rgba(0,0,0,0)`);
      gradient.addColorStop(1, `rgba(0,0,0,0.55)`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);

      const yaw = t * 0.55;
      const pitch = Math.sin(t * 0.5) * 0.18;

      const projected: Array<{ x: number; y: number; z: number; s: number; a: number }> = [];

      for (const point of points) {
        let p = point.p;
        p = rotateY(p, yaw);
        p = rotateX(p, pitch);

        const z = p.z + 1.6;
        const perspective = 1 / z;
        const x = cx + p.x * 360 * perspective;
        const y = cy + p.y * 320 * perspective;
        const s = point.size * 1.2 * perspective;
        const a = clamp(0.12 + 0.55 * (1 - (z - 1.1) / 1.4), 0.08, 0.8);
        projected.push({ x, y, z, s, a });
      }

      projected.sort((l, r) => r.z - l.z);

      for (let i = 0; i < projected.length; i += 1) {
        const p = projected[i];
        const glow = 0.55 + 0.45 * Math.sin(t * 1.2 + i * 0.02);
        const r = Math.round(accent.r * glow + ink.r * (1 - glow) * 0.1);
        const g = Math.round(accent.g * glow + ink.g * (1 - glow) * 0.1);
        const b = Math.round(accent.b * glow + ink.b * (1 - glow) * 0.1);
        context.fillStyle = `rgba(${r},${g},${b},${p.a})`;
        context.beginPath();
        context.arc(p.x, p.y, Math.max(0.6, p.s), 0, Math.PI * 2);
        context.fill();
      }

      // center "portal" ring
      context.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},0.4)`;
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(cx, cy, 120, 120, t * 0.25, 0, Math.PI * 2);
      context.stroke();
    }

    raf = window.requestAnimationFrame(frame);

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, [size.height, size.width]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-canvas/92 px-4 py-6 backdrop-blur-sm">
      <div className="ui-panel flex w-full max-w-3xl flex-col" style={{ maxHeight: "calc(100dvh - 3rem)" }}>
        {/* Text header — fixed, never scrolls away */}
        <div className="shrink-0 px-6 pt-6 pb-4 md:px-8 md:pt-7">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Portfolio</p>
          <h1 className="mt-2 font-secondary text-2xl font-medium tracking-tight text-ink md:text-3xl">
            Hi, I&apos;m {portfolio.meta.name}.
          </h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            Backend engineer and AI researcher — currently building{" "}
            <span className="text-ink">deterministic reasoning infrastructure for autonomous agents</span>.
          </p>
        </div>

        {/* Canvas — grows to fill available space, never overflows */}
        <div className="min-h-0 flex-1 overflow-hidden border-y border-line bg-surface/40">
          <canvas
            ref={canvasRef}
            className="block h-full w-full object-cover"
            role="img"
            aria-label="3D portal animation"
          />
        </div>

        {/* Footer — always visible */}
        <div className="shrink-0 flex items-center justify-end px-6 py-4 md:px-8">
          <button
            type="button"
            onClick={onEnter}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            Enter workspace
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
