"use client";

import { useRef } from "react";
import { motion, useDragControls } from "framer-motion";

export default function WindowFrame({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const controls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed inset-0 bottom-15 z-30"
      />
      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ x: 140, y: 100 }}
        className="absolute z-40 flex h-105 w-160 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e]/95 shadow-2xl backdrop-blur-xl"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="flex h-9 shrink-0 cursor-grab items-center justify-between bg-white/5 px-3 active:cursor-grabbing"
        >
          <span className="select-none text-xs text-white/80">{title}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded px-2 py-0.5 text-white/70 hover:bg-red-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-3 text-sm text-white">
          {children}
        </div>
      </motion.div>
    </>
  );
}