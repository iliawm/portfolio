"use client";

import { useTheme } from "next-themes";

export type ContextItem = {
  label: string;
  hint?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  dividerAfter?: boolean;
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

  return (
    <div
      className={`fixed z-100 min-w-48 overflow-hidden rounded-lg border p-1 shadow-2xl backdrop-blur-2xl ${
        isDark
          ? "border-white/10 bg-[#2c2c2c]/92 text-white"
          : "border-black/8 bg-[#f2f2f2]/95 text-neutral-900"
      }`}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {items.map((item, i) => (
        <div key={`${item.label}-${i}`}>
          <button
            type="button"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.();
              onClose();
            }}
            className={`flex h-8 w-full items-center justify-between gap-6 rounded-md px-3 text-left text-xs tracking-tight ${
              item.disabled
                ? isDark
                  ? "cursor-default text-white/30"
                  : "cursor-default text-black/30"
                : item.danger
                  ? "cursor-pointer text-red-500 hover:bg-red-500/15"
                  : isDark
                    ? "cursor-pointer hover:bg-white/10"
                    : "cursor-pointer hover:bg-black/6"
            }`}
          >
            <span className="whitespace-nowrap">{item.label}</span>
            {item.hint ? (
              <span
                className={`text-[10px] ${
                  isDark ? "text-white/35" : "text-black/35"
                }`}
              >
                {item.hint}
              </span>
            ) : null}
          </button>
          {item.dividerAfter ? (
            <div
              className={`mx-2 my-1 h-px ${
                isDark ? "bg-white/10" : "bg-black/8"
              }`}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function clampMenuPosition(
  clientX: number,
  clientY: number,
  menuW = 200,
  menuH = 160
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