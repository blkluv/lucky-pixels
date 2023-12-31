import { useState, useEffect, useRef } from "react";
import { Price, ProductWithPrice } from "../types";
import { useUser } from "../hooks/useUser";
import { toast } from "react-hot-toast";
import { postData } from "../libs/helpers";
import { getStripe } from "../libs/stripeClient";
import { Json } from "../types_db";

function BlockBuy({ children }) {
  const [
    selectedBlocks,
    setSelectedBlocks,
    setSidebarState,
    products,
    soldBlocks,
  ] = children;
  const [buyXAmount, setBuyXAmount] = useState(1);
  const [buyYAmount, setBuyYAmount] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const { user, isLoading } = useUser();

  const lastXAmount = useRef(buyXAmount);
  const lastYAmount = useRef(buyYAmount);
  let blockArray = [];

  function changeAmount(direction, amount) {
    if (amount > 0) {
      if (direction === "x" && selectedBlocks[0].y + amount - 1 <= 100) {
        setBuyXAmount(amount);
      }
      if (direction === "y" && selectedBlocks[0].x + amount - 1 <= 100) {
        setBuyYAmount(amount);
      }
    }
  }

  useEffect(() => {
    if (buyXAmount != 1 || buyYAmount != 1) {
      for (let i = 0; i < buyXAmount; i++) {
        blockArray.push(
          ...[...Array(buyYAmount)].map((y, j) => {
            return {
              x: selectedBlocks[0].x + j,
              y: selectedBlocks[0].y + i,
            };
          })
        );
      }
      let soldBlocksInSelect = blockArray.filter((block) => {
        return soldBlocks[(block.x - 1) * 100 + block.y];
      });
      if (soldBlocksInSelect.length == 0) {
        setSelectedQuantity(blockArray.length);
        setSelectedBlocks(blockArray);
        lastXAmount.current = buyXAmount;
        lastYAmount.current = buyYAmount;
      } else {
        setBuyXAmount(lastXAmount.current);
        setBuyYAmount(lastYAmount.current);
      }
    }
  }, [buyXAmount, buyYAmount]);

  const formatPrice = (price: Price, quantity?: number) => {
    quantity = quantity ? quantity : 1;
    const priceString = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format((price?.unit_amount * quantity || 0) / 100);
    return priceString;
  };

  const handleCheckout = async (
    price: Price,
    quantity: number,
    blockAmounts: Json
  ) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }
    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price, quantity, blockAmounts },
      });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center py-3">
      <h2 className="card-title">
        Pixel#
        {selectedBlocks
          ? (selectedBlocks[0].x - 1) * 100 + selectedBlocks[0].y
          : "00000"}
        <div className="badge badge-secondary py-3">AVAILABLE</div>
      </h2>
      <button
        onClick={() => setSidebarState("info")}
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
      <div className="text-center">
        <p>Current block price: {formatPrice(products[0].prices[0])}</p>
        <p>Select block amount: {selectedQuantity}</p>
        <p className="m-3 font-bold">
          Total amount: {formatPrice(products[0].prices[0], selectedQuantity)}
        </p>
      </div>
      <button
        onClick={() =>
          handleCheckout(products[0].prices[0], selectedQuantity, {
            xStartBlock: selectedBlocks[0].x,
            yStartBlock: selectedBlocks[0].y,
            xAmount: buyXAmount,
            yAmount: buyYAmount,
          })
        }
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
