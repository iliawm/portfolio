import { DESKTOP_APPS } from "@/config/Apps/config";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const Tray = ({ tray }: { tray: boolean }) => {
  const [apps] = useState(DESKTOP_APPS);

  const closedApps = apps.filter((app) => app.open);

  const cols = Math.min(closedApps.length, 3);
  const rows = Math.ceil(closedApps.length / 3);

  return (
    <div className="flex justify-center h-full">
      <ul
        style={{
          width: `${cols * 72 + 40}px`,
          height: `${rows * 100 + 40}px`,
        }}
        className={`absolute grid grid-cols-3 rounded-2xl p-5 gap-2 -right-10 bg-[#1a1a1a] bottom-17 ${
          tray ? "grid" : "hidden"
        }`}
      >
        {closedApps.map((app, index) => (
          <li
            key={app.id || index}
            className="w-18 h-fit flex flex-col items-center gap-3 hover:bg-gray-700 px-2 py-2 rounded-md select-none"
          >
            {!app.isIconpath ? (
              <div className="text-lg">{app.icon}</div>
            ) : (
              <Image
                src={app.icon}
                width={50}
                height={50}
                alt={app.id}
                className="w-7 h-7 object-contain"
              />
            )}

            <span className="text-wrap text-center">
              {app.name}
            </span>
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
export default Tray