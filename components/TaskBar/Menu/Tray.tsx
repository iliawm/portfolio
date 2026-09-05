"use client";

import Image from "next/image";
import { IoIosArrowUp } from "react-icons/io";
import { useAppsStore } from "@/store/useAppsStore";

const Tray = ({ tray }: { tray: boolean }) => {
  const apps = useAppsStore((s) => s.apps);
  const openApp = useAppsStore((s) => s.openApp);
  const openApps = apps.filter((app) => app.open);

  const cols = Math.min(Math.max(openApps.length, 1), 3);
  const rows = Math.ceil(openApps.length / 3) || 1;

  return (
    <div className="relative flex h-full items-center ">
      {tray && (
        <div className="absolute right-0 bottom-14 z-50 min-w-45 mb-2 rounded-xl border border-white/10 bg-[#2c2c2c]/95 p-2 shadow-2xl backdrop-blur-xl">
          {openApps.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-white/50">
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
                  className="flex w-14 cursor-pointer flex-col items-center gap-1 rounded-md px-1 py-2 hover:bg-white/10"
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
                  <span className="w-full truncate text-center text-[11px] leading-tight text-white/90">
                    {app.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex h-full items-center px-2 transition-all duration-200 ease-in-out hover:bg-gray-600">
        <div
          className={`transition-transform duration-200 ${
            tray ? "rotate-180" : ""
          }`}
        >
          <IoIosArrowUp />
        </div>
      </div>
    </div>
  );
};

export default Tray;