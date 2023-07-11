"use client";

import { useEffect, useState } from "react";

// import AuthModal from "@/components/AuthModal";
// import SubscribeModal from "@/components/SubscribeModal";
// import UploadModal from "@/components/UploadModal";
import GoogleModal from "../components/GoogleModal";
import { ProductWithPrice } from "../types";

// interface ModalProviderProps {
//   products: ProductWithPrice[];
// }

const ModalProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* <AuthModal />
      <SubscribeModal products={products} />
      <UploadModal /> */}
      <GoogleModal />
    </>
  );
};

export default ModalProvider;
