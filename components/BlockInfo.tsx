import Image from "next/image";
import { AiFillFacebook, AiOutlineTwitter } from "react-icons/ai";
import { useUser } from "../hooks/useUser";
import { showModal } from "./AuthModal";

import { getUser } from "../actions/getUsers";
import { useState, useEffect } from "react";

function BlockInfo({ children }) {
  const { user } = useUser();
  const [selectedBlocks, setSidebarState, soldBlocks] = children;
  const blockArray = soldBlocks[0] ?? [];
  const selectedBlockPurchaceInfo = blockArray?.find(
    (block) =>
      block.position.x == selectedBlocks[0]?.x &&
      block.position.y == selectedBlocks[0]?.y
  );
  // useEffect(() => {
  //   return () => setSidebarState("info");
  // }, []);

  function buttonFunction() {
    if (!user) {
      showModal();
    } else if (!selectedBlockPurchaceInfo) {
      setSidebarState("buy");
    } else {
      setSidebarState("update");
    }
  }

  return (
    <>
      <div className="card w-full rounded-none">
        <figure>
          <Image
            src="/favicon.ico"
            width={300}
            height={300}
            alt="Pixel picture"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            Pixel#
            {selectedBlocks
              ? (selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y
              : "00000"}
            <div
              className={`badge ${
                selectedBlockPurchaceInfo
                  ? selectedBlockPurchaceInfo?.user_id == user?.id
                    ? "badge-accent"
                    : "badge-primary"
                  : "badge-secondary"
              } py-3`}
            >
              {selectedBlockPurchaceInfo
                ? selectedBlockPurchaceInfo?.user_id == user?.id
                  ? "YOUR BLOCK"
                  : "SOLD"
                : "AVAILABLE"}
            </div>
          </h2>
          <p>Get a piece of the internet</p>
        </div>
      </div>
      <button
        className="btn-neutral btn w-fit p-3 px-10"
        disabled={selectedBlockPurchaceInfo && !user}
        onClick={() => buttonFunction()}
      >
        {user
          ? selectedBlockPurchaceInfo?.user_id == user?.id
            ? "Update info"
            : "BUY"
          : "Please login to buy"}
      </button>
      <div className="flex grow flex-col justify-end py-3">
        <p className="text-center">Share with your friends and followers</p>
        <div className="mt-3 flex justify-around">
          <a
            className="btn-outline btn w-fit"
            target="_blank"
            href="https://www.facebook.com"
          >
            <AiFillFacebook size={30} />
          </a>
          <a
            className="btn-outline btn w-fit"
            target="_blank"
            href="https://www.twitter.com"
          >
            <AiOutlineTwitter size={30} />
          </a>
        </div>
      </div>
    </>
  );
}

export default BlockInfo;
