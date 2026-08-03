"use client"
import { CiSearch } from "react-icons/ci";
import Image from "next/image"
import { useEffect, useState } from "react"
import MainMenu from "./Menu/MainMenu"
import SearchMenu from "./Menu/SearchMenu"
import { useTheme } from "next-themes"

const TaskBar = () => {
    const [Menu, SetMenu] = useState(false)
    const [menuIndex, SetMenuIndex] = useState(0)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        renderMenu()
        setTheme("dark")
    }, [menuIndex])
    useEffect(()=>{
        // 

    })
    const renderMenu = () => {
        switch (menuIndex) {
            case 0:
                return <div className="w-full h-full"><MainMenu/></div>
            case 1:
                return <div className="w-full h-full"><SearchMenu/></div>
            default:
                return <div className="w-full h-full"><MainMenu/></div>
        }
    }


    if (!mounted) {
        return (
            <section className="w-full h-15 bg-[#1A1A1A] fixed bottom-0 flex justify-center items-center py-2 gap-2 invisible md:visible">
                <div className="w-12 h-12"></div>
                <div className="w-12 h-12"></div>
            </section>
        )
    }

    const currentTheme = resolvedTheme || theme

    return (
        <section className={`w-full h-15 ${currentTheme === "dark" ? "bg-[#1A1A1A]" : "bg-[#FFFFFF]"} fixed bottom-0 flex z-40 justify-center items-center py-2 gap-2 invisible md:visible`}>
            <div className={`absolute h-140 w-120 lg:w-170 lg:h-170 ${theme==="dark" ? "bg-[#1A1A1A]/80 backdrop-blur-2xl":"bg-white"} transition-all bottom-19 z-30 rounded-xl ${Menu ? "opacity-100 translate-y-0" : "translate-y-4 opacity-0 pointer-events-none"}`}>
            {renderMenu()}
            </div>

            {/* WINDOWS */}
            <button className={`${menuIndex===0 && Menu ? (theme==="dark"? "bg-gray-600": "bg-gray-200"):""} cursor-pointer w-12 h-full relative ${theme==="dark"?"hover:bg-gray-600":"hover:bg-gray-200"} rounded-lg hover:scale-[1.1] active:scale-[1]`} onClick={() => {
                if (menuIndex !== 0 && Menu) {
                    SetMenu(true)
                    SetMenuIndex(0)
                } else {
                    SetMenu(!Menu)
                    SetMenuIndex(0)
                }
            }}>
                <Image alt="winbtn" fill loading="eager" src={'/buttons/windbtn.png'} className="w-full h-full p-2.5" sizes="100"/>
            </button>

            {/* SEARCH */}
            <button className={`${menuIndex===1 && Menu ? (theme==="dark"? "bg-gray-600": "bg-gray-200"):""} cursor-pointer w-12 h-full relative ${theme==="dark"?"hover:bg-gray-600":"hover:bg-gray-200"} rounded-lg hover:scale-[1.1] active:scale-[1]`} onClick={() => {
                if (menuIndex !== 1 && Menu) {
                    SetMenu(true)
                    SetMenuIndex(1)
                } else {
                    SetMenu(!Menu)
                    SetMenuIndex(1)
                }
            }}>
                <div className={`${theme==="dark"?"text-white":"text-black"} flex items-center justify-center text-3xl scale-x-[-1] font-bold `}>
                    <CiSearch />
                </div>
            </button>
        </section>
    )
}

export default TaskBar