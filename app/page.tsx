import BlockContainer from "../components/BlockContainer";
import AuthModal from "../components/AuthModal";
import getBlocks from "../actions/getBlocks";

// const React  = dynamic(() => import("react"));

export const revalidate = 0;

export default async function Home() {
  const blocks = await getBlocks();
  console.log(blocks);

  return (
    <main className="h-screen bg-black">
      <BlockContainer>{blocks}</BlockContainer>
      <AuthModal />
    </main>
  );
}
