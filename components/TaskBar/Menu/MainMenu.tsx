import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { RiArrowRightWideLine } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { MdRestartAlt } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";

interface MainMenuProps {
    shutmenu: boolean;
    countdown: number;
    setCountdown: React.Dispatch<React.SetStateAction<number>>;
    Mode: number;
    setMode: React.Dispatch<React.SetStateAction<number>>;
}

const MainMenu = ({ shutmenu, countdown, setCountdown, Mode, setMode }: MainMenuProps) => {
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        if (countdown === 0) return;
        const timer = setTimeout(() => {
            setCountdown((prev: number) => prev - 1);
        }, 1000);
        console.log(countdown);
        if (countdown === 1 && Mode === 2) {
            window.location.href = "https://github.com/iliawm";
        }
        if (countdown === 1 && Mode === 0) {
            window.location.href = "https://www.linkedin.com/in/psychowm";
        }
        if (countdown === 1 && Mode === 1) {
            window.location.href = "https://www.frontendmentor.io/profile/iliawm?tab=progress#skills-profile";
        }
        return () => clearTimeout(timer);
    }, [countdown, Mode, setCountdown]);

    useEffect(() => {
        if (!shutmenu) {
            setMenu(false);
        }
    }, [shutmenu]);

    return (
        <div className="w-full h-full p-7 pb-0 flex flex-col gap-5">
            <section className="search px-3 w-full h-12 flex gap-4 items-center ring ring-gray-700/80 rounded-sm border-b-2 border-purple-700">
                <button className="flex scale-x-[-1] cursor-pointer"><IoIosSearch /></button>
                <input type="text" className="w-full h-full focus:outline-0" placeholder="Type here to search" />
            </section>

            <div className="w-full h-full flex flex-col justify-start gap-5 rounded-xl">
                <section className="w-full h-fit min-h-30 flex flex-col">
                    <div className="flex justify-between items-center px-5 py-3">
                        <h1>Pinned</h1>
                        <button className="flex gap-1 items-center bg-[#343434]/70 backdrop-blur-2xl px-2 py-1 rounded-lg cursor-pointer hover:scale-[1.07] active:scale-[1]">
                            <h3>All apps</h3>
                            <div className="icon"><RiArrowRightWideLine /></div>
                        </button>
                    </div>
                    <div></div>
                </section>

                <section className="w-full h-fit min-h-30 flex flex-col">
                    <div className="flex justify-between items-center px-5 py-3">
                        <h1>Recommended</h1>
                        <button className="flex gap-1 items-center bg-[#343434]/70 backdrop-blur-2xl px-2 py-1 rounded-lg cursor-pointer hover:scale-[1.07] active:scale-[1]">
                            <h3>More</h3>
                            <div className="icon"><RiArrowRightWideLine /></div>
                        </button>
                    </div>
                    <div></div>
                </section>
            </div>

            <div className="profile flex items-center justify-between relative bottom-0 w-full h-20 px-3 mb-1">
                <div className="User flex gap-2 items-center py-4">
                    <div className="w-8 h-8 relative">
                        <Image src={'/pfp/me.jpg'} fill className="rounded-full" alt="Userpfp" sizes="auto"/>
                    </div>
                    <h3 className="font-bold">Iliawm</h3>
                </div>

                <div className="buttons flex justify-center">
                    <button
                        className={`shotdown transition-all ease-linear duration-400 hover:bg-gray-600 ${menu ? "bg-gray-600 animate-pulse" : ""} transition-all duration-100 ease-linear px-3 py-2 cursor-pointer rounded-lg hover:scale-[1.06] active:scale-[1]`}
                        onClick={() => setMenu(!menu)}
                    >
                        <FaPowerOff />
                    </button>

                    <div className={`absolute w-fit mr-10 bg-[#1a1a1a]/40 backdrop-blur-2xl bottom-15 shadow shadow-gray-700/60 rounded-xl border border-gray-700/40 p-3 px-4 flex flex-col transition-all ease-linear h-fit ${menu ? "opacity-100" : "opacity-0 pointer-events-none"} text-sm border-gray-700/60`}>
                        <button
                            className="shotdown flex gap-2.5 items-center text-nowrap cursor-pointer hover:scale-[1.05] active:scale-[1] transition-all ease-linear hover:bg-white/10 rounded-md px-1 py-1"
                            onClick={() => {
                                setMode(2);
                                setCountdown(10);
                            }}
                        >
                            <span className="flex scale-x-[-1]"><IoMoonOutline /></span>
                            <div>Github</div>
                        </button>

                        <button
                            className="shotdown flex gap-2.5 items-center text-nowrap cursor-pointer hover:scale-[1.05] active:scale-[1] transition-all ease-linear hover:bg-white/10 rounded-md px-1 py-1"
                            onClick={() => {
                                setMode(0);
                                setCountdown(10);
                            }}
                        >
                            <span><FaPowerOff /></span>
                            <div>LinkedIn</div>
                        </button>

                        <button
                            className="shotdown flex gap-2.5 items-center text-nowrap cursor-pointer hover:scale-[1.05] active:scale-[1] transition-all ease-linear hover:bg-white/10 rounded-md px-1 py-1"
                            onClick={() => {
                                setMode(1);
                                setCountdown(10);
                            }}
                        >
                            <span><MdRestartAlt /></span>
                            <div>FrontEndMentor</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;