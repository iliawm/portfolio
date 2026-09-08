"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";

export type ContextItem = {
  label: string;
  hint?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  dividerAfter?: boolean;
  children?: ContextItem[];
};

export default function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextItem[];
  onClose: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [openSub, setOpenSub] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const panel = isDark
    ? "border-white/10 bg-[#2c2c2c]/95 text-white"
    : "border-black/10 bg-[#f2f2f2]/95 text-neutral-900";
  const hover = isDark ? "hover:bg-white/10" : "hover:bg-black/6";
  const muted = isDark ? "text-white/35" : "text-black/35";
  const disabledCls = isDark ? "text-white/30" : "text-black/30";
  const divider = isDark ? "bg-white/10" : "bg-black/8";

  const node = (
    <div
      className={`fixed z-100 min-w-48 rounded-lg border p-1 shadow-2xl backdrop-blur-2xl ${panel}`}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseLeave={() => setOpenSub(null)}
    >
      {items.map((item, i) => {
        const key = `${item.label}-${i}`;
        const hasChildren = !!item.children?.length;

        return (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => {
              if (hasChildren && !item.disabled) setOpenSub(key);
              else setOpenSub(null);
            }}
          >
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled || hasChildren) return;
                item.onClick?.();
                onClose();
              }}
              className={`flex h-8 w-full items-center justify-between gap-6 rounded-md px-3 text-left text-xs tracking-tight ${
                item.disabled
                  ? `cursor-default ${disabledCls}`
                  : item.danger
                    ? "cursor-pointer text-red-500 hover:bg-red-500/15"
                    : `cursor-pointer ${hover}`
              } ${openSub === key ? (isDark ? "bg-white/10" : "bg-black/6") : ""}`}
            >
              <span className="whitespace-nowrap">{item.label}</span>
              {item.hint ? (
                <span className={`text-[10px] ${muted}`}>{item.hint}</span>
              ) : null}
            </button>

            {hasChildren && openSub === key && (
              <div
                className={`absolute top-0 left-full z-100 ml-1 min-w-44 rounded-lg border p-1 shadow-2xl backdrop-blur-2xl ${panel}`}
                onMouseEnter={() => setOpenSub(key)}
              >
                {item.children!.map((sub, j) => (
                  <div key={`${sub.label}-${j}`}>
                    <button
                      type="button"
                      disabled={sub.disabled}
                      onClick={() => {
                        if (sub.disabled) return;
                        sub.onClick?.();
                        onClose();
                      }}
                      className={`flex h-8 w-full items-center justify-between gap-6 rounded-md px-3 text-left text-xs ${
                        sub.disabled
                          ? `cursor-default ${disabledCls}`
                          : `cursor-pointer ${hover}`
                      }`}
                    >
                      <span>{sub.label}</span>
                      {sub.hint ? (
                        <span className={`text-[10px] ${muted}`}>{sub.hint}</span>
                      ) : null}
                    </button>
                    {sub.dividerAfter ? (
                      <div className={`mx-2 my-1 h-px ${divider}`} />
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {item.dividerAfter ? (
              <div className={`mx-2 my-1 h-px ${divider}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}

export function clampMenuPosition(
  clientX: number,
  clientY: number,
  menuW = 200,
  menuH = 280
) {
  const pad = 8;
  const taskbar = 60;
  let x = clientX;
  let y = clientY;
  if (x + menuW > window.innerWidth - pad) x = window.innerWidth - menuW - pad;
  if (y + menuH > window.innerHeight - taskbar - pad)
    y = window.innerHeight - menuH - taskbar - pad;
  if (x < pad) x = pad;
  if (y < pad) y = pad;
  return { x, y };
}