"use client";

import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MainMenu from "./Menu/MainMenu";
import SearchMenu from "./Menu/SearchMenu";
import { useTheme } from "next-themes";
import { FaCheck } from "react-icons/fa6";
import SystemTray from "./Menu/SystemTray";
import { useAppsStore } from "@/store/useAppsStore";
import Apps from "../main/Apps/Apps";
import { IoClose } from "react-icons/io5";

const TaskBar = () => {
  const [Menu, SetMenu] = useState(false);
  const [menuIndex, SetMenuIndex] = useState(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [Mode, setMode] = useState(4);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const apps = useAppsStore((s) => s.apps);
  const openApps = apps.filter((app) => app.open);
  const pinnedApps = apps.filter((app)=>app.ispinnedtoTaskbar)
  const restoreApp = useAppsStore((s) => s.restoreApp);
  const openApp= useAppsStore((s) => s.openApp);
  const toggleMinimize = useAppsStore((s) => s.toggleMinimize);
  const [HoverMinimize,SetHoverMinimize] = useState(false);
  const [Id,SetId] = useState("");
  const [Name,SetName] = useState("");
  const closeApp = useAppsStore((s) => s.closeApp);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    SetMenuIndex(1);
  }, [search]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (Mode === 4) return;
    if (Mode === 2) setName("GitHub");
    if (Mode === 0) setName("LinkedIn");
    if (Mode === 1) setName("FrontEnd Mentor");
  }, [Mode]);

  const closeMenu = () => SetMenu(false);
  const hoverMenu =()=>{
    switch(HoverMinimize){
      case true:
        return(
          <div className="w-45 h-35 bg-black absolute bottom-9 left-0 rounded-xl flex flex-col justify-start hover:opacity-80 cursor-pointer">
            <div className="text-white flex justify-end   ">
              <div className="w-full p-1 flex items-center justify-between h-fit " onClick={()=>{
                if(Id.length>1) return closeApp(Id);
              }}> 
              <div className="text-white text-sm ml-1 mt-1">
              {Name}  
              </div> 
              <div>
              <IoClose />
              </div> 
              </div>
              </div> 
              <div className="w-full h-full  overflow-hidden px-7 py-2 relative">
                <Image src={"/AppIcons/placeholder.png"} alt="Image" width={50} height={50} className="w-full h-full invert-50 "/> 
              </div>
          </div>
       )
      case false:
        return (
          <div className="hidden">

          </div>
        )
    }
  }
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
              onAppOpen={closeMenu}
            />
          </div>
        );
      case 1:
        return (
          <div className="h-full w-full">
            <SearchMenu
              setSearch={setSearch}
              search={search}
              onAppOpen={closeMenu}
            />
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
              onAppOpen={closeMenu}
            />
          </div>
        );
    }
  };

  if (!mounted) {
    return (
      <section className="invisible fixed bottom-0 z-50 flex h-15 w-full items-center justify-center gap-2 bg-[#1A1A1A] py-2 md:visible">
        <div className="h-12 w-12" />
        <div className="h-12 w-12" />
      </section>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme !== "light";

  return (
    <section
      className={`fixed bottom-0 z-50 flex h-15 w-full items-center justify-center gap-2 py-2 invisible md:visible ${
        isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-neutral-900"
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      
      <div
        className={`fixed top-25 -right-101 flex h-fit w-fit items-center justify-start gap-5 rounded-lg bg-blue-500 px-4 py-5 font-bold transition-all ease-linear ${
          Mode !== 4 ? "-translate-x-101" : ""
        }`}
      >
        <div className="text-xl text-green-400">
          <FaCheck />
        </div>
        <div className="text-xl text-white">
          You will visit Iliawms {name || "Github"} in {countdown}
        </div>
      </div>

      <div
        className={`absolute bottom-19 z-30 h-140 w-120 rounded-xl transition-all lg:h-170 lg:w-170 ${
          isDark
            ? "bg-[#1A1A1A]/80 text-white backdrop-blur-2xl"
            : "bg-white text-neutral-900 shadow-xl"
        } ${
          Menu
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderMenu()}
      </div>

      <button
        type="button"
        className={`relative h-full w-12 cursor-pointer rounded-lg hover:scale-[1.1] active:scale-100 ${
          menuIndex === 0 && Menu
            ? isDark
              ? "bg-gray-600"
              : "bg-gray-200"
            : ""
        } ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
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
        type="button"
        className={`relative h-full w-12 cursor-pointer rounded-lg hover:scale-[1.1] active:scale-100 ${
          menuIndex === 1 && Menu
            ? isDark
              ? "bg-gray-600"
              : "bg-gray-200"
            : ""
        } ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
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
            isDark ? "text-white" : "text-black"
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
            onClick={() => {
              if (app.minimized) restoreApp(app.id);
              else toggleMinimize(app.id);
            }}
            onContextMenu={(e)=>{
              e.stopPropagation()
              e.preventDefault()
              
            }}
            onMouseEnter={()=>{
              if(app.minimized) {
                SetHoverMinimize(true)
                SetId(app.id)
                SetName(app.name)
                if(hideTimeoutRef.current){
                  clearTimeout(hideTimeoutRef.current);
                }
              };
              if(!app.minimized) {
                SetHoverMinimize(false)
                SetId("")
              }
              
            }}
            onMouseLeave={()=>{
              hideTimeoutRef.current = setTimeout(() => {
                SetHoverMinimize(false);
                SetId("");
                SetName("");
              }, 150);
            }}
            className={`relative flex h-full w-12 items-center justify-center rounded-lg transition-all hover:scale-[1.08] active:scale-100 ${
              isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
            } ${app.minimized ? "bg-white/5 " : "bg-white/10"}`}
          >
            {
              HoverMinimize&& Id===app.id&&(
                <div className="w-fit h-fit absolute mr-40" onMouseEnter={()=>{
                  if (hideTimeoutRef.current) {
                  clearTimeout(hideTimeoutRef.current);
                  hideTimeoutRef.current = null;
              }
              
                }}
                onMouseLeave={()=>{
                  hideTimeoutRef.current = setTimeout(() => {
                    SetHoverMinimize(false);
                    SetId("");
                  },150)
                }} 
                onClick={()=>{
                  restoreApp(Id)
                }}     
                >{hoverMenu()}</div> 
              )
              
            }
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
            <span
              className={`absolute bottom-1 left-1/2 h-0.75 w-4 -translate-x-1/2 rounded-full ${
                app.minimized
                  ? isDark
                    ? "bg-white/40"
                    : "bg-black/30"
                  : isDark
                    ? "bg-white/80"
                    : "bg-black/60"
              }`}
            />
          </button>
        ))}
        {pinnedApps.map((app) => {
          if(app.open) return null
          return(
          <button
            key={app.id}
            type="button"
            title={app.name}
            onClick={() => {
              openApp(app.id)
              
            }}
            onContextMenu={(e)=>{
              e.stopPropagation()
              e.preventDefault()
              
            }}
            className={`relative flex h-full w-12 items-center justify-center rounded-lg transition-all hover:scale-[1.08] active:scale-100 ${
              isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
            } ${app.minimized ? "bg-white/5 opacity-70" : "bg-white/10"}`}
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
            <span
              className={`absolute bottom-1 left-1/2 h-0.75 w-4 -translate-x-1/2 rounded-full ${
                app.open?
                app.minimized
                  ? isDark
                    ? "bg-white/40"
                    : "bg-black/30"
                  : isDark
                    ? "bg-white/80"
                    : "bg-black/60"
              :""}`}
            />
          </button>)
        })}
      </div>

      <div
        className="absolute right-0 h-full"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <SystemTray />
      </div>
    </section>
  );
};

export default TaskBar;