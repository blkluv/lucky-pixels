"use client";

import BlockInfo from "./BlockInfo";
import BlockBuy from "./BlockBuy";
import { useState } from "react";

function BlockSideBar({ children }) {
  const [blockSidebarState, setBlockSidebarState, products, blocks] = children;
  const [infoState, setInfoState] = useState(true);

  return (
    <div
      className={`drawer ${
        blockSidebarState[0]?.x && blockSidebarState[0]?.y && "drawer-open"
      }`}
      onClick={() => {
        setBlockSidebarState([{ x: 0, y: 0 }]), setInfoState(true);
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
          {infoState ? (
            <BlockInfo>{[blockSidebarState, setInfoState, blocks]}</BlockInfo>
          ) : (
            <BlockBuy>
              {[
                blockSidebarState,
                setBlockSidebarState,
                setInfoState,
                products,
                blocks,
              ]}
            </BlockBuy>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BlockSideBar;
