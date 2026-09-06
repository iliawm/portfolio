"use client";

import { useEffect, useState } from "react";
import {
  IoWifi,
  IoVolumeHigh,
  IoBatteryHalf,
  IoNotificationsOutline,
} from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";
import Tray from "./Tray";
import ControlCenter from "./ControlCenter";
import NotificationCenter from "./NotificationCenter";

export default function SystemTray() {
  const [tray, setTray] = useState(false);
  const [quick, setQuick] = useState(false);
  const [notif, setNotif] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = d.toLocaleDateString([], {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      setClock(`${time}\n${date}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const closePanels = () => {
    setQuick(false);
    setNotif(false);
    setTray(false);
  };

  return (
    <div className="relative flex h-full items-center gap-0.5 pr-2">
      <button
        type="button"
        title="Show hidden icons"
        onClick={() => {
          setTray((v) => !v);
          setQuick(false);
          setNotif(false);
        }}
        className={`relative flex h-full items-center rounded-md px-1.5 hover:bg-white/10 ${
          tray ? "bg-white/10" : ""
        }`}
      >
        <IoIosArrowUp
          className={`text-sm transition-transform ${tray ? "rotate-180" : ""}`}
        />
        <Tray tray={tray} />
      </button>

      <button
        type="button"
        title="Quick settings"
        onClick={() => {
          setQuick((v) => !v);
          setNotif(false);
          setTray(false);
        }}
        className={`flex h-full items-center gap-1.5 rounded-md px-2 hover:bg-white/10 ${
          quick ? "bg-white/10" : ""
        }`}
      >
        <IoWifi className="text-base" />
        <IoVolumeHigh className="text-base" />
        <IoBatteryHalf className="text-base" />
      </button>

      <button
        type="button"
        title="Date and time"
        onClick={() => {
          setNotif((v) => !v);
          setQuick(false);
          setTray(false);
        }}
        className={`flex h-full min-w-16 flex-col items-end justify-center rounded-md px-2 text-right hover:bg-white/10 ${
          notif ? "bg-white/10" : ""
        }`}
      >
        <span className="text-xs leading-tight whitespace-pre-line">{clock}</span>
      </button>

      <button
        type="button"
        title="Notification center"
        onClick={() => {
          setNotif((v) => !v);
          setQuick(false);
          setTray(false);
        }}
        className={`flex h-full items-center rounded-md px-2 hover:bg-white/10 ${
          notif ? "bg-white/10" : ""
        }`}
      >
        <IoNotificationsOutline className="text-base" />
      </button>

      <ControlCenter open={quick} onClose={closePanels} />
      <NotificationCenter open={notif} onClose={closePanels} />
    </div>
  );
}