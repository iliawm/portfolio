"use client";

import { useRef, useState } from "react";
import { motion, PanInfo } from "framer-motion";

const apps = [
  { id: 1, name: "Chrome", color: "bg-blue-500" },
  { id: 2, name: "VSCode", color: "bg-blue-400" },
  { id: 3, name: "Terminal", color: "bg-gray-700" },
];

const AppsBg = () => {
  const gridSize = 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const [positions, setPositions] = useState<
    Record<number, { x: number; y: number }>
  >(
    apps.reduce((acc, app, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      acc[app.id] = { x: col * gridSize, y: row * gridSize };
      return acc;
    }, {} as Record<number, { x: number; y: number }>)
  );

  const handleDragEnd = (
    appId: number,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const elementEl = itemRefs.current.get(appId);
    if (!elementEl) return;

    const element = elementEl.getBoundingClientRect();

    const currentX = element.left - container.left;
    const currentY = element.top - container.top;

    const snapX = Math.round(currentX / gridSize) * gridSize;
    const snapY = Math.round(currentY / gridSize) * gridSize;

    const maxX = container.width - element.width;
    const maxY = container.height - element.height;
    const clampedX = Math.max(0, Math.min(snapX, maxX));
    const clampedY = Math.max(0, Math.min(snapY, maxY));

    setPositions((prev) => ({
      ...prev,
      [appId]: { x: clampedX, y: clampedY },
    }));
  };

  return (
    <div
      className="w-full h-screen fixed inset-0 z-20 bg-gray-900/50"
      ref={containerRef}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    >
      {apps.map((app) => (
        <motion.div
          key={app.id}
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          layout
          className={`w-25 h-25 ${app.color} cursor-grab active:cursor-grabbing rounded-xl flex flex-col items-center justify-center gap-1 text-white text-xs font-bold shadow-lg`}
          animate={{
            x: positions[app.id]?.x || 0,
            y: positions[app.id]?.y || 0,
          }}
          onDragEnd={(event, info) => handleDragEnd(app.id, event, info)}
          transition={{ duration: 0 }}
          ref={(el) => {
            if (el) itemRefs.current.set(app.id, el);
          }}
        >
          <div className="text-2xl">📦</div>
          <div>{app.name}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default AppsBg;