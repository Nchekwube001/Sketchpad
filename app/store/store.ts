import { create } from "zustand";
import { BearActions, BearState, createBearSlice } from "./bearSlice";

// type BearState = {
//   bears: number;
// };

// type Actions = {
//   increasePopulation: () => void;
//   updateBears: (bears: number) => void;
//   removeAllBears: () => void;
// };
// export const useStore = create<BearState & Actions>((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
// }));

type combinedTypes = BearActions & BearState;
// export const useStore = create<combinedTypes>()((...state) => ({
//   //   ...createBearSlice(...state),\
//   ...createBearSlice(...state),
// }));

export const useStore = create<BearState & BearActions>()((...a) => ({
  ...createBearSlice(...a),
}));
