"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import WindowFrame from "../WindowFrame";

const NOTE = `Ilia Bayat
Full Stack Engineer

Location: Tehran, Iran
Site:     https://www.iliawm.ir
GitHub:   https://github.com/iliawm
LinkedIn: https://www.linkedin.com/in/psychowm
Also:     Frontend Mentor · Karlancer

----------------------------------------
WHO I AM
----------------------------------------

Independent software developer focused on modern web
applications. I care about clean UI, solid architecture,
and performance — the kind of details that show when
every millisecond matters.

I run Arch Linux daily. I build with React and Next.js
on the front, and Node / databases on the back. I prefer
shipping real products, not only demos.

----------------------------------------
STACK
----------------------------------------

Frontend
  Next.js (App Router) · React · TypeScript
  Tailwind CSS · Motion / animations

Backend
  Node.js · Express
  MongoDB + Mongoose · PostgreSQL + Prisma
  Auth (Better Auth) · API routes

Also exploring
  FastAPI
  Next.js 16 — Server Components, streaming,
  caching, edge runtime

----------------------------------------
PROJECTS
----------------------------------------

  portfolio           Windows 11-style interactive portfolio OS
  ShoppingWebsite     Full-stack shop — Next.js 16, MongoDB, auth, admin
  teaching-website    E-commerce + learning platform
  Offset_ui           UI component library (Next + TS + Tailwind)
  Weather-app         React + Vite + third-party APIs
  Frontend Mentor     UI challenge solutions

Live: https://www.iliawm.ir

----------------------------------------
HOW I WORK
----------------------------------------

  1. Solve the problem.
  2. Then write the code.

Open to freelance and full-time roles where I can own
features end to end — UI, data, and deploy.

----------------------------------------
CONTACT
----------------------------------------

  github.com/iliawm
  linkedin.com/in/psychowm
  iliawm.ir
`;

type MenuId = "file" | "edit" | "format" | "view" | "help" | null;

type MenuItem = {
  label: string;
  hint?: string;
  disabled?: boolean;
  dividerAfter?: boolean;
  onClick?: () => void;
};

const MENUS: Record<Exclude<MenuId, null>, MenuItem[]> = {
  file: [
    { label: "New", hint: "Ctrl+N", disabled: true },
    { label: "Open...", hint: "Ctrl+O", disabled: true },
    { label: "Save", hint: "Ctrl+S", disabled: true },
    { label: "Save As...", disabled: true, dividerAfter: true },
    { label: "Page Setup...", disabled: true },
    { label: "Print...", hint: "Ctrl+P", disabled: true, dividerAfter: true },
    { label: "Exit" },
  ],
  edit: [
    { label: "Undo", hint: "Ctrl+Z", disabled: true, dividerAfter: true },
    { label: "Cut", hint: "Ctrl+X", disabled: true },
    { label: "Copy", hint: "Ctrl+C", disabled: true },
    { label: "Paste", hint: "Ctrl+V", disabled: true },
    { label: "Delete", hint: "Del", disabled: true, dividerAfter: true },
    { label: "Find...", hint: "Ctrl+F", disabled: true },
    { label: "Replace...", hint: "Ctrl+H", disabled: true, dividerAfter: true },
    { label: "Select All", hint: "Ctrl+A", disabled: true },
  ],
  format: [
    { label: "Word Wrap" },
    { label: "Font...", disabled: true },
  ],
  view: [
    { label: "Zoom", hint: "›", disabled: true },
    { label: "Status Bar" },
  ],
  help: [
    { label: "View Help", disabled: true, dividerAfter: true },
    { label: "About Notepad" },
  ],
};

export default function AboutMe({
  onClose,
  onMinimize,
  minimized,
}: {
  id: string;
  onClose: () => void;
  onMinimize: () => void;
  minimized?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [openMenu, setOpenMenu] = useState<MenuId>(null);
  const [wrap, setWrap] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const shell = isDark
    ? "bg-[#1e1e1e] text-[#d4d4d4]"
    : "bg-white text-neutral-900";
  const bar = isDark
    ? "border-white/10 text-white/70"
    : "border-black/10 text-black/70";
  const menuBtn = isDark ? "hover:bg-white/10" : "hover:bg-black/5";
  const menuBtnOn = isDark ? "bg-white/10" : "bg-black/8";
  const dropdown = isDark
    ? "border-white/10 bg-[#2c2c2c] text-white shadow-xl"
    : "border-black/10 bg-white text-neutral-900 shadow-xl";
  const itemHover = isDark ? "hover:bg-[#0078d4] hover:text-white" : "hover:bg-[#0078d4] hover:text-white";
  const itemMuted = isDark ? "text-white/30" : "text-black/30";
  const divider = isDark ? "bg-white/10" : "bg-black/10";
  const status = isDark
    ? "border-white/10 text-white/40"
    : "border-black/10 text-black/45";

  const runItem = (menu: Exclude<MenuId, null>, item: MenuItem) => {
    if (item.disabled) return;

    if (menu === "file" && item.label === "Exit") {
      onClose();
      return;
    }
    if (menu === "format" && item.label === "Word Wrap") {
      setWrap((v) => !v);
      setToast(`Word Wrap: ${!wrap ? "On" : "Off"}`);
      setOpenMenu(null);
      return;
    }
    if (menu === "view" && item.label === "Status Bar") {
      setShowStatus((v) => !v);
      setToast(`Status Bar: ${!showStatus ? "On" : "Off"}`);
      setOpenMenu(null);
      return;
    }
    if (menu === "help" && item.label === "About Notepad") {
      setToast("Windows Notepad — portfolio edition");
      setOpenMenu(null);
      return;
    }

    setToast(item.label);
    setOpenMenu(null);
  };

  const labels: { id: Exclude<MenuId, null>; label: string }[] = [
    { id: "file", label: "File" },
    { id: "edit", label: "Edit" },
    { id: "format", label: "Format" },
    { id: "view", label: "View" },
    { id: "help", label: "Help" },
  ];

  return (
    <WindowFrame
      title="About Me.txt - Notepad"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
      defaultWidth={520}
      defaultHeight={480}
    >
      <div
        className={`relative -m-3 flex h-full min-h-80 flex-col font-[Consolas,Cascadia_Mono,Courier_New,monospace] ${shell}`}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div
          ref={barRef}
          className={`relative flex shrink-0 gap-0 border-b px-1 py-0.5 text-[11px] ${bar}`}
        >
          {labels.map((m) => (
            <div key={m.id} className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((cur) => (cur === m.id ? null : m.id))
                }
                onMouseEnter={() => {
                  if (openMenu) setOpenMenu(m.id);
                }}
                className={`rounded-sm px-2 py-0.5 ${menuBtn} ${
                  openMenu === m.id ? menuBtnOn : ""
                }`}
              >
                {m.label}
              </button>

              {openMenu === m.id && (
                <div
                  className={`absolute top-full left-0 z-50 min-w-48 rounded-md border py-1 ${dropdown}`}
                >
                  {MENUS[m.id].map((item) => (
                    <div key={item.label}>
                      <button
                        type="button"
                        disabled={item.disabled}
                        onClick={() => runItem(m.id, item)}
                        className={`flex h-7 w-full items-center justify-between gap-8 px-3 text-left text-[11px] ${
                          item.disabled
                            ? `cursor-default ${itemMuted}`
                            : `cursor-pointer ${itemHover}`
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {(m.id === "format" &&
                            item.label === "Word Wrap" &&
                            wrap) ||
                          (m.id === "view" &&
                            item.label === "Status Bar" &&
                            showStatus)
                            ? "✓ "
                            : "  "}
                          {item.label}
                        </span>
                        {item.hint && (
                          <span className={itemMuted}>{item.hint}</span>
                        )}
                      </button>
                      {item.dividerAfter && (
                        <div className={`mx-2 my-1 h-px ${divider}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <pre
          className={`hide-scrollbar flex-1 overflow-auto p-3 text-[13px] leading-relaxed ${
            wrap ? "whitespace-pre-wrap wrap-break-word" : "whitespace-pre"
          }`}
        >
          {NOTE}
        </pre>

        {showStatus && (
          <div
            className={`flex shrink-0 items-center justify-between border-t px-3 py-0.5 text-[10px] ${status}`}
          >
            <span>Ln 1, Col 1</span>
            <span>100%</span>
            <span>Windows (CRLF)</span>
            <span>UTF-8</span>
          </div>
        )}

        {toast && (
          <div
            className={`pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-md px-3 py-1.5 text-[11px] shadow-lg ${
              isDark ? "bg-[#2c2c2c] text-white" : "bg-neutral-800 text-white"
            }`}
          >
            {toast}
          </div>
        )}
      </div>
    </WindowFrame>
  );
}