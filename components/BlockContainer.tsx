"use client";

import React, { useEffect, useState, useRef } from "react";
import BlockSideBar from "../components/BlockSidebar";
import MenuSidebar from "../components/MenuSidebar";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function PixelContainer({ children }) {
  const [blocks] = children;
  const [blockSidebarState, setBlockSidebarState] = useState([{ x: 0, y: 0 }]);
  const lastBlockState = useRef([]);
  console.log(blocks);

  useEffect(() => {
    if (blockSidebarState[0].x !== 0 && blockSidebarState[0].y !== 0) {
      blockSidebarState.map((block) => {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) element.style.opacity = "1";
      });
      lastBlockState.current = blockSidebarState;
    } else {
      lastBlockState.current?.map((block) => {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) element.style.opacity = "0.5";
      });
    }
  }, [blockSidebarState]);

  return (
    <>
      <div className="absolute">
        <TransformWrapper maxScale={5} minScale={1}>
          {() => (
            <React.Fragment>
              <TransformComponent>
                <div className="flex h-screen w-screen items-center justify-center">
                  {[...Array(100)].map((x, i) => {
                    return (
                      <div key={i}>
                        {[...Array(100)].map((y, j) => {
                          return (
                            <div
                              id={"block " + (i + 1) + ", " + (j + 1)}
                              key={j}
                              className={`bg-white opacity-50 hover:opacity-100`}
                              style={{ height: 5, width: 5 }}
                              onClick={() =>
                                setBlockSidebarState([{ x: j + 1, y: i + 1 }])
                              }
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
      <BlockSideBar>{[blockSidebarState, setBlockSidebarState]}</BlockSideBar>
      <MenuSidebar />
    </>
  );
}

export default PixelContainer;
