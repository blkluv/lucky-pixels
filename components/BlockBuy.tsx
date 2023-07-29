import { useState, useEffect } from "react";

function BlockBuy({ children }) {
  const [blockSidebarState, setBlockSidebarState, setInfoState] = children;
  const [buyXAmount, setBuyXAmount] = useState(1);
  const [buyYAmount, setBuyYAmount] = useState(1);
  let blockArray = [];

  function changeAmount(direction, amount) {
    if (amount > 0) {
      direction === "x" &&
        blockSidebarState[0].y + amount - 1 <= 100 &&
        setBuyXAmount(amount);
      direction === "y" &&
        blockSidebarState[0].x + amount - 1 <= 100 &&
        setBuyYAmount(amount);
    }
  }

  useEffect(() => {
    if (buyXAmount != 1 || buyYAmount != 1) {
      for (let i = 0; i < buyXAmount; i++) {
        blockArray.push(
          ...[...Array(buyYAmount)].map((y, j) => {
            return {
              x: blockSidebarState[0].x + j,
              y: blockSidebarState[0].y + i,
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
          ? (blockSidebarState[0].x - 1) * 100 + blockSidebarState[0].y
          : "00000"}
        <div className="badge badge-secondary">AVAILABLE</div>
      </h2>
      <button
        onClick={() => setInfoState(true)}
        className="btn-ghost btn-xs my-3 mb-10 w-fit underline"
      >
        Go to block
      </button>
      <div className="flex w-full justify-between p-3 text-lg">
        Block width:{" "}
        <input
          type="number"
          min={1}
          max={100}
          value={buyXAmount}
          onChange={(e) => changeAmount("x", parseInt(e.target.value))}
        />
      </div>
      <div className="flex w-full justify-between p-3 text-lg">
        Block height:{" "}
        <input
          type="number"
          min={1}
          max={100}
          value={buyYAmount}
          onChange={(e) => changeAmount("y", parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}

export default BlockBuy;
