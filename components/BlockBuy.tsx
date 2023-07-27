import { useState, useEffect } from "react";

function BlockBuy({ children }) {
  const [blockSidebarState, setBlockSidebarState, setInfoState] = children;
  const [buyXAmount, setBuyXAmount] = useState(1);
  const [buyYAmount, setBuyYAmount] = useState(1);
  let blockArray = [];

  function changeAmount(direction, amount) {
    if (amount > 0 && amount <= 100) {
      direction === "x" && setBuyXAmount(amount);
      direction === "y" && setBuyYAmount(amount);
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
          onChange={(e) => changeAmount("x", parseInt(e.target.value))}
        />
      </div>
      <div>
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
