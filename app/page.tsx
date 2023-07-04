"use client";

import PixelContainer from "../components/PixelContainer";
import MenuSidebar from "../components/MenuSidebar";
import { useState } from "react";

interface PageProps {
  children: React.ReactNode;
}

export default function Home({ children }: PageProps) {
  const [sideBarState, setSideBarState] = useState("");

  return (
    <main className="h-screen bg-black">
      <PixelContainer>{[sideBarState, setSideBarState]}</PixelContainer>
      <MenuSidebar>{[sideBarState, setSideBarState]}</MenuSidebar>
    </main>
  );
}
