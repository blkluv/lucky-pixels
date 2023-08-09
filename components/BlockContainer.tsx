"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import BlockSideBar from "../components/BlockSidebar";
import MenuSidebar from "../components/MenuSidebar";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getUser, getUsers } from "../actions/getUsers";

function PixelContainer({ children }) {
  const [blocks, products] = children;
  const [blockSidebarState, setBlockSidebarState] = useState([{ x: 0, y: 0 }]);
  const lastBlockState = useRef([]);
  const search = useSearchParams();

  useEffect(() => {
    if (blockSidebarState[0].x !== 0 && blockSidebarState[0].y !== 0) {
      lastBlockState.current?.map((block) => {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) {
          element.classList.add("opacity-50");
          element.classList.remove("opacity-100");
        }
      });
      blockSidebarState.map((block) => {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) {
          element.classList.remove("opacity-50");
          element.classList.add("opacity-100");
        }
      });
      lastBlockState.current = blockSidebarState;
    } else {
      lastBlockState.current?.map((block) => {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) {
          element.classList.add("opacity-50");
          element.classList.remove("opacity-100");
        }
      });
    }
  }, [blockSidebarState]);

  useEffect(() => {
    const checkoutState = search.get("checkout");
    if (checkoutState) {
      checkoutState === "success" && toast.success("Success");
      checkoutState === "cancel" && toast.error("Cancelled");
    }
  }, []);

  async function blockInfo(x, y) {
    // console.log(
    //   getUser(
    //     blocks.find(
    //       (block) => block.position.x == x + 1 && block.position.y == y + 1
    //     )
    //   )
    // );
    // console.log(getUsers());
    setBlockSidebarState([{ x: x + 1, y: y + 1 }]);
  }

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
                              onClick={() => blockInfo(j, i)}
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
      <BlockSideBar>
        {[blockSidebarState, setBlockSidebarState, products, blocks]}
      </BlockSideBar>
      <MenuSidebar />
    </>
  );
}

export default PixelContainer;
