"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Apps from "./Apps/Apps";
import { useAppsStore } from "@/store/useAppsStore";
import WindowManager from "./Windows/WindowManager";
import ContextMenu, { clampMenuPosition, type ContextItem } from "./ContextMenu";

const AppsBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isAppDraggingRef = useRef(false);
  const gridSize = 90;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const apps = useAppsStore((s) => s.apps);
  const setSelectedAppIds = useAppsStore((s) => s.setSelectedAppIds);
  const openApp = useAppsStore((s) => s.openApp);

  const [Clicked, setClicked] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  useEffect(() => {
    if (Clicked) setMenu(null);
  }, [Clicked]);

  const desktopItems: ContextItem[] = [
    { label: "View", hint: "›" },
    { label: "Sort by", hint: "›", dividerAfter: true },
    { label: "Refresh", onClick: () => window.location.reload(), dividerAfter: true },
    { label: "Paste", disabled: true },
    { label: "Paste shortcut", disabled: true, dividerAfter: true },
    { label: "New", hint: "›", dividerAfter: true },
    { label: "Display settings", onClick: () => openApp("settings") },
    { label: "Personalize", onClick: () => openApp("settings") },
  ];

  const handle_contextmenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target !== containerRef.current) return;
    const pos = clampMenuPosition(e.clientX, e.clientY);
    setMenu(pos);
  };

  const handle_Deselection = () => {
    if (isDraggingRef.current || isAppDraggingRef.current) return;
    setClicked(true);
    setSelectedAppIds([]);
    setMenu(null);
    setTimeout(() => setClicked(false), 100);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (e.target !== containerRef.current) return;
    isDraggingRef.current = false;
    setMenu(null);
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
        if (!app.isOnDesktop) return false;
        const appLeft = app.defaultCol * gridSize;
        const appTop = app.defaultRow * gridSize;
        return (
          appLeft < boxLeft + boxWidth &&
          appLeft + gridSize > boxLeft &&
          appTop < boxTop + boxHeight &&
          appTop + gridSize > boxTop
        );
      })
      .map((app) => app.id);
    setSelectionBox(updated);
    setSelectedAppIds(newlySelectedIds);
  };

  const handleMouseUp = () => {
    if (isSelecting) setIsSelecting(false);
  };

  const boxLeft = Math.min(selectionBox.startX, selectionBox.currentX);
  const boxTop = Math.min(selectionBox.startY, selectionBox.currentY);
  const boxWidth = Math.abs(selectionBox.currentX - selectionBox.startX);
  const boxHeight = Math.abs(selectionBox.currentY - selectionBox.startY);

  return (
    <div
      className="absolute inset-0 z-20 flex h-screen w-full select-none overflow-hidden"
      ref={containerRef}
      onContextMenu={handle_contextmenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handle_Deselection}
    >
      <Apps
        gridSize={gridSize}
        containerRef={containerRef}
        clicked={Clicked}
        isAppDraggingRef={isAppDraggingRef}
      />
      <WindowManager />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={desktopItems}
          onClose={() => setMenu(null)}
        />
      )}

      {isSelecting && (
        <div
          className={`pointer-events-none absolute z-30 border ${
            isDark
              ? "border-blue-400/60 bg-blue-500/20"
              : "border-blue-600/50 bg-blue-500/15"
          }`}
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