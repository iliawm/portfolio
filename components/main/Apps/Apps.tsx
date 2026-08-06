"use client"

import React, { useState } from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import { IoSettings } from "react-icons/io5";
interface AppsProps {
  gridSize: number;
  gridPosition: { col: number; row: number };
  setGridPosition: React.Dispatch<React.SetStateAction<{ col: number; row: number }>>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Apps = ({ gridSize, gridPosition, setGridPosition, containerRef }: AppsProps) => {
  return (
    <>
    <motion.div 
      
      className={`absolute active:bg-white/10 active:border border-gray-300 flex flex-col items-center justify-center py-2 active:scale-95 gap-1 cursor-pointer active:cursor-grabbing select-none`}
      
      
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
      onClick={()=>{

      }}
    >
      <span className="
      text-black xs:text-xs font-mono relative 
      text-3xl
      ">
            {/* <Image src={"/"} alt='App icon' fill sizes='fill'/> */}
            <IoSettings />
      </span>
      <span className='font-bold text-black'>
        settings
      </span>
    </motion.div>
    
    </>
  )
}

export default Apps;