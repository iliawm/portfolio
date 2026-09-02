"use client";

import { create } from "zustand";
import { DESKTOP_APPS, type AppConfig } from "@/config/Apps/config";

interface AppsState {
  apps: AppConfig[];
  selectedAppIds: string[];
  setSelectedAppIds: (ids: string[]) => void;
  openApp: (id: string) => void;
  closeApp: (id: string) => void;
  toggleApp: (id: string) => void;
  updateAppPosition: (id: string, col: number, row: number) => void;
  updateMultiplePositions: (
    updates: { id: string; col: number; row: number }[]
  ) => void;
  getOpenApps: () => AppConfig[];
  getPinnedToStart: () => AppConfig[];
}

export const useAppsStore = create<AppsState>((set, get) => ({
  apps: DESKTOP_APPS.map((app) => ({ ...app })),
  selectedAppIds: [],

  setSelectedAppIds: (ids) => set({ selectedAppIds: ids }),

  openApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, open: true, lastOpened: true }
          : app
      ),
    })),

  closeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, open: false } : app
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
            }
          : app
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