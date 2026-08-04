"use client"
import { CiSearch } from "react-icons/ci";
import Image from "next/image"
import { useEffect, useState } from "react"
import MainMenu from "./Menu/MainMenu"
import SearchMenu from "./Menu/SearchMenu"
import { useTheme } from "next-themes"
import { FaCheck } from "react-icons/fa6";
const TaskBar = () => {
    const [Menu, SetMenu] = useState(false)
    const [menuIndex, SetMenuIndex] = useState(0)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [countdown, setCountdown] = useState(0); 
    const [Mode, setMode] = useState(4);
    const [name,setName]=useState("")
    

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
    useEffect(()=>{
        if(Mode===4)return;
        if(Mode===2){
            setName("GitHub")
        }
        if(Mode===0){
            setName("LinkedIn")
        }
        if(Mode===1){
            setName("FrontEnd Mentor")
        }
    },[Mode])
    const renderMenu = () => {
        switch (menuIndex) {
            case 0:
                return <div className="w-full h-full"><MainMenu shutmenu={Menu} countdown={countdown} setCountdown={setCountdown} Mode={Mode} setMode={setMode}/></div>
            case 1:
                return <div className="w-full h-full"><SearchMenu/></div>
            default:
                return <div className="w-full h-full"><MainMenu shutmenu={Menu} countdown={countdown} setCountdown={setCountdown}  Mode={Mode} setMode={setMode}/></div>
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
           {/* manage shutdown */}
           <div className={`fixed top-25 -right-101 w-fit bg-blue-500 h-fit flex px-4 py-5 justify-start rounded-lg items-center gap-5 font-bold transition-all ease-linear  ${Mode!==4?"-translate-x-101":""}`}>
                <div className="text-green-400 text-xl"><FaCheck /></div>
                <div className=" text-xl ">Your will visit Iliawms {name||"Github"} in {countdown}</div>
            </div>
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