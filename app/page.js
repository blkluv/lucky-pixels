"use client";

import PixelContainer from "../components/PixelContainer";
import MenuSidebar from "../components/MenuSidebar";
import { useState } from "react";

export default function Home() {
  const [sideBarState, setSideBarState] = useState("");

  return (
    <main className="bg-black h-screen">
      <PixelContainer children={{ sideBarState, setSideBarState }} />
      <MenuSidebar children={{ sideBarState, setSideBarState }} />
    </main>
  );
}
