import { useState, useEffect } from "react";

function BlockBuy({ children }) {
  const [blockSidebarState, setBlockSidebarState, setInfoState] = children;
  const [buyXAmount, setBuyXAmount] = useState(1);
  const [buyYAmount, setBuyYAmount] = useState(1);
  let blockArray = [];

  useEffect(() => {
    if (buyXAmount != 1 || buyYAmount != 1) {
      for (let i = 0; i < buyXAmount; i++) {
        blockArray.push(
          ...[...Array(buyYAmount)].map((y, j) => {
            return {
              x: blockSidebarState[0].x + i,
              y: blockSidebarState[0].y + j,
            };
          })
        );
      }
      setBlockSidebarState(blockArray);
    }
  }, [buyXAmount, buyYAmount]);

  return (
    <div className="flex flex-col items-center py-3">
      <h2 className="card-title">
        Pixel#
        {blockSidebarState
          ? blockSidebarState[0]?.x * 100 + blockSidebarState[0]?.y + 1
          : "00000"}
        <div className="badge badge-secondary">AVAILABLE</div>
      </h2>
      <button
        onClick={() => setInfoState(true)}
        className="btn-ghost btn-xs mb-10 w-fit"
      >
        Go to block
      </button>
      <div>
        Block width:{" "}
        <input
          type="number"
          min={1}
          max={100}
          value={buyXAmount}
          onChange={(e) => setBuyXAmount(parseInt(e.target.value))}
        />
      </div>
      <div>
        Block height:{" "}
        <input
          type="number"
          min={1}
          max={100}
          value={buyYAmount}
          onChange={(e) => setBuyYAmount(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}

export default BlockBuy;
