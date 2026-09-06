"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  IoWifi,
  IoBluetooth,
  IoAirplane,
  IoMoon,
  IoSunny,
  IoBatteryHalf,
  IoVolumeHigh,
  IoAccessibility,
  IoLaptopOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useAppsStore } from "@/store/useAppsStore";

function Tile({
  icon,
  label,
  active,
  onClick,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-18 flex-col items-start justify-between rounded-xl px-3 py-2 text-left transition ${
        active
          ? "bg-[#60cdff] text-black"
          : isDark
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-black/5 text-neutral-900 hover:bg-black/10"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium leading-tight">{label}</span>
    </button>
  );
}

export default function ControlCenter({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const openApp = useAppsStore((s) => s.openApp);
  const [mounted, setMounted] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(false);
  const [plane, setPlane] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open) return null;

  const isDark = mounted && resolvedTheme !== "light";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-transparent"
        onClick={onClose}
        aria-label="Close control center"
      />
      <div
        className={`absolute right-2 bottom-16 z-50 w-88 overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl ${
          isDark
            ? "border-white/10 bg-[#2c2c2c]/95 text-white"
            : "border-black/10 bg-white/95 text-neutral-900"
        }`}
      >
        <div className="grid grid-cols-2 gap-2">
          <Tile isDark={isDark} icon={<IoWifi />} label="Wi-Fi" active={wifi} onClick={() => setWifi((v) => !v)} />
          <Tile isDark={isDark} icon={<IoBluetooth />} label="Bluetooth" active={bt} onClick={() => setBt((v) => !v)} />
          <Tile isDark={isDark} icon={<IoAirplane />} label="Airplane mode" active={plane} onClick={() => setPlane((v) => !v)} />
          <Tile
            isDark={isDark}
            icon={isDark ? <IoMoon /> : <IoSunny />}
            label={isDark ? "Dark" : "Light"}
            active={isDark}
            onClick={() => {
              if (!mounted) return;
              setTheme(isDark ? "light" : "dark");
            }}
          />
          <Tile isDark={isDark} icon={<IoBatteryHalf />} label="Battery saver" />
          <Tile isDark={isDark} icon={<IoAccessibility />} label="Accessibility" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <IoSunny className={`shrink-0 text-base ${isDark ? "text-white/70" : "text-black/50"}`} />
          <input
            type="range"
            min={0}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="h-1 w-full cursor-pointer accent-[#60cdff]"
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <IoVolumeHigh className={`shrink-0 text-base ${isDark ? "text-white/70" : "text-black/50"}`} />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-full cursor-pointer accent-[#60cdff]"
          />
        </div>

        <div
          className={`mt-4 flex items-center justify-between border-t pt-3 ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className={`flex items-center gap-2 text-xs ${isDark ? "text-white/60" : "text-black/50"}`}>
            <IoLaptopOutline />
            <span>{mounted ? (theme === "system" ? "System" : theme) : "…"}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              openApp("settings");
              onClose();
            }}
            className={`rounded-md p-2 ${
              isDark
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-black/50 hover:bg-black/5 hover:text-black"
            }`}
            title="Settings"
          >
            <IoSettingsOutline className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );
}