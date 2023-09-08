import React from "react";

import Image from "next/image";
import useLoadImage from "../hooks/useLoadImage";

function BlockItem({ soldBlocks, setBlockInfo, i, j, testImage }) {
  const currentBlockId = j * 100 + i + 1;
  const imagePath = useLoadImage(soldBlocks[currentBlockId]?.image ?? null);

  // const imagePath = testImage;
  return (
    <div
      id={"block " + (i + 1) + ", " + (j + 1)}
      key={j}
      className={`relative bg-white ${
        soldBlocks[currentBlockId] ? "opacity-80" : "opacity-50"
      } hover:opacity-100`}
      style={{
        height: 5,
        width: 5,
        // backgroundImage: imagePath ? `url(${imagePath})` : null,
        // backgroundSize: "cover",
      }}
      onClick={() => setBlockInfo(j, i)}
    >
      {imagePath && (
        <Image
          src={imagePath}
          // placeholder="blur"
          // blurDataURL={encodeURIComponent(imagePath)}
          fill
          quality={20}
          alt="Pixel picture"
          unoptimized
        />
      )}
    </div>
  );
}

export default BlockItem;
