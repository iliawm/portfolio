"use client";

import WindowFrame from "../WindowFrame";

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
  return (
    <WindowFrame
      title="cmd"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      <pre className="font-mono text-green-400">
        {`Microsoft Windows [Version 11.0]
(c) Iliawm Corporation.

C:\\Users\\Iliawm>_`}
      </pre>
    </WindowFrame>
  );
}