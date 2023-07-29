import { useState, useEffect } from "react";
import { Price, ProductWithPrice } from "../types";
import { useUser } from "../hooks/useUser";
import { toast } from "react-hot-toast";
import { postData } from "../libs/helpers";
import { getStripe } from "../libs/stripeClient";

function BlockBuy({ children }) {
  const [blockSidebarState, setBlockSidebarState, setInfoState, products] =
    children;
  const [buyXAmount, setBuyXAmount] = useState(1);
  const [buyYAmount, setBuyYAmount] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading } = useUser();
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

  const formatPrice = (price: Price, quantity?: number) => {
    quantity = quantity ? quantity : 1;
    const priceString = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format((price?.unit_amount * quantity || 0) / 100);
    return priceString;
  };

  const handleCheckout = async (price: Price, quantity: number) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }
    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price, quantity },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

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
      setSelectedQuantity(blockArray.length);
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
      <p>Current block price: {formatPrice(products[0].prices[0])}</p>
      <p>Select block amount: {selectedQuantity}</p>
      <p>
        Selected block total amount:{" "}
        {formatPrice(products[0].prices[0], selectedQuantity)}
      </p>
      <button
        onClick={() => handleCheckout(products[0].prices[0], selectedQuantity)}
        className="btn-neutral btn my-10 p-3 px-10"
      >
        {priceIdLoading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          "CONFIRM"
        )}
      </button>
    </div>
  );
}

export default BlockBuy;
