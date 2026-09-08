"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import WindowFrame from "../WindowFrame";
import { useAppsStore } from "@/store/useAppsStore";

type Line = { type: "in" | "out" | "err"; text: string };

export default function Cmd({
  onClose,
  onMinimize,
  minimized,
}: {
  id: string;
  onClose: () => void;
  onMinimize: () => void;
  minimized?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const openApp = useAppsStore((s) => s.openApp);
  const apps = useAppsStore((s) => s.apps);

  const [lines, setLines] = useState<Line[]>([
    { type: "out", text: "Microsoft Windows [Version 11.0.22000.1]" },
    { type: "out", text: "(c) Iliawm Corporation. All rights reserved." },
    { type: "out", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("C:\\Users\\Iliawm");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [minimized]);

  const push = (...next: Line[]) => setLines((prev) => [...prev, ...next]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) {
      push({ type: "in", text: `${cwd}>` });
      return;
    }

    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHistIdx(-1);
    push({ type: "in", text: `${cwd}>${cmd}` });

    const [head, ...rest] = cmd.split(/\s+/);
    const name = head.toLowerCase();
    const arg = rest.join(" ");

    switch (name) {
      case "help":
        push(
          { type: "out", text: "Supported commands:" },
          { type: "out", text: "  help              Show this list" },
          { type: "out", text: "  cls               Clear the screen" },
          { type: "out", text: "  dir               List portfolio items" },
          { type: "out", text: "  whoami            Current user" },
          { type: "out", text: "  about             Short bio" },
          { type: "out", text: "  date              Date and time" },
          { type: "out", text: "  echo [text]       Print text" },
          { type: "out", text: "  cd [folder]       Change directory (demo)" },
          { type: "out", text: "  open [app]        Open app (settings, projects, ...)" },
          { type: "out", text: "  theme [light|dark|system]" },
          { type: "out", text: "  github            Open GitHub profile" },
          { type: "out", text: "  linkedin          Open LinkedIn profile" },
          { type: "out", text: "  exit              Close this window" },
          { type: "out", text: "" }
        );
        break;

      case "cls":
      case "clear":
        setLines([]);
        break;

      case "dir":
      case "ls":
        push(
          { type: "out", text: ` Directory of ${cwd}` },
          { type: "out", text: "" },
          { type: "out", text: "04/09/2026  12:00 AM    <DIR>          Desktop" },
          { type: "out", text: "04/09/2026  12:00 AM    <DIR>          Documents" },
          { type: "out", text: "04/09/2026  12:00 AM    <DIR>          Projects" },
          { type: "out", text: "08/09/2026  03:30 PM             4,128 About Me.txt" },
          { type: "out", text: "08/09/2026  03:30 PM             2,048 portfolio.next" },
          {
            type: "out",
            text: `               ${apps.filter((a) => a.isOnDesktop).length} desktop app(s)`,
          },
          { type: "out", text: "" }
        );
        break;

      case "whoami":
        push({ type: "out", text: "Iliawm\\Ilia Bayat" }, { type: "out", text: "" });
        break;

      case "about":
        push(
          { type: "out", text: "Ilia Bayat — Full Stack Engineer" },
          { type: "out", text: "Next.js · React · TypeScript · Node · MongoDB" },
          { type: "out", text: "https://www.iliawm.ir" },
          { type: "out", text: "https://github.com/iliawm" },
          { type: "out", text: "https://www.linkedin.com/in/psychowm" },
          { type: "out", text: "" }
        );
        break;

      case "date":
      case "time":
        push(
          { type: "out", text: new Date().toString() },
          { type: "out", text: "" }
        );
        break;

      case "echo":
        push({ type: "out", text: arg || "" }, { type: "out", text: "" });
        break;

      case "cd": {
        if (!arg || arg === "~" || arg === "%USERPROFILE%") {
          setCwd("C:\\Users\\Iliawm");
        } else if (arg === ".." || arg === "../") {
          setCwd("C:\\Users");
        } else if (arg.toLowerCase() === "desktop") {
          setCwd("C:\\Users\\Iliawm\\Desktop");
        } else if (arg.toLowerCase() === "projects") {
          setCwd("C:\\Users\\Iliawm\\Projects");
        } else if (arg.match(/^[A-Za-z]:\\/)) {
          setCwd(arg);
        } else {
          setCwd((c) => `${c}\\${arg}`);
        }
        push({ type: "out", text: "" });
        break;
      }

      case "open": {
        const id = arg.toLowerCase().replace(/\s+/g, "-");
        const map: Record<string, string> = {
          settings: "settings",
          about: "about-me",
          "about-me": "about-me",
          projects: "projects",
          cmd: "cmd",
          "this-pc": "This_Pc",
          thispc: "This_Pc",
          pc: "This_Pc",
        };
        const target = map[id] || id;
        const found = apps.some((a) => a.id === target);
        if (found) {
          openApp(target);
          push({ type: "out", text: `Opening ${target}...` }, { type: "out", text: "" });
        } else {
          push(
            {
              type: "err",
              text: `'${arg || "?"}' is not a known app. Try: settings, about, projects`,
            },
            { type: "out", text: "" }
          );
        }
        break;
      }

      case "theme": {
        const t = arg.toLowerCase();
        if (t === "light" || t === "dark" || t === "system") {
          setTheme(t);
          push({ type: "out", text: `Theme set to ${t}.` }, { type: "out", text: "" });
        } else {
          push(
            {
              type: "err",
              text: "Usage: theme light | theme dark | theme system",
            },
            { type: "out", text: "" }
          );
        }
        break;
      }

      case "github":
        window.open("https://github.com/iliawm", "_blank", "noopener,noreferrer");
        push({ type: "out", text: "Opening GitHub..." }, { type: "out", text: "" });
        break;

      case "linkedin":
        window.open(
          "https://www.linkedin.com/in/psychowm",
          "_blank",
          "noopener,noreferrer"
        );
        push({ type: "out", text: "Opening LinkedIn..." }, { type: "out", text: "" });
        break;

      case "exit":
      case "quit":
        onClose();
        break;

      default:
        push(
          {
            type: "err",
            text: `'${head}' is not recognized as an internal or external command,`,
          },
          { type: "err", text: "operable program or batch file." },
          { type: "out", text: "" }
        );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next]) {
        setHistIdx(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput("");
      } else {
        const next = histIdx - 1;
        setHistIdx(next);
        setInput(history[next] || "");
      }
    }
  };

  return (
    <WindowFrame
      title="Command Prompt"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
      defaultWidth={640}
      defaultHeight={400}
    >
      <div
        className={`-m-3 flex h-full min-h-72 cursor-text flex-col font-[Consolas,Cascadia_Mono,Courier_New,monospace] text-sm ${
          isDark ? "bg-black text-[#cccccc]" : "bg-[#0c0c0c] text-[#cccccc]"
        }`}
        onClick={() => inputRef.current?.focus()}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="hide-scrollbar flex-1 overflow-y-auto p-2 leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "err"
                  ? "text-red-400"
                  : line.type === "in"
                    ? "text-[#cccccc]"
                    : "text-[#cccccc]"
              }
            >
              {line.text || "\u00A0"}
            </div>
          ))}

          <div className="flex items-center gap-0">
            <span className="shrink-0">{cwd}&gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent caret-[#cccccc] outline-none"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </WindowFrame>
  );
}