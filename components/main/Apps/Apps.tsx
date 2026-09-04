"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAppsStore } from "@/store/useAppsStore";

interface AppsProps {
  gridSize: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  clicked: boolean;
  isAppDraggingRef: React.MutableRefObject<boolean>;
}

const Apps = ({
  gridSize,
  containerRef,
  clicked,
  isAppDraggingRef,
}: AppsProps) => {
  const apps = useAppsStore((s) => s.apps);
  const selectedAppIds = useAppsStore((s) => s.selectedAppIds);
  const setSelectedAppIds = useAppsStore((s) => s.setSelectedAppIds);
  const openApp = useAppsStore((s) => s.openApp);
  const updateAppPosition = useAppsStore((s) => s.updateAppPosition);
  const updateMultiplePositions = useAppsStore(
    (s) => s.updateMultiplePositions
  );

  const [lastClick, setLastClick] = useState(0);

  useEffect(() => {
    if (clicked === true) {
      setSelectedAppIds([]);
    }
  }, [clicked, setSelectedAppIds]);

  const handle_clicks = () => {
    const seconds = Date.now() / 1000;
    setLastClick(seconds);
  };

  const handle_double_clicks = (id: string) => {
    if (Date.now() / 1000 - lastClick <= 2) {
      openApp(id);
    }
  };

  return (
    <>
      {apps.map((app, index) => {
        const active = selectedAppIds.includes(app.id);

        if (!app.isOnDesktop) return null;

        return (
          <motion.div
            key={app.id || index}
            className={`absolute hidden cursor-pointer select-none md:flex ${
              active ? "bg-white/20 outline  outline-white/40" : ""
            } flex-col items-center justify-start rounded-md hover:bg-white/10 active:scale-95`}
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

              const centerX = info.point.x - rect.left;
              const centerY = info.point.y - rect.top;

              let targetCol = Math.floor(centerX / gridSize);
              let targetRow = Math.floor(centerY / gridSize);

              const maxCols = Math.max(1, Math.floor(rect.width / gridSize));
              const maxRows = Math.max(1, Math.floor(rect.height / gridSize));

              targetCol = Math.max(0, Math.min(targetCol, maxCols - 1));
              targetRow = Math.max(0, Math.min(targetRow, maxRows - 1));

              const movingIds = selectedAppIds.includes(app.id)
                ? selectedAppIds
                : [app.id];

              const isOccupied = (c: number, r: number) =>
                apps.some(
                  (p) =>
                    !movingIds.includes(p.id) &&
                    p.isOnDesktop &&
                    p.defaultCol === c &&
                    p.defaultRow === r
                );

              if (movingIds.length > 1) {
                const deltaCol = targetCol - app.defaultCol;
                const deltaRow = targetRow - app.defaultRow;

                let canMove = true;
                const newPositions = movingIds.map((id) => {
                  const movingApp = apps.find((a) => a.id === id)!;
                  const newCol = movingApp.defaultCol + deltaCol;
                  const newRow = movingApp.defaultRow + deltaRow;

                  if (
                    newCol < 0 ||
                    newCol >= maxCols ||
                    newRow < 0 ||
                    newRow >= maxRows ||
                    isOccupied(newCol, newRow)
                  ) {
                    canMove = false;
                  }
                  return { id, col: newCol, row: newRow };
                });

                if (canMove) {
                  updateMultiplePositions(newPositions);
                }
              } else {
                let finalCol = targetCol;
                let finalRow = targetRow;

                if (isOccupied(finalCol, finalRow)) {
                  const candidates = [
                    { col: finalCol + 1, row: finalRow },
                    { col: finalCol - 1, row: finalRow },
                    { col: finalCol, row: finalRow + 1 },
                    { col: finalCol, row: finalRow - 1 },
                    { col: finalCol + 1, row: finalRow + 1 },
                    { col: finalCol - 1, row: finalRow - 1 },
                    { col: finalCol + 1, row: finalRow - 1 },
                    { col: finalCol - 1, row: finalRow + 1 },
                  ];

                  const free = candidates.find(
                    (p) =>
                      p.col >= 0 &&
                      p.col < maxCols &&
                      p.row >= 0 &&
                      p.row < maxRows &&
                      !isOccupied(p.col, p.row)
                  );

                  if (free) {
                    finalCol = free.col;
                    finalRow = free.row;
                  } else {
                    let found = false;
                    for (let r = 0; r < maxRows && !found; r++) {
                      for (let c = 0; c < maxCols && !found; c++) {
                        if (!isOccupied(c, r)) {
                          finalCol = c;
                          finalRow = r;
                          found = true;
                        }
                      }
                    }
                    if (!found) {
                      window.alert("desktop full of apps");
                      setTimeout(() => {
                        isAppDraggingRef.current = false;
                      }, 150);
                      return;
                    }
                  }
                }

                updateAppPosition(app.id, finalCol, finalRow);
              }

              if (!selectedAppIds.includes(app.id)) {
                setSelectedAppIds([app.id]);
              }

              setTimeout(() => {
                isAppDraggingRef.current = false;
              }, 150);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAppIds([app.id]);
              handle_clicks();
            }}
            onDoubleClick={() => {
              handle_double_clicks(app.id);
            }}
          >
            
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center">
              {app.isIconpath ? (
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  loading="eager"
                  draggable={false}
                />
              ) : (
                <span className="text-3xl leading-none drop-shadow-sm">
                  {app.icon}
                </span>
              )}
            </div>

            <span
              className="mt-1 line-clamp-2 w-18 px-0.5 text-center text-[11px] leading-[1.15] font-medium text-white"
              style={{
                textShadow:
                  "0 0 2px #000, 0 0 2px #000, 1px 1px 1px #000, -1px -1px 1px #000",
              }}
            >
              {app.name}
            </span>
          </motion.div>
        );
      })}
    </>
  );
};

export default Apps;