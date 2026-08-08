"use client"
import React, { useState } from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import { DESKTOP_APPS } from '@/config/Apps/config'; 


interface AppsProps {
  gridSize: number;
  appsState: typeof DESKTOP_APPS;
  setAppsState: React.Dispatch<React.SetStateAction<typeof DESKTOP_APPS>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const Apps = ({ gridSize, appsState, setAppsState, containerRef }: AppsProps) => {
  return (
    <>
      
      {appsState.map((app, index) => {
        // console.log("")
        const [active,setActive]=useState(false)
        const length = app.name.length
        return (
          <motion.div 
            key={app.id || index}
            className={`absolute px-2  border-gray-300 flex flex-col items-center justify-center py-5 gap-1 cursor-pointer select-none m-2  active: active:cursor-grabbing active:scale-95 ${active? "bg-white/20 border":""}`}
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
            }}
            drag 
            dragMomentum={false}
            dragConstraints={containerRef}
            
           
            animate={{
              x: app.defaultCol * gridSize, 
              y: app.defaultRow * gridSize, 
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            
            onDragEnd={(e, info) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (!rect) return;

              const mouseX = info.point.x - rect.left;
              const mouseY = info.point.y - rect.top;

              const col = Math.floor(mouseX / gridSize);
              const row = Math.floor(mouseY / gridSize);

              
              setAppsState((prevApps) => 
                prevApps.map((p) => 
                  p.id === app.id 
                    ? { ...p, defaultCol: Math.max(0, col), defaultRow: Math.max(0, row) } 
                    : p
                )
              );
            }}
            onClick={()=>{
              setActive(true)
            }}
          >
            <span className="text-black xs:text-sm font-mono relative h-full w-full p-5 flex items-center justify-center text-2xl" >
              {app.isIconpath?
              <Image src={"/AppIcons/Settings.png"} alt='App icon' fill sizes='100vw' className='px-2.5 py-0.5 object-contain' loading='eager' draggable={false}/>
              :

              app.icon
              }
            </span>
            <span className={`font-black text-white [-webkit-text-stroke:0.7px_black] ${length<=8 ? "text-nowrap":""}`}>
              {app.name}

            </span>
          </motion.div>
        );
      })}
    </>
  );
}

export default Apps;