"use client"
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import Apps from "./Apps/Apps";
import { DESKTOP_APPS } from '@/config/Apps/config'; 

const AppsBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridSize = 80;
  const [appsState, setAppsState] = useState(DESKTOP_APPS);
  const [Clicked,setClicked]=useState(false)
  const [RClicked,setRClicked]=useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  // useeffect to close rClick menu
  useEffect(()=>{
    if(RClicked){
      setRClicked(false)
    }
  },[Clicked])
  // to turn right click menu on and off
  const handle_contextmenu = (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault()
  e.stopPropagation()
  if(RClicked){
    setMenuPosition({x:e.clientX,y:e.clientY})
  }
  if(!RClicked){
    setRClicked(true)
    setMenuPosition({x:e.clientX,y:e.clientY})
  }
}

// on click deselects apps
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
      onContextMenu={handle_contextmenu}
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
       {/* right click menu */}
      {RClicked && (
        <div 
          className="absolute z-50 w-56 transition-all bg-[#202020]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-1 text-white text-xs select-none flex flex-col gap-0.5"
          style={{ top: menuPosition.y, left: menuPosition.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer flex justify-between items-center">
            <span>View</span>
            <span>&gt;</span>
          </div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer flex justify-between items-center">
            <span>Sort by</span>
            <span>&gt;</span>
          </div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer">
            Refresh
          </div>
          <div className="h-px bg-white/10 my-1"></div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer opacity-50 ">
            Paste
          </div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer opacity-50 ">
            Paste shortcut
          </div>
          <div className="h-px bg-white/10 my-1"></div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer flex justify-between items-center">
            <span>New</span>
            <span>&gt;</span>
          </div>
          <div className="h-px bg-white/10 my-1"></div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer">
            Display settings
          </div>
          <div className="px-3 py-1.5 hover:bg-white/10 rounded cursor-pointer">
            Personalize
          </div>
        </div>
      )}
      {/*mass app selection */}
        
    </div>
  )
}

export default AppsBg;