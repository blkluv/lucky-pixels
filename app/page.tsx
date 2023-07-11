"use client";

import { useState } from "react";
import BlockContainer from "../components/BlockContainer";
import MenuSidebar from "../components/MenuSidebar";
import BlockSideBar from "../components/BlockSidebar";

export default function Home() {
  const [blockSidebarState, setBlockSidebarState] = useState("");
  return (
    <main className="h-screen bg-black">
      <BlockContainer>
        {[blockSidebarState, setBlockSidebarState]}
      </BlockContainer>
      <MenuSidebar />
      <BlockSideBar>{[blockSidebarState, setBlockSidebarState]}</BlockSideBar>
    </main>
  );
}
