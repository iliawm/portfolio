"use client";

import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { RiArrowRightWideLine } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { MdRestartAlt } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { useAppsStore } from "@/store/useAppsStore";

interface MainMenuProps {
  shutmenu: boolean;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  Mode: number;
  setMode: React.Dispatch<React.SetStateAction<number>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  onAppOpen?: () => void;
}

const MainMenu = ({
  shutmenu,
  countdown,
  setCountdown,
  Mode,
  setMode,
  setSearch,
  search,
  onAppOpen,
}: MainMenuProps) => {
  const [menu, setMenu] = useState(false);
  const apps = useAppsStore((s) => s.apps);
  const openApp = useAppsStore((s) => s.openApp);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);
    if (countdown === 1 && Mode === 2) {
      window.location.href = "https://github.com/iliawm";
    }
    if (countdown === 1 && Mode === 0) {
      window.location.href = "https://www.linkedin.com/in/psychowm";
    }
    if (countdown === 1 && Mode === 1) {
      window.location.href =
        "https://www.frontendmentor.io/profile/iliawm?tab=progress#skills-profile";
    }
    return () => clearTimeout(timer);
  }, [countdown, Mode, setCountdown]);

  useEffect(() => {
    if (!shutmenu) {
      setMenu(false);
    }
  }, [shutmenu]);

  const handleOpen = (id: string) => {
    openApp(id);
    onAppOpen?.();
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 p-7 pb-0">
      <section className="search flex h-12 w-full items-center gap-4 rounded-sm border-b-2 border-purple-700 px-3 ring ring-gray-700/80">
        <button type="button" className="flex scale-x-[-1] cursor-pointer">
          <IoIosSearch />
        </button>
        <input
          type="text"
          className="h-full w-full focus:outline-0"
          placeholder="Type here to search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </section>

      <div className="flex h-full w-full flex-col justify-start gap-5 rounded-xl">
        <section className="flex h-fit min-h-30 w-full flex-col">
          <div className="flex items-center justify-between px-5 py-3">
            <h1>Pinned</h1>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-[#343434]/70 px-2 py-1 backdrop-blur-2xl hover:scale-[1.07] active:scale-[1]"
            >
              <h3>All apps</h3>
              <div className="icon">
                <RiArrowRightWideLine />
              </div>
            </button>
          </div>
          <ul className="ml-3 flex h-full w-full gap-2 overflow-x-scroll hide-scrollbar">
            {apps.map((app) => {
              if (!app.isPinnedtoStart) return null;
              return (
                <li
                  key={app.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpen(app.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleOpen(app.id);
                  }}
                  className="relative flex h-fit w-18 cursor-pointer select-none flex-col items-center gap-3 rounded-md px-2 hover:bg-gray-700"
                >
                  {!app.isIconpath ? (
                    <div className="text-lg">{app.icon}</div>
                  ) : (
                    <Image
                      src={app.icon}
                      width={50}
                      height={50}
                      alt={app.id}
                      className="w-7"
                    />
                  )}
                  <span className="text-wrap">{app.name}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex h-fit min-h-30 w-full flex-col">
          <div className="flex items-center justify-between px-5 py-3">
            <h1>Recommended</h1>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-[#343434]/70 px-2 py-1 backdrop-blur-2xl hover:scale-[1.07] active:scale-[1]"
            >
              <h3>More</h3>
              <div className="icon">
                <RiArrowRightWideLine />
              </div>
            </button>
          </div>
          <div />
        </section>
      </div>

      <div className="profile relative bottom-0 mb-1 flex h-20 w-full items-center justify-between px-3">
        <div className="User flex items-center gap-2 py-4">
          <div className="relative h-8 w-8">
            <Image
              src={"/pfp/me.jpg"}
              fill
              className="rounded-full"
              alt="Userpfp"
              sizes="auto"
            />
          </div>
          <h3 className="font-bold">Iliawm</h3>
        </div>

        <div className="buttons flex justify-center">
          <button
            type="button"
            className={`shotdown cursor-pointer rounded-lg px-3 py-2 transition-all duration-100 ease-linear hover:scale-[1.06] hover:bg-gray-600 active:scale-[1] ${
              menu ? "animate-pulse bg-gray-600" : ""
            }`}
            onClick={() => setMenu(!menu)}
          >
            <FaPowerOff />
          </button>

          <div
            className={`absolute bottom-15 mr-10 flex h-fit w-fit flex-col rounded-xl border border-gray-700/40 bg-[#1a1a1a]/40 p-3 px-4 text-sm shadow shadow-gray-700/60 backdrop-blur-2xl transition-all ease-linear ${
              menu ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <button
              type="button"
              className="shotdown flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-nowrap transition-all ease-linear hover:scale-[1.05] hover:bg-white/10 active:scale-[1]"
              onClick={() => {
                setMode(2);
                setCountdown(10);
              }}
            >
              <span className="flex scale-x-[-1]">
                <IoMoonOutline />
              </span>
              <div>Github</div>
            </button>

            <button
              type="button"
              className="shotdown flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-nowrap transition-all ease-linear hover:scale-[1.05] hover:bg-white/10 active:scale-[1]"
              onClick={() => {
                setMode(0);
                setCountdown(10);
              }}
            >
              <span>
                <FaPowerOff />
              </span>
              <div>LinkedIn</div>
            </button>

            <button
              type="button"
              className="shotdown flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1 text-nowrap transition-all ease-linear hover:scale-[1.05] hover:bg-white/10 active:scale-[1]"
              onClick={() => {
                setMode(1);
                setCountdown(10);
              }}
            >
              <span>
                <MdRestartAlt />
              </span>
              <div>FrontEndMentor</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;