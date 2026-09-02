"use client";

import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { useAppsStore } from "@/store/useAppsStore";

interface SearchMenuProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
}

const SearchMenu = ({ setSearch, search }: SearchMenuProps) => {
  const apps = useAppsStore((s) => s.apps);
  const recentApps = apps.filter((app) => app.lastOpened || app.open);

  return (
    <div className="w-full h-full p-6 pb-0 flex flex-col gap-5">
      <section className="search px-3 w-full h-10 flex gap-4 items-center ring ring-gray-700/80 rounded-sm border-b-2 border-purple-700">
        <button className="flex scale-x-[-1] cursor-pointer">
          <IoIosSearch />
        </button>
        <input
          type="text"
          className="w-full h-full focus:outline-0"
          placeholder="Type here to search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </section>

      <section className="flex h-full">
        <div className="flex flex-col gap-3 h-full">
          <h1 className={`${search ? "hidden" : "flex"}`}>Recent</h1>
          <ul
            className={`flex-col overflow-y-scroll h-full hide-scrollbar gap-3 ${
              search ? "hidden" : "flex"
            }`}
          >
            {recentApps.length > 0
              ? recentApps.map((app, index) => (
                  <li
                    key={app.id || index}
                    className="w-full h-fit flex items-center relative gap-3 hover:bg-gray-700 pl-2 rounded-md py-1 pr-20"
                  >
                    {!app.isIconpath ? (
                      <div className="m-2 text-xl">{app.icon}</div>
                    ) : (
                      <Image
                        src={app.icon}
                        width={50}
                        height={50}
                        alt={app.id}
                        className="w-10"
                      />
                    )}
                    <span className="text-nowrap">{app.name}</span>
                  </li>
                ))
              : null}
          </ul>

          <ul
            className={`w-full text-nowrap flex-col gap-3 ${
              search ? "flex" : "hidden"
            }`}
          >
            <h1>Installed Apps</h1>
            <div className="flex flex-col w-full">
              {apps
                .filter(
                  (app) =>
                    app.name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    app.id.toLowerCase().includes(search.toLowerCase())
                )
                .map((app, index) => (
                  <li
                    key={app.id || index}
                    className="w-full h-fit flex items-center relative gap-3 hover:bg-gray-700 pl-2 rounded-md py-1 pr-20"
                  >
                    {!app.isIconpath ? (
                      <div className="m-2 text-xl">{app.icon}</div>
                    ) : (
                      <Image
                        src={app.icon}
                        width={50}
                        height={50}
                        alt={app.id}
                        className="w-10"
                      />
                    )}
                    <span className="text-nowrap">{app.name}</span>
                  </li>
                ))}
            </div>
            <h1 className="absolute top-1/2">Web Search</h1>
          </ul>
        </div>
        <div className="w-full"></div>
      </section>
    </div>
  );
};

export default SearchMenu;