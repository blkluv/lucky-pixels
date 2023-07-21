// import { create } from "zustand";

// interface SelectedBlock {
//   x: number;
//   y: number;
//   setX: (x: string) => void;
//   setY: (y: string) => void;
//   reset: () => void;
// }

// interface SelectedBlocks extends Array<SelectedBlock> {
//   selectedBlock: SelectedBlock;
//   setSelectedBlocks: (selectedBlock: SelectedBlock) => void;
//   reset: () => void;
// }

// const useSelectedBlock = create<SelectedBlocks>((set) => ({
//   ids: [],
//   activeId: undefined,
//   setId: (id: string) => set({ activeId: id }),
//   setIds: (ids: string[]) => set({ ids }),
//   reset: () => set({ ids: [], activeId: undefined }),
// }));

// export default usePlayer;
