"use client";

import WindowFrame from "../WindowFrame";

export default function AboutMe({
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  return (
    <WindowFrame title="About Me.txt" onClose={onClose}>
      <p>Hey, I&apos;m Iliawm.</p>
      <p className="mt-2 text-white/70">Full stack engineer · Next.js · React</p>
    </WindowFrame>
  );
}