"use client";

import WindowFrame from "../WindowFrame";

export default function ThisPc({
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
      title="This PC"
      onClose={onClose}
      onMinimize={onMinimize}
      minimized={minimized}
    >
      <p>This PC placeholder.</p>
    </WindowFrame>
  );
}