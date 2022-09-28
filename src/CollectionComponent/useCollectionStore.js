import create from "zustand";
import shallow from "zustand/shallow";
import { devtools, persist } from "zustand/middleware";
import {
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  deleteDoc,
  getDocs,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";

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
              const ref = collection(db, "users", user.uid, "deck1");
              const docSnap = await getDocs(ref);
              docSnap.forEach((item) => {
                console.log(item.data())
                tempTodoArray.push(item.data());
              });
              set(() => ({ userDeck: tempTodoArray }));
              get().calculateCollectionValue();
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
            const docRef = doc(db, "users", user, "deck1",request.id);
            setDoc(docRef, request );
            console.log("Document written with ID: ", request.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      },

      updateCardOnUserDeck: (request) => {
        const find = get().userDeck.findIndex((card) => request.id == card.id);
        if (find >= 0) {
          const updatedArray = get().userDeck;
          updatedArray[find] = request;
          set(() => ({
            userDeck: updatedArray,
          }));
          get().calculateCollectionValue();
        }
      },

      removeFromUserDeck: (request, userUid) => {
        try {
           deleteDoc(doc(db, "users", userUid, "deck1", request.id));
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
        set(() => ({
          collectionValue: get()
            .userDeck.map((card) => card.userDeckInfo.value)
            .reduce((prev, curr) => prev + curr, 0),
        }));
      },
    })),
    { name: "collection-storage" }
  )
);

export default useCollectionStore;
