"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  IoDesktopOutline,
  IoDownloadOutline,
  IoDocumentTextOutline,
  IoImagesOutline,
  IoMusicalNotesOutline,
  IoVideocamOutline,
  IoFolderOutline,
  IoHardwareChipOutline,
  IoChevronForward,
  IoHomeOutline,
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoSearch,
  IoRefresh,
  IoAppsOutline,
  IoPinOutline,
  IoClose,
} from "react-icons/io5";
import WindowFrame from "../WindowFrame";
import { useAppsStore } from "@/store/useAppsStore";
import ContextMenu, {
  clampMenuPosition,
  type ContextItem,
} from "@/components/main/ContextMenu";

type CategoryId =
  | "desktop"
  | "documents"
  | "downloads"
  | "pictures"
  | "music"
  | "videos"
  | "apps";

type NavId =
  | "this-pc"
  | CategoryId
  | "drive:c"
  | "drive:d"
  | `folder:${string}`;

type SortKey = "name" | "type";

type MenuState =
  | { kind: "empty"; x: number; y: number }
  | { kind: "app"; x: number; y: number; appId: string }
  | { kind: "folder"; x: number; y: number; folderId: string }
  | { kind: "drive"; x: number; y: number; driveId: "c" | "d" }
  | null;

type DialogState =
  | { type: "new-folder"; driveId: "c" | "d"; parentId: string | null }
  | { type: "rename-folder"; folderId: string; name: string }
  | null;

type Tab = { id: string; path: NavId; title: string };

const CATEGORIES: {
  id: CategoryId;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "desktop", label: "Desktop", icon: <IoDesktopOutline /> },
  { id: "downloads", label: "Downloads", icon: <IoDownloadOutline /> },
  { id: "documents", label: "Documents", icon: <IoDocumentTextOutline /> },
  { id: "pictures", label: "Pictures", icon: <IoImagesOutline /> },
  { id: "music", label: "Music", icon: <IoMusicalNotesOutline /> },
  { id: "videos", label: "Videos", icon: <IoVideocamOutline /> },
  { id: "apps", label: "Apps", icon: <IoAppsOutline /> },
];

const DRIVES = [
  {
    id: "c" as const,
    label: "Local Disk (C:)",
    short: "C:",
    sub: "Windows · SSD",
    used: 128,
    total: 512,
  },
  {
    id: "d" as const,
    label: "Data (D:)",
    short: "D:",
    sub: "Projects · HDD",
    used: 420,
    total: 1024,
  },
];

function titleForPath(
  path: NavId,
  folders: { id: string; name: string }[]
): string {
  if (path === "this-pc") return "This PC";
  if (path === "drive:c") return "Local Disk (C:)";
  if (path === "drive:d") return "Data (D:)";
  if (path.startsWith("folder:")) {
    const fid = path.slice(7);
    return folders.find((f) => f.id === fid)?.name ?? "Folder";
  }
  return CATEGORIES.find((c) => c.id === path)?.label ?? "This PC";
}

