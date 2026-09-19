"use client";

import { Space_Grotesk } from "next/font/google";
import { Canvas } from "@react-three/fiber";
import WindowFrame from "../WindowFrame";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
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

const PROJECTS = [
  {
    id: "shopping",
    title: "Shopping Website",
    tag: "E-commerce",
    stack: ["Next.js 16", "React 19", "MongoDB", "Auth"],
    summary:
      "Full-stack store with product browsing, cart, checkout, user auth and an admin panel for products and orders.",
    link: "https://github.com/iliawm/ShoppingWebsite",
    image: "/projects/shopping.png",
  },
  {
    id: "teaching",
    title: "Teaching Website",
    tag: "E-commerce + Learning",
    stack: ["Next.js", "MongoDB", "Better Auth", "Tailwind"],
    summary:
      "Combined learning platform and shop with auth, cart, search and a mobile-first user dashboard.",
    link: "https://github.com/iliawm/teaching-website",
    image: "/projects/teaching.png",
  },
  {
    id: "portfolio",
    title: "Desktop Portfolio",
    tag: "OS UI",
    stack: ["Next.js", "Framer Motion", "Three.js", "Zustand"],
    summary:
      "Windowed desktop experience with apps, taskbar and this interactive 3D showcase.",
    link: "https://github.com/iliawm/portfolio",
    image: "/projects/portfolio.png",
  },
  {
    id: "offset",
    title: "Offset UI",
    tag: "Component library",
    stack: ["Next.js 15", "TypeScript", "Tailwind"],
    summary:
      "Minimal reusable UI kit focused on clean architecture and customizable components.",
    link: "https://github.com/iliawm/Offset_ui",
    image: "/projects/offset.png",
  },
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

function Cutout({
  showThird,
  children,
}: {
  showThird: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask
          id="cutout-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1600"
          height="900"
        >
          <rect x="0" y="0" width="1600" height="900" fill="white" />
          <motion.text
            x="800"
            y="450"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="230"
            fontWeight="900"
            letterSpacing="-12"
            initial={{ scale: 1.5 }}
            animate={{
              y: showThird ? 10 : 1,
              scale: showThird ? 330 : 1,
            }}
            transition={{
              delay: 1,
              duration: 1,
              ease: "easeInOut",
            }}
          >
            {children}
          </motion.text>
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="1600"
        height="900"
        fill="black"
        mask="url(#cutout-mask)"
      />
    </motion.svg>
  );
}

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
  const [showThird, setShowThird] = useState(false);
  const [showFourth, setShowFourth] = useState(false);
  const [expandedId, setExpandedId] = useState("shopping");

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
    scroll.set(0);
    setShowNext(false);
    setShowThird(false);
    setShowFourth(false);
    setExpandedId("shopping");
    setPanelOpen(false);
  }, [scroll]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-car-controls]")) {
        return;
      }

      const current = scroll.get();
      const next = event.deltaY > 0 ? current + 120 : current - 120;

      let boundedNext;
      if (next < 0) boundedNext = 0;
      else if (next > 1000) boundedNext = 1000;
      else boundedNext = next;

      scroll.set(boundedNext);

      setShowNext(boundedNext >= 120);
      setShowThird(boundedNext >= 240);
      setShowFourth(boundedNext >= 360);
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scroll]);

  const activePreset =
    PRESETS.find((preset) => preset.name === selectedPreset) ?? PRESETS[0];

  const carConfig = {
    baseColor: carColors.baseColor || activePreset.baseColor,
    colouredPartsColor:
      carColors.colouredPartsColor || activePreset.colouredPartsColor,
    carbonColor: carColors.carbonColor || activePreset.carbonColor,
    darkColor: carColors.darkColor || activePreset.darkColor,
    windshieldColor: carColors.windshieldColor || activePreset.windshieldColor,
    glassColor: carColors.glassColor || activePreset.glassColor,
    redGlassColor: carColors.redGlassColor || activePreset.redGlassColor,
    emitColor: carColors.emitColor || activePreset.emitColor,
    wmitRedColor: carColors.wmitRedColor || activePreset.wmitRedColor,
    rimComponentColor:
      carColors.rimComponentColor || activePreset.rimComponentColor,
    brakeDiscColor: carColors.brakeDiscColor || activePreset.brakeDiscColor,
    rimColor: carColors.rimColor || activePreset.rimColor,
    blackMetallicColor:
      carColors.blackMetallicColor || activePreset.blackMetallicColor,
    tireColor: carColors.tireColor || activePreset.tireColor,
  };

  const activeProject =
    PROJECTS.find((p) => p.id === expandedId) ?? PROJECTS[0];

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

  const updateCarColor = (key: keyof CarColors, value: string) => {
    setSelectedPreset("");
    setCarColors((prev) => ({ ...prev, [key]: value }));
  };

  const page1Visible = !showNext;
  const page2Visible = showNext && !showThird;
  const page3Visible = showThird && !showFourth;
  const page4Visible = showFourth;

  return (
    <WindowFrame
      appId={id}
      title="Portfolio"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      <motion.div
        className={`${portfolioFont.className} relative h-full w-full overflow-hidden bg-black`}
      >
        <div className="relative h-full w-full @sm:min-h-64 @md:min-h-72">
          <motion.section
            className="@container absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden p-6 @sm:p-8 @md:p-10"
            style={{ background }}
            animate={{
              opacity: page1Visible ? 1 : 0,
              zIndex: page1Visible ? 10 : 0,
              pointerEvents: page1Visible ? "auto" : "none",
            }}
            transition={{
              opacity: { delay: showNext ? 1.5 : 0, duration: 0.3 },
              zIndex: { delay: showNext ? 1.5 : 0 },
              pointerEvents: { delay: showNext ? 1.5 : 0 },
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mix-blend-difference">
                  Ilia Bayat
                </p>
                <p className="mt-1 text-xs font-medium text-white/70 mix-blend-difference">
                  Tehran · Available for work
                </p>
              </div>
              <div className="hidden gap-2 @md:flex">
                <span className="rounded-full border border-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white mix-blend-difference">
                  Next.js
                </span>
                <span className="rounded-full border border-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white mix-blend-difference">
                  Three.js
                </span>
                <span className="rounded-full border border-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white mix-blend-difference">
                  TypeScript
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white mix-blend-difference">
                Hello
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white mix-blend-difference @sm:text-5xl @md:text-6xl @lg:text-7xl">
                I build fast,
                <br />
                interactive products.
              </h1>
              <motion.h2
                className="mt-2 h-fit w-fit text-nowrap text-lg font-semibold text-white mix-blend-difference @md:text-xl"
                initial={{ scale: 3 }}
                animate={{ scale: showNext ? 200 : 1 }}
                transition={{
                  delay: showNext ? 0.7 : 0,
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                Fullstack engineer · UI focused
              </motion.h2>
            </div>

            <div className="flex items-end justify-between gap-4">
              <p className="max-w-xs text-left text-xs leading-relaxed text-white mix-blend-difference @sm:text-sm">
                My name is Ilia. I&apos;m 22 years old and I&apos;m from Iran. I
                ship polished web apps with a focus on performance and motion.
              </p>
              <div className="flex flex-col items-end gap-1">
                <span className="animate-bounce text-sm font-bold uppercase tracking-[0.3em] text-white mix-blend-difference">
                  Scroll
                </span>
                <span className="text-[10px] text-white/60 mix-blend-difference">
                  to explore
                </span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="absolute inset-0 flex h-full w-full flex-col overflow-hidden bg-black"
            initial={false}
            animate={{
              opacity: page2Visible ? 1 : 0,
              zIndex: page2Visible ? 20 : 0,
              pointerEvents: page2Visible ? "auto" : "none",
            }}
            transition={{
              delay: page2Visible ? 0.5 : 0,
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
                  Interactive 3D configurator — real-time materials, lighting and
                  paint systems built with React Three Fiber.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="https://nextjs.org/"
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70"
                  >
                    Next.js
                  </Link>
                  <Link
                    href="https://threejs.org/"
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70"
                  >
                    Three.js
                  </Link>
                  <Link
                    href="https://motion.dev/"
                    target="_blank"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/70"
                  >
                    Framer Motion
                  </Link>
                </div>
                <div className="mt-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                    Explore
                  </div>
                  <p className="text-xs leading-relaxed text-white/50">
                    Rotate the vehicle and switch between paint configurations.
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
                    colouredPartsColor={carConfig.colouredPartsColor}
                    carbonColor={carConfig.carbonColor}
                    darkColor={carConfig.darkColor}
                    windshieldColor={carConfig.windshieldColor}
                    glassColor={carConfig.glassColor}
                    redGlassColor={carConfig.redGlassColor}
                    emitColor={carConfig.emitColor}
                    wmitRedColor={carConfig.wmitRedColor}
                    rimComponentColor={carConfig.rimComponentColor}
                    brakeDiscColor={carConfig.brakeDiscColor}
                    rimColor={carConfig.rimColor}
                    blackMetallicColor={carConfig.blackMetallicColor}
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
                animate={{ height: panelOpen ? 250 : 88 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex h-22 items-center justify-between gap-4 px-5 @md:px-8">
                  <div className="flex min-w-0 items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPanelOpen((prev) => !prev)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 active:scale-95"
                    >
                      <motion.span
                        animate={{ rotate: panelOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
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
                      style={{ backgroundColor: color }}
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
                  className="h-40.5 overflow-y-auto px-5 pb-6 @md:px-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15"
                  initial={false}
                  animate={{
                    opacity: panelOpen ? 1 : 0,
                    y: panelOpen ? 0 : 15,
                  }}
                  transition={{ duration: 0.25 }}
                  style={{ pointerEvents: panelOpen ? "auto" : "none" }}
                  onWheel={(event) => event.stopPropagation()}
                >
                  <div>
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Signature builds
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {PRESETS.map((preset) => {
                        const active = selectedPreset === preset.name;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => selectPreset(preset)}
                            className={`group relative flex min-w-31.25 shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                              active
                                ? "border-white/40 bg-white/10"
                                : "border-white/10 bg-white/3 hover:bg-white/7"
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
                          color.toLowerCase() === paint.value.toLowerCase();
                        return (
                          <button
                            key={paint.name}
                            type="button"
                            onClick={() => selectNormalColor(paint.value)}
                            className={`group flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                              active
                                ? "border-white/40 bg-white/10"
                                : "border-white/10 bg-white/3 hover:bg-white/8"
                            }`}
                          >
                            <span
                              className="h-5 w-5 rounded-full border border-white/15"
                              style={{ backgroundColor: paint.value }}
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
                        { name: "Body", key: "baseColor" as const },
                        { name: "Trim", key: "colouredPartsColor" as const },
                      ].map((item) => {
                        const value =
                          carColors[item.key] || activePreset[item.key];
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
                                updateCarColor(item.key, event.target.value)
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
                        { name: "Windshield", key: "windshieldColor" as const },
                        {
                          name: "back brake light",
                          key: "redGlassColor" as const,
                        },
                      ].map((item) => {
                        const value =
                          carColors[item.key] || activePreset[item.key];
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
                                updateCarColor(item.key, event.target.value)
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
                        { name: "Rim", key: "rimComponentColor" as const },
                        { name: "Brake", key: "brakeDiscColor" as const },
                        { name: "Ring", key: "rimColor" as const },
                        {
                          name: "tire screw",
                          key: "blackMetallicColor" as const,
                        },
                        { name: "Tire", key: "tireColor" as const },
                      ].map((item) => {
                        const value =
                          carColors[item.key] || activePreset[item.key];
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
                                updateCarColor(item.key, event.target.value)
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

          <motion.section
            className="absolute inset-0 flex h-full w-full flex-col overflow-hidden bg-black"
            initial={false}
            animate={{
              opacity: page3Visible ? 1 : 0,
              zIndex: page3Visible ? 30 : 0,
              pointerEvents: page3Visible ? "auto" : "none",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <video
                src="/video/bmw.mp4"
                autoPlay
                muted
                playsInline
                loop
                className="absolute inset-0 h-full w-full scale-[1.5] object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
              <Cutout showThird={page3Visible}>I L I A</Cutout>
              <motion.div
                className="relative z-30 flex h-full flex-col items-center justify-end gap-3 px-6 pb-16 text-center"
                initial={false}
                animate={{
                  opacity: page3Visible ? 1 : 0,
                  y: page3Visible ? 0 : 20,
                }}
                transition={{ delay: page3Visible ? 2.2 : 0, duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-white/45">
                  Selected work
                </p>
                <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-lg @md:text-5xl">
                  Performance obsessed
                </h2>
                <p className="max-w-md text-sm font-medium leading-relaxed text-white/65 @md:text-base">
                  Shipping fast, polished products with Next.js, TypeScript and
                  MongoDB. From e-commerce platforms to interactive 3D
                  experiences — every millisecond matters.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {[
                    "Next.js",
                    "TypeScript",
                    "MongoDB",
                    "PostgreSQL",
                    "Three.js",
                    "Node.js",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-bold text-white/80 backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://github.com/iliawm"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.iliawm.ir"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    iliawm.ir
                  </a>
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/35">
                  Scroll for projects
                </p>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            className="absolute inset-0 flex h-full w-full flex-col overflow-hidden bg-black"
            initial={false}
            animate={{
              opacity: page4Visible ? 1 : 0,
              zIndex: page4Visible ? 40 : 0,
              pointerEvents: page4Visible ? "auto" : "none",
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-[#070707]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.07),transparent_50%)]" />

            <div className="relative z-10 flex h-full min-h-0 gap-4 p-4 @md:gap-5 @md:p-6">
              <motion.div
                initial={false}
                animate={{
                  opacity: page4Visible ? 1 : 0,
                  x: page4Visible ? 0 : -20,
                }}
                transition={{ delay: page4Visible ? 0.15 : 0, duration: 0.5 }}
                className="flex w-[38%] min-w-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl @md:w-[34%] @md:p-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                  Archive
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white @md:text-3xl">
                  Other builds
                </h2>

                <div className="mt-6 flex flex-1 flex-col justify-center gap-1">
                  {PROJECTS.map((project, i) => {
                    const active = expandedId === project.id;
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setExpandedId(project.id)}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/40 hover:bg-white/5 hover:text-white/70"
                        }`}
                      >
                        <span className="text-[10px] font-bold tracking-widest opacity-50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate text-sm font-bold @md:text-base">
                          {project.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <a
                  href="https://github.com/iliawm"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 transition hover:text-white/60"
                >
                  All repos →
                </a>
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  opacity: page4Visible ? 1 : 0,
                  x: page4Visible ? 0 : 20,
                }}
                transition={{ delay: page4Visible ? 0.25 : 0, duration: 0.5 }}
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex h-full min-h-0 flex-col"
                  >
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-white/10 bg-black/40">
                      <Image
                        src={activeProject.image}
                        alt={activeProject.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                        {activeProject.tag}
                      </span>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col p-5 @md:p-6">
                      <h3 className="text-xl font-black tracking-tight text-white @md:text-3xl">
                        {activeProject.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">
                        {activeProject.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeProject.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold text-white/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:text-white/60"
                      >
                        Open on GitHub
                        <span className="h-px w-6 bg-white/40" />
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </WindowFrame>
  );
}