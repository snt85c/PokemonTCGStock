import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const useCollectionStore = create(
  devtools(
    persist((set) => ({
      userDeck: [],
      setUserDeckFromFirebase:(request) => set((state)=>({userDeck:request})),
      setUserDeck:(request) => set((state)=>({userDeck:[...state.userDeck, request]})),
    })),
    { name: "collection-storage" }
  )
);

export default useCollectionStore;
