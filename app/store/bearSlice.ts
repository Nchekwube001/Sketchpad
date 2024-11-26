import { create, StateCreator } from "zustand";

export type BearState = {
  bears: number;
};

export type BearActions = {
  increasePopulation: () => void;
  updateBears: (bears: number) => void;
  removeAllBears: () => void;
};
// export const useStore = create<BearState & BearActions>((set) => ({
export const createBearSlice: StateCreator<
  BearState & BearActions,
  [],
  [],
  BearState & BearActions
> = (set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
});
