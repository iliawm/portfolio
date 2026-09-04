"use client";

import WindowFrame from "../WindowFrame";

export default function Cmd({
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  return (
    <WindowFrame title="cmd" onClose={onClose}>
      <pre className="font-mono text-green-400">
        Microsoft Windows [Version 11.0]
        {"\n"}(c) Iliawm Corporation.
        {"\n\n"}C:\Users\Iliawm&gt;_
      </pre>
    </WindowFrame>
  );
}