"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import BlockSideBar from "../components/BlockSidebar";
import MenuSidebar from "../components/MenuSidebar";

import getImage from "../hooks/getImage";
import { getUserBlocks } from "../actions/getBlocks";
import { useUser } from "../hooks/useUser";

function PixelContainer({ children }) {
  const [soldBlocks, products] = children;
  const { user, isLoading, userDetails } = useUser();

  const [selectedBlocks, setSelectedBlocks] = useState([{ x: 0, y: 0 }]);
  const [userBlocks, setUserBlocks] = useState([]);
  const lastBlockState = useRef([]);
  const search = useSearchParams();

  useEffect(() => {
    if (user) {
      getUserBlocks(user?.id).then((res) => {
        setUserBlocks(res);
      });
    }
  }, []);

  function soldBlocks80() {
    soldBlocks[0]?.map((block) => {
      var element = document.getElementById(
        "block " + block.position.y + ", " + block.position.x
      );
      if (element) {
        element.classList.remove("opacity-100");
        element.classList.add("opacity-80");
      }
    });
  }
  function lastBlocks50() {
    lastBlockState.current?.map((block) => {
      if (!soldBlocks[(block.x - 1) * 100 + block.y]) {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) {
          element.classList.remove("opacity-100");
          element.classList.add("opacity-50");
        }
      }
    });
  }
  function selectedBlocks100() {
    selectedBlocks.map((block) => {
      var element = document.getElementById(
        "block " + block.y + ", " + block.x
      );
      if (element) {
        element.classList.remove("opacity-50");
        element.classList.remove("opacity-80");
        element.classList.add("opacity-100");
      }
    });
  }
  function soldBlocksReset() {
    soldBlocks[0]?.map((block) => {
      var element = document.getElementById(
        "block " + block.position.y + ", " + block.position.x
      );
      if (element) {
        element.classList.remove("opacity-50");
        element.classList.remove("opacity-80");
        element.classList.add("opacity-100");
      }
    });
  }
  function lastBlocksReset() {
    lastBlockState.current?.map((block) => {
      if (!soldBlocks[(block.x - 1) * 100 + block.y]) {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) {
          element.classList.remove("opacity-100");
          element.classList.add("opacity-50");
        }
      }
    });
  }
  function soldBlocks50() {
    soldBlocks[0]?.map((block) => {
      var element = document.getElementById(
        "block " + block.position.y + ", " + block.position.x
      );
      if (element) {
        element.classList.remove("opacity-100");
        element.classList.remove("opacity-80");
        element.classList.add("opacity-50");
      }
    });
  }
  function ownedBlocks80() {
    userBlocks[0]?.map((block) => {
      var element = document.getElementById(
        "block " + block.position.y + ", " + block.position.x
      );
      if (element) {
        element.classList.remove("opacity-100");
        element.classList.remove("opacity-50");
        element.classList.add("opacity-80");
      }
    });
  }
  function ownedLastBlocksReset() {
    lastBlockState.current?.map((block) => {
      if (!userBlocks[(block.x - 1) * 100 + block.y]) {
        var element = document.getElementById(
          "block " + block.y + ", " + block.x
        );
        if (element) {
          element.classList.remove("opacity-100");
          element.classList.add("opacity-50");
        }
      }
    });
  }

  useEffect(() => {
    if (selectedBlocks[0].x !== 0 && selectedBlocks[0].y !== 0) {
      if (userBlocks[(selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y]) {
        soldBlocks50();
        ownedLastBlocksReset();
        ownedBlocks80();
        selectedBlocks100();
      } else {
        soldBlocks80();
        lastBlocks50();
        selectedBlocks100();
      }
      lastBlockState.current = selectedBlocks;
    } else {
      soldBlocksReset();
      lastBlocksReset();
    }
  }, [selectedBlocks]);

  useEffect(() => {
    const checkoutState = search.get("checkout");
    if (checkoutState) {
      checkoutState === "success" && toast.success("Success");
      checkoutState === "cancel" && toast.error("Cancelled");
    }
  }, []);

  async function blockInfo(x, y) {
    setSelectedBlocks([{ x: x + 1, y: y + 1 }]);
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
                          const currentBlockId = j * 100 + i + 1;
                          let imagePath;
                          if (soldBlocks[currentBlockId]) {
                            imagePath = getImage(
                              soldBlocks[currentBlockId]?.image
                            );
                          }
                          return (
                            <div
                              id={"block " + (i + 1) + ", " + (j + 1)}
                              key={j}
                              className={`relative bg-white ${
                                soldBlocks[currentBlockId]
                                  ? "opacity-80"
                                  : "opacity-50"
                              } hover:opacity-100`}
                              style={{ height: 5, width: 5 }}
                              onClick={() => blockInfo(j, i)}
                            >
                              {imagePath && (
                                <Image
                                  src={imagePath}
                                  placeholder="blur"
                                  blurDataURL={encodeURIComponent(imagePath)}
                                  fill
                                  quality={20}
                                  alt="Pixel picture"
                                />
                              )}
                            </div>
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
        {[selectedBlocks, setSelectedBlocks, products, soldBlocks, userBlocks]}
      </BlockSideBar>
      <MenuSidebar />
    </>
  );
}

export default PixelContainer;
