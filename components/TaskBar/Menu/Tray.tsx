"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useAppsStore } from "@/store/useAppsStore";

const Tray = ({ tray }: { tray: boolean }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const apps = useAppsStore((s) => s.apps);
  const openApp = useAppsStore((s) => s.openApp);
  const openApps = apps.filter((app) => app.open);

  if (!tray) return null;

  return (
    <div
      className={`absolute right-0 bottom-16 z-50 min-w-44 rounded-xl border p-2 shadow-2xl backdrop-blur-xl ${
        isDark
          ? "border-white/10 bg-[#2c2c2c]/95 text-white"
          : "border-black/10 bg-white/95 text-neutral-900"
      }`}
    >
      {openApps.length === 0 ? (
        <div className={`px-3 py-4 text-center text-xs ${isDark ? "text-white/50" : "text-black/40"}`}>
          No open apps
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-1">
          {openApps.map((app) => (
            <li
              key={app.id}
              role="button"
              tabIndex={0}
              onClick={() => openApp(app.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") openApp(app.id);
              }}
              className={`flex w-14 cursor-pointer flex-col items-center gap-1 rounded-md px-1 py-2 ${
                isDark ? "hover:bg-white/10" : "hover:bg-black/5"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                {!app.isIconpath ? (
                  <span className="text-xl leading-none">{app.icon}</span>
                ) : (
                  <Image
                    src={app.icon}
                    width={28}
                    height={28}
                    alt={app.id}
                    className="h-7 w-7 object-contain"
                  />
                )}
              </div>
              <span className="w-full truncate text-center text-xs leading-tight">
                {app.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tray;