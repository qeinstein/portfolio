import { useEffect, useRef } from "react";

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

    // Angle of rotation
    let angleX = 0.4;
    let angleY = 0.6;
    let targetAngleX = 0.4;
    let targetAngleY = 0.6;

    // Center of projection
    let cx = width / 2;
    let cy = height / 2;
    let size = Math.min(width, height) * 0.38; // Radius of sphere

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
      size = Math.min(width, height) * 0.35;
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse interactive tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      targetAngleY = (mx / rect.width) * Math.PI * 1.5;
      targetAngleX = (my / rect.height) * Math.PI * 1.5;
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
      // Rotate around Y, then X
      let [rx, ry, rz] = rotateY(x, y, z, angleY);
      [rx, ry, rz] = rotateX(rx, ry, rz, angleX);
      
      // Perspective projection
      const distance = 2.5;
      const scale = distance / (distance - rz / size);
      return [cx + rx * scale, cy + ry * scale, rz];
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth angles interpolation
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      // Add gentle baseline rotation if mouse is idle
      targetAngleY += 0.0015;

      // Latitude lines (horizontal grid)
      const latCount = 6;
      ctx.lineWidth = 1;
      
      for (let i = 1; i < latCount; i++) {
        const phi = (i * Math.PI) / latCount;
        const r = Math.sin(phi) * size;
        const y = Math.cos(phi) * size;
        
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const theta = (j * 2 * Math.PI) / 60;
          const x = Math.cos(theta) * r;
          const z = Math.sin(theta) * r;
          const [px, py] = project(x, y, z);
          
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        // Equator is drawn bolder
        ctx.strokeStyle = i === latCount / 2 
          ? "rgba(97, 175, 239, 0.22)" 
          : "rgba(97, 175, 239, 0.06)";
        ctx.stroke();
      }

      // Longitude lines (vertical grid)
      const lonCount = 8;
      for (let i = 0; i < lonCount; i++) {
        const theta = (i * Math.PI) / lonCount;
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const phi = (j * Math.PI) / 60;
          const x = Math.sin(phi) * Math.cos(theta) * size;
          const y = Math.cos(phi) * size;
          const z = Math.sin(phi) * Math.sin(theta) * size;
          const [px, py] = project(x, y, z);
          
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(97, 175, 239, 0.05)";
        ctx.stroke();
      }

      // Draw Outer Sphere circle
      ctx.beginPath();
      // Outer sphere diameter projection outline
      for (let i = 0; i <= 60; i++) {
        const theta = (i * 2 * Math.PI) / 60;
        const [px, py] = project(Math.cos(theta) * size, Math.sin(theta) * size, 0);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "rgba(171, 178, 191, 0.12)";
      ctx.stroke();

      // Main Axes (X, Y, Z)
      const axes = [
        { x: size * 1.15, y: 0, z: 0, label: "x", color: "rgba(171, 178, 191, 0.3)" },
        { x: 0, y: -size * 1.15, z: 0, label: "z  |0⟩", color: "rgba(97, 175, 239, 0.65)" },
        { x: 0, y: 0, z: size * 1.15, label: "y", color: "rgba(171, 178, 191, 0.3)" }
      ];

      const [ox, oy] = project(0, 0, 0);

      axes.forEach((axis) => {
        const [ax, ay] = project(axis.x, axis.y, axis.z);
        
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = axis.color;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Axis label
        ctx.fillStyle = axis.color;
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillText(axis.label, ax + 4, ay + 4);
      });

      // Bottom Z label: |1>
      const [zNegX, zNegY] = project(0, size * 1.15, 0);
      ctx.fillStyle = "rgba(97, 175, 239, 0.65)";
      ctx.fillText("|1⟩", zNegX + 4, zNegY + 4);

      // Rotating Quantum State Vector |ψ⟩
      const pulse = Date.now() * 0.001;
      const stateTheta = Math.PI / 3 + Math.sin(pulse * 0.7) * 0.2; // superposition angle
      const statePhi = pulse * 0.3;

      const sx = Math.sin(stateTheta) * Math.cos(statePhi) * size;
      const sy = -Math.cos(stateTheta) * size;
      const sz = Math.sin(stateTheta) * Math.sin(statePhi) * size;

      const [spx, spy] = project(sx, sy, sz);

      // Dot product projection lines
      const [ppx, ppy] = project(sx, 0, sz);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ppx, ppy);
      ctx.strokeStyle = "rgba(97, 175, 239, 0.15)";
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(ppx, ppy);
      ctx.lineTo(spx, spy);
      ctx.strokeStyle = "rgba(97, 175, 239, 0.15)";
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // State Vector line
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(spx, spy);
      ctx.strokeStyle = "rgb(97, 175, 239)"; // Glowing blue accent
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // State Vector endpoint node
      ctx.beginPath();
      ctx.arc(spx, spy, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(97, 175, 239)";
      ctx.fill();

      // Label state vector
      ctx.fillStyle = "rgb(97, 175, 239)";
      ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.fillText("|ψ⟩", spx + 6, spy - 2);

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
      {/* Decorative caption */}
      <div className="absolute bottom-1 left-0 right-0 text-center font-mono text-[9px] text-muted/65 tracking-widest uppercase">
        Bloch Sphere Simulation
      </div>
    </div>
  );
}
export default QuantumCanvas;
