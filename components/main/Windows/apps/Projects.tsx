"use client";

import WindowFrame from "../WindowFrame";

export default function Projects({
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  return (
    <WindowFrame title="Projects" onClose={onClose}>
      <ul className="list-disc space-y-1 pl-4">
        <li>Portfolio (this OS)</li>
        <li>ShoppingWebsite</li>
        <li>More coming soon</li>
      </ul>
    </WindowFrame>
  );
}