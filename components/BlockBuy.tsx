import { useState, useEffect } from "react";

function BlockBuy({ children }) {
  const [blockSidebarState, setBlockSidebarState, setInfoState] = children;
  const [buyXAmount, setBuyXAmount] = useState(1);
  const [buyYAmount, setBuyYAmount] = useState(1);

  function handleChange(values) {
    // setBuyAmount([parseInt(values[0]), parseInt(values[1])]);
    // blockSidebarState[0].x * 100 + blockSidebarState[0].y + 1
    // setBlockSidebarState
  }

  return (
    <div className="flex flex-col items-center py-3">
      <h2 className="card-title">
        Pixel#
        {blockSidebarState
          ? blockSidebarState[0].x * 100 + blockSidebarState[0].y + 1
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
        Block width:{" "}
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
