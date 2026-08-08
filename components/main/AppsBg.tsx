"use client"
import { useRef, useState } from "react"
import Apps from "./Apps/Apps";
import { DESKTOP_APPS } from '@/config/Apps/config'; 

const AppsBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridSize = 80;
  
 
  const [appsState, setAppsState] = useState(DESKTOP_APPS);

  return (
    <div 
      className="w-full h-screen absolute inset-0 z-20 overflow-hidden flex" 
      ref={containerRef}
    >
      <Apps 
        gridSize={gridSize} 
        appsState={appsState}           
        setAppsState={setAppsState}    
        containerRef={containerRef}
      />
    </div>
  )
}

export default AppsBg;