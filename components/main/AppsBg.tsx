"use client";

import { useEffect, useRef, useState } from "react";
import Apps from "./Apps/Apps";
import { useAppsStore } from "@/store/useAppsStore";

const AppsBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isAppDraggingRef = useRef(false);
  const gridSize = 90;

  const apps = useAppsStore((s) => s.apps);
  const selectedAppIds = useAppsStore((s) => s.selectedAppIds);
  const setSelectedAppIds = useAppsStore((s) => s.setSelectedAppIds);

  const [Clicked, setClicked] = useState(false);
  const [RClicked, setRClicked] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  useEffect(() => {
    if (RClicked) {
      setRClicked(false);
    }
  }, [Clicked]);

  const handle_contextmenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (RClicked) {
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }
    if (!RClicked) {
      setRClicked(true);
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handle_Deselection = () => {
    if (isDraggingRef.current || isAppDraggingRef.current) return;
    setClicked(true);
    setSelectedAppIds([]);
    setTimeout(() => {
      setClicked(false);
    }, 100);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (e.target !== containerRef.current) return;

    isDraggingRef.current = false;
    if (RClicked) {
      setRClicked(false);
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionBox({ startX: x, startY: y, currentX: x, currentY: y });
    setSelectedAppIds([]);
  };

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!isSelecting) return;

  isDraggingRef.current = true;

  const rect = containerRef.current?.getBoundingClientRect();
  if (!rect) return;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const updated = {
    startX: selectionBox.startX,
    startY: selectionBox.startY,
    currentX: x,
    currentY: y,
  };

  const boxLeft = Math.min(updated.startX, updated.currentX);
  const boxTop = Math.min(updated.startY, updated.currentY);
  const boxWidth = Math.abs(updated.currentX - updated.startX);
  const boxHeight = Math.abs(updated.currentY - updated.startY);

  const newlySelectedIds = apps
    .filter((app) => {
      const appLeft = app.defaultCol * gridSize;
      const appTop = app.defaultRow * gridSize;
      const appWidth = gridSize;
      const appHeight = gridSize;
      return (
        appLeft < boxLeft + boxWidth &&
        appLeft + appWidth > boxLeft &&
        appTop < boxTop + boxHeight &&
        appTop + appHeight > boxTop
      );
    })
    .map((app) => app.id);

  setSelectionBox(updated);
  setSelectedAppIds(newlySelectedIds);
};

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
    }
  };

  const boxLeft = Math.min(selectionBox.startX, selectionBox.currentX);
  const boxTop = Math.min(selectionBox.startY, selectionBox.currentY);
  const boxWidth = Math.abs(selectionBox.currentX - selectionBox.startX);
  const boxHeight = Math.abs(selectionBox.currentY - selectionBox.startY);

  return (
    <div
      className="w-full h-screen absolute inset-0 z-20 overflow-hidden flex select-none"
      ref={containerRef}
      onContextMenu={handle_contextmenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => {
        handle_Deselection();
      }}
    >
      <Apps
        gridSize={gridSize}
        containerRef={containerRef}
        clicked={Clicked}
        isAppDraggingRef={isAppDraggingRef}
      />
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
      {isSelecting && (
        <div
          className="absolute bg-blue-500/20 border border-blue-500/60 pointer-events-none z-30"
          style={{
            left: `${boxLeft}px`,
            top: `${boxTop}px`,
            width: `${boxWidth}px`,
            height: `${boxHeight}px`,
          }}
        />
      )}
    </div>
  );
};

export default AppsBg;