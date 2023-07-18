import Image from "next/image";
import { AiFillFacebook, AiOutlineTwitter } from "react-icons/ai";
import { useUser } from "../hooks/useUser";

function BlockInfo({ children }) {
  const { user } = useUser();
  const [blockSidebarState, setInfoState] = children;

  return (
    <>
      <div className="card w-full rounded-none">
        <figure>
          <Image
            src="/favicon.ico"
            width={400}
            height={400}
            alt="Pixel picture"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            Pixel#
            {blockSidebarState
              ? blockSidebarState[0].x * 100 + blockSidebarState[0].y + 1
              : "00000"}
            <div className="badge badge-secondary">AVAILABLE</div>
          </h2>
          <p>Get a piece of the internet</p>
        </div>
      </div>
      <button
        className="btn-neutral btn w-fit p-3 px-10"
        onClick={() => user && setInfoState(false)}
      >
        {user ? "BUY" : "Please login to buy"}
      </button>
      <div className="flex grow flex-col justify-end py-3">
        <p>Share with your friends and followers</p>
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
