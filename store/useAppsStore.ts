"use client";

import { create } from "zustand";
import { DESKTOP_APPS, type AppConfig } from "@/config/Apps/config";

export type AppConfigWithWindow = AppConfig & {
  minimized?: boolean;
};

interface AppsState {
  apps: AppConfigWithWindow[];
  selectedAppIds: string[];
  setSelectedAppIds: (ids: string[]) => void;
  openApp: (id: string) => void;
  closeApp: (id: string) => void;
  toggleApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  restoreApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updateAppPosition: (id: string, col: number, row: number) => void;
  updateMultiplePositions: (
    updates: { id: string; col: number; row: number }[]
  ) => void;
  getOpenApps: () => AppConfigWithWindow[];
  getPinnedToStart: () => AppConfigWithWindow[];
}

export const useAppsStore = create<AppsState>((set, get) => ({
  apps: DESKTOP_APPS.map((app) => ({ ...app, minimized: false })),
  selectedAppIds: [],

  setSelectedAppIds: (ids) => set({ selectedAppIds: ids }),

  openApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, open: true, lastOpened: true, minimized: false }
          : app
      ),
    })),

  closeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, open: false, minimized: false }
          : app
      ),
    })),

  toggleApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              open: !app.open,
              lastOpened: !app.open ? true : app.lastOpened,
              minimized: false,
            }
          : app
      ),
    })),

  minimizeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, minimized: true } : app
      ),
    })),

  restoreApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, minimized: false } : app
      ),
    })),

  toggleMinimize: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, minimized: !app.minimized } : app
      ),
    })),

  updateAppPosition: (id, col, row) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, defaultCol: col, defaultRow: row }
          : app
      ),
    })),

  updateMultiplePositions: (updates) =>
    set((state) => ({
      apps: state.apps.map((app) => {
        const found = updates.find((u) => u.id === app.id);
        return found
          ? { ...app, defaultCol: found.col, defaultRow: found.row }
          : app;
      }),
    })),

  getOpenApps: () => get().apps.filter((app) => app.open),

  getPinnedToStart: () =>
    get().apps.filter((app) => app.isPinnedtoStart),
}));