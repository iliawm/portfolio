"use client";

import { create } from "zustand";
import { DESKTOP_APPS, type AppConfig } from "@/config/Apps/config";

export type AppConfigWithWindow = AppConfig & {
  minimized?: boolean;
  zIndex?: number;
};

export type ExplorerFolder = {
  id: string;
  name: string;
  parentId: string | null;
  driveId: "c" | "d";
  appIds: string[];
  isOnDesktop: boolean;
  defaultCol?: number;
  defaultRow?: number;
};

export type ClipboardPayload =
  | {
      mode: "copy" | "cut";
      type: "app";
      ids: string[];
      fromFolderId?: string | null;
      fromDesktop?: boolean;
    }
  | {
      mode: "copy" | "cut";
      type: "folder";
      ids: string[];
    }
  | null;

export type ExplorerDrag =
  | { type: "app"; id: string; source: "desktop" | "explorer" }
  | { type: "folder"; id: string; source: "desktop" | "explorer" }
  | null;

const WIN_Z_MIN = 40;
const WIN_Z_MAX = 49;

interface AppsState {
  apps: AppConfigWithWindow[];
  selectedAppIds: string[];
  topZ: number;
  clipboard: ClipboardPayload;
  folders: ExplorerFolder[];
  explorerPath: string | null;
  pinnedDrives: ("c" | "d")[];
  explorerDrag: ExplorerDrag;
  setSelectedAppIds: (ids: string[]) => void;
  openApp: (id: string) => void;
  closeApp: (id: string) => void;
  toggleApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  restoreApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  focusApp: (id: string) => void;
  updateAppPosition: (id: string, col: number, row: number) => void;
  updateMultiplePositions: (
    updates: { id: string; col: number; row: number }[]
  ) => void;
  setOnDesktop: (id: string, onDesktop: boolean) => void;
  togglePinTaskbar: (id: string) => void;
  togglePinStart: (id: string) => void;
  setClipboard: (payload: ClipboardPayload) => void;
  clearClipboard: () => void;
  createFolder: (opts: {
    name: string;
    driveId: "c" | "d";
    parentId?: string | null;
    isOnDesktop?: boolean;
  }) => string;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  setFolderOnDesktop: (id: string, onDesktop: boolean) => void;
  addAppToFolder: (folderId: string, appId: string) => void;
  removeAppFromFolder: (folderId: string, appId: string) => void;
  moveAppToFolder: (
    appId: string,
    targetFolderId: string | null,
    opts?: { fromFolderId?: string | null; removeFromDesktop?: boolean }
  ) => void;
  pasteClipboard: (target: {
    folderId?: string | null;
    driveId?: "c" | "d";
  }) => void;
  setExplorerPath: (path: string | null) => void;
  openFolderInExplorer: (folderId: string) => void;
  togglePinDrive: (driveId: "c" | "d") => void;
  setExplorerDrag: (payload: ExplorerDrag) => void;
  getOpenApps: () => AppConfigWithWindow[];
  getPinnedToStart: () => AppConfigWithWindow[];
  getPinnedToTaskbar: () => AppConfigWithWindow[];
}

function nextDesktopSlot(
  apps: AppConfigWithWindow[],
  folders: ExplorerFolder[],
  skipAppId?: string,
  skipFolderId?: string
) {
  const occupied = new Set<string>();
  apps.forEach((a) => {
    if (a.isOnDesktop && a.id !== skipAppId) {
      occupied.add(`${a.defaultCol},${a.defaultRow}`);
    }
  });
  folders.forEach((f) => {
    if (f.isOnDesktop && f.id !== skipFolderId) {
      occupied.add(`${f.defaultCol ?? 0},${f.defaultRow ?? 0}`);
    }
  });
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 8; c++) {
      if (!occupied.has(`${c},${r}`)) return { col: c, row: r };
    }
  }
  return { col: 0, row: 0 };
}

export const useAppsStore = create<AppsState>((set, get) => ({
  apps: DESKTOP_APPS.map((app) => ({
    ...app,
    minimized: false,
    zIndex: WIN_Z_MIN,
  })),
  selectedAppIds: [],
  topZ: WIN_Z_MIN,
  clipboard: null,
  folders: [],
  explorerPath: null,
  pinnedDrives: ["c", "d"],
  explorerDrag: null,

  setSelectedAppIds: (ids) => set({ selectedAppIds: ids }),
  setExplorerDrag: (payload) => set({ explorerDrag: payload }),

  focusApp: (id) =>
    set((state) => {
      const nextZ = Math.min(state.topZ + 1, WIN_Z_MAX);
      return {
        topZ: nextZ,
        apps: state.apps.map((app) =>
          app.id === id ? { ...app, zIndex: nextZ } : app
        ),
      };
    }),

  openApp: (id) =>
    set((state) => {
      const nextZ = Math.min(state.topZ + 1, WIN_Z_MAX);
      return {
        topZ: nextZ,
        apps: state.apps.map((app) =>
          app.id === id
            ? {
                ...app,
                open: true,
                lastOpened: true,
                minimized: false,
                zIndex: nextZ,
              }
            : app
        ),
      };
    }),

  closeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, open: false, minimized: false } : app
      ),
    })),

  toggleApp: (id) =>
    set((state) => {
      const target = state.apps.find((a) => a.id === id);
      const opening = !target?.open;
      const nextZ = opening
        ? Math.min(state.topZ + 1, WIN_Z_MAX)
        : state.topZ;
      return {
        topZ: nextZ,
        apps: state.apps.map((app) =>
          app.id === id
            ? {
                ...app,
                open: !app.open,
                lastOpened: !app.open ? true : app.lastOpened,
                minimized: false,
                zIndex: opening ? nextZ : app.zIndex,
              }
            : app
        ),
      };
    }),

  minimizeApp: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, minimized: true } : app
      ),
    })),

  restoreApp: (id) =>
    set((state) => {
      const nextZ = Math.min(state.topZ + 1, WIN_Z_MAX);
      return {
        topZ: nextZ,
        apps: state.apps.map((app) =>
          app.id === id
            ? { ...app, minimized: false, zIndex: nextZ }
            : app
        ),
      };
    }),

  toggleMinimize: (id) =>
    set((state) => {
      const target = state.apps.find((a) => a.id === id);
      const restoring = !!target?.minimized;
      const nextZ = restoring
        ? Math.min(state.topZ + 1, WIN_Z_MAX)
        : state.topZ;
      return {
        topZ: nextZ,
        apps: state.apps.map((app) =>
          app.id === id
            ? {
                ...app,
                minimized: !app.minimized,
                zIndex: restoring ? nextZ : app.zIndex,
              }
            : app
        ),
      };
    }),

  updateAppPosition: (id, col, row) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id ? { ...app, defaultCol: col, defaultRow: row } : app
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

  setOnDesktop: (id, onDesktop) =>
    set((state) => {
      const slot = onDesktop
        ? nextDesktopSlot(state.apps, state.folders, id)
        : null;
      return {
        apps: state.apps.map((app) =>
          app.id === id
            ? {
                ...app,
                isOnDesktop: onDesktop,
                ...(slot
                  ? { defaultCol: slot.col, defaultRow: slot.row }
                  : {}),
              }
            : app
        ),
      };
    }),

  togglePinTaskbar: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, ispinnedtoTaskbar: !app.ispinnedtoTaskbar }
          : app
      ),
    })),

  togglePinStart: (id) =>
    set((state) => ({
      apps: state.apps.map((app) =>
        app.id === id
          ? { ...app, isPinnedtoStart: !app.isPinnedtoStart }
          : app
      ),
    })),

  setClipboard: (payload) => set({ clipboard: payload }),
  clearClipboard: () => set({ clipboard: null }),

  createFolder: ({ name, driveId, parentId = null, isOnDesktop = false }) => {
    const id = `folder-${Date.now()}`;
    set((state) => {
      const slot = isOnDesktop
        ? nextDesktopSlot(state.apps, state.folders)
        : null;
      return {
        folders: [
          ...state.folders,
          {
            id,
            name: name.trim() || "New folder",
            parentId,
            driveId,
            appIds: [],
            isOnDesktop,
            defaultCol: slot?.col,
            defaultRow: slot?.row,
          },
        ],
      };
    });
    return id;
  },

  renameFolder: (id, name) =>
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === id ? { ...f, name: name.trim() || f.name } : f
      ),
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter(
        (f) => f.id !== id && f.parentId !== id
      ),
    })),

  setFolderOnDesktop: (id, onDesktop) =>
    set((state) => {
      const slot = onDesktop
        ? nextDesktopSlot(state.apps, state.folders, undefined, id)
        : null;
      return {
        folders: state.folders.map((f) =>
          f.id === id
            ? {
                ...f,
                isOnDesktop: onDesktop,
                defaultCol: slot?.col,
                defaultRow: slot?.row,
              }
            : f
        ),
      };
    }),

  addAppToFolder: (folderId, appId) =>
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === folderId && !f.appIds.includes(appId)
          ? { ...f, appIds: [...f.appIds, appId] }
          : f
      ),
    })),

  removeAppFromFolder: (folderId, appId) =>
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === folderId
          ? { ...f, appIds: f.appIds.filter((x) => x !== appId) }
          : f
      ),
    })),

  moveAppToFolder: (appId, targetFolderId, opts) =>
    set((state) => {
      const folders = state.folders.map((f) => {
        let appIds = f.appIds;
        if (opts?.fromFolderId && f.id === opts.fromFolderId) {
          appIds = appIds.filter((id) => id !== appId);
        }
        if (
          targetFolderId &&
          f.id === targetFolderId &&
          !appIds.includes(appId)
        ) {
          appIds = [...appIds, appId];
        }
        return { ...f, appIds };
      });
      const apps = state.apps.map((app) =>
        app.id === appId && opts?.removeFromDesktop
          ? { ...app, isOnDesktop: false }
          : app
      );
      return { folders, apps };
    }),

  pasteClipboard: ({ folderId = null, driveId = "c" }) => {
    const clip = get().clipboard;
    if (!clip || clip.ids.length === 0) return;

    if (clip.type === "app") {
      set((s) => {
        let folders = s.folders.map((f) => {
          let appIds = f.appIds;
          if (
            clip.mode === "cut" &&
            clip.fromFolderId &&
            f.id === clip.fromFolderId
          ) {
            appIds = appIds.filter((id) => !clip.ids.includes(id));
          }
          if (folderId && f.id === folderId) {
            appIds = Array.from(new Set([...appIds, ...clip.ids]));
          }
          return { ...f, appIds };
        });

        let apps = s.apps;
        if (clip.mode === "cut" && clip.fromDesktop) {
          apps = apps.map((app) =>
            clip.ids.includes(app.id) ? { ...app, isOnDesktop: false } : app
          );
        }
        if (!folderId) {
          const occupied = new Set(
            apps
              .filter((a) => a.isOnDesktop)
              .map((a) => `${a.defaultCol},${a.defaultRow}`)
          );
          apps = apps.map((app) => {
            if (!clip.ids.includes(app.id)) return app;
            let col = 0;
            let row = 0;
            outer: for (let r = 0; r < 12; r++) {
              for (let c = 0; c < 8; c++) {
                if (!occupied.has(`${c},${r}`)) {
                  col = c;
                  row = r;
                  occupied.add(`${c},${r}`);
                  break outer;
                }
              }
            }
            return {
              ...app,
              isOnDesktop: true,
              defaultCol: col,
              defaultRow: row,
            };
          });
        }

        return {
          folders,
          apps,
          clipboard: clip.mode === "cut" ? null : s.clipboard,
        };
      });
      return;
    }

    if (clip.type === "folder") {
      set((s) => {
        if (clip.mode === "copy") {
          const copies = s.folders
            .filter((f) => clip.ids.includes(f.id))
            .map((f) => ({
              ...f,
              id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: `${f.name} - Copy`,
              parentId: folderId,
              driveId,
              appIds: [...f.appIds],
              isOnDesktop: false,
            }));
          return { folders: [...s.folders, ...copies] };
        }
        return {
          folders: s.folders.map((f) =>
            clip.ids.includes(f.id)
              ? { ...f, parentId: folderId, driveId, isOnDesktop: false }
              : f
          ),
          clipboard: null,
        };
      });
    }
  },

  setExplorerPath: (path) => set({ explorerPath: path }),

  openFolderInExplorer: (folderId) =>
    set((state) => {
      const nextZ = Math.min(state.topZ + 1, WIN_Z_MAX);
      return {
        topZ: nextZ,
        explorerPath: `folder:${folderId}`,
        apps: state.apps.map((app) =>
          app.id === "This_Pc"
            ? {
                ...app,
                open: true,
                minimized: false,
                lastOpened: true,
                zIndex: nextZ,
              }
            : app
        ),
      };
    }),

  togglePinDrive: (driveId) =>
    set((state) => ({
      pinnedDrives: state.pinnedDrives.includes(driveId)
        ? state.pinnedDrives.filter((d) => d !== driveId)
        : [...state.pinnedDrives, driveId],
    })),

  getOpenApps: () => get().apps.filter((app) => app.open),
  getPinnedToStart: () => get().apps.filter((app) => app.isPinnedtoStart),
  getPinnedToTaskbar: () =>
    get().apps.filter((app) => app.ispinnedtoTaskbar),
}));