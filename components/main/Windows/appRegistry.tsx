import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const AboutMe = dynamic(() => import("./apps/AboutMe"));
const Projects = dynamic(() => import("./apps/Projects"));
const Cmd = dynamic(() => import("./apps/Cmd"));
const Settings = dynamic(() => import("./apps/Settings"));
const ThisPc = dynamic(() => import("./apps/ThisPc"));

export const APP_WINDOWS: Record<
  string,
  ComponentType<{ id: string; onClose: () => void }>
> = {
  "about-me": AboutMe,
  projects: Projects,
  cmd: Cmd,
  settings: Settings,
  This_Pc: ThisPc,
};