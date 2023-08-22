"use client";

import { useState } from "react";
import BlockInfo from "./BlockInfo";
import BlockBuy from "./BlockBuy";
import BlockInfoUpdate from "./BlockInfoUpdate";

function BlockSideBar({ children }) {
  const [selectedBlocks, setSelectedBlocks, products, soldBlocks, userBlocks] =
    children;
  const [sidebarState, setSidebarState] = useState("info");

  return (
    <div
      className={`drawer ${
        selectedBlocks[0]?.x && selectedBlocks[0]?.y && "drawer-open"
      }`}
      onClick={() => {
        setSelectedBlocks([{ x: 0, y: 0 }]), setSidebarState("info");
      }}
    >
      <input id="blockinfo-drawer" type="checkbox" className="drawer-toggle" />
      <div
        className="drawer-open drawer-side z-10"
        id="sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="blockinfo-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 items-center bg-base-200 p-0">
          {sidebarState == "info" && (
            <BlockInfo>
              {[selectedBlocks, setSelectedBlocks, setSidebarState, soldBlocks]}
            </BlockInfo>
          )}
          {sidebarState == "buy" && (
            <BlockBuy>
              {[
                selectedBlocks,
                setSelectedBlocks,
                setSidebarState,
                products,
                soldBlocks,
              ]}
            </BlockBuy>
          )}
          {sidebarState == "update" && (
            <BlockInfoUpdate>
              {[selectedBlocks, setSelectedBlocks, setSidebarState, userBlocks]}
            </BlockInfoUpdate>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BlockSideBar;
