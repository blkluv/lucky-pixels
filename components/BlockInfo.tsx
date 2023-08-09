import Image from "next/image";
import { AiFillFacebook, AiOutlineTwitter } from "react-icons/ai";
import { useUser } from "../hooks/useUser";
import { showModal } from "./AuthModal";

import { getUser } from "../actions/getUsers";

function BlockInfo({ children }) {
  const { user } = useUser();
  const [blockSidebarState, setInfoState, blocks] = children;
  const selectedBlockPurchaceInfo = blocks?.find(
    (block) =>
      block.position.x == blockSidebarState[0]?.x &&
      block.position.y == blockSidebarState[0]?.y
  );
  console.log(selectedBlockPurchaceInfo);
  // getUser(
  //   blocks.find(
  //     (block) => block.position.x == x + 1 && block.position.y == y + 1
  //   )
  // )

  function buyButtonFunction() {
    if (user && !selectedBlockPurchaceInfo) {
      setInfoState(false);
    } else {
      showModal();
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
            {blockSidebarState
              ? (blockSidebarState[0].x - 1) * 100 + blockSidebarState[0].y
              : "00000"}
            <div
              className={`badge ${
                selectedBlockPurchaceInfo ? "badge-primary" : "badge-secondary"
              } py-3`}
            >
              {selectedBlockPurchaceInfo ? "SOLD" : "AVAILABLE"}
            </div>
          </h2>
          <p>Get a piece of the internet</p>
        </div>
      </div>
      <button
        className="btn-neutral btn w-fit p-3 px-10"
        disabled={selectedBlockPurchaceInfo}
        onClick={() => buyButtonFunction()}
      >
        {user ? "BUY" : "Please login to buy"}
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
