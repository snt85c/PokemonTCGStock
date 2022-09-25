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
        if (user)
          try {
            let tempTodoArray = [];
            async function fetch() {
              console.log("fetching userDeck from Firestore");
              const ref = doc(db, "users", user.uid);
              const docSnap = await getDoc(ref);
              const result = docSnap.data();
              result.userDeck.forEach((card) => {
                tempTodoArray.push(card);
              });
              set(() => ({ userDeck: tempTodoArray }));
            }
            fetch();
          } catch (e) {
            console.log(e);
          }
      },

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

      calculateCollectionValue: () => {
        let arr = get()
          .userDeck.map((card) => card.userDeckInfo.quantity)
          .map((item) => Object.values(item))
          .reduce((prev, current) => prev + parseInt(current), 0);
        // console.log(arr);

        set((state) => ({
          collectionValue: arr,
        }));
      },
    })),
    { name: "collection-storage" }
  )
);

export default useCollectionStore;
