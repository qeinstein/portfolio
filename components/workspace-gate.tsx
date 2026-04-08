import { useEffect, useMemo, useRef, useState } from "react";

type WorkspaceGateProps = {
  onEnter: () => void;
};

type Viewport = {
  centerX: number;
  centerY: number;
  scale: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let r = 0;
  let g = 0;
  let b = 0;

  if (hp >= 0 && hp < 1) {
    r = c;
    g = x;
  } else if (hp >= 1 && hp < 2) {
    r = x;
    g = c;
  } else if (hp >= 2 && hp < 3) {
    g = c;
    b = x;
  } else if (hp >= 3 && hp < 4) {
    g = x;
    b = c;
  } else if (hp >= 4 && hp < 5) {
    r = x;
    b = c;
  } else if (hp >= 5 && hp < 6) {
    r = c;
    b = x;
  }

  const m = l - c / 2;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function mandelbrotIterations(cx: number, cy: number, maxIterations: number) {
  let x = 0;
  let y = 0;
  let iteration = 0;

  while (x * x + y * y <= 4 && iteration < maxIterations) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    iteration += 1;
  }

  return iteration;
}

export function WorkspaceGate({ onEnter }: WorkspaceGateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [iterations, setIterations] = useState(64);
  const [viewport, setViewport] = useState<Viewport>({
    centerX: -0.6,
    centerY: 0,
    scale: 2.6,
  });
  const [isRendering, setIsRendering] = useState(false);

  const size = useMemo(() => ({ width: 560, height: 360 }), []);

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

    canvas.width = size.width;
    canvas.height = size.height;

    let cancelled = false;
    setIsRendering(true);

    const imageData = context.createImageData(size.width, size.height);
    const data = imageData.data;

    const maxIterations = iterations;
    const aspect = size.width / size.height;
    const scaleX = viewport.scale;
    const scaleY = viewport.scale / aspect;

    let y = 0;

    function renderChunk() {
      if (cancelled) {
        return;
      }

      const linesPerChunk = 10;
      const endY = Math.min(size.height, y + linesPerChunk);

      for (; y < endY; y += 1) {
        for (let x = 0; x < size.width; x += 1) {
          const cx =
            viewport.centerX +
            ((x / size.width) * 2 - 1) * scaleX;
          const cy =
            viewport.centerY +
            ((y / size.height) * 2 - 1) * scaleY;

          const iteration = mandelbrotIterations(cx, cy, maxIterations);
          const offset = (y * size.width + x) * 4;

          if (iteration >= maxIterations) {
            data[offset] = 10;
            data[offset + 1] = 10;
            data[offset + 2] = 10;
            data[offset + 3] = 255;
            continue;
          }

          const t = iteration / maxIterations;
          const hue = 210 + 120 * t;
          const { r, g, b } = hslToRgb(hue, 0.78, 0.55 - t * 0.25);
          data[offset] = r;
          data[offset + 1] = g;
          data[offset + 2] = b;
          data[offset + 3] = 255;
        }
      }

      context.putImageData(imageData, 0, 0);

      if (y < size.height) {
        window.setTimeout(renderChunk, 0);
        return;
      }

      setIsRendering(false);
    }

    renderChunk();

    return () => {
      cancelled = true;
    };
  }, [iterations, size.height, size.width, viewport.centerX, viewport.centerY, viewport.scale]);

  function zoomAt(clientX: number, clientY: number, zoomFactor: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);

    const aspect = size.width / size.height;
    const scaleX = viewport.scale;
    const scaleY = viewport.scale / aspect;

    const targetX = viewport.centerX + (x * 2 - 1) * scaleX;
    const targetY = viewport.centerY + (y * 2 - 1) * scaleY;

    setViewport({
      centerX: targetX,
      centerY: targetY,
      scale: clamp(viewport.scale * zoomFactor, 0.00008, 4.2),
    });
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-canvas/92 px-6 py-10 backdrop-blur-sm">
      <div className="w-full max-w-4xl border border-line bg-surface/25 p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
              Interactive gate
            </p>
            <h1 className="mt-3 font-secondary text-3xl font-medium tracking-tight text-ink md:text-4xl">
              Infinite complexity from a simple rule.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              The Mandelbrot set — infinite detail emerging from{" "}
              <span className="font-mono text-ink">z = z² + c</span>. The same
              principle drives scalable systems: simple, composable rules that produce
              emergent behavior at scale. Click to zoom in. Shift-click to zoom out.
            </p>

            <div className="mt-6 overflow-hidden border border-line bg-canvas">
              <canvas
                ref={canvasRef}
                className="block h-auto w-full"
                onClick={(event) => {
                  if (isRendering) {
                    return;
                  }
                  zoomAt(event.clientX, event.clientY, event.shiftKey ? 1.6 : 0.55);
                }}
                role="img"
                aria-label="Mandelbrot set exploration canvas"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
                Compute
              </p>
              <label className="block text-sm text-muted">
                Iterations: <span className="text-ink">{iterations}</span>
              </label>
              <input
                type="range"
                min={24}
                max={220}
                value={iterations}
                onChange={(event) => setIterations(Number(event.target.value))}
                className="w-full"
              />
              <button
                type="button"
                onClick={() =>
                  setViewport({
                    centerX: -0.6,
                    centerY: 0,
                    scale: 2.6,
                  })
                }
                className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                Reset view
              </button>
              {isRendering ? (
                <p className="text-sm text-muted">Rendering…</p>
              ) : (
                <p className="text-sm text-muted">Ready.</p>
              )}
            </div>

            <div className="space-y-3 border-t border-line pt-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
                Enter
              </p>
              <button
                type="button"
                onClick={onEnter}
                className="inline-flex w-full items-center justify-center border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors duration-200 hover:bg-surface/80"
              >
                Enter workspace
              </button>
              <p className="text-xs leading-6 text-muted">
                This stores a local preference so you won’t see the gate again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
