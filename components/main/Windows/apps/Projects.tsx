"use client";

import WindowFrame from "../WindowFrame";

export default function Settings({
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
      title="Settings"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      <p>Settings panel placeholder.</p>
    </WindowFrame>
  );
}