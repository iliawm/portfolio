"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { IoFolderOutline } from "react-icons/io5";
import { useAppsStore } from "@/store/useAppsStore";
import ContextMenu, {
  clampMenuPosition,
  type ContextItem,
} from "../ContextMenu";

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const apps = useAppsStore((s) => s.apps);
  const folders = useAppsStore((s) => s.folders);
  const selectedAppIds = useAppsStore((s) => s.selectedAppIds);
  const setSelectedAppIds = useAppsStore((s) => s.setSelectedAppIds);
  const openApp = useAppsStore((s) => s.openApp);
  const updateAppPosition = useAppsStore((s) => s.updateAppPosition);
  const updateMultiplePositions = useAppsStore(
    (s) => s.updateMultiplePositions
  );
  const setOnDesktop = useAppsStore((s) => s.setOnDesktop);
  const setFolderOnDesktop = useAppsStore((s) => s.setFolderOnDesktop);
  const deleteFolder = useAppsStore((s) => s.deleteFolder);
  const renameFolder = useAppsStore((s) => s.renameFolder);
  const setClipboard = useAppsStore((s) => s.setClipboard);
  const clipboard = useAppsStore((s) => s.clipboard);
  const addAppToFolder = useAppsStore((s) => s.addAppToFolder);
  const openFolderInExplorer = useAppsStore((s) => s.openFolderInExplorer);

  const [lastClick, setLastClick] = useState(0);
  const [iconMenu, setIconMenu] = useState<{
    x: number;
    y: number;
    appId: string;
  } | null>(null);
  const [folderMenu, setFolderMenu] = useState<{
    x: number;
    y: number;
    folderId: string;
  } | null>(null);
  const [renameState, setRenameState] = useState<{
    folderId: string;
    name: string;
  } | null>(null);
  const [hoverFolderId, setHoverFolderId] = useState<string | null>(null);

  const desktopFolders = folders.filter((f) => f.isOnDesktop);
  const desktopApps = apps.filter((a) => a.isOnDesktop);

  useEffect(() => {
    if (clicked === true) {
      setSelectedAppIds([]);
      setIconMenu(null);
      setFolderMenu(null);
    }
  }, [clicked, setSelectedAppIds]);

  const handle_clicks = () => {
    setLastClick(Date.now() / 1000);
  };

  const handle_double_clicks = (id: string) => {
    if (Date.now() / 1000 - lastClick <= 2) {
      openApp(id);
    }
  };

  const findFolderAtPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    return (
      desktopFolders.find(
        (f) => (f.defaultCol ?? 0) === col && (f.defaultRow ?? 0) === row
      ) ?? null
    );
  };

  const isOccupied = (c: number, r: number, movingIds: string[] = []) =>
    desktopApps.some(
      (p) =>
        !movingIds.includes(p.id) &&
        p.defaultCol === c &&
        p.defaultRow === r
    ) ||
    desktopFolders.some(
      (f) => (f.defaultCol ?? 0) === c && (f.defaultRow ?? 0) === r
    );

  const iconMenuItems = (appId: string): ContextItem[] => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return [];
    return [
      {
        label: "Open",
        onClick: () => openApp(appId),
        dividerAfter: true,
      },
      {
        label: "Cut",
        onClick: () =>
          setClipboard({
            mode: "cut",
            type: "app",
            ids: [appId],
            fromDesktop: true,
          }),
      },
      {
        label: "Copy",
        onClick: () =>
          setClipboard({
            mode: "copy",
            type: "app",
            ids: [appId],
            fromDesktop: true,
          }),
      },
      {
        label: "Paste",
        disabled: !clipboard || clipboard.type !== "app",
        onClick: () => {
          if (!clipboard || clipboard.type !== "app") return;
          clipboard.ids.forEach((id) => setOnDesktop(id, true));
          if (clipboard.mode === "cut") setClipboard(null);
        },
        dividerAfter: true,
      },
      {
        label: "Delete",
        danger: true,
        onClick: () => setOnDesktop(appId, false),
        dividerAfter: true,
      },
      {
        label: "Properties",
        onClick: () => openApp(appId),
      },
    ];
  };

  const folderMenuItems = (folderId: string): ContextItem[] => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return [];
    return [
      {
        label: "Open",
        onClick: () => openFolderInExplorer(folderId),
        dividerAfter: true,
      },
      {
        label: "Paste into folder",
        disabled: !clipboard || clipboard.type !== "app",
        onClick: () => {
          if (!clipboard || clipboard.type !== "app") return;
          clipboard.ids.forEach((id) => {
            addAppToFolder(folderId, id);
            if (clipboard.mode === "cut") setOnDesktop(id, false);
          });
          if (clipboard.mode === "cut") setClipboard(null);
        },
        dividerAfter: true,
      },
      {
        label: "Rename",
        onClick: () => setRenameState({ folderId, name: folder.name }),
      },
      {
        label: "Remove from Desktop",
        onClick: () => setFolderOnDesktop(folderId, false),
        dividerAfter: true,
      },
      {
        label: "Delete",
        danger: true,
        onClick: () => deleteFolder(folderId),
      },
    ];
  };

  return (
    <>
      {desktopApps.map((app, index) => {
        const active = selectedAppIds.includes(app.id);

        return (
          <motion.div
            key={app.id || index}
            className={`absolute hidden cursor-pointer select-none md:flex ${
              active
                ? isDark
                  ? "bg-white/20 outline outline-white/40"
                  : "bg-black/10 outline outline-black/20"
                : ""
            } flex-col items-center justify-start rounded-md ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
            } active:scale-95`}
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              zIndex: active ? 15 : 10,
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
              setIconMenu(null);
              setFolderMenu(null);
            }}
            animate={{
              x: app.defaultCol * gridSize,
              y: app.defaultRow * gridSize,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onDrag={(e, info) => {
              const over = findFolderAtPoint(info.point.x, info.point.y);
              setHoverFolderId(over?.id ?? null);
            }}
            onDragEnd={(e, info) => {
              const el = document.elementFromPoint(
                info.point.x,
                info.point.y
              ) as HTMLElement | null;
              const dropEl = el?.closest?.(
                "[data-explorer-drop]"
              ) as HTMLElement | null;
              const drop = dropEl?.getAttribute("data-explorer-drop");

              if (drop) {
                const movingIds = selectedAppIds.includes(app.id)
                  ? selectedAppIds
                  : [app.id];

                if (drop === "desktop") {
                  movingIds.forEach((id) => setOnDesktop(id, true));
                } else if (drop.startsWith("folder:")) {
                  const folderId = drop.slice(7);
                  movingIds.forEach((id) => {
                    addAppToFolder(folderId, id);
                    setOnDesktop(id, false);
                  });
                }

                setSelectedAppIds([]);
                setHoverFolderId(null);
                setTimeout(() => {
                  isAppDraggingRef.current = false;
                }, 150);
                return;
              }

              const rect = containerRef.current?.getBoundingClientRect();
              if (!rect) {
                setHoverFolderId(null);
                setTimeout(() => {
                  isAppDraggingRef.current = false;
                }, 150);
                return;
              }

              const dropFolder = findFolderAtPoint(info.point.x, info.point.y);
              setHoverFolderId(null);

              if (dropFolder) {
                const movingIds = selectedAppIds.includes(app.id)
                  ? selectedAppIds
                  : [app.id];
                movingIds.forEach((id) => {
                  addAppToFolder(dropFolder.id, id);
                  setOnDesktop(id, false);
                });
                setSelectedAppIds([]);
                setTimeout(() => {
                  isAppDraggingRef.current = false;
                }, 150);
                return;
              }

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
                    isOccupied(newCol, newRow, movingIds)
                  ) {
                    canMove = false;
                  }
                  return { id, col: newCol, row: newRow };
                });

                if (canMove) updateMultiplePositions(newPositions);
              } else {
                let finalCol = targetCol;
                let finalRow = targetRow;

                if (isOccupied(finalCol, finalRow, [app.id])) {
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
                      !isOccupied(p.col, p.row, [app.id])
                  );

                  if (free) {
                    finalCol = free.col;
                    finalRow = free.row;
                  } else {
                    let found = false;
                    for (let r = 0; r < maxRows && !found; r++) {
                      for (let c = 0; c < maxCols && !found; c++) {
                        if (!isOccupied(c, r, [app.id])) {
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
              setIconMenu(null);
              setFolderMenu(null);
              handle_clicks();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const pos = clampMenuPosition(e.clientX, e.clientY, 220, 280);
              setSelectedAppIds([app.id]);
              setFolderMenu(null);
              setIconMenu({ ...pos, appId: app.id });
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
              className={`mt-1 line-clamp-2 w-18 px-0.5 text-center text-xs leading-tight font-medium ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
              style={{
                textShadow: isDark
                  ? "0 0 2px #000, 0 0 2px #000, 1px 1px 1px #000, -1px -1px 1px #000"
                  : "0 0 2px #fff, 0 0 2px #fff, 1px 1px 1px #fff, -1px -1px 1px #fff",
              }}
            >
              {app.name}
            </span>
          </motion.div>
        );
      })}

      {desktopFolders.map((folder) => (
        <div
          key={folder.id}
          className={`absolute hidden cursor-pointer select-none md:flex flex-col items-center justify-start rounded-md active:scale-95 ${
            hoverFolderId === folder.id
              ? isDark
                ? "bg-white/25 outline outline-white/50"
                : "bg-black/15 outline outline-black/25"
              : isDark
                ? "hover:bg-white/10"
                : "hover:bg-black/5"
          }`}
          style={{
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            left: `${(folder.defaultCol ?? 0) * gridSize}px`,
            top: `${(folder.defaultRow ?? 0) * gridSize}px`,
            zIndex: 10,
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setIconMenu(null);
            setFolderMenu(null);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            openFolderInExplorer(folder.id);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const pos = clampMenuPosition(e.clientX, e.clientY, 220, 280);
            setIconMenu(null);
            setFolderMenu({ ...pos, folderId: folder.id });
          }}
        >
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-3xl text-[#f7b731]">
            <IoFolderOutline />
          </div>
          <span
            className={`mt-1 line-clamp-2 w-18 px-0.5 text-center text-xs leading-tight font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
            style={{
              textShadow: isDark
                ? "0 0 2px #000, 0 0 2px #000, 1px 1px 1px #000, -1px -1px 1px #000"
                : "0 0 2px #fff, 0 0 2px #fff, 1px 1px 1px #fff, -1px -1px 1px #fff",
            }}
          >
            {folder.name}
          </span>
        </div>
      ))}

      {iconMenu && (
        <ContextMenu
          x={iconMenu.x}
          y={iconMenu.y}
          items={iconMenuItems(iconMenu.appId)}
          onClose={() => setIconMenu(null)}
        />
      )}

      {folderMenu && (
        <ContextMenu
          x={folderMenu.x}
          y={folderMenu.y}
          items={folderMenuItems(folderMenu.folderId)}
          onClose={() => setFolderMenu(null)}
        />
      )}

      {renameState && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setRenameState(null)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className={`w-full max-w-sm rounded-xl border p-4 shadow-2xl ${
              isDark
                ? "border-white/10 bg-[#2c2c2c] text-white"
                : "border-black/10 bg-white text-neutral-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-sm font-semibold">Rename</h3>
            <input
              autoFocus
              value={renameState.name}
              onChange={(e) =>
                setRenameState({ ...renameState, name: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameFolder(renameState.folderId, renameState.name);
                  setRenameState(null);
                }
                if (e.key === "Escape") setRenameState(null);
              }}
              className={`mb-4 w-full rounded-md px-3 py-2 text-sm outline-none ring-1 ${
                isDark
                  ? "bg-[#1c1c1c] ring-white/10"
                  : "bg-black/5 ring-black/10"
              }`}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameState(null)}
                className={`rounded-md px-3 py-1.5 text-xs ${
                  isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  renameFolder(renameState.folderId, renameState.name);
                  setRenameState(null);
                }}
                className="rounded-md bg-[#0078d4] px-3 py-1.5 text-xs text-white hover:bg-[#006cbd]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Apps;