import { useEffect, useRef } from "react";

export function QuantumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The mesh colour is a theme token, not a constant: indigo at dark-mode alpha
  // is nearly invisible on paper, so light mode supplies a deeper, denser value.
  const meshRef = useRef({ rgb: "99, 102, 241", alpha: 0.32 });

  useEffect(() => {
    const readMeshTokens = () => {
      const styles = getComputedStyle(document.documentElement);
      const rgb = styles.getPropertyValue("--mesh-rgb").trim();
      const alpha = Number.parseFloat(styles.getPropertyValue("--mesh-alpha"));
      meshRef.current = {
        rgb: rgb ? rgb.replace(/\s+/g, ", ") : "99, 102, 241",
        alpha: Number.isFinite(alpha) ? alpha : 0.32
      };
    };

    readMeshTokens();
    const observer = new MutationObserver(readMeshTokens);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width;
    let height = canvas.height;
    let cx = width / 2;
    let cy = height / 2;
    let size = Math.min(width, height) * 0.45;

    // Angle of rotation
    let angleX = 0.65;
    let angleY = 0.75;
    let targetAngleX = 0.65;
    let targetAngleY = 0.75;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      width = canvas.width;
      height = canvas.height;
      cx = width / 2;
      cy = height / 2;
      size = Math.min(width, height) * 0.44;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      targetAngleY = 0.75 + (mx / rect.width) * 0.6;
      targetAngleX = 0.65 + (my / rect.height) * 0.6;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Rotation matrices
    const rotateX = (x: number, y: number, z: number, theta: number) => {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateY = (x: number, y: number, z: number, theta: number) => {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    };

    const project = (x: number, y: number, z: number) => {
      let [rx, ry, rz] = rotateY(x * size, y * size, z * size, angleY);
      [rx, ry, rz] = rotateX(rx, ry, rz, angleX);
      const distance = 2.2;
      const scale = distance / (distance - rz / size);
      return [cx + rx * scale, cy + ry * scale, rz];
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth rotate
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      // Natural continuous rotation drift
      targetAngleY += 0.0006;

      const time = Date.now() * 0.0012;

      // Curvilinear mesh dimensions (20x20 grid)
      const gridSize = 20;
      const points: [number, number, number][][] = [];

      for (let i = 0; i <= gridSize; i++) {
        const u = -1.0 + (i * 2.0) / gridSize; // range [-1, 1]
        points[i] = [];
        for (let j = 0; j <= gridSize; j++) {
          const v = -1.0 + (j * 2.0) / gridSize; // range [-1, 1]
          
          // Gaussian envelope over quantum localized wave packet
          const d = Math.sqrt(u * u + v * v);
          const wave = 0.25 * Math.sin(d * 4.8 - time) * Math.cos(u * 2.5 + time * 0.4);
          const envelope = Math.exp(-d * d * 1.6);
          const y = wave * envelope;

          points[i][j] = [u, y, v];
        }
      }

      // Project all mesh coordinates
      const projected: [number, number, number][][] = [];
      for (let i = 0; i <= gridSize; i++) {
        projected[i] = [];
        for (let j = 0; j <= gridSize; j++) {
          const [u, y, v] = points[i][j];
          const [px, py, pz] = project(u, y, v);
          projected[i][j] = [px, py, pz];
        }
      }

      // Draw Curvilinear Grid Mesh
      ctx.lineWidth = 1.0;

      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          const d = Math.sqrt(
            points[i][j][0] * points[i][j][0] + points[i][j][2] * points[i][j][2]
          );
          
          // Fade lines towards the edges
          const edgeFade = Math.max(0, 1.0 - d);
          const mesh = meshRef.current;
          ctx.strokeStyle = `rgba(${mesh.rgb}, ${edgeFade * mesh.alpha})`;

          // Draw U line segment
          if (i < gridSize) {
            ctx.beginPath();
            ctx.moveTo(projected[i][j][0], projected[i][j][1]);
            ctx.lineTo(projected[i + 1][j][0], projected[i + 1][j][1]);
            ctx.stroke();
          }

          // Draw V line segment
          if (j < gridSize) {
            ctx.beginPath();
            ctx.moveTo(projected[i][j][0], projected[i][j][1]);
            ctx.lineTo(projected[i][j + 1][0], projected[i][j + 1][1]);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative aspect-square w-[280px] max-w-[280px] sm:w-[320px] sm:max-w-[320px] md:w-[360px] md:max-w-[360px] mx-auto flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ display: "block" }}
      />
      {/* Premium wave identifier caption */}
      <div
        className="absolute bottom-1 left-0 right-0 text-center font-mono text-[8px] text-muted tracking-[0.25em] uppercase"
        style={{ opacity: "var(--caption-opacity)" }}
      >
        Wave Function Manifold &middot; &Psi;(r, t)
      </div>
    </div>
  );
}
export default QuantumCanvas;
