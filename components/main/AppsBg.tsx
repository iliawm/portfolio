"use client"

import { useRef, useState } from "react"
import Apps from "./Apps/Apps";

const AppsBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridSize = 90;
  const [gridPosition, setGridPosition] = useState({ col: 0, row: 0 });

  return (
    
    <div 
      className="w-full h-screen absolute inset-0 z-20 overflow-hidden" 
      ref={containerRef}
    >
      <Apps 
        gridSize={gridSize} 
        gridPosition={gridPosition} 
        setGridPosition={setGridPosition} 
        containerRef={containerRef}
      />
    </div>
  )
}

export default AppsBg;