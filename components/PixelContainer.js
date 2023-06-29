"use client";

import dynamic from "next/dynamic";
import React, { Component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const useWindowDimensions = dynamic(
  () => import("../components/useWindowDimensions"),
  {
    ssr: false,
  }
);

function PixelContainer({ children }) {
  const [sideBarState, setSideBarState] = children;
  const { height, width } = useWindowDimensions();
  return (
    <div className="absolute">
      <TransformWrapper maxScale={5} minScale={1}>
        {(props) => (
          <React.Fragment>
            <TransformComponent>
              <div className="h-screen w-screen flex justify-center items-center">
                {[...Array(100)].map((a, i) => {
                  return (
                    <div key={i} className="flex-row">
                      {[...Array(100)].map((b, j) => {
                        return (
                          <div
                            key={j}
                            className={`bg-white opacity-50 hover:opacity-100 ${
                              sideBarState[0] == j &&
                              sideBarState[1] == i &&
                              "opacity-100"
                            }`}
                            style={{ height: 5, width: 5 }}
                            onClick={() => setSideBarState([j, i])}
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

{
  /* <Space
        onCreate={(vp) =>
          vp.setBounds({
            x: [0, width],
            y: [0, height],
          })
        }
      >
        <div className="h-screen flex justify-center items-center">
          {[...Array(100)].map((a, i) => {
            return (
              <div key={i} className="flex-row">
                {[...Array(100)].map((b, j) => {
                  return (
                    <div
                      key={j}
                      className="bg-white opacity-50 hover:opacity-100"
                      style={{ height: 5, width: 5 }}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Space> */
}
