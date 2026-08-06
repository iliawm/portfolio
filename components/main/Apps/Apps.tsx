"use client"

import React from 'react'
import { motion } from "framer-motion";

interface AppsProps {
  gridSize: number;
  gridPosition: { col: number; row: number };
  setGridPosition: React.Dispatch<React.SetStateAction<{ col: number; row: number }>>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Apps = ({ gridSize, gridPosition, setGridPosition, containerRef }: AppsProps) => {
  return (
    <motion.div 
      
      className="absolute bg-red-700 flex flex-col items-center justify-center py-2 active:scale-95 cursor-grab active:cursor-grabbing select-none"
      
      
      style={{
        width: `${gridSize}px`,
        height: `${gridSize}px`,
      }}
      
      
      drag 
      dragMomentum={false}
      dragConstraints={containerRef}

      
      animate={{
        x: gridPosition.col * gridSize,
        y: gridPosition.row * gridSize,
      }}

      
      transition={{ type: "spring", stiffness: 350, damping: 25 }}

      onDragEnd={(e, info) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        
        const mouseX = info.point.x - rect.left;
        const mouseY = info.point.y - rect.top;

        const col = Math.floor(mouseX / gridSize);
        const row = Math.floor(mouseY / gridSize);

       
        setGridPosition({
          col: Math.max(0, col),
          row: Math.max(0, row),
        });
      }}
    >
      <span className="text-white text-xs font-mono">
        {gridPosition.col},{gridPosition.row}
      </span>
    </motion.div>
  )
}

export default Apps;