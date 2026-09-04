"use client";

import WindowFrame from "../WindowFrame";

export default function Settings({
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  return (
    <WindowFrame title="Settings" onClose={onClose}>
      <p>Settings panel placeholder.</p>
    </WindowFrame>
  );
}