"use client";

import Image from "next/image";
import { IoIosArrowUp } from "react-icons/io";
import { useAppsStore } from "@/store/useAppsStore";
import { useShallow } from "zustand/react/shallow";

const Tray = ({ tray }: { tray: boolean }) => {
  const openApps = useAppsStore(
    useShallow((s) => s.apps.filter((app) => app.open))
  );

  const cols = Math.min(openApps.length, 3);
  const rows = Math.ceil(openApps.length / 3) || 1;

  return (
    <div className="flex justify-center h-full">
      <ul
        style={{
          width: `${cols * 72 + 40}px`,
          height: `${rows * 100 + 40}px`,
        }}
        className={`absolute grid grid-cols-3 rounded-2xl p-5 gap-5 -right-10 bg-[#1a1a1a]/85 backdrop-blur-2xl bottom-17 ${
          tray ? "grid" : "hidden"
        }`}
      >
        {openApps.map((app, index) => (
          <li
            key={app.id || index}
            className="w-18 h-fit flex flex-col items-center gap-3 hover:bg-gray-700 px-2 py-2 rounded-md select-none"
          >
            {!app.isIconpath ? (
              <div className="text-lg">{app.icon}</div>
            ) : (
              <Image
                src={app.icon}
                width={30}
                height={30}
                alt={app.id}
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-wrap text-center">{app.name}</span>
          </li>
        ))}
      </ul>
      <div className="transition-all flex items-center px-2 ease-in-out duration-400 hover:bg-gray-600 h-full">
        <div
          className={`${
            tray ? "rotate-180" : ""
          } transition-all duration-200`}
        >
          <IoIosArrowUp />
        </div>
      </div>
    </div>
  );
};

export default Tray;