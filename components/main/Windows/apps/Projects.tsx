"use client";

import WindowFrame from "../WindowFrame";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
    stiffness: 100,
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
      console.log(next)
    if (next < 0) {
      scroll.set(0);
    } else if (next > 1000) {
      scroll.set(1000);
    } else if (next >= 0 && next <= 1000) {
      scroll.set(next);
    }

    if (event.deltaY > 0) {
      setShowNext(true);
    } else if (event.deltaY < 0) {
      setShowNext(false);
    }
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

            <motion.h2 className="h-fit w-fit text-nowrap text-2xl font-black mix-blend-difference text-white  @sm:text-3xl @md:text-4xl @lg:text-5xl"
            initial={{
                scale:1,
                // background:"",
              }}
            animate={{
              scale: showNext ? 200 : 1,
              
              color: showNext ? "black" :"unset",
              mixBlendMode:showNext ? "unset" :"difference",
              // background:showNext ? "black" :"unset",
            }}
              transition={{
                delay:1,
              duration: 1.2,
              ease: "easeInOut",
            }}>
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
            className="@container absolute inset-0 flex min-h-56 w-full items-center gap-4 rounded-2xl bg-black p-4"
            initial={{
              opacity: 0,
              y: 100,
            }}
            animate={{
              opacity: showNext ? 1 : 0,
              y: showNext ? 0 : 100,
              zIndex:showNext ? 20 : 0,
            }}
            transition={{
              delay: 1.5,
              duration: 0.5,
              ease: "linear",
            }}
          >
            
          </motion.section>
        </div>
      </motion.div>
    </WindowFrame>
  );
}