import { Suspense } from "react";

import Bg from "@/components/BackgroundImages/bg";
import AppsBg from "@/components/main/AppsBg";

export default function Home() {
  return (
    <main className="absolute h-full w-full">
      <Bg />

      <Suspense fallback={null}>
        <AppsBg />
      </Suspense>
    </main>
  );
}