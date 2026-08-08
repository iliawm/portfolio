"use client"
import { useRef, useState } from "react"
import Apps from "./Apps/Apps";
import { DESKTOP_APPS } from '@/config/Apps/config'; 

const AppsBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridSize = 80;
  const [appsState, setAppsState] = useState(DESKTOP_APPS);
  const [Clicked,setClicked]=useState(false)

  const handle_Deselection=()=>{
    setClicked(true)
        
        setTimeout(() => {
          setClicked(false)
      
        }, 100);
   

  }
  return (
    <div 
      className="w-full h-screen absolute inset-0 z-20 overflow-hidden flex" 
      ref={containerRef}
      onContextMenu={(e)=>{
        e.preventDefault()
      }}
      onClick={()=>{
        handle_Deselection()
      }}
    >
      <Apps 
        gridSize={gridSize} 
        appsState={appsState}           
        setAppsState={setAppsState}    
        containerRef={containerRef}
        clicked={Clicked}
      />
    </div>
  )
}

export default AppsBg;