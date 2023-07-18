"use client";

import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function PixelContainer({ children }) {
  const [blockSidebarState, setBlockSidebarState] = children;

  return (
    <div className="absolute">
      <TransformWrapper maxScale={5} minScale={1}>
        {() => (
          <React.Fragment>
            <TransformComponent>
              <div className="flex h-screen w-screen items-center justify-center">
                {[...Array(100)].map((a, i) => {
                  return (
                    <div key={i} className="flex-row">
                      {[...Array(100)].map((b, j) => {
                        return (
                          <div
                            key={j}
                            className={`bg-white  hover:opacity-100 ${
                              blockSidebarState[0]?.x == j &&
                              blockSidebarState[0]?.y == i
                                ? "opacity-100"
                                : "opacity-50"
                            }`}
                            style={{ height: 5, width: 5 }}
                            onClick={() =>
                              setBlockSidebarState([{ x: j, y: i }])
                            }
                          ></div>
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
  );
}

export default PixelContainer;
