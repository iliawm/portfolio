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
import {  ContactShadows, OrbitControls } from "@react-three/drei";
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
            className="absolute inset-0 flex h-full w-full flex-col overflow-hidden bg-black"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: showNext ? 1 : 0,
              zIndex: showNext ? 20 : 0,
              pointerEvents: showNext ? "auto" : "none",
            }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0">
              <Image
                src="/bg/bg.png"
                alt="Background"
                fill
                className="object-cover opacity-20 grayscale"
                priority
              />
              <div className="absolute inset-0 bg-black/70" />
            </div>

            <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">

              <div className="absolute left-5 top-5 z-20 w-70 max-w-[40%] rounded-2xl border border-white/10 bg-black/50 p-5 text-white backdrop-blur-xl @md:left-8 @md:top-8 @md:p-6">
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                  Featured Project
                </div>

                <h1 className="text-3xl font-black leading-none @md:text-5xl">
                  BMW M4
                </h1>

                <p className="mt-3 text-sm font-medium text-white/60 @md:text-base">
                  Interactive 3D automotive experience.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
                    Next.js
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
                    Three.js
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
                    R3F
                  </span>
                </div>

                <div className="mt-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                    Explore
                  </div>

                  <p className="text-xs leading-relaxed text-white/50">
                    Rotate the vehicle and switch between different paint
                    configurations.
                  </p>
                </div>
              </div>

              <div className="relative min-h-0 flex-1">
                <Canvas
                  id="canvas"
                  camera={{
                    position: [1.8, 0.5, 2],
                    fov: 30,
                    near: 1,
                    far: 50,
                  }}
                  className="h-full w-full"
                >
                  <Light />

                  <ambientLight intensity={0.3} />

                  <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0.1, -0.1, 0]}
                  >
                    <circleGeometry args={[4, 96]} />
                    <meshStandardMaterial
                      color="#111111"
                      roughness={0.65}
                      metalness={0.2}
                    />
                  </mesh>

                  <BmwModel
                    scale={0.1}
                    position={[0.4, -0.1, 0]}
                    color={color}
                  />

                  <ContactShadows
                    position={[0.1, -0.08, 0]}
                    opacity={0.65}
                    scale={6}
                    blur={2}
                    far={4}
                  />

                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.2}
                  />
                </Canvas>
              </div>

              <motion.div
                className="relative z-20 flex h-24 shrink-0 items-center justify-between gap-6 border-t border-white/10 bg-black/60 px-6 backdrop-blur-2xl @md:px-10"
                initial={{
                  y: 80,
                  opacity: 0,
                }}
                animate={{
                  y: showNext ? 0 : 80,
                  opacity: showNext ? 1 : 0,
                }}
                transition={{
                  delay: showNext ? 1 : 0,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xl font-black text-white @md:text-2xl">
                      BMW M4
                    </div>
                    <div className="text-xs font-medium uppercase tracking-widest text-white/40">
                      Paint
                    </div>
                  </div>

                  <div className="h-8 w-px bg-white/10" />

                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Red"
                      className="h-10 w-10 rounded-full bg-red-600 ring-1 ring-white/10 transition-transform hover:scale-110 active:scale-90"
                      onClick={() => setColor("red")}
                    />

                    <button
                      aria-label="Blue"
                      className="h-10 w-10 rounded-full bg-blue-700 ring-1 ring-white/10 transition-transform hover:scale-110 active:scale-90"
                      onClick={() => setColor("blue")}
                    />

                    <button
                      aria-label="Black"
                      className="h-10 w-10 rounded-full bg-black ring-1 ring-white/40 transition-transform hover:scale-110 active:scale-90"
                      onClick={() => setColor("black")}
                    />
                  </div>
                </div>

                <div className="hidden text-right @md:block">
                  <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
                    Interactive 3D
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/70">
                    Drag to explore
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </WindowFrame>
  );
}