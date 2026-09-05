"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_W = 320;
const MIN_H = 200;
const TASKBAR_H = 60;

export default function WindowFrame({
  title,
  onClose,
  onMinimize,
  minimized,
  children,
}: {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  minimized?: boolean;
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState(40);
  const [maximized, setMaximized] = useState(false);

  const pos = useRef({ x: 140, y: 100, w: 640, h: 420 });
  const preMax = useRef({ x: 140, y: 100, w: 640, h: 420 });

  const drag = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const resize = useRef<{
    dir: ResizeDir;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const apply = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    const { x, y, w, h } = pos.current;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    apply();
  }, [apply]);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (drag.current && !maximized) {
        const d = drag.current;
        pos.current.x = d.origX + (e.clientX - d.startX);
        pos.current.y = d.origY + (e.clientY - d.startY);
        apply();
        return;
      }

      if (resize.current && !maximized) {
        const r = resize.current;
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;

        let x = r.origX;
        let y = r.origY;
        let w = r.origW;
        let h = r.origH;

        if (r.dir.includes("e")) {
          w = Math.max(MIN_W, r.origW + dx);
        }
        if (r.dir.includes("w")) {
          w = Math.max(MIN_W, r.origW - dx);
          x = r.origX + (r.origW - w);
        }
        if (r.dir.includes("s")) {
          h = Math.max(MIN_H, r.origH + dy);
        }
        if (r.dir.includes("n")) {
          h = Math.max(MIN_H, r.origH - dy);
          y = r.origY + (r.origH - h);
        }

        pos.current = { x, y, w, h };
        apply();
      }
    },
    [apply, maximized]
  );

  const onUp = useCallback(() => {
    drag.current = null;
    resize.current = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }, [onMove]);

  const startDrag = (e: React.PointerEvent) => {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.current.x,
      origY: pos.current.y,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (dir: ResizeDir, e: React.PointerEvent) => {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    resize.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.current.x,
      origY: pos.current.y,
      origW: pos.current.w,
      origH: pos.current.h,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const toggleMaximize = () => {
    if (!maximized) {
      preMax.current = { ...pos.current };
      pos.current = {
        x: 0,
        y: 0,
        w: window.innerWidth,
        h: window.innerHeight - TASKBAR_H,
      };
      setMaximized(true);
    } else {
      pos.current = { ...preMax.current };
      setMaximized(false);
    }
    apply();
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onMove, onUp]);

  if (minimized) return null;

  const handle = "absolute z-50";

  return (
    <div
      ref={frameRef}
      className="fixed flex flex-col overflow-hidden border border-white/10 bg-[#1e1e1e]/95 shadow-2xl backdrop-blur-xl"
      style={{
        left: pos.current.x,
        top: pos.current.y,
        width: pos.current.w,
        height: pos.current.h,
        zIndex: z,
        borderRadius: maximized ? 0 : 8,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setZ((v) => v + 1);
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e)=>{
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <div
        onPointerDown={startDrag}
        onDoubleClick={toggleMaximize}
        className="flex h-9 shrink-0 cursor-grab items-center justify-between bg-white/5 px-2 active:cursor-grabbing  "
      >
        <span className="select-none truncate px-1 text-xs text-white/80">
          {title}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex h-7 w-10 items-center justify-center rounded-sm text-white/70 hover:bg-white/10"
          >
            <span className="mb-1 text-lg leading-none">─</span>
          </button>
          <button
            type="button"
            title={maximized ? "Restore" : "Maximize"}
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex h-7 w-10 items-center justify-center rounded-sm text-white/70 hover:bg-white/10"
          >
            {maximized ? (
              <span className="text-[15px]  h-fit leading-none">❐</span>
            ) : (
              <span className="text-[20px] mb-1 h-fit leading-none">☐</span>
            )}
          </button>
          <button
            type="button"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex h-7 w-10 items-center justify-center rounded-sm text-white/70 hover:bg-red-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3 text-sm text-white hide-scrollbar">
        {children}
      </div>

      {!maximized && (
        <>
          <div
            className={`${handle} top-0 right-2 left-2 h-1 cursor-n-resize`}
            onPointerDown={(e) => startResize("n", e)}
          />
          <div
            className={`${handle} right-2 bottom-0 left-2 h-1 cursor-s-resize`}
            onPointerDown={(e) => startResize("s", e)}
          />
          <div
            className={`${handle} top-2 bottom-2 left-0 w-1 cursor-w-resize`}
            onPointerDown={(e) => startResize("w", e)}
          />
          <div
            className={`${handle} top-2 right-0 bottom-2 w-1 cursor-e-resize`}
            onPointerDown={(e) => startResize("e", e)}
          />
          <div
            className={`${handle} top-0 left-0 h-3 w-3 cursor-nw-resize`}
            onPointerDown={(e) => startResize("nw", e)}
          />
          <div
            className={`${handle} top-0 right-0 h-3 w-3 cursor-ne-resize`}
            onPointerDown={(e) => startResize("ne", e)}
          />
          <div
            className={`${handle} bottom-0 left-0 h-3 w-3 cursor-sw-resize`}
            onPointerDown={(e) => startResize("sw", e)}
          />
          <div
            className={`${handle} right-0 bottom-0 h-3 w-3 cursor-se-resize`}
            onPointerDown={(e) => startResize("se", e)}
          />
        </>
      )}
    </div>
  );
}