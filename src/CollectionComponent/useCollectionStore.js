import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../LoginComponents/Firebase";

const useCollectionStore = create(
  devtools(
    persist((set, get) => ({
      userDeck: [],
      collectionValue: 0,

      setUserDeckFromFirebase: async (user) => {
        let tempTodoArray = [];
        async function fetch() {
          console.log("fetching userDeck from Firestore");
          const ref = doc(db, "users", user.uid);
          const docSnap = await getDoc(ref);
          const result = docSnap.data();
          result.userDeck.forEach((card) => {
            console.log(card);
            tempTodoArray.push(card);
          });
          return tempTodoArray;
        }
        fetch().then((res) => {
          set(() => ({ userDeck: res }));
        });
      },

      // setUserDeckFromFirebase: (request) => set(() => ({ userDeck: request })),

      findInCollection: (request) => {
        return get().userDeck.find((card) => card.id === request.id);
      },

      addToUserDeck: (request, user, newData) => {
        const found = get().findInCollection(request);
        if (!found) {
          set((state) => ({
            userDeck: [...state.userDeck, request],
          }));
          try {
            updateDoc(doc(db, "users", user), {
              userDeck: arrayUnion(newData),
            });
            console.log("Document written with ID: ", newData.id.toString());
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      },

      removeFromUserDeck: (request, userUid) => {
        try {
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayRemove(request),
          });
          console.log("Document removed with ID: ", request.id.toString());
        } catch (e) {
          console.error("Error removing document: ", e);
        }
        set((state) => ({
          userDeck: state.userDeck.filter((item) => {
            return item.id !== request.id;
          }),
        }));
      },

      calculateCollectionValue: () =>
        set((state) => ({
          collectionValue: state.userDeck.reduce(
            (prev, current) =>
              prev +
              current.cardmarket.prices.avg1 * current.userDeckInfo.quantity,
            0
          ),
        })),

      setBulkQuantity: (id, userUid, newQuantity, currentData, newData) => {
        updateDoc(doc(db, "users", userUid), {
          userDeck: arrayRemove(currentData),
        }).then(async () => {
          await updateDoc(doc(db, "users", userUid), {
            userDeck: arrayUnion(newData),
          });
        });
        set((state) => ({
          userDeck: state.userDeck.map((card) => {
            if (card.id === id) {
              console.log("bulk set quantity: ", newQuantity);
              return {
                ...card,
                userDeckInfo: {
                  ...card.userDeckInfo,
                  quantity: newQuantity,
                },
              };
            }
            return card;
          }),
        }));
      },

      increaseCardQuantity: async (id, userUid, currentData, newData) => {
        await new Promise((res) => {
          set((state) => ({
            userDeck: state.userDeck.map((card) => {
              if (card.id === id) {
                console.log("increase");
                return {
                  ...card,
                  userDeckInfo: {
                    ...card.userDeckInfo,
                    quantity: card.userDeckInfo.quantity + 1,
                  },
                };
              }
              return card;
            }),
          }));

          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayRemove(currentData),
          });
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayUnion(newData),
          });
          res(true);
        });
      },

      decreaseCardQuantity: async (id, userUid, currentData, newData) => {
        await new Promise((res) => {
          set((state) => ({
            userDeck: state.userDeck.map((card) => {
              if (card.id === id) {
                console.log("increase");
                return {
                  ...card,
                  userDeckInfo: {
                    ...card.userDeckInfo,
                    quantity: card.userDeckInfo.quantity - 1,
                  },
                };
              }
              return card;
            }),
          }));
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayRemove(currentData),
          });
          updateDoc(doc(db, "users", userUid), {
            userDeck: arrayUnion(newData),
          });
          res(true);
        });
      },
    })),
    { name: "collection-storage" }
  )
);

export default useCollectionStore;
