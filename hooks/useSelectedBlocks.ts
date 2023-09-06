import { create } from "zustand";

type SelectedBlock = {
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  reset: () => void;
};

type SelectedBlocks = SelectedBlock[] & {
  setSelectedBlocks: (selectedBlock: SelectedBlock) => void;
  reset: () => void;
};

// const useSelectedBlocksStore = create<SelectedBlocks>((set) => ({
//   selectedBlocks: [],
// }));

// export default useSelectedBlocksStore;
