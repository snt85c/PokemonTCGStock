import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../LoginComponents/Firebase";

const useCardStore = create(
  devtools(
    persist((set, get) => ({
      card: {},
      setCard: (request) => {
        set(() => ({ card: request }));
      },

      setBulkQuantity: async (
        userUid,
        newQuantity,
        currentData,
        newData
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
            quantity: state.card.userDeckInfo.quantity = newQuantity 
          }));
          res();
        });
      },

      increaseCardQuantity: async ( userUid, currentData, newData) => {
        await new Promise((res) => {
          console.log("add");
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayRemove(currentData),
          });
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayUnion(newData),
          });
          set((state) => ({
            quantity: state.card.userDeckInfo.quantity++,
          }));
          res();
        });
      },

      decreaseCardQuantity: async ( userUid, currentData, newData) => {
        await new Promise((res) => {
          console.log("remove");
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayRemove(currentData),
          });
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayUnion(newData),
          });
          set((state) => ({
            quantity: state.card.userDeckInfo.quantity--,
          }));
          res(true);
        });
      },
    })),
    { name: "card-storage" }
  )
);

export default useCardStore;
