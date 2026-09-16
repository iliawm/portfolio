"use client";

import { Canvas } from "@react-three/fiber";
import WindowFrame from "../WindowFrame";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {  OrbitControls } from "@react-three/drei";
import BmwModel from "@/components/models/Scene";
import Light from "@/components/model/Light";
import Image from "next/image";



export default function Projects({
  id,
  onClose,
  onMinimize,
  minimized,
}: {
  id: string;
  onClose: () => void;
  onMinimize: () => void;
  minimized?: boolean;
}) {
  const scroll = useMotionValue(0);
    const [color,setColor]=useState("black")
  const smoothScroll = useSpring(scroll, {
    stiffness: 40,
    damping: 20,
  });

  const background = useTransform(
    smoothScroll,
    [0, 100],
    [
      "linear-gradient(155deg, white 50%, black 50%)",
      "linear-gradient(90deg, white 50%, black 50%)",
    ]
  );

  const [showNext, setShowNext] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  const handleWheel = (event: WheelEvent) => {
    const current = scroll.get();

    const next =
      event.deltaY > 0
        ? current + 120
        : current - 120;

    let boundedNext;

    if (next < 0) {
      boundedNext = 0;
    } else if (next > 1000) {
      boundedNext = 1000;
    } else {
      boundedNext = next;
    }

    scroll.set(boundedNext);

    if (boundedNext >= 120) {
      setShowNext(true);
    } else if (boundedNext < 120) {
      setShowNext(false);
    }

;
  };

  window.addEventListener("wheel", handleWheel);

  return () => {
    window.removeEventListener("wheel", handleWheel);
  };
}, [scroll]);

  return (
    <WindowFrame
      appId={id}
      title="Portfolio"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      <motion.div className="relative h-full w-full overflow-hidden bg-black">
        <div className="relative h-full w-full @sm:min-h-64 @md:min-h-72">
          <motion.section
            className="@container flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl p-4 @sm:min-h-64 @sm:gap-5 @sm:p-5 @md:min-h-72 @md:p-6"
            style={{
              background,
            }}
            
          >
            <motion.h1 className="mr-auto mb-auto w-fit max-w-full text-nowrap text-2xl font-black text-white mix-blend-difference @sm:text-3xl @md:text-4xl @lg:text-5xl" >
              Hello im Iliawm
            </motion.h1>
            <motion.h2
              className={`h-fit w-fit text-nowrap text-2xl font-black mix-blend-difference @sm:text-3xl @md:text-4xl @lg:text-5xl `}
              initial={{
                scale: 3,
              }}
              animate={{
                scale: showNext ? 200 : 1,
                // mixBlendMode: showNext ? "unset" : "difference",
              }}
              transition={{
                delay: showNext ? 0.7 : 0,
                duration: 1,
                ease: "easeInOut",
              }}
            >
              I'm a fullstack dev
            </motion.h2>

            <div className="mt-auto mb-10 flex w-full flex-col items-start justify-between gap-4 @sm:flex-row @sm:items-end">
              <p className="max-w-xs text-xs font-black text-white mix-blend-difference @sm:text-sm @md:text-xl">
                My Name is Ilia. im 22 Years old and im from iran
              </p>

              <div className="font-bold opacity-85 animate-bounce mr-5 text-2xl">
                scroll
              </div>
            </div>
          </motion.section>

          <motion.section
            className="@container absolute  inset-0 flex h-full w-full items-center gap-4  bg-black "
            initial={{
              opacity: 0,
              y: 0,
            }}
            animate={{
              opacity: showNext ? 1 : 0,
              display:showNext ? "hidden" : "flex",
              
              zIndex:showNext ? 20 : 0,
            }}
            transition={{
              delay: 0.5,
              duration: 1,
              ease: "linear",
            }}
          > <div className="absolute -z-10 w-full h-full inset-0">
            <Image src={"/bg/bg.png"} alt={"background"} width={1920} height={1080} className="w-full h-full "/>
          </div>
            <div className="bg-black/65 w-4/10 h-9/10 ml-3 flex flex-col p-3 rounded-2xl text-white font-semibold text-pretty text-2xl">
              hello everyone
            </div>
            <div className="w-full h-full flex flex-col py-10">
            <Canvas id="canvas" camera={{position:[1.8,0.5,2], fov:30 ,near:1,far:50}} className="w-full h-full">

              <Light/>
              <BmwModel scale={0.1} position={[0.4,-0.1,0]} color={color}/>
              
              <OrbitControls enableZoom={false} rotateSpeed={0.2} enablePan={false}/>
            </Canvas>
            <div className="w-full h-30  rounded-2xl flex items-center p-10 gap-10 bg-white/55 overflow-hidden transition-all ">
              <motion.div className="w-full h-full flex items-center gap-5 " 
              initial={{
                x:-200
              }}
              animate={{
                x:showNext?0:-200
              }}
              transition={{
                delay:0.6,
                duration:1,
                ease:"linear",
              }}
              
              >
                
                <h1 className="bg-[linear-gradient(135deg,#007ae6,#4f2ca9,#ec0000)] from-33% via-33% to-33% bg-clip-text text-transparent text-4xl font-black ">BMW M4</h1>
                  <button className="w-14 h-14 bg-red-600 rounded-full hover:opacity-80 cursor-pointer active:scale-[0.9]" onClick={()=>{setColor("red")}}></button>
                  <button className="w-14 h-14 bg-blue-700 rounded-full hover:opacity-80 cursor-pointer active:scale-[0.9]" onClick={()=>{setColor("blue")}}></button>
                  <button className="w-14 h-14 bg-black rounded-full hover:opacity-80 cursor-pointer active:scale-[0.9] border" onClick={()=>{setColor("black")}}></button>
            </motion.div>
            </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </WindowFrame>
  );
}