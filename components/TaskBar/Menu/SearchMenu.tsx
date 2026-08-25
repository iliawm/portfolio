import { DESKTOP_APPS } from '@/config/Apps/config'; 
import { div } from 'framer-motion/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

interface MainMenuProps{
  setSearch: React.Dispatch<React.SetStateAction<string>>;
    search: string;
}

const SearchMenu = ({setSearch,search}: MainMenuProps) => {
  const [apps,setapps]=useState(DESKTOP_APPS)
  useEffect(()=>{
  },[search])
  return (
    <div className="w-full h-full p-6 pb-0 flex flex-col gap-5">
        <section className="search px-3 w-full h-10 flex gap-4 items-center ring ring-gray-700/80 rounded-sm border-b-2 border-purple-700">
            <button className="flex scale-x-[-1] cursor-pointer"><IoIosSearch /></button>
            <input type="text" className="w-full h-full focus:outline-0" placeholder="Type here to search" value={search} onChange={(e)=>{
                    setSearch(e.target.value)
                }} autoFocus/>
        </section>
            <section className='flex '>
              {/* Recent apps */}
                <ul className={` flex-col gap-3 ${search?"hidden":"flex"}`}>
                    <h1>Recent</h1>
                      <li>
                        {/*recent apps */}
                      </li>
                </ul>
                {/* Search */}
                <ul className={`w-full flex-col gap-3 ${search ? "flex" : "hidden"}`}>
                  <h1>Installed Apps</h1>
                  <div className=' flex flex-col w-full'>
                  {apps
                      .filter((app) => 
                          app.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.id.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((app, index) => (
                          <li key={app.id || index} className='w-7/10 h-fit flex items-center relative gap-3 hover:bg-gray-700 px-2 rounded-md py-1'>
                            {!app.isIconpath?
                            <div className='m-2 text-xl'>
                            {app.icon}
                            </div>
                            :
                                <Image src={app.icon} width={50} height={50} alt={app.id} className='w-10'/>
                             }
                              {app.name}
                          </li>
                      ))
                  }
                  </div>
                  <h1 className='absolute top-1/2'>Web Search</h1>
              </ul>
                {/* right side */}
              <div className='w-full'>
              </div>
            </section>
    </div>
  )
}

export default SearchMenu