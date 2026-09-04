"use client";

import WindowFrame from "../WindowFrame";

export default function ThisPc({
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  return (
    <WindowFrame title="This PC" onClose={onClose}>
      <p>This PC placeholder.</p>
    </WindowFrame>
  );
}