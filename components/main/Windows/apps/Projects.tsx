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
import { Box, OrbitControls } from "@react-three/drei";
import BmwModel from "@/components/models/Scene";
import Light from "@/components/model/Light";


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
    const next = current + event.deltaY;

    let boundedNext;

    if (next < 0) {
      boundedNext = 0;
    } else if (next > 1000) {
      boundedNext = 1000;
    } else {
      boundedNext = next;
    }

    scroll.set(boundedNext);

    if (boundedNext >= 100) {
      setShowNext(true);
    } else if (boundedNext < 100) {
      setShowNext(false);
    }

    console.log(boundedNext);
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
                scale: 1,
              }}
              animate={{
                scale: showNext ? 200 : 1,
                // mixBlendMode: showNext ? "unset" : "difference",
              }}
              transition={{
                delay: showNext ? 0.7 : 0,
                duration: 1.2,
                ease: "easeInOut",
              }}
            >
              I'm a fullstack dev
            </motion.h2>

            <div className="mt-auto mb-10 flex w-full flex-col items-start justify-between gap-4 @sm:flex-row @sm:items-end">
              <p className="max-w-xs text-xs font-black text-white mix-blend-difference @sm:text-sm @md:text-xl">
                My Name is Ilia. im 22 Years old and im from iran
              </p>

              <div className="font-bold opacity-85 animate-bounce mr-5">
                scroll
              </div>
            </div>
          </motion.section>

          <motion.section
            className="@container absolute inset-0 flex min-h-screen w-full items-center gap-4  bg-white p-4"
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
              delay: 1,
              duration: 0.3,
              ease: "linear",
            }}
          >
            <div className="bg-cyan-900 w-8/10 h-6/10 ">

            </div>
            <Canvas id="canvas" camera={{position:[1,0.7,2], fov:50 ,near:1,far:100}} >
              
              <Light/>
              <BmwModel scale={0.06} position={[0.3,0,0.3]}/>
              
              <OrbitControls enableZoom={false}/>
            </Canvas>
          </motion.section>
        </div>
      </motion.div>
    </WindowFrame>
  );
}