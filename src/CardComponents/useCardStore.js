import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";

const useCardStore = create(
  devtools((set, get) => ({
    card: {},
    cardValue: 0,

    setCard: (request) => {
      set(() => ({ card: request }));
      // get().setCardValue()
    },

    setCardValue: (card) => {
      let value = Object.keys(card.userDeckInfo.quantity)
        .reduce(
          (prev, current) =>
            prev +
            card.tcgplayer.prices[current].market *
              card.userDeckInfo.quantity[current],
          0
        )
        .toFixed(2);
      set(() => ({ cardValue: value }));
    },
    setBulkQuantity: async (
      userUid,
      newQuantity,
      currentData,
      newData,
      cardType
    ) => {
      await new Promise((res) => {
        console.log("bulk");
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayRemove(currentData),
        });
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayUnion(newData),
        });
        set((state) => ({
          quantity: (state.card.userDeckInfo.quantity[cardType] = newQuantity),
        }));
        res();
      });
    },

    increaseCardQuantity: async (userUid, currentData, newData, cardType) => {
      await new Promise((res) => {
        console.log("add");
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayRemove(currentData),
        });
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayUnion(newData),
        });
        set((state) => ({
          quantity: state.card.userDeckInfo.quantity[cardType]++,
        }));
        res();
      });
    },

    decreaseCardQuantity: async (userUid, currentData, newData, cardType) => {
      await new Promise((res) => {
        console.log("remove");
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayRemove(currentData),
        });
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayUnion(newData),
        });
        set((state) => ({
          quantity: state.card.userDeckInfo.quantity[cardType]--,
        }));
        res();
      });
    },
  }))
);

export default useCardStore;
