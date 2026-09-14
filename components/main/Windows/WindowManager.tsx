"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppsStore } from "@/store/useAppsStore";
import { APP_WINDOWS } from "./appRegistry";

export default function WindowManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apps = useAppsStore((s) => s.apps);
  const closeApp = useAppsStore((s) => s.closeApp);
  const minimizeApp = useAppsStore((s) => s.minimizeApp);
  const openApp = useAppsStore((s) => s.openApp);

  const AppsOpen = apps.filter((a) => a.open);

  useEffect(() => {
    if (searchParams.get("p") === "Open") {
      openApp("portfolio");
    }
  }, [searchParams, openApp]);

  return (
    <>
      {AppsOpen.map((app) => {
        const Win = APP_WINDOWS[app.id];
        if (!Win) return null;
        return (
          <Win
            key={app.id}
            id={app.id}
            onClose={() => {
              closeApp(app.id);
              if (app.id === "portfolio") {
                router.replace(window.location.pathname);
              }
            }}
            onMinimize={() => minimizeApp(app.id)}
            minimized={!!app.minimized}
          />
        );
      })}
    </>
  );
}