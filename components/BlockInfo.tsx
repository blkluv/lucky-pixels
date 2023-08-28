import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillFacebook, AiOutlineTwitter } from "react-icons/ai";

import { useUser } from "../hooks/useUser";
import { showModal } from "./AuthModal";
import useLoadImage from "../hooks/useLoadImage";
import { getBlockGroup } from "../actions/getGroup";

function BlockInfo({ children }) {
  const { user } = useUser();
  const [groupData, setGroupData] = useState<any>();
  const [groupLoading, setGroupLoading] = useState<boolean>(false);

  const [selectedBlocks, setSelectedBlocks, setSidebarState, soldBlocks] =
    children;

  const selectedBlockPurchaceInfo = soldBlocks[0]?.find(
    (block) =>
      block.position.x == selectedBlocks[0]?.x &&
      block.position.y == selectedBlocks[0]?.y
  );
  const imagePath = useLoadImage(selectedBlockPurchaceInfo?.image);

  useEffect(() => {
    if (selectedBlockPurchaceInfo && selectedBlockPurchaceInfo.group_id) {
      setGroupLoading(true);
      getBlockGroup(selectedBlockPurchaceInfo.group_id).then((res) => {
        setGroupData(res);
        setGroupLoading(false);
      });
      let selectedGroupBlocks = soldBlocks[0].filter(
        (block) => block?.group_id == selectedBlockPurchaceInfo?.group_id
      );
      selectedGroupBlocks = selectedGroupBlocks.map((block) => {
        return block.position;
      });
      setSelectedBlocks(selectedGroupBlocks);
    } else setGroupData(null);
  }, [selectedBlockPurchaceInfo]);

  function buttonFunction() {
    if (!user) {
      showModal();
    } else if (!selectedBlockPurchaceInfo) {
      setSidebarState("buy");
    } else {
      setSidebarState("update");
    }
  }

  if (groupLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-ring loading-lg bg-black"></span>
      </div>
    );

  return (
    <>
      <div className="card w-full rounded-none">
        <figure className="relative m-3 h-72">
          <Image
            src={imagePath ?? "/favicon.ico"}
            fill
            alt="Pixel picture"
            style={{ objectFit: "contain" }}
            placeholder="blur"
            blurDataURL={encodeURIComponent(imagePath) ?? "/favicon.ico"}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {groupData
              ? groupData.title
              : `Pixel#
              ${
                selectedBlocks
                  ? (selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y
                  : "00000"
              }`}
            {!groupData && (
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
            )}
          </h2>
          <p>{groupData ? groupData.desc : "Get a piece of the internet"}</p>
          {groupData && (
            <div className="flex flex-1 justify-center">
              <a
                className="btn-outline btn w-fit"
                target="_blank"
                href={
                  groupData.link.startsWith("https://")
                    ? groupData.link
                    : "https://" + groupData.link
                }
              >
                {groupData.link}
              </a>
            </div>
          )}
        </div>
      </div>
      <button
        className="btn-neutral btn w-fit p-3 px-10"
        disabled={
          selectedBlockPurchaceInfo
            ? selectedBlockPurchaceInfo?.user_id == user?.id
              ? false
              : true
            : false
        }
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
