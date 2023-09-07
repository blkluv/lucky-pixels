"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import BlockSideBar from "../components/BlockSidebar";
import MenuSidebar from "../components/MenuSidebar";

import { getUserBlocks } from "../actions/getBlocks";
import { useUser } from "../hooks/useUser";
import BlockItem from "./BlockItem";

import useLoadImage from "../hooks/useLoadImage";

type EditBlocks = {
  soldBlocks80: () => void;
  lastBlocks50: () => void;
  selectedBlocks100: () => void;
  soldBlocksReset: () => void;
  lastBlocksReset: () => void;
  soldBlocks50: () => void;
  ownedBlocks80: () => void;
  ownedLastBlocksReset: () => void;
};

function PixelContainer({ children }) {
  const [soldBlocks, products] = children;
  const { user, isLoading, userDetails } = useUser();

  const [selectedBlocks, setSelectedBlocks] = useState([{ x: 0, y: 0 }]);
  const [userBlocks, setUserBlocks] = useState([]);
  const lastBlockState = useRef([]);
  const search = useSearchParams();

  const testImage = useLoadImage(soldBlocks[303]?.image ?? null);
  console.log(testImage);

  useEffect(() => {
    if (user) {
      getUserBlocks(user?.id).then((res) => {
        setUserBlocks(res);
      });
    }
  }, []);

  const editBlocks: EditBlocks = {
    soldBlocks80() {
      soldBlocks[0]?.map((block) => {
        var element = document.getElementById(
          "block " + block.position.y + ", " + block.position.x
        );
        if (element) {
          element.classList.remove("opacity-100");
          element.classList.add("opacity-80");
        }
      });
    },
    lastBlocks50() {
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
    },
    selectedBlocks100() {
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
    },
    soldBlocksReset() {
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
    },
    lastBlocksReset() {
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
    },
    soldBlocks50() {
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
    },
    ownedBlocks80() {
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
    },
    ownedLastBlocksReset() {
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
    },
  };

  useEffect(() => {
    if (selectedBlocks[0].x !== 0 && selectedBlocks[0].y !== 0) {
      if (userBlocks[(selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y]) {
        editBlocks.soldBlocks50();
        editBlocks.ownedLastBlocksReset();
        editBlocks.ownedBlocks80();
        editBlocks.selectedBlocks100();
      } else {
        editBlocks.soldBlocks80();
        editBlocks.lastBlocks50();
        editBlocks.selectedBlocks100();
      }
      lastBlockState.current = selectedBlocks;
    } else {
      editBlocks.soldBlocksReset();
      editBlocks.lastBlocksReset();
    }
  }, [selectedBlocks]);

  useEffect(() => {
    const checkoutState = search.get("checkout");
    if (checkoutState) {
      checkoutState === "success" && toast.success("Success");
      checkoutState === "cancel" && toast.error("Cancelled");
    }
  }, []);

  async function setBlockInfo(x, y) {
    setSelectedBlocks([{ x: x + 1, y: y + 1 }]);
  }

  return (
    <>
      <div className="absolute">
        <TransformWrapper maxScale={5} minScale={1}>
          {() => (
            <>
              <TransformComponent>
                <div className="flex h-screen w-screen items-center justify-center">
                  {[...Array(100)].map((x, i) => {
                    return (
                      <div key={i}>
                        {[...Array(100)].map((y, j) => {
                          return (
                            <BlockItem
                              soldBlocks={soldBlocks}
                              setBlockInfo={setBlockInfo}
                              i={i}
                              j={j}
                              key={j}
                              testImage={testImage}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </TransformComponent>
            </>
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
