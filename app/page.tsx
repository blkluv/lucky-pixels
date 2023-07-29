import BlockContainer from "../components/BlockContainer";
import AuthModal from "../components/AuthModal";
import getBlocks from "../actions/getBlocks";
import getActiveProductsWithPrices from "../actions/getActiveProductsWithPrices";

export const revalidate = 0;

export default async function Home() {
  const blocks = await getBlocks();
  // const products = await getActiveProductsWithPrices;

  return (
    <main className="h-screen bg-black">
      <BlockContainer>{[blocks]}</BlockContainer>
      <AuthModal />
    </main>
  );
}
