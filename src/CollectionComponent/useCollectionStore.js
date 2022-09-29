import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";

const useCollectionStore = create(
  devtools(
    persist((set, get) => ({
      currentDeck: [],
      currentDeckInfo: null,
      decks: [],
      collectionValue: 0,

      createNewCollection: async (user) => {
        if (!get().decks) {
          set(() => ({
            decks: [],
          }));
        }
        console.log("create new collection", get().decks);
        if (get().currentDeckInfo && get().decks) {
          let newDeckId = "";
          if (get().decks) {
            newDeckId = "deck" + (get().decks.length + 1);
          } else {
            newDeckId = "deck1";
          }
          const collectionRef = doc(db, "users", user.uid, newDeckId, "info");
          setDoc(
            collectionRef,
            {
              name: newDeckId,
              type: "deck",
              creationDate: new Date(),
              note: "",
            },
            { merge: true }
          );
          const temp = {
            decks: get().decks ? get().decks.push(newDeckId) : [],
          };
          const userRef = doc(db, "users", user.uid);
          updateDoc(userRef, { decks: [...get().decks] }, { merge: true });
          const temp2 = [...get().decks];
          console.log(temp2);
          set(() => ({
            decks: temp2,
          }));
        }
      },

      setUserDeckFromFirebase: async (user, deck) => {
        if (user)
          try {
            let tempTodoArray = [];
            async function fetch() {
              console.log("fetching userDeck from Firestore");
              const collectionRef = collection(
                db,
                "users",
                user.uid,
                deck ? deck : "deck1"
              );
              const colSnap = await getDocs(collectionRef);
              colSnap.forEach((item) => {
                let temp = item.data();

                if (temp.type !== "deck") {
                  tempTodoArray.push(item.data());
                } else {
                  console.log(temp);
                  set(() => ({ currentDeckInfo: temp }));
                }
              });
              const docRef = doc(db, "users", user.uid);
              const docSnap = (await getDoc(docRef)).data();
              console.log(docSnap);
              set(() => ({
                currentDeck: tempTodoArray,
                decks: docSnap.decks,
              }));

              get().calculateCollectionValue();
            }
            fetch();
          } catch (e) {
            console.log(e);
          }
      },

      findInCollection: (request) => {
        return get().currentDeck.find((card) => card.id === request.id);
      },

      addToUserDeck: (request, user, deck) => {
        const found = get().findInCollection(request);
        if (!found) {
          set((state) => ({
            currentDeck: [...state.currentDeck, request],
          }));
          try {
            const docRef = doc(
              db,
              "users",
              user,
              deck ? deck : "deck1",
              request.id
            );
            setDoc(docRef, request);
            console.log("Document written with ID: ", request.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      },

      updateCardOnUserDeck: (request) => {
        const find = get().currentDeck.findIndex(
          (card) => request.id == card.id
        );
        if (find >= 0) {
          const updatedArray = get().currentDeck;
          updatedArray[find] = request;
          set(() => ({
            currentDeck: updatedArray,
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
          currentDeck: state.currentDeck.filter((item) => {
            return item.id !== request.id;
          }),
        }));
      },

      calculateCollectionValue: () => {
        set(() => ({
          collectionValue: get()
            .currentDeck.map((card) => card.userDeckInfo.value)
            .reduce((prev, curr) => prev + curr, 0),
        }));
      },
    })),
    { name: "collection-storage" }
  )
);

export default useCollectionStore;
