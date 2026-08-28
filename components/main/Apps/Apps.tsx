"use client"
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import { DESKTOP_APPS } from '@/config/Apps/config'; 

interface AppsProps {
  gridSize: number;
  appsState: typeof DESKTOP_APPS;
  setAppsState: React.Dispatch<React.SetStateAction<typeof DESKTOP_APPS>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  clicked: boolean;
  selectedAppIds: string[];
  setSelectedAppIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAppDraggingRef: React.MutableRefObject<boolean>; 
}

const Apps = ({ gridSize, appsState, setAppsState, containerRef , clicked, selectedAppIds, setSelectedAppIds, isAppDraggingRef }: AppsProps) => {
  const [lastClick,SetLastClick]=useState(0)
  const [rename,setRename]=useState(true)
 
  useEffect(()=>{
    if(clicked===true){
      setSelectedAppIds([])
    }
  },[clicked])
  
  const handle_clicks=()=>{
    const seconds = (Date.now()/1000)
    SetLastClick(seconds)
  }
  
  const handle_double_clicks=()=>{
    if(((Date.now()/1000)-lastClick)<=2){
      console.log("open")
      
      window.alert("apps window not implemented yet")
    }
  }
  
  return (
    <>
      {appsState.map((app, index) => {
        const active = selectedAppIds.includes(app.id);
        const length = app.name.length
       

        if(app.isOnDesktop)
        return (
          <motion.div 
            key={app.id || index}
            className={`absolute px-2 hidden md:flex border-gray-300  flex-col items-center justify-center py-5 gap-1 cursor-pointer select-none m-2 active:cursor-grabbing active:scale-95 ${active? "bg-white/20 border":""}`}
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              zIndex: active ? 30 : 10,
            }}
            drag 
            dragMomentum={false}
            dragConstraints={containerRef}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (!selectedAppIds.includes(app.id)) {
                setSelectedAppIds([app.id]);
              }
            }}
            onDragStart={() => {
              isAppDraggingRef.current = true;
            }}
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

              const targetCol = Math.floor(mouseX / gridSize);
              const targetRow = Math.floor(mouseY / gridSize);

              const maxCols = Math.floor(rect.width / gridSize);
              const maxRows = Math.floor(rect.height / gridSize);

              const movingIds = selectedAppIds.includes(app.id) ? selectedAppIds : [app.id];
              const deltaCol = targetCol - app.defaultCol;
              const deltaRow = targetRow - app.defaultRow;

              const isOccupiedByStaticApp = (c: number, r: number) => {
                return appsState.some((p) => !movingIds.includes(p.id) && p.defaultCol === c && p.defaultRow === r);
              };

              if (movingIds.length > 1) {
                let canMove = true;
                const newPositions = movingIds.map((id) => {
                  const movingApp = appsState.find((a) => a.id === id)!;
                  const newCol = movingApp.defaultCol + deltaCol;
                  const newRow = movingApp.defaultRow + deltaRow;
                  
                  if (newCol < 0 || newCol >= maxCols || newRow < 0 || newRow >= maxRows || isOccupiedByStaticApp(newCol, newRow)) {
                    canMove = false;
                  }
                  return { id, col: newCol, row: newRow };
                });

                if (canMove) {
                  setAppsState((prev) =>
                    prev.map((p) => {
                      const newPos = newPositions.find((n) => n.id === p.id);
                      return newPos ? { ...p, defaultCol: newPos.col, defaultRow: newPos.row } : p;
                    })
                  );
                }
              } else {
                let finalCol = Math.max(0, Math.min(targetCol, maxCols - 1));
                let finalRow = Math.max(0, Math.min(targetRow, maxRows - 1));

                if (isOccupiedByStaticApp(finalCol, finalRow)) {
                  const rightCol = finalCol + 1;
                  if (rightCol < maxCols && !isOccupiedByStaticApp(rightCol, finalRow)) {
                    finalCol = rightCol;
                  } else {
                    const leftCol = finalCol - 1;
                    if (leftCol >= 0 && !isOccupiedByStaticApp(leftCol, finalRow)) {
                      finalCol = leftCol;
                    } else {
                      const emptySlots: { col: number; row: number }[] = [];
                      for (let c = 0; c < maxCols; c++) {
                        for (let r = 0; r < maxRows; r++) {
                          if (!isOccupiedByStaticApp(c, r)) {
                            emptySlots.push({ col: c, row: r });
                          }
                        }
                      }

                      if (emptySlots.length > 0) {
                        const randomIndex = Math.floor(Math.random() * emptySlots.length);
                        finalCol = emptySlots[randomIndex].col;
                        finalRow = emptySlots[randomIndex].row;
                      } else {
                        window.alert("cant change position desktop full of apps");
                        return;
                      }
                    }
                  }
                }

                setAppsState((prevApps) => 
                  prevApps.map((p) => 
                    p.id === app.id 
                      ? { ...p, defaultCol: finalCol, defaultRow: finalRow } 
                      : p
                  )
                );
              }

              if (!selectedAppIds.includes(app.id)) {
                setSelectedAppIds([app.id]);
              }

              
              setTimeout(() => {
                isAppDraggingRef.current = false;
              }, 150);
            }}
            onClick={(e)=>{
              e.stopPropagation()
              setSelectedAppIds([app.id])
              handle_clicks()
            }}
            onDoubleClick={()=>{
              app.lastOpened = true
              const ex = document.cookie.match(app.name + app.lastOpened)
              ex?"": document.cookie = `${app.name} + ${app.lastOpened} ; expires=3600000}`
              console.log(app.name,app.lastOpened)
              handle_double_clicks()
            }}
          >
            <span className="text-black xs:text-sm font-mono relative h-full w-full p-5 flex items-center justify-center text-2xl" >
              {app.isIconpath ? (
                <Image src={app.icon} alt='App icon' fill sizes='auto' className='px-2.5 py-0.5 object-contain' loading='eager' draggable={false}/>
              ) : (
                app.icon
              )}
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