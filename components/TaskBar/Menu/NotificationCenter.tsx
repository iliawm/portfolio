"use client";

import { useTheme } from "next-themes";
import { IoNotificationsOutline, IoClose } from "react-icons/io5";

const MOCK = [
  {
    id: "1",
    app: "Portfolio",
    title: "Welcome",
    body: "Your Windows-style desktop is ready.",
    time: "now",
  },
  {
    id: "2",
    app: "Settings",
    title: "Theme",
    body: "Switch light / dark from Quick Settings or Personalization.",
    time: "2m",
  },
   {
    id: "3",
    app: "iliawm",
    title: "Portfolio",
    body: "Hope You enjoy it! This is a Windows 11 clone made with Next.js, TailwindCSS, and Zustand.",
    time: "infinite",
  },
];

export default function NotificationCenter({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-transparent"
        onClick={onClose}
        aria-label="Close notifications"
      />
      <div
        className={`absolute right-2 bottom-16 z-50 flex h-120 w-90 flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl ${
          isDark
            ? "border-white/10 bg-[#2c2c2c]/95 text-white"
            : "border-black/10 bg-white/95 text-neutral-900"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b px-4 py-3 ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IoNotificationsOutline />
            Notifications
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-md p-1 ${
              isDark
                ? "text-white/50 hover:bg-white/10 hover:text-white"
                : "text-black/40 hover:bg-black/5 hover:text-black"
            }`}
          >
            <IoClose />
          </button>
        </div>

        <div className="hide-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
          {MOCK.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl px-3 py-3 ${
                isDark ? "bg-white/8 hover:bg-white/12" : "bg-black/5 hover:bg-black/8"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`text-xs font-medium ${isDark ? "text-white/50" : "text-black/45"}`}>
                  {n.app}
                </div>
                <div className={`text-xs ${isDark ? "text-white/35" : "text-black/35"}`}>
                  {n.time}
                </div>
              </div>
              <div className="mt-1 text-sm font-medium">{n.title}</div>
              <div className={`mt-0.5 text-xs leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
                {n.body}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`border-t px-4 py-2 text-center text-xs ${
            isDark ? "border-white/10 text-white/40" : "border-black/10 text-black/40"
          }`}
        >
          Notification settings in Settings → System
        </div>
      </div>
    </>
  );
}