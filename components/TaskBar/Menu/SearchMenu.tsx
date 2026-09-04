"use client";

import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { useAppsStore } from "@/store/useAppsStore";

interface SearchMenuProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  onAppOpen?: () => void;
}

const SearchMenu = ({ setSearch, search, onAppOpen }: SearchMenuProps) => {
  const apps = useAppsStore((s) => s.apps);
  const openApp = useAppsStore((s) => s.openApp);
  const recentApps = apps.filter((app) => app.lastOpened || app.open);

  const handleOpen = (id: string) => {
    openApp(id);
    onAppOpen?.();
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 p-6 pb-0">
      <section className="search flex h-10 w-full items-center gap-4 rounded-sm border-b-2 border-purple-700 px-3 ring ring-gray-700/80">
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

      <section className="flex h-full">
        <div className="flex h-full flex-col gap-3">
          <h1 className={`${search ? "hidden" : "flex"}`}>Recent</h1>
          <ul
            className={`hide-scrollbar h-full flex-col gap-3 overflow-y-scroll ${
              search ? "hidden" : "flex"
            }`}
          >
            {recentApps.map((app) => (
              <li
                key={app.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpen(app.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleOpen(app.id);
                }}
                className="relative flex h-fit w-full cursor-pointer items-center gap-3 rounded-md py-1 pr-20 pl-2 hover:bg-gray-700"
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
          </ul>

          <ul
            className={`w-full flex-col gap-3 text-nowrap ${
              search ? "flex" : "hidden"
            }`}
          >
            <h1>Installed Apps</h1>
            <div className="flex w-full flex-col">
              {apps
                .filter(
                  (app) =>
                    app.name.toLowerCase().includes(search.toLowerCase()) ||
                    app.id.toLowerCase().includes(search.toLowerCase())
                )
                .map((app) => (
                  <li
                    key={app.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpen(app.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleOpen(app.id);
                    }}
                    className="relative flex h-fit w-full cursor-pointer items-center gap-3 rounded-md py-1 pr-20 pl-2 hover:bg-gray-700"
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
          </ul>
        </div>
        <div className="w-full" />
      </section>
    </div>
  );
};

export default SearchMenu;