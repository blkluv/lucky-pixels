import BlockContainer from "../components/BlockContainer";
import AuthModal from "../components/AuthModal";
import getActiveProductsWithPrices from "../actions/getActiveProductsWithPrices";
import { getSoldBlocks } from "../actions/getBlocks";

export const revalidate = 0;

export default async function Home() {
  const products = await getActiveProductsWithPrices();
  const soldBlocks = await getSoldBlocks();

  return (
    <main className="h-screen bg-black">
      <BlockContainer>{[soldBlocks, products]}</BlockContainer>
      <AuthModal />
    </main>
  );
}
