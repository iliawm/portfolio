"use client";

import WindowFrame from "../WindowFrame";

export default function AboutMe({
  onClose,
  onMinimize,
  minimized,
}: {
  id: string;
  onClose: () => void;
  onMinimize: () => void;
  minimized?: boolean;
}) {
  return (
    <WindowFrame
      title="About Me.txt"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      <p>Hey, I&apos;m Iliawm.</p>
      <p className="mt-2 text-white/70">Full stack engineer · Next.js · React</p>
    </WindowFrame>
  );
}