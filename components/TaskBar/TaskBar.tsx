"use client";

import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import { useEffect, useState } from "react";
import MainMenu from "./Menu/MainMenu";
import SearchMenu from "./Menu/SearchMenu";
import { useTheme } from "next-themes";
import { FaCheck } from "react-icons/fa6";
import Tray from "./Menu/Tray";
import { useAppsStore } from "@/store/useAppsStore";

const TaskBar = () => {
  const [Menu, SetMenu] = useState(false);
  const [menuIndex, SetMenuIndex] = useState(0);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [Mode, setMode] = useState(4);
  const [name, setName] = useState("");
  const [tray, setTray] = useState(false);
  const [search, setSearch] = useState("");

  const apps = useAppsStore((s) => s.apps);
  const openApps = apps.filter((app) => app.open);
  const toggleApp = useAppsStore((s) => s.toggleApp);

  useEffect(() => {
    SetMenuIndex(1);
  }, [search]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTheme("dark");
  }, [menuIndex, setTheme]);

  useEffect(() => {
    if (Mode === 4) return;
    if (Mode === 2) setName("GitHub");
    if (Mode === 0) setName("LinkedIn");
    if (Mode === 1) setName("FrontEnd Mentor");
  }, [Mode]);

  const renderMenu = () => {
    switch (menuIndex) {
      case 0:
        return (
          <div className="h-full w-full">
            <MainMenu
              setSearch={setSearch}
              search={search}
              shutmenu={Menu}
              countdown={countdown}
              setCountdown={setCountdown}
              Mode={Mode}
              setMode={setMode}
            />
          </div>
        );
      case 1:
        return (
          <div className="h-full w-full">
            <SearchMenu setSearch={setSearch} search={search} />
          </div>
        );
      default:
        return (
          <div className="h-full w-full">
            <MainMenu
              setSearch={setSearch}
              search={search}
              shutmenu={Menu}
              countdown={countdown}
              setCountdown={setCountdown}
              Mode={Mode}
              setMode={setMode}
            />
          </div>
        );
    }
  };

  if (!mounted) {
    return (
      <section className="invisible fixed bottom-0 flex h-15 w-full items-center justify-center gap-2 bg-[#1A1A1A] py-2 md:visible">
        <div className="h-12 w-12"></div>
        <div className="h-12 w-12"></div>
      </section>
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <section
      className={`fixed bottom-0 z-40 flex h-15 w-full items-center justify-center gap-2 py-2 invisible md:visible ${
        currentTheme === "dark" ? "bg-[#1A1A1A]" : "bg-[#FFFFFF]"
      }`}
    >
      <div
        className={`fixed top-25 -right-101 flex h-fit w-fit items-center justify-start gap-5 rounded-lg bg-blue-500 px-4 py-5 font-bold transition-all ease-linear ${
          Mode !== 4 ? "-translate-x-101" : ""
        }`}
      >
        <div className="text-xl text-green-400">
          <FaCheck />
        </div>
        <div className="text-xl">
          You will visit Iliawms {name || "Github"} in {countdown}
        </div>
      </div>

      <div
        className={`absolute bottom-19 z-30 h-140 w-120 rounded-xl transition-all lg:h-170 lg:w-170 ${
          theme === "dark"
            ? "bg-[#1A1A1A]/80 backdrop-blur-2xl"
            : "bg-white"
        } ${
          Menu
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {renderMenu()}
      </div>

      <button
        className={`relative h-full w-12 cursor-pointer rounded-lg hover:scale-[1.1] active:scale-[1] ${
          menuIndex === 0 && Menu
            ? theme === "dark"
              ? "bg-gray-600"
              : "bg-gray-200"
            : ""
        } ${
          theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
        }`}
        onClick={() => {
          if (menuIndex !== 0 && Menu) {
            SetMenu(true);
            SetMenuIndex(0);
          } else {
            SetMenu(!Menu);
            SetMenuIndex(0);
          }
        }}
      >
        <Image
          alt="winbtn"
          fill
          loading="eager"
          src={"/buttons/windbtn.png"}
          className="h-full w-full p-2.5"
          sizes="100"
        />
      </button>

      <button
        className={`relative h-full w-12 cursor-pointer rounded-lg hover:scale-[1.1] active:scale-[1] ${
          menuIndex === 1 && Menu
            ? theme === "dark"
              ? "bg-gray-600"
              : "bg-gray-200"
            : ""
        } ${
          theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
        }`}
        onClick={() => {
          if (menuIndex !== 1 && Menu) {
            SetMenu(true);
            SetMenuIndex(1);
          } else {
            SetMenu(!Menu);
            SetMenuIndex(1);
          }
        }}
      >
        <div
          className={`flex scale-x-[-1] items-center justify-center text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          <CiSearch />
        </div>
      </button>

     <div className="flex h-full items-center gap-1">
        {openApps.map((app) => (
            <button
            key={app.id}
            type="button"
            title={app.name}
            className={`relative flex h-full w-12 items-center justify-center rounded-lg transition-all hover:scale-[1.08] active:scale-100 ${
                theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
            } bg-white/10`}
            >
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
            <span className="absolute bottom-1 left-1/2 h-0.75 w-4 -translate-x-1/2 rounded-full bg-white/80" />
            </button>
        ))}
        </div>

      <div className="absolute right-0 mr-4 h-full">
        <button
          type="button"
          className="flex h-full items-center"
          onClick={() => setTray(!tray)}
        >
          <Tray tray={tray} />
        </button>
      </div>
    </section>
  );
};

export default TaskBar;