export default function ThisPc({
  id,
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

  const apps = useAppsStore((s) => s.apps);
  const openApp = useAppsStore((s) => s.openApp);
  const setOnDesktop = useAppsStore((s) => s.setOnDesktop);
  const folders = useAppsStore((s) => s.folders);
  const clipboard = useAppsStore((s) => s.clipboard);
  const setClipboard = useAppsStore((s) => s.setClipboard);
  const createFolder = useAppsStore((s) => s.createFolder);
  const renameFolder = useAppsStore((s) => s.renameFolder);
  const deleteFolder = useAppsStore((s) => s.deleteFolder);
  const setFolderOnDesktop = useAppsStore((s) => s.setFolderOnDesktop);
  const removeAppFromFolder = useAppsStore((s) => s.removeAppFromFolder);
  const addAppToFolder = useAppsStore((s) => s.addAppToFolder);
  const pasteClipboard = useAppsStore((s) => s.pasteClipboard);
  const explorerPath = useAppsStore((s) => s.explorerPath);
  const setExplorerPath = useAppsStore((s) => s.setExplorerPath);
  const pinnedDrives = useAppsStore((s) => s.pinnedDrives);
  const togglePinDrive = useAppsStore((s) => s.togglePinDrive);
  const setExplorerDrag = useAppsStore((s) => s.setExplorerDrag);

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab-1", path: "this-pc", title: "This PC" },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [menu, setMenu] = useState<MenuState>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogName, setDialogName] = useState("New folder");
  const [toast, setToast] = useState<string | null>(null);
  const [dragItem, setDragItem] = useState<
    | { type: "app"; id: string }
    | { type: "folder"; id: string }
    | null
  >(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const nav = activeTab.path;

  const setNav = (path: NavId) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, path, title: titleForPath(path, folders) }
          : t
      )
    );
  };

  const openInNewTab = (path: NavId) => {
    const tid = `tab-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      { id: tid, path, title: titleForPath(path, folders) },
    ]);
    setActiveTabId(tid);
  };

  const closeTab = (tid: string) => {
    setTabs((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((t) => t.id !== tid);
      if (activeTabId === tid) setActiveTabId(next[next.length - 1].id);
      return next;
    });
  };

  useEffect(() => {
    if (explorerPath) {
      setNav(explorerPath as NavId);
      setExplorerPath(null);
    }
  }, [explorerPath, setExplorerPath]);

  useEffect(() => {
    setTabs((prev) =>
      prev.map((t) => ({ ...t, title: titleForPath(t.path, folders) }))
    );
  }, [folders]);

  const shell = isDark
    ? "bg-[#202020] text-white"
    : "bg-[#f3f3f3] text-neutral-900";
  const side = isDark
    ? "border-white/10 bg-[#191919]"
    : "border-black/8 bg-white";
  const card = isDark
    ? "bg-white/5 hover:bg-white/10"
    : "bg-black/5 hover:bg-black/8";
  const cardDrop = isDark
    ? "bg-[#0078d4]/30 outline outline-[#0078d4]/80"
    : "bg-[#0078d4]/20 outline outline-[#0078d4]/50";
  const muted = isDark ? "text-white/45" : "text-black/45";
  const bar = isDark
    ? "border-white/10 bg-[#2c2c2c]"
    : "border-black/8 bg-white";
  const inputCls = isDark
    ? "bg-[#1c1c1c] ring-white/10 placeholder:text-white/35"
    : "bg-black/5 ring-black/10 placeholder:text-black/35";
  const sideActive = isDark ? "bg-white/10" : "bg-black/8";
  const sideHover = isDark ? "hover:bg-white/5" : "hover:bg-black/5";

  const activeFolderId = nav.startsWith("folder:")
    ? nav.slice("folder:".length)
    : null;
  const activeFolder = folders.find((f) => f.id === activeFolderId) ?? null;
  const activeDriveId =
    nav === "drive:c"
      ? "c"
      : nav === "drive:d"
        ? "d"
        : activeFolder?.driveId;

  const title = titleForPath(nav, folders);
  const q = query.trim().toLowerCase();

  const sortByName = <T extends { name: string }>(list: T[]) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name));

  const desktopApps = sortByName(
    apps.filter(
      (a) => a.isOnDesktop && (!q || a.name.toLowerCase().includes(q))
    )
  );
  const allApps = sortByName(
    apps.filter((a) => !q || a.name.toLowerCase().includes(q))
  );
  const folderAppsList = sortByName(
    apps.filter(
      (a) =>
        !!activeFolder?.appIds.includes(a.id) &&
        (!q || a.name.toLowerCase().includes(q))
    )
  );
  const foldersInViewList = sortByName(
    folders.filter((f) => {
      if (nav === "drive:c") return f.driveId === "c" && f.parentId === null;
      if (nav === "drive:d") return f.driveId === "d" && f.parentId === null;
      if (activeFolderId)
        return (
          f.parentId === activeFolderId &&
          (!q || f.name.toLowerCase().includes(q))
        );
      return false;
    })
  );

  const mixedItems = useMemo(() => {
    const folderItems = foldersInViewList.map((f) => ({
      kind: "folder" as const,
      f,
      name: f.name,
    }));
    const appItems = (activeFolder ? folderAppsList : []).map((a) => ({
      kind: "app" as const,
      a,
      name: a.name,
    }));
    if (sortKey === "type") {
      return [...folderItems, ...appItems];
    }
    return [...folderItems, ...appItems].sort((x, y) =>
      x.name.localeCompare(y.name)
    );
  }, [foldersInViewList, folderAppsList, activeFolder, sortKey]);

  const sortedCategories = useMemo(() => {
    const list = CATEGORIES.filter(
      (c) => !q || c.label.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => a.label.localeCompare(b.label));
  }, [q]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  const currentPasteTarget = () => {
    if (activeFolderId)
      return {
        folderId: activeFolderId,
        driveId: activeFolder?.driveId ?? ("c" as const),
      };
    if (nav === "drive:c") return { folderId: null, driveId: "c" as const };
    if (nav === "drive:d") return { folderId: null, driveId: "d" as const };
    if (nav === "desktop") return { folderId: null, driveId: "c" as const };
    return null;
  };

  const moveToDesktop = (appId: string) => {
    if (activeFolderId) removeAppFromFolder(activeFolderId, appId);
    setOnDesktop(appId, true);
  };

  const openNewFolderDialog = () => {
    const driveId = activeDriveId ?? "c";
    setDialogName("New folder");
    setDialog({
      type: "new-folder",
      driveId,
      parentId: activeFolderId,
    });
    setMenu(null);
  };

  const confirmDialog = () => {
    if (!dialog) return;
    if (dialog.type === "new-folder") {
      const fid = createFolder({
        name: dialogName || "New folder",
        driveId: dialog.driveId,
        parentId: dialog.parentId,
        isOnDesktop: false,
      });
      setNav(`folder:${fid}`);
      showToast("Folder created");
    }
    if (dialog.type === "rename-folder") {
      renameFolder(dialog.folderId, dialogName);
      showToast("Renamed");
    }
    setDialog(null);
  };

  const onMiddleNav = (e: React.MouseEvent, path: NavId) => {
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      openInNewTab(path);
    }
  };

  const handleDropOnFolder = (targetFolderId: string) => {
    if (!dragItem) return;
    if (dragItem.type === "app") {
      if (activeFolderId && activeFolderId !== targetFolderId) {
        removeAppFromFolder(activeFolderId, dragItem.id);
      }
      addAppToFolder(targetFolderId, dragItem.id);
      setOnDesktop(dragItem.id, false);
      showToast("Moved into folder");
    }
    if (dragItem.type === "folder" && dragItem.id !== targetFolderId) {
      useAppsStore.setState((s) => ({
        folders: s.folders.map((folder) =>
          folder.id === dragItem.id
            ? {
                ...folder,
                parentId: targetFolderId,
                isOnDesktop: false,
                driveId:
                  s.folders.find((x) => x.id === targetFolderId)?.driveId ??
                  folder.driveId,
              }
            : folder
        ),
      }));
      showToast("Folder moved");
    }
    setDragItem(null);
    setDropTarget(null);
    setExplorerDrag(null);
  };

  const handleDropOnCurrentView = () => {
    if (!dragItem) return;

    if (nav === "desktop") {
      if (dragItem.type === "app") {
        if (activeFolderId) removeAppFromFolder(activeFolderId, dragItem.id);
        setOnDesktop(dragItem.id, true);
        showToast("Moved to Desktop");
      }
      if (dragItem.type === "folder") {
        setFolderOnDesktop(dragItem.id, true);
        showToast("Folder on Desktop");
      }
    } else if (activeFolderId) {
      if (dragItem.type === "app") {
        if (activeFolderId) {
          addAppToFolder(activeFolderId, dragItem.id);
          setOnDesktop(dragItem.id, false);
        }
        showToast("Added to folder");
      }
      if (dragItem.type === "folder" && dragItem.id !== activeFolderId) {
        useAppsStore.setState((s) => ({
          folders: s.folders.map((folder) =>
            folder.id === dragItem.id
              ? {
                  ...folder,
                  parentId: activeFolderId,
                  isOnDesktop: false,
                }
              : folder
          ),
        }));
        showToast("Folder moved here");
      }
    }

    setDragItem(null);
    setDropTarget(null);
    setExplorerDrag(null);
  };

  const emptyItems = (): ContextItem[] => {
    const pasteTarget = currentPasteTarget();
    const canPaste = !!clipboard && !!pasteTarget;
    return [
      {
        label: "Sort by",
        hint: "›",
        dividerAfter: true,
        children: [
          {
            label: "Name",
            onClick: () => {
              setSortKey("name");
              showToast("Sorted by name");
            },
          },
          {
            label: "Type",
            onClick: () => {
              setSortKey("type");
              showToast("Sorted by type");
            },
          },
        ],
      },
      {
        label: "Refresh",
        onClick: () => showToast("Refreshed"),
        dividerAfter: true,
      },
      { label: "New folder", onClick: openNewFolderDialog },
      {
        label: "Paste",
        disabled: !canPaste,
        onClick: () => {
          if (!pasteTarget) return;
          pasteClipboard(pasteTarget);
          showToast("Pasted");
        },
        dividerAfter: true,
      },
      {
        label: "Properties",
        onClick: () => showToast(`${title} properties`),
      },
    ];
  };

  const appItems = (appId: string): ContextItem[] => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return [];
    return [
      { label: "Open", onClick: () => openApp(appId), dividerAfter: true },
      {
        label: "Cut",
        onClick: () => {
          setClipboard({
            mode: "cut",
            type: "app",
            ids: [appId],
            fromFolderId: activeFolderId,
            fromDesktop: !!app.isOnDesktop && !activeFolderId,
          });
          showToast("Cut");
        },
      },
      {
        label: "Copy",
        onClick: () => {
          setClipboard({
            mode: "copy",
            type: "app",
            ids: [appId],
            fromFolderId: activeFolderId,
            fromDesktop: !!app.isOnDesktop,
          });
          showToast("Copied");
        },
      },
      {
        label: "Paste",
        disabled: !clipboard || !currentPasteTarget(),
        onClick: () => {
          const t = currentPasteTarget();
          if (!t) return;
          pasteClipboard(t);
          showToast("Pasted");
        },
        dividerAfter: true,
      },
      {
        label: "Move to Desktop",
        onClick: () => {
          moveToDesktop(appId);
          showToast("Moved to Desktop");
        },
        dividerAfter: true,
      },
      ...(activeFolderId
        ? [
            {
              label: "Remove from this folder",
              onClick: () => {
                removeAppFromFolder(activeFolderId, appId);
                showToast("Removed");
              },
              dividerAfter: true,
            } satisfies ContextItem,
          ]
        : []),
      {
        label: "Properties",
        onClick: () => showToast(app.name),
      },
    ];
  };

  const folderItems = (folderId: string): ContextItem[] => {
    const f = folders.find((x) => x.id === folderId);
    if (!f) return [];
    return [
      {
        label: "Open",
        onClick: () => setNav(`folder:${folderId}`),
      },
      {
        label: "Open in new tab",
        onClick: () => openInNewTab(`folder:${folderId}`),
        dividerAfter: true,
      },
      {
        label: "Cut",
        onClick: () => {
          setClipboard({ mode: "cut", type: "folder", ids: [folderId] });
          showToast("Cut");
        },
      },
      {
        label: "Copy",
        onClick: () => {
          setClipboard({ mode: "copy", type: "folder", ids: [folderId] });
          showToast("Copied");
        },
      },
      {
        label: "Paste",
        disabled: !clipboard,
        onClick: () => {
          pasteClipboard({ folderId, driveId: f.driveId });
          showToast("Pasted");
        },
        dividerAfter: true,
      },
      {
        label: "Rename",
        onClick: () => {
          setDialogName(f.name);
          setDialog({ type: "rename-folder", folderId, name: f.name });
        },
      },
      {
        label: f.isOnDesktop ? "Remove from Desktop" : "Move to Desktop",
        onClick: () => {
          setFolderOnDesktop(folderId, !f.isOnDesktop);
          showToast(
            f.isOnDesktop ? "Removed from Desktop" : "Moved to Desktop"
          );
        },
        dividerAfter: true,
      },
      {
        label: "Delete",
        danger: true,
        onClick: () => {
          deleteFolder(folderId);
          if (nav === `folder:${folderId}`) setNav("this-pc");
          showToast("Folder deleted");
        },
      },
    ];
  };

  const driveItems = (driveId: "c" | "d"): ContextItem[] => {
    const pinned = pinnedDrives.includes(driveId);
    return [
      {
        label: "Open",
        onClick: () => setNav(`drive:${driveId}`),
      },
      {
        label: "Open in new tab",
        onClick: () => openInNewTab(`drive:${driveId}`),
        dividerAfter: true,
      },
      {
        label: pinned ? "Unpin from sidebar" : "Pin to sidebar",
        onClick: () => {
          togglePinDrive(driveId);
          showToast(pinned ? "Unpinned" : "Pinned");
        },
      },
      {
        label: "Properties",
        onClick: () =>
          showToast(driveId === "c" ? "Local Disk (C:)" : "Data (D:)"),
      },
    ];
  };

  const openEmptyMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = clampMenuPosition(e.clientX, e.clientY, 240, 380);
    setMenu({ kind: "empty", ...pos });
  };

  const renderAppButton = (app: (typeof apps)[number]) => (
    <button
      key={app.id}
      type="button"
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        setDragItem({ type: "app", id: app.id });
        setExplorerDrag({ type: "app", id: app.id, source: "explorer" });
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => {
        setDragItem(null);
        setDropTarget(null);
        setExplorerDrag(null);
      }}
      onDoubleClick={() => openApp(app.id)}
      onClick={() => {
        setMenu(null);
        openApp(app.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = clampMenuPosition(e.clientX, e.clientY, 240, 400);
        setMenu({ kind: "app", appId: app.id, ...pos });
      }}
      className={`flex min-w-0 cursor-grab items-center gap-3 rounded-lg px-3 py-2.5 text-left active:cursor-grabbing ${card}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {app.isIconpath ? (
          <Image
            src={app.icon}
            alt={app.name}
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
        ) : (
          <span className="text-xl leading-none">{app.icon}</span>
        )}
      </div>
      <span className="truncate text-sm">{app.name}</span>
    </button>
  );

  const renderFolderButton = (f: (typeof folders)[number]) => (
    <button
      key={f.id}
      type="button"
      data-explorer-drop={`folder:${f.id}`}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        setDragItem({ type: "folder", id: f.id });
        setExplorerDrag({ type: "folder", id: f.id, source: "explorer" });
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => {
        setDragItem(null);
        setDropTarget(null);
        setExplorerDrag(null);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTarget(f.id);
      }}
      onDragLeave={() => setDropTarget((t) => (t === f.id ? null : t))}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDropOnFolder(f.id);
      }}
      onDoubleClick={() => setNav(`folder:${f.id}`)}
      onClick={() => setNav(`folder:${f.id}`)}
      onMouseDown={(e) => onMiddleNav(e, `folder:${f.id}`)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = clampMenuPosition(e.clientX, e.clientY, 240, 360);
        setMenu({ kind: "folder", folderId: f.id, ...pos });
      }}
      className={`flex min-w-0 cursor-grab items-center gap-3 rounded-lg px-3 py-2.5 text-left active:cursor-grabbing ${
        dropTarget === f.id ? cardDrop : card
      }`}
    >
      <span className="text-2xl text-[#f7b731]">
        <IoFolderOutline />
      </span>
      <span className="truncate text-sm">{f.name}</span>
    </button>
  );

  const sideBtn = (active: boolean) =>
    `flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs whitespace-nowrap ${
      active ? sideActive : sideHover
    }`;

  return (
    <WindowFrame
      appId={id}
      title={title}
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
      defaultWidth={920}
      defaultHeight={560}
    >
      <div
        className={`relative -m-3 flex h-full min-h-72 flex-col overflow-hidden ${shell}`}
        onContextMenu={openEmptyMenu}
        onClick={() => setMenu(null)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className={`flex shrink-0 items-center gap-1 overflow-x-auto border-b px-1 py-1 ${bar}`}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTabId(t.id)}
              className={`group flex max-w-40 items-center gap-1 rounded-md px-2 py-1 text-xs ${
                t.id === activeTabId
                  ? isDark
                    ? "bg-white/10"
                    : "bg-black/8"
                  : sideHover
              }`}
            >
              <span className="truncate">{t.title}</span>
              {tabs.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(t.id);
                  }}
                  className="rounded p-0.5 opacity-50 hover:opacity-100"
                >
                  <IoClose className="text-[10px]" />
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className={`flex shrink-0 flex-wrap items-center gap-1 border-b px-2 py-1.5 sm:gap-2 ${bar}`}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={() => setNav("this-pc")}
            className={`rounded-md p-1.5 ${sideHover}`}
          >
            <IoArrowBack className="text-sm" />
          </button>
          <button type="button" className="rounded-md p-1.5 opacity-40" disabled>
            <IoArrowForward className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeFolder?.parentId)
                setNav(`folder:${activeFolder.parentId}`);
              else if (activeFolder) setNav(`drive:${activeFolder.driveId}`);
              else setNav("this-pc");
            }}
            className={`rounded-md p-1.5 ${sideHover}`}
          >
            <IoArrowUp className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => showToast("Refreshed")}
            className={`rounded-md p-1.5 ${sideHover}`}
          >
            <IoRefresh className="text-sm" />
          </button>

          <div
            className={`order-last mt-1 flex min-w-0 w-full flex-1 items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 sm:order-none sm:mt-0 sm:w-auto ${inputCls}`}
          >
            <IoHomeOutline className={muted} />
            <IoChevronForward className={`text-[10px] ${muted}`} />
            <span className="truncate">{title}</span>
          </div>

          <div
            className={`ml-auto flex w-full items-center gap-1.5 rounded-md px-2 py-1 ring-1 sm:w-44 ${inputCls}`}
          >
            <IoSearch className={`shrink-0 text-sm ${muted}`} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full min-w-0 bg-transparent text-xs outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          <aside
            className={`flex max-h-44 w-full shrink-0 flex-row gap-0.5 overflow-x-auto border-b p-2 sm:max-h-none sm:w-52 sm:flex-col sm:overflow-y-auto sm:border-r sm:border-b-0 ${side}`}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              onClick={() => setNav("this-pc")}
              onMouseDown={(e) => onMiddleNav(e, "this-pc")}
              className={sideBtn(nav === "this-pc")}
            >
              <IoHardwareChipOutline />
              This PC
            </button>

            <div
              className={`my-1 hidden h-px sm:block ${isDark ? "bg-white/10" : "bg-black/8"}`}
            />
            <p className={`hidden px-2 pt-1 text-[10px] uppercase sm:block ${muted}`}>
              Categories
            </p>
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                data-explorer-drop={
                  item.id === "desktop" ? "desktop" : undefined
                }
                onClick={() => setNav(item.id)}
                onMouseDown={(e) => onMiddleNav(e, item.id)}
                onDragOver={(e) => {
                  if (item.id === "desktop") {
                    e.preventDefault();
                    setDropTarget("desktop");
                  }
                }}
                onDragLeave={() =>
                  setDropTarget((t) => (t === "desktop" ? null : t))
                }
                onDrop={(e) => {
                  if (item.id !== "desktop") return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (dragItem?.type === "app") {
                    moveToDesktop(dragItem.id);
                    showToast("Moved to Desktop");
                  }
                  if (dragItem?.type === "folder") {
                    setFolderOnDesktop(dragItem.id, true);
                    showToast("Folder on Desktop");
                  }
                  setDragItem(null);
                  setDropTarget(null);
                  setExplorerDrag(null);
                }}
                className={`${sideBtn(nav === item.id)} ${
                  dropTarget === "desktop" && item.id === "desktop"
                    ? cardDrop
                    : ""
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </button>
            ))}

            {pinnedDrives.length > 0 && (
              <>
                <div
                  className={`my-1 hidden h-px sm:block ${isDark ? "bg-white/10" : "bg-black/8"}`}
                />
                <p className={`hidden px-2 pt-1 text-[10px] uppercase sm:block ${muted}`}>
                  Drives
                </p>
                {DRIVES.filter((d) => pinnedDrives.includes(d.id)).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setNav(`drive:${d.id}`)}
                    onMouseDown={(e) => onMiddleNav(e, `drive:${d.id}`)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const pos = clampMenuPosition(
                        e.clientX,
                        e.clientY,
                        220,
                        200
                      );
                      setMenu({ kind: "drive", driveId: d.id, ...pos });
                    }}
                    className={sideBtn(nav === `drive:${d.id}`)}
                  >
                    <IoHardwareChipOutline className="text-[#60a5fa]" />
                    {d.short}
                    <IoPinOutline className={`ml-auto text-[10px] ${muted}`} />
                  </button>
                ))}
              </>
            )}
          </aside>

          <main
            className={`hide-scrollbar min-w-0 flex-1 overflow-y-auto p-3 sm:p-4 ${
              dropTarget === "current" ? cardDrop : ""
            }`}
            data-explorer-drop={
              activeFolderId
                ? `folder:${activeFolderId}`
                : nav === "desktop"
                  ? "desktop"
                  : "current"
            }
            onDragOver={(e) => {
              e.preventDefault();
              setDropTarget("current");
            }}
            onDragLeave={() =>
              setDropTarget((t) => (t === "current" ? null : t))
            }
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDropOnCurrentView();
            }}
          >
            {nav === "this-pc" && (
              <div className="flex flex-col gap-5">
                <section>
                  <h2 className={`mb-2 text-xs font-semibold ${muted}`}>
                    Categories
                  </h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sortedCategories.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setNav(f.id)}
                        onMouseDown={(e) => onMiddleNav(e, f.id)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left ${card}`}
                      >
                        <span className="text-2xl text-[#f7b731]">{f.icon}</span>
                        <span className="truncate text-sm">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className={`mb-2 text-xs font-semibold ${muted}`}>
                    Devices and drives
                  </h2>
                  <div className="flex flex-col gap-2">
                    {DRIVES.map((d) => {
                      const pct = Math.round((d.used / d.total) * 100);
                      const pinned = pinnedDrives.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setNav(`drive:${d.id}`)}
                          onMouseDown={(e) => onMiddleNav(e, `drive:${d.id}`)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const pos = clampMenuPosition(
                              e.clientX,
                              e.clientY,
                              220,
                              200
                            );
                            setMenu({ kind: "drive", driveId: d.id, ...pos });
                          }}
                          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left ${card}`}
                        >
                          <span className="text-3xl text-[#60a5fa]">
                            <IoHardwareChipOutline />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium">
                                {d.label}
                              </span>
                              {pinned && (
                                <IoPinOutline className={`text-xs ${muted}`} />
                              )}
                            </div>
                            <div className={`text-xs ${muted}`}>{d.sub}</div>
                            <div
                              className={`mt-2 h-1.5 overflow-hidden rounded-full ${
                                isDark ? "bg-white/10" : "bg-black/10"
                              }`}
                            >
                              <div
                                className={`h-full rounded-full ${
                                  pct > 85 ? "bg-red-500" : "bg-[#60cdff]"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className={`mt-1 text-[11px] ${muted}`}>
                              {d.total - d.used} GB free of {d.total} GB
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {(nav === "drive:c" || nav === "drive:d" || !!activeFolder) && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{title}</h2>
                  <button
                    type="button"
                    onClick={openNewFolderDialog}
                    className="rounded-md bg-[#0078d4] px-2.5 py-1 text-xs text-white hover:bg-[#006cbd]"
                  >
                    New folder
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {mixedItems.map((item) =>
                    item.kind === "folder"
                      ? renderFolderButton(item.f)
                      : renderAppButton(item.a)
                  )}
                  {mixedItems.length === 0 && (
                    <div
                      className={`col-span-full rounded-lg border border-dashed py-10 text-center text-sm ${muted} ${
                        isDark ? "border-white/15" : "border-black/15"
                      }`}
                    >
                       right-click → New folder
                    </div>
                  )}
                </div>
              </div>
            )}

            {nav === "desktop" && (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Desktop</h2>
                <p className={`mb-2 text-xs ${muted}`}>
                  Drop items here to show them on the desktop
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {folders
                    .filter((f) => f.isOnDesktop)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(renderFolderButton)}
                  {desktopApps.map(renderAppButton)}
                </div>
              </div>
            )}

            {nav === "apps" && (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Apps</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {allApps.map(renderAppButton)}
                </div>
              </div>
            )}

            {CATEGORIES.some((c) => c.id === nav) &&
              nav !== "desktop" &&
              nav !== "apps" && (
                <div
                  className={`flex h-full flex-col items-center justify-center gap-2 ${muted}`}
                >
                  <IoFolderOutline className="text-4xl opacity-40" />
                  <p className="text-sm">Category is empty</p>
                </div>
              )}
          </main>
        </div>

        {dialog && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setDialog(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div
              className={`w-full max-w-sm rounded-xl border p-4 shadow-2xl ${
                isDark
                  ? "border-white/10 bg-[#2c2c2c] text-white"
                  : "border-black/10 bg-white text-neutral-900"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-sm font-semibold">
                {dialog.type === "new-folder" ? "New folder" : "Rename"}
              </h3>
              <input
                autoFocus
                value={dialogName}
                onChange={(e) => setDialogName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmDialog();
                  if (e.key === "Escape") setDialog(null);
                }}
                className={`mb-4 w-full rounded-md px-3 py-2 text-sm outline-none ring-1 ${inputCls}`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDialog(null)}
                  className={`rounded-md px-3 py-1.5 text-xs ${sideHover}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDialog}
                  className="rounded-md bg-[#0078d4] px-3 py-1.5 text-xs text-white hover:bg-[#006cbd]"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {menu && (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            items={
              menu.kind === "empty"
                ? emptyItems()
                : menu.kind === "app"
                  ? appItems(menu.appId)
                  : menu.kind === "folder"
                    ? folderItems(menu.folderId)
                    : driveItems(menu.driveId)
            }
            onClose={() => setMenu(null)}
          />
        )}

        {toast && (
          <div
            className={`pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md px-3 py-1.5 text-xs shadow-lg ${
              isDark ? "bg-[#2c2c2c] text-white" : "bg-neutral-800 text-white"
            }`}
          >
            {toast}
          </div>
        )}
      </div>
    </WindowFrame>
  );
}