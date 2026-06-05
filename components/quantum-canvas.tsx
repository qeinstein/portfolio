import { useEffect, useRef } from "react";

type EmbeddingNode = {
  x: number;
  y: number;
  z: number;
  label: string;
};

export function QuantumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // 3D Embedding space concepts from Toheeb's actual research/projects
    const nodes: EmbeddingNode[] = [
      { x: -0.7, y: 0.5, z: -0.3, label: "QIE Feature Maps" },
      { x: 0.8, y: -0.3, z: 0.6, label: "Symbolic TMS" },
      { x: -0.3, y: -0.6, z: -0.5, label: "KV Quantization" },
      { x: 0.75, y: 0.7, z: -0.2, label: "CSP Concurrency" },
      { x: 0.2, y: 0.2, z: -0.85, label: "Context Collapse" },
      { x: -0.8, y: -0.2, z: 0.5, label: "Spectral Collapse" },
      { x: -0.4, y: 0.8, z: 0.6, label: "Lloyd-Max Quantizer" },
      { x: 0.55, y: 0.1, z: -0.6, label: "QJL inner corrector" },
      { x: -0.1, y: -0.8, z: 0.45, label: "Deterministic Kernel" }
    ];

    // Angle of rotation
    let angleX = 0.5;
    let angleY = 0.8;
    let targetAngleX = 0.5;
    let targetAngleY = 0.8;

    // Resize handler
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      width = canvas.width;
      height = canvas.height;
      cx = width / 2;
      cy = height / 2;
      size = Math.min(width, height) * 0.42;
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse movement interactive rotation
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      targetAngleY = (mx / rect.width) * Math.PI * 1.8;
      targetAngleX = (my / rect.height) * Math.PI * 1.8;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Coordinate rotation helpers
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
      // Scale coordinates to fit size
      const sx = x * size;
      const sy = y * size;
      const sz = z * size;

      // Rotate around Y, then X
      let [rx, ry, rz] = rotateY(sx, sy, sz, angleY);
      [rx, ry, rz] = rotateX(rx, ry, rz, angleX);
      
      // Perspective projection
      const distance = 2.4;
      const scale = distance / (distance - rz / size);
      return [cx + rx * scale, cy + ry * scale, rz];
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth angles interpolation
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      // Gentle baseline drift
      targetAngleY += 0.0012;

      // 1. Draw ground perspective grid plane (X-Z plane at y = 1.0)
      ctx.lineWidth = 1;
      const gridSegments = 8;
      for (let i = 0; i <= gridSegments; i++) {
        const val = -1.0 + (i * 2.0) / gridSegments;
        
        // Z grid lines
        const [p1x, p1y] = project(val, 1.0, -1.0);
        const [p2x, p2y] = project(val, 1.0, 1.0);
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.strokeStyle = "rgba(97, 175, 239, 0.035)";
        ctx.stroke();

        // X grid lines
        const [g1x, g1y] = project(-1.0, 1.0, val);
        const [g2x, g2y] = project(1.0, 1.0, val);
        ctx.beginPath();
        ctx.moveTo(g1x, g1y);
        ctx.lineTo(g2x, g2y);
        ctx.strokeStyle = "rgba(97, 175, 239, 0.035)";
        ctx.stroke();
      }

      // 2. Draw Main Latent Axes
      const axes = [
        { x: 1.1, y: 0, z: 0, label: "Dim_0", color: "rgba(171, 178, 191, 0.15)" },
        { x: 0, y: -1.1, z: 0, label: "Dim_1", color: "rgba(171, 178, 191, 0.15)" },
        { x: 0, y: 0, z: 1.1, label: "Dim_2", color: "rgba(171, 178, 191, 0.15)" }
      ];

      const [ox, oy] = project(0, 0, 0);

      axes.forEach((axis) => {
        const [ax, ay] = project(axis.x, axis.y, axis.z);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = axis.color;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        ctx.fillStyle = axis.color;
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.fillText(axis.label, ax + 4, ay + 4);
      });

      // 3. Move Query Vector Q on parametric trajectory (Lissajous path in Latent Space)
      const time = Date.now() * 0.0008;
      const qx = Math.sin(time * 0.7) * 0.6;
      const qy = Math.cos(time * 0.5) * 0.5;
      const qz = Math.sin(time * 1.1) * 0.6;

      // Project Query Vector
      const [qpx, qpy, qpz] = project(qx, qy, qz);

      // 4. Calculate K-Nearest Neighbors in 3D Space
      const distances = nodes.map((node, index) => {
        const dx = node.x - qx;
        const dy = node.y - qy;
        const dz = node.z - qz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Cosine similarity approximation: maps [0, 2] distance to [1.0, 0.0] similarity
        const similarity = Math.max(0, 1.0 - dist / 2.0);
        return { index, distance: dist, similarity, node };
      });

      // Sort by distance ascending
      distances.sort((a, b) => a.distance - b.distance);
      const knn = distances.slice(0, 3); // 3-Nearest Neighbors

      // 5. Draw Glowing Attention connections to nearest neighbors
      knn.forEach((match) => {
        const [npx, npy] = project(match.node.x, match.node.y, match.node.z);
        ctx.beginPath();
        ctx.moveTo(qpx, qpy);
        ctx.lineTo(npx, npy);
        // Stroke opacity proportional to similarity
        ctx.strokeStyle = `rgba(97, 175, 239, ${match.similarity * 0.6})`;
        ctx.lineWidth = match.similarity * 1.8;
        ctx.stroke();

        // Print Similarity value along the link vector
        const mx = (qpx + npx) / 2;
        const my = (qpy + npy) / 2;
        ctx.fillStyle = "rgba(97, 175, 239, 0.75)";
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.fillText(`cos_θ: ${match.similarity.toFixed(2)}`, mx + 4, my - 2);
      });

      // 6. Draw Embedding Nodes (Point Cloud)
      nodes.forEach((node, idx) => {
        const [npx, npy, npz] = project(node.x, node.y, node.z);
        const sizeMultiplier = (npz + size) / (size * 2); // Depth scaling
        const radius = 2.5 + sizeMultiplier * 2.5;

        // Check if node is one of the KNN matches
        const isKnn = knn.some((k) => k.index === idx);

        ctx.beginPath();
        ctx.arc(npx, npy, radius, 0, 2 * Math.PI);
        if (isKnn) {
          ctx.fillStyle = "rgb(97, 175, 239)"; // Glowing Blue for active neighbors
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgb(97, 175, 239)";
        } else {
          ctx.fillStyle = "rgba(171, 178, 191, 0.35)"; // Gray for idle embeddings
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Label embedding nodes with concept name
        ctx.fillStyle = isKnn ? "rgba(255, 255, 255, 0.85)" : "rgba(171, 178, 191, 0.4)";
        ctx.font = isKnn ? "bold 9px JetBrains Mono, monospace" : "8px JetBrains Mono, monospace";
        ctx.fillText(node.label, npx + 8, npy + 3);
      });

      // 7. Draw Query Vector node
      const qRadius = 6.0;
      ctx.beginPath();
      ctx.arc(qpx, qpy, qRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(79, 70, 229)"; // Deep Indigo
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgb(79, 70, 229)";
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.font = "bold 10px JetBrains Mono, monospace";
      ctx.fillText("Q (Query)", qpx + 10, qpy - 4);

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
      {/* Precision dashboard details */}
      <div className="absolute bottom-1 left-0 right-0 text-center font-mono text-[8px] text-muted/50 tracking-[0.2em] uppercase">
        Latent Space Manifold &middot; KNN k=3 &middot; Cosine Similarity
      </div>
    </div>
  );
}
export default QuantumCanvas;
