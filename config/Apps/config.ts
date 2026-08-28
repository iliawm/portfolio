export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  defaultCol: number;
  defaultRow: number;
  isIconpath: boolean;
  isPinnedtoStart: boolean;
  ispinnedtoTaskbar: boolean;
  open: boolean;
  numId: number;
  isOnDesktop: boolean;
  lastOpened: boolean | null; 
}

export const DESKTOP_APPS: AppConfig[] = [
  {
    id: "about-me",
    name: "About Me.txt",
    icon: "📄",
    defaultCol: 0,
    defaultRow: 0,
    isIconpath: false,
    isPinnedtoStart: false,
    ispinnedtoTaskbar: false,
    open: false,
    numId: 0,
    isOnDesktop: true,
    lastOpened: null,
  },
  {
    id: "projects",
    name: "Projects",
    icon: "📁",
    defaultCol: 0,
    defaultRow: 1,
    isIconpath: false,
    isPinnedtoStart: false,
    ispinnedtoTaskbar: false,
    open: false,
    numId: 1,
    isOnDesktop: true,
    lastOpened: null,
  },
  {
    id: "cmd",
    name: "cmd",
    icon: "/AppIcons/Cmd.png",
    defaultCol: 0,
    defaultRow: 2,
    isIconpath: true,
    isPinnedtoStart: false,
    ispinnedtoTaskbar: false,
    open: false,
    numId: 2,
    isOnDesktop: false,
    lastOpened: null,
  },
  {
    id: "settings",
    name: "settings",
    icon: "/AppIcons/Settings.png",
    defaultCol: 0,
    defaultRow: 3,
    isIconpath: true,
    isPinnedtoStart: false,
    ispinnedtoTaskbar: false,
    open: false,
    numId: 3,
    isOnDesktop: false,
    lastOpened: null,
  },
  {
    id: "This_Pc",
    name: "This PC",
    icon: "/AppIcons/Settings.png",
    defaultCol: 0,
    defaultRow: 3,
    isIconpath: true,
    isPinnedtoStart: false,
    ispinnedtoTaskbar: false,
    open: false,
    numId: 3,
    isOnDesktop: false,
    lastOpened: null,
  },
];