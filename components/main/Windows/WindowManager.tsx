"use client";

import { useAppsStore } from "@/store/useAppsStore";
import { APP_WINDOWS } from "./appRegistry";

export default function WindowManager() {
  const apps = useAppsStore((s) => s.apps);
  const closeApp = useAppsStore((s) => s.closeApp);
  const minimizeApp = useAppsStore((s) => s.minimizeApp);

  const openApps = apps.filter((a) => a.open);

  return (
    <>
      {openApps.map((app) => {
        const Win = APP_WINDOWS[app.id];
        if (!Win) return null;
        return (
          <Win
            key={app.id}
            id={app.id}
            onClose={() => closeApp(app.id)}
            onMinimize={() => minimizeApp(app.id)}
            minimized={!!app.minimized}
          />
        );
      })}
    </>
  );
}