"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  IoSearch,
  IoPhonePortraitOutline,
  IoBluetoothOutline,
  IoWifiOutline,
  IoColorPaletteOutline,
  IoAppsOutline,
  IoPersonCircleOutline,
  IoTimeOutline,
  IoGameControllerOutline,
  IoAccessibilityOutline,
  IoShieldCheckmarkOutline,
  IoArrowUpCircleOutline,
  IoDesktopOutline,
  IoVolumeHighOutline,
  IoNotificationsOutline,
  IoSunnyOutline,
  IoBatteryHalfOutline,
  IoServerOutline,
  IoTabletLandscapeOutline,
  IoPowerOutline,
  IoChevronForward,
  IoChevronBack,
  IoMailOutline,
  IoMoonOutline,
  IoLaptopOutline,
} from "react-icons/io5";
import WindowFrame from "../WindowFrame";

const NAV = [
  { id: "system", label: "System", icon: IoPhonePortraitOutline },
  { id: "bluetooth", label: "Bluetooth & devices", icon: IoBluetoothOutline },
  { id: "network", label: "Network & internet", icon: IoWifiOutline },
  { id: "personalization", label: "Personalization", icon: IoColorPaletteOutline },
  { id: "apps", label: "Apps", icon: IoAppsOutline },
  { id: "accounts", label: "Accounts", icon: IoPersonCircleOutline },
  { id: "time", label: "Time & language", icon: IoTimeOutline },
  { id: "gaming", label: "Gaming", icon: IoGameControllerOutline },
  { id: "accessibility", label: "Accessibility", icon: IoAccessibilityOutline },
  { id: "privacy", label: "Privacy & security", icon: IoShieldCheckmarkOutline },
  { id: "update", label: "Windows Update", icon: IoArrowUpCircleOutline },
] as const;

type NavId = (typeof NAV)[number]["id"];

const SYSTEM_ROWS = [
  { id: "display", title: "Display", desc: "Monitors, brightness, night light, display profile", icon: IoDesktopOutline },
  { id: "sound", title: "Sound", desc: "Volume levels, output, input, sound devices", icon: IoVolumeHighOutline },
  { id: "notifications", title: "Notifications", desc: "Alerts from apps and other senders", icon: IoNotificationsOutline },
  { id: "focus", title: "Focus", desc: "Reduce distractions", icon: IoSunnyOutline },
  { id: "power", title: "Power & battery", desc: "Sleep, battery usage, battery saver", icon: IoBatteryHalfOutline },
  { id: "storage", title: "Storage", desc: "Storage space, drives, configuration rules", icon: IoServerOutline },
  { id: "nearby", title: "Nearby sharing", desc: "Share content with nearby devices", icon: IoTabletLandscapeOutline },
  { id: "multitasking", title: "Multitasking", desc: "Snap windows, desktops, task switching", icon: IoTabletLandscapeOutline },
  { id: "activation", title: "Activation", desc: "Activation state, subscriptions, product key", icon: IoShieldCheckmarkOutline },
  { id: "troubleshoot", title: "Troubleshoot", desc: "Recommended troubleshooters, preferences", icon: IoAppsOutline },
  { id: "recovery", title: "Recovery", desc: "Reset, advanced startup, go back", icon: IoPowerOutline },
  { id: "projecting", title: "Projecting to this PC", desc: "Permissions, pairing PIN, discoverability", icon: IoDesktopOutline },
] as const;

type SearchHit =
  | { kind: "nav"; id: NavId; label: string }
  | { kind: "system"; id: string; label: string; desc: string };

function ThemePicker({ isDark }: { isDark: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-24 animate-pulse rounded-xl ${
          isDark ? "bg-[#2d2d2d]" : "bg-black/5"
        }`}
      />
    );
  }

  const current = theme ?? "system";
  const options = [
    { id: "light", label: "Light", icon: IoSunnyOutline },
    { id: "dark", label: "Dark", icon: IoMoonOutline },
    { id: "system", label: "System", icon: IoLaptopOutline },
  ] as const;

  return (
    <div
      className={`overflow-hidden rounded-xl ${
        isDark ? "bg-[#2d2d2d]" : "bg-black/5"
      }`}
    >
      <div
        className={`border-b px-4 py-3 ${
          isDark ? "border-white/5" : "border-black/5"
        }`}
      >
        <div className="text-sm font-medium">Theme</div>
        <div className={`text-xs ${isDark ? "text-white/40" : "text-black/40"}`}>
          Current: {resolvedTheme ?? current}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = current === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-xs transition ${
                active
                  ? "border-[#60cdff] bg-[#60cdff]/15"
                  : isDark
                    ? "border-white/10 text-white/70 hover:bg-white/5"
                    : "border-black/10 text-black/70 hover:bg-black/5"
              }`}
            >
              <Icon className="text-xl" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SystemHome({
  onOpen,
  isDark,
}: {
  onOpen: (id: string) => void;
  isDark: boolean;
}) {
  const card = isDark ? "bg-[#2d2d2d]" : "bg-black/5";
  const muted = isDark ? "text-white/40" : "text-black/40";
  const hover = isDark ? "hover:bg-white/5" : "hover:bg-black/5";

  return (
    <div className="@container flex w-full max-w-4xl flex-col gap-3">
      <div className="flex flex-col gap-2 @min-[520px]:flex-row @min-[520px]:flex-wrap">
        <div className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-4 py-4 ${card}`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0078d4] text-2xl text-white">
            <IoDesktopOutline />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">Iliawm-PC</div>
            <button type="button" className="text-xs text-[#0078d4] hover:underline">
              Rename
            </button>
          </div>
        </div>

        <button
          type="button"
          className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left ${card} ${isDark ? "hover:bg-[#323232]" : "hover:bg-black/10"}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0078d4]/15 text-[#0078d4]">
            <IoMailOutline className="text-lg" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium">Microsoft 365</div>
            <div className={`truncate text-xs ${muted}`}>View benefits</div>
          </div>
        </button>

        <button
          type="button"
          className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left ${card} ${isDark ? "hover:bg-[#323232]" : "hover:bg-black/10"}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0078d4]/15 text-[#0078d4]">
            <IoArrowUpCircleOutline className="text-lg" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium">Windows Update</div>
            <div className={`truncate text-xs ${muted}`}>You&apos;re up to date</div>
          </div>
        </button>
      </div>

      <div className={`overflow-hidden rounded-xl ${card}`}>
        {SYSTEM_ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onOpen(row.id)}
              className={`flex w-full items-center gap-3 border-t px-3.5 py-3 text-left first:border-t-0 ${hover} ${
                isDark ? "border-white/5" : "border-black/5"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm ${
                  isDark ? "bg-[#3d3d3d] text-[#9ecbff]" : "bg-black/5 text-[#0078d4]"
                }`}
              >
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{row.title}</div>
                <div className={`truncate text-xs ${muted}`}>{row.desc}</div>
              </div>
              <IoChevronForward className={`shrink-0 text-xs ${muted}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SystemDetail({
  id,
  onBack,
  isDark,
}: {
  id: string;
  onBack: () => void;
  isDark: boolean;
}) {
  const row = SYSTEM_ROWS.find((r) => r.id === id);
  return (
    <div className="flex w-full max-w-4xl flex-col gap-3">
      <button
        type="button"
        onClick={onBack}
        className={`flex w-fit items-center gap-1 rounded-md px-1 py-1 text-sm ${
          isDark ? "text-white/70 hover:bg-white/5" : "text-black/70 hover:bg-black/5"
        }`}
      >
        <IoChevronBack />
        System
      </button>
      <h2 className="text-2xl font-semibold">{row?.title ?? "Settings"}</h2>
      <div
        className={`rounded-xl px-4 py-3 text-sm ${
          isDark ? "bg-[#2d2d2d] text-white/60" : "bg-black/5 text-black/60"
        }`}
      >
        Portfolio preview for {row?.title}.
      </div>
    </div>
  );
}

export default function Settings({
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

  const [section, setSection] = useState<NavId>("system");
  const [systemPage, setSystemPage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const current = NAV.find((n) => n.id === section);

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as SearchHit[];
    const hits: SearchHit[] = [];
    for (const n of NAV) {
      if (n.label.toLowerCase().includes(q) || n.id.includes(q)) {
        hits.push({ kind: "nav", id: n.id, label: n.label });
      }
    }
    for (const r of SYSTEM_ROWS) {
      if (
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.id.includes(q)
      ) {
        hits.push({ kind: "system", id: r.id, label: r.title, desc: r.desc });
      }
    }
    return hits;
  }, [query]);

  const openSection = (id: NavId) => {
    setSection(id);
    setSystemPage(null);
    setQuery("");
    setNavOpen(false);
  };

  const openSystem = (id: string) => {
    setSection("system");
    setSystemPage(id);
    setQuery("");
    setNavOpen(false);
  };

  const shell = isDark ? "bg-[#202020] text-white" : "bg-[#f3f3f3] text-neutral-900";
  const aside = isDark
    ? "border-white/10 bg-[#1c1c1c]"
    : "border-black/10 bg-white";
  const searchBox = isDark
    ? "bg-[#2b2b2b] ring-white/10"
    : "bg-black/5 ring-black/10";
  const navActive = isDark ? "bg-[#2b2b2b]" : "bg-black/8";
  const navIdle = isDark
    ? "text-white/70 hover:bg-white/5 hover:text-white"
    : "text-black/70 hover:bg-black/5 hover:text-black";
  const panel = isDark ? "bg-[#2d2d2d]" : "bg-black/5";
  const muted = isDark ? "text-white/40" : "text-black/40";

  return (
    <WindowFrame
      title="Settings"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
      defaultWidth={1000}
      defaultHeight={640}
    >
      <div
        className={`relative -m-3 flex h-full min-h-96 overflow-hidden overflow-x-hidden font-[Segoe_UI,Tahoma,sans-serif] ${shell}`}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {navOpen && (
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          />
        )}

        <aside
          className={`absolute z-30 flex h-full w-64 max-w-[85%] shrink-0 flex-col overflow-x-hidden border-r px-2 py-3 transition-transform lg:static lg:w-64 lg:max-w-none lg:translate-x-0 ${aside} ${
            navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <button
            type="button"
            className={`mb-2 flex items-center gap-3 rounded-md px-2 py-2 text-left ${
              isDark ? "hover:bg-white/5" : "hover:bg-black/5"
            }`}
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image src="/pfp/me.jpg" alt="User" fill className="object-cover" sizes="36px" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">Iliawm</div>
              <div className={`truncate text-xs ${muted}`}>local account</div>
            </div>
          </button>

          <div className={`mb-2 flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${searchBox}`}>
            <IoSearch className={`shrink-0 text-sm ${muted}`} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a setting"
              className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
            />
          </div>

          <nav className="hide-scrollbar flex flex-1 flex-col gap-px overflow-x-hidden overflow-y-auto">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = section === item.id && !query;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openSection(item.id)}
                  className={`relative flex items-center gap-3 rounded-md py-2 pr-3 pl-3 text-left text-sm ${
                    active ? navActive : navIdle
                  }`}
                >
                  {active && (
                    <span className="absolute top-1/2 left-0 h-4 w-0.75 -translate-y-1/2 rounded-r-sm bg-[#60cdff]" />
                  )}
                  <Icon className="shrink-0 text-base" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="hide-scrollbar flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className={`rounded-md px-2 py-1 text-lg lg:hidden ${
                isDark ? "hover:bg-white/10" : "hover:bg-black/5"
              }`}
              aria-label="Open settings menu"
            >
              ☰
            </button>
            <h1 className="truncate text-2xl font-semibold tracking-tight lg:text-3xl">
              {query
                ? "Search results"
                : systemPage
                  ? SYSTEM_ROWS.find((r) => r.id === systemPage)?.title
                  : current?.label ?? "Settings"}
            </h1>
          </div>

          {query.trim() ? (
            <div className={`w-full max-w-4xl overflow-hidden rounded-xl ${panel}`}>
              {searchHits.length === 0 ? (
                <div className={`px-4 py-6 text-sm ${muted}`}>
                  No results for &quot;{query}&quot;
                </div>
              ) : (
                searchHits.map((hit) => (
                  <button
                    key={`${hit.kind}-${hit.id}`}
                    type="button"
                    onClick={() => {
                      if (hit.kind === "nav") openSection(hit.id);
                      else openSystem(hit.id);
                    }}
                    className={`flex w-full items-center gap-3 border-t px-3.5 py-3 text-left first:border-t-0 ${
                      isDark
                        ? "border-white/5 hover:bg-white/5"
                        : "border-black/5 hover:bg-black/5"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{hit.label}</div>
                      <div className={`truncate text-xs ${muted}`}>
                        {hit.kind === "system" ? hit.desc : "Settings category"}
                      </div>
                    </div>
                    <IoChevronForward className={`shrink-0 ${muted}`} />
                  </button>
                ))
              )}
            </div>
          ) : section === "system" ? (
            systemPage ? (
              <SystemDetail id={systemPage} onBack={() => setSystemPage(null)} isDark={isDark} />
            ) : (
              <SystemHome onOpen={openSystem} isDark={isDark} />
            )
          ) : section === "personalization" ? (
            <div className="flex w-full max-w-4xl flex-col gap-3">
              <ThemePicker isDark={isDark} />
            </div>
          ) : (
            <div className={`w-full max-w-4xl rounded-xl px-4 py-4 text-sm ${panel} ${muted}`}>
              {current?.label} — portfolio preview
            </div>
          )}
        </main>
      </div>
    </WindowFrame>
  );
}