import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const useCollectionStore = create(
  devtools(
    persist((set) => ({
      userDeck: [],
      collectionValue: 0,
      setUserDeckFromFirebase: (request) => set(() => ({ userDeck: request })),
      addToUserDeck: (request) =>
        set((state) => ({ userDeck: [...state.userDeck, request] })),
      removeFromUserDeck: (request) =>
        set((state) => ({
          userDeck: state.userDeck.filter((item) => {
            return item.id !== request.id;
          }),
        })),
      calculateCollectionValue: () =>
        set((state) => ({
          collectionValue: state.userDeck.reduce(
            (prev, current) =>
              prev +
              current.cardmarket.prices.avg1 * current.userDeckInfo.quantity,
            0
          ),
        })),
      increaseCardQuantity: (id) =>
        set((state) => ({
          userDeck: state.userDeck.map((card) => {
            if (card.id === id) {
              console.log("increase")
              return {
                ...card,
                userDeckInfo: { ...card.userDeckInfo, quantity: card.userDeckInfo.quantity + 1 },
              };
            }
            return card;
          }),
        })),
      decreaseCardQuantity: (id) =>
        set((state) => ({
          userDeck: state.userDeck.map((card) => {
            if (card.id === id) {
              console.log("increase")
              return {
                ...card,
                userDeckInfo: { ...card.userDeckInfo, quantity: card.userDeckInfo.quantity - 1 },
              };
            }
            return card;
          }),
        })),
    })),
    { name: "collection-storage" }
  )
);

export default useCollectionStore;
