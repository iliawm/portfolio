export interface AppConfig {
  id: string;
  name: string;
  icon: string; 
  defaultCol: number;
  defaultRow: number;
  isIconpath:boolean;
}

export const DESKTOP_APPS: AppConfig[] = [
  {
    id: "about-me",
    name: "About Me.txt",
    icon: "📄",
    defaultCol: 0,
    defaultRow: 0,
    isIconpath:false,

  },
  {
    id: "projects",
    name: "Projects",
    icon: "📁",
    defaultCol: 0,
    defaultRow: 1,
    isIconpath:false,

  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "⌨️",
    defaultCol: 0,
    defaultRow: 2,
    isIconpath:false,

  },
  {
    id:"settings",
    name: "settings",
    icon: "/AppIcons/Settings.png",
    defaultCol: 0,
    defaultRow: 3,
    isIconpath:true,

  }
];