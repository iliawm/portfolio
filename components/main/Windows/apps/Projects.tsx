"use client";
import { Space_Grotesk } from "next/font/google";
import { Canvas } from "@react-three/fiber";
import WindowFrame from "../WindowFrame";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useEffect, useRef, useState } from "react";

import {
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";

import BmwModel from "@/components/models/Scene";
import Light from "@/components/model/Light";
import Image from "next/image";
import Link from "next/link";

type CarPreset = {
  name: string;
  color: string;

  baseColor: string;
  colouredPartsColor: string;
  carbonColor: string;
  darkColor: string;

  windshieldColor: string;
  glassColor: string;
  redGlassColor: string;
  emitColor: string;
  wmitRedColor: string;

  rimComponentColor: string;
  brakeDiscColor: string;
  rimColor: string;
  blackMetallicColor: string;
  tireColor: string;
};

const portfolioFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const PRESETS: CarPreset[] = [
  {
    name: "Shadow",
    color: "#111111",
    baseColor: "#0a0a0a",
    colouredPartsColor: "#181818",
    carbonColor: "#050505",
    darkColor: "#030303",
    windshieldColor: "#111111",
    glassColor: "#090909",
    redGlassColor: "#400000",
    emitColor: "#ffffff",
    wmitRedColor: "#ff0000",
    rimComponentColor: "#555555",
    brakeDiscColor: "#b71919",
    rimColor: "#0b0b0b",
    blackMetallicColor: "#151515",
    tireColor: "#050505",
  },
  {
    name: "Crimson",
    color: "#9f0f1d",
    baseColor: "#700913",
    colouredPartsColor: "#b51b2b",
    carbonColor: "#090909",
    darkColor: "#050505",
    windshieldColor: "#180606",
    glassColor: "#100303",
    redGlassColor: "#ff0015",
    emitColor: "#fff4f4",
    wmitRedColor: "#ff0015",
    rimComponentColor: "#b8b8b8",
    brakeDiscColor: "#ff3030",
    rimColor: "#151515",
    blackMetallicColor: "#202020",
    tireColor: "#050505",
  },
  {
    name: "Azure",
    color: "#0d4f9c",
    baseColor: "#0a376d",
    colouredPartsColor: "#1465bd",
    carbonColor: "#080b10",
    darkColor: "#05070a",
    windshieldColor: "#071321",
    glassColor: "#07101c",
    redGlassColor: "#4a0710",
    emitColor: "#dff3ff",
    wmitRedColor: "#ff2838",
    rimComponentColor: "#8d99a8",
    brakeDiscColor: "#d5d5d5",
    rimColor: "#13171d",
    blackMetallicColor: "#1d232b",
    tireColor: "#050609",
  },
  {
    name: "Titanium",
    color: "#8a8e94",
    baseColor: "#676b71",
    colouredPartsColor: "#a4a8ae",
    carbonColor: "#111214",
    darkColor: "#08090a",
    windshieldColor: "#1d1f22",
    glassColor: "#111315",
    redGlassColor: "#45080c",
    emitColor: "#ffffff",
    wmitRedColor: "#ff2b2b",
    rimComponentColor: "#d7d9dc",
    brakeDiscColor: "#9da1a6",
    rimColor: "#2b2e32",
    blackMetallicColor: "#3a3e43",
    tireColor: "#08090a",
  },
  {
    name: "Emerald",
    color: "#0d6b53",
    baseColor: "#084737",
    colouredPartsColor: "#148868",
    carbonColor: "#06110d",
    darkColor: "#030806",
    windshieldColor: "#06130f",
    glassColor: "#04100c",
    redGlassColor: "#320b0b",
    emitColor: "#eafff6",
    wmitRedColor: "#ff4141",
    rimComponentColor: "#b0b6b2",
    brakeDiscColor: "#d7dbd9",
    rimColor: "#0c1612",
    blackMetallicColor: "#17231e",
    tireColor: "#040706",
  },
];

const NORMAL_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#f5f5f5" },
  { name: "Red", value: "#d20f2f" },
  { name: "Blue", value: "#175ec8" },
  { name: "Green", value: "#13945f" },
  { name: "Silver", value: "#aeb3b8" },
  { name: "Yellow", value: "#d9ae16" },
  { name: "Purple", value: "#7137c8" },
];

type CarColors = {
  baseColor: string;
  colouredPartsColor: string;
  carbonColor: string;
  darkColor: string;
  windshieldColor: string;
  glassColor: string;
  redGlassColor: string;
  emitColor: string;
  wmitRedColor: string;
  rimComponentColor: string;
  brakeDiscColor: string;
  rimColor: string;
  blackMetallicColor: string;
  tireColor: string;
};

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

  const [color, setColor] = useState("#000000");
  const [selectedPreset, setSelectedPreset] = useState("Shadow");
  const [panelOpen, setPanelOpen] = useState(false);

  const [carColors, setCarColors] = useState<CarColors>({
    baseColor: "",
    colouredPartsColor: "",
    carbonColor: "",
    darkColor: "",
    windshieldColor: "",
    glassColor: "",
    redGlassColor: "",
    emitColor: "",
    wmitRedColor: "",
    rimComponentColor: "",
    brakeDiscColor: "",
    rimColor: "",
    blackMetallicColor: "",
    tireColor: "",
  });

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-car-controls]")) {
        return;
      }

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
      setShowNext(boundedNext >= 120);
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scroll]);

  const activePreset =
    PRESETS.find(
      (preset) => preset.name === selectedPreset
    ) ?? PRESETS[0];

  const carConfig = {
    baseColor:
      carColors.baseColor || activePreset.baseColor,
    colouredPartsColor:
      carColors.colouredPartsColor ||
      activePreset.colouredPartsColor,
    carbonColor:
      carColors.carbonColor || activePreset.carbonColor,
    darkColor:
      carColors.darkColor || activePreset.darkColor,
    windshieldColor:
      carColors.windshieldColor ||
      activePreset.windshieldColor,
    glassColor:
      carColors.glassColor || activePreset.glassColor,
    redGlassColor:
      carColors.redGlassColor ||
      activePreset.redGlassColor,
    emitColor:
      carColors.emitColor || activePreset.emitColor,
    wmitRedColor:
      carColors.wmitRedColor ||
      activePreset.wmitRedColor,
    rimComponentColor:
      carColors.rimComponentColor ||
      activePreset.rimComponentColor,
    brakeDiscColor:
      carColors.brakeDiscColor ||
      activePreset.brakeDiscColor,
    rimColor:
      carColors.rimColor || activePreset.rimColor,
    blackMetallicColor:
      carColors.blackMetallicColor ||
      activePreset.blackMetallicColor,
    tireColor:
      carColors.tireColor || activePreset.tireColor,
  };

  const selectPreset = (preset: CarPreset) => {
    setSelectedPreset(preset.name);
    setColor(preset.color);

    setCarColors({
      baseColor: preset.baseColor,
      colouredPartsColor: preset.colouredPartsColor,
      carbonColor: preset.carbonColor,
      darkColor: preset.darkColor,
      windshieldColor: preset.windshieldColor,
      glassColor: preset.glassColor,
      redGlassColor: preset.redGlassColor,
      emitColor: preset.emitColor,
      wmitRedColor: preset.wmitRedColor,
      rimComponentColor: preset.rimComponentColor,
      brakeDiscColor: preset.brakeDiscColor,
      rimColor: preset.rimColor,
      blackMetallicColor: preset.blackMetallicColor,
      tireColor: preset.tireColor,
    });
  };

  const selectNormalColor = (value: string) => {
    setSelectedPreset("");
    setColor(value);
  };

  const updateCarColor = (
    key: keyof CarColors,
    value: string
  ) => {
    setSelectedPreset("");

    setCarColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <WindowFrame
      appId={id}
      title="Portfolio"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      {/* 1st */}
      <motion.div className={`${portfolioFont.className} relative h-full w-full overflow-hidden bg-black`}>
        <div className="relative h-full w-full @sm:min-h-64 @md:min-h-72">
          <motion.section
            className="@container flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl p-4 @sm:min-h-64 @sm:gap-5 @sm:p-5 @md:min-h-72 @md:p-6"
            style={{
              background,
            }}
          >
            <motion.h1 className="mr-auto mb-auto w-fit max-w-full text-nowrap text-2xl font-black text-white mix-blend-difference @sm:text-3xl @md:text-4xl @lg:text-5xl">
              Hello, I'm Ilia.
            </motion.h1>

            <motion.h2
              className="h-fit w-fit text-nowrap text-2xl font-black mix-blend-difference @sm:text-3xl @md:text-4xl @lg:text-5xl"
              initial={{
                scale: 3,
              }}
              animate={{
                scale: showNext ? 200 : 1,
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

              <div className="mr-5 animate-bounce text-2xl font-bold opacity-85">
                scroll
              </div>
            </div>
          </motion.section>
                {/* 2nd */}
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
                  <Link href={"https://nextjs.org/"} target="__blank" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
                    Next.js
                  </Link>

                  <Link href={"https://threejs.org/"} target="__blank" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
                    Three.js
                  </Link>

                   <Link href={"https://motion.dev/"} target="__blank" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70">
                      Framer motion
                  </Link>
                </div>

                <div className="mt-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                    Explore
                  </div>

                  <p className="text-xs leading-relaxed text-white/50">
                    Rotate the vehicle and switch between different paint configurations.
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
                    baseColor={carConfig.baseColor}
                    colouredPartsColor={
                      carConfig.colouredPartsColor
                    }
                    carbonColor={carConfig.carbonColor}
                    darkColor={carConfig.darkColor}
                    windshieldColor={
                      carConfig.windshieldColor
                    }
                    glassColor={carConfig.glassColor}
                    redGlassColor={
                      carConfig.redGlassColor
                    }
                    emitColor={carConfig.emitColor}
                    wmitRedColor={
                      carConfig.wmitRedColor
                    }
                    rimComponentColor={
                      carConfig.rimComponentColor
                    }
                    brakeDiscColor={
                      carConfig.brakeDiscColor
                    }
                    rimColor={carConfig.rimColor}
                    blackMetallicColor={
                      carConfig.blackMetallicColor
                    }
                    tireColor={carConfig.tireColor}
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
                data-car-controls
                className="relative z-30 shrink-0 overflow-hidden border-t border-white/10 bg-black/90 text-white shadow-[0_-20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                animate={{
                  height: panelOpen ? 250 : 88,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex h-22 items-center justify-between gap-4 px-5 @md:px-8">
                  <div className="flex min-w-0 items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setPanelOpen((prev) => !prev)
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 active:scale-95"
                      aria-label={
                        panelOpen
                          ? "Collapse customization panel"
                          : "Expand customization panel"
                      }
                    >
                      <motion.span
                        animate={{
                          rotate: panelOpen ? 180 : 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="text-lg"
                      >
                        ↑
                      </motion.span>
                    </button>

                    <div className="min-w-0">
                      <div className="text-xl font-black @md:text-2xl">
                        BMW M4
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 @md:text-xs">
                        {selectedPreset
                          ? `${selectedPreset} configuration`
                          : "Custom configuration"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-full border border-white/20 shadow-lg"
                      style={{
                        backgroundColor: color,
                      }}
                    />

                    <div className="hidden text-right @md:block">
                      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                        Paint
                      </div>

                      <div className="text-sm font-semibold text-white/70">
                        {color}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="h-40.5 overflow-y-auto px-5 pb-6 @md:px-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25"
                  initial={false}
                  animate={{
                    opacity: panelOpen ? 1 : 0,
                    y: panelOpen ? 0 : 15,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  style={{
                    pointerEvents: panelOpen
                      ? "auto"
                      : "none",
                  }}
                  onWheel={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <div>
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Signature builds
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
                      {PRESETS.map((preset) => {
                        const active =
                          selectedPreset ===
                          preset.name;

                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() =>
                              selectPreset(
                                preset
                              )
                            }
                            className={`group relative flex min-w-31.25 shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                              active
                                ? "border-white/40 bg-white/10"
                                : "border-white/10 bg-white/3 hover:bg-white/[0.07]"
                            }`}
                          >
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: `radial-gradient(circle at 35% 35%, ${preset.color} 0%, ${preset.color} 45%, #050505 100%)`,
                                }}
                              />

                              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-xs font-black">
                                {preset.name}
                              </div>

                              <div className="mt-1 truncate text-[10px] text-white/40">
                                Full setup
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Paint colors
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {NORMAL_COLORS.map((paint) => {
                        const active =
                          selectedPreset === "" &&
                          color.toLowerCase() ===
                            paint.value.toLowerCase();

                        return (
                          <button
                            key={paint.name}
                            type="button"
                            onClick={() =>
                              selectNormalColor(
                                paint.value
                              )
                            }
                            className={`group flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                              active
                                ? "border-white/40 bg-white/10"
                                : "border-white/10 bg-white/3 hover:bg-white/8"
                            }`}
                          >
                            <span
                              className="h-5 w-5 rounded-full border border-white/15"
                              style={{
                                backgroundColor:
                                  paint.value,
                              }}
                            />

                            <span className="text-xs font-bold text-white/70">
                              {paint.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Body
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          name: "Body",
                          key: "baseColor" as const,
                        },
                        {
                          name: "Trim",
                          key: "colouredPartsColor" as const,
                        },
                       
                      ].map((item) => {
                        const value =
                          carColors[item.key] ||
                          activePreset[item.key];

                        return (
                          <div
                            key={item.key}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-2"
                          >
                            <span className="text-xs font-bold text-white/60">
                              {item.name}
                            </span>

                            <input
                              type="color"
                              value={value}
                              onChange={(event) =>
                                updateCarColor(
                                  item.key,
                                  event.target.value
                                )
                              }
                              className="h-5 w-5 cursor-pointer overflow-hidden rounded-full border-0 bg-transparent p-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Glass & lights
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          name: "Windshield",
                          key: "windshieldColor" as const,
                        },
                        {
                          name: "back brake light",
                          key: "redGlassColor" as const,
                        },
                       
                      ].map((item) => {
                        const value =
                          carColors[item.key] ||
                          activePreset[item.key];

                        return (
                          <div
                            key={item.key}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-2"
                          >
                            <span className="text-xs font-bold text-white/60">
                              {item.name}
                            </span>

                            <input
                              type="color"
                              value={value}
                              onChange={(event) =>
                                updateCarColor(
                                  item.key,
                                  event.target.value
                                )
                              }
                              className="h-5 w-5 cursor-pointer overflow-hidden rounded-full border-0 bg-transparent p-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Wheels
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          name: "Rim",
                          key: "rimComponentColor" as const,
                        },
                        {
                          name: "Brake",
                          key: "brakeDiscColor" as const,
                        },
                        {
                          name: "Ring",
                          key: "rimColor" as const,
                        },
                        {
                          name: "tire screw",
                          key: "blackMetallicColor" as const,
                        },
                        {
                          name: "Tire",
                          key: "tireColor" as const,
                        },
                      ].map((item) => {
                        const value =
                          carColors[item.key] ||
                          activePreset[item.key];

                        return (
                          <div
                            key={item.key}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-2"
                          >
                            <span className="text-xs font-bold text-white/60">
                              {item.name}
                            </span>

                            <input
                              type="color"
                              value={value}
                              onChange={(event) =>
                                updateCarColor(
                                  item.key,
                                  event.target.value
                                )
                              }
                              className="h-5 w-5 cursor-pointer overflow-hidden rounded-full border-0 bg-transparent p-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
          {/* 3rd */}
        </div>
      </motion.div>
    </WindowFrame>
  );
}
