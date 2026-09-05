"use client";

import { useState } from "react";
import Image from "next/image";
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
  IoCloudOutline,
  IoMailOutline,
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
  { title: "Display", desc: "Monitors, brightness, night light, display profile", icon: IoDesktopOutline },
  { title: "Sound", desc: "Volume levels, output, input, sound devices", icon: IoVolumeHighOutline },
  { title: "Notifications", desc: "Alerts from apps and other senders", icon: IoNotificationsOutline },
  { title: "Focus", desc: "Reduce distractions", icon: IoSunnyOutline },
  { title: "Power & battery", desc: "Sleep, battery usage, battery saver", icon: IoBatteryHalfOutline },
  { title: "Storage", desc: "Storage space, drives, configuration rules", icon: IoServerOutline },
  { title: "Nearby sharing", desc: "Share content with nearby devices", icon: IoTabletLandscapeOutline },
  { title: "Multitasking", desc: "Snap windows, desktops, task switching", icon: IoTabletLandscapeOutline },
  { title: "Activation", desc: "Activation state, subscriptions, product key", icon: IoShieldCheckmarkOutline },
  { title: "Troubleshoot", desc: "Recommended troubleshooters, preferences", icon: IoAppsOutline },
  { title: "Recovery", desc: "Reset, advanced startup, go back", icon: IoPowerOutline },
  { title: "Projecting to this PC", desc: "Permissions, pairing PIN, discoverability", icon: IoDesktopOutline },
];

function SystemHome() {
  return (
    <div className="flex w-full max-w-205 flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex min-w-0 flex-[1.4] items-center gap-4 rounded-xl bg-[#2d2d2d]/90 px-4 py-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#0078d4] text-[28px] text-white shadow-sm">
            <IoDesktopOutline />
          </div>
          <div className="min-w-0">
            <div className="text-[18px] font-semibold leading-tight text-white">
              Iliawm-PC
            </div>
            <button
              type="button"
              className="mt-0.5 text-[12px] text-[#4cc2ff] hover:underline"
            >
              Rename
            </button>
          </div>
        </div>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#2d2d2d]/90 px-4 py-3 text-left hover:bg-[#323232]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0078d4]/20 text-[#4cc2ff]">
            <IoMailOutline className="text-lg" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-white">Microsoft 365</div>
            <div className="truncate text-[11px] text-white/45">
              View benefits
            </div>
          </div>
        </button>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#2d2d2d]/90 px-4 py-3 text-left hover:bg-[#323232]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0078d4]/20 text-[#4cc2ff]">
            <IoArrowUpCircleOutline className="text-lg" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-white">Windows Update</div>
            <div className="truncate text-[11px] text-white/45">
              You&apos;re up to date
            </div>
          </div>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-[#2d2d2d]/90">
        {SYSTEM_ROWS.map((row, i) => {
          const Icon = row.icon;
          return (
            <button
              key={row.title}
              type="button"
              className={`flex w-full items-center gap-3 px-3.5 py-3 text-left hover:bg-white/4 ${
                i > 0 ? "border-t border-white/5" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#3d3d3d] text-[15px] text-[#9ecbff]">
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-white">
                  {row.title}
                </div>
                <div className="truncate text-[11px] leading-snug text-white/40">
                  {row.desc}
                </div>
              </div>
              <IoChevronForward className="shrink-0 text-[12px] text-white/25" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="w-full max-w-205 overflow-hidden rounded-xl bg-[#2d2d2d]/90">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <div className="text-[13px] text-white">{title}</div>
          <div className="text-[11px] text-white/40">Portfolio preview</div>
        </div>
        <div className="relative h-5 w-10 rounded-full bg-[#0078d4]">
          <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow" />
        </div>
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
  const [section, setSection] = useState<NavId>("system");
  const [query, setQuery] = useState("");
  const current = NAV.find((n) => n.id === section);

  return (
    <WindowFrame
      title="Settings"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
      defaultWidth={1000}
      defaultHeight={640}
    >
      <div className="-m-3 flex h-full min-h-130 overflow-hidden bg-[#1f1f1f]/85 font-[Segoe_UI,Segoe_UI_Variable,Tahoma,sans-serif] text-white backdrop-blur-2xl">
        <aside className="flex w-70 shrink-0 flex-col border-r border-white/6 bg-[#1a1a1a]/50 px-2 py-3">
          <button
            type="button"
            className="mb-2 flex items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-white/4"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image
                src="/pfp/me.jpg"
                alt="User"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium leading-tight">
                Iliawm
              </div>
              <div className="truncate text-[11px] text-white/40">
                local account
              </div>
            </div>
          </button>

          <div className="mb-2 flex items-center gap-2 rounded-full bg-[#2b2b2b] px-3 py-1.5 ring-1 ring-white/10">
            <IoSearch className="text-[14px] text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a setting"
              className="w-full bg-transparent text-[12px] text-white placeholder:text-white/35 focus:outline-none"
            />
          </div>

          <nav className="flex flex-1 flex-col gap-px overflow-y-auto">
            {NAV.filter(
              (n) =>
                !query ||
                n.label.toLowerCase().includes(query.toLowerCase())
            ).map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`relative flex items-center gap-3 rounded-md py-2 pr-3 pl-3 text-left text-[13px] ${
                    active
                      ? "bg-[#2b2b2b] text-white"
                      : "text-white/70 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute top-1/2 left-0 h-4 w-0.75 -translate-y-1/2 rounded-r-sm bg-[#60cdff]" />
                  )}
                  <Icon className="text-[15px] opacity-90" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
          <h1 className="mb-4 text-[28px] font-semibold tracking-tight text-white">
            {current?.label ?? "Settings"}
          </h1>

          {section === "system" ? (
            <SystemHome />
          ) : (
            <PlaceholderSection title={current?.label ?? "Settings"} />
          )}
        </main>
      </div>
    </WindowFrame>
  );
}