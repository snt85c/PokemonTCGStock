import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
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
              id: newDeckId,
              name:"",
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
        //we get either the first deck at login or the deck that the user is asking for, plus an array of index to keep note of how many decks are available, and the info of the deck
        if (user)
          try {
            let tempTodoArray = [];
            async function fetch() {
              console.log("fetching ==>", deck ? deck : "deck1"," from Firestore");
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
                  //inside the deck there is a Jolly with the information on the deck (creationDate, name, notes etc..)
                  set(() => ({ currentDeckInfo: temp }));
                }
              });
              const docRef = doc(db, "users", user.uid);
              const docSnap = (await getDoc(docRef)).data();
              //we set all the cards in the current deck, also we set an array to keep a note of all the decsk
              set(() => ({
                currentDeck: tempTodoArray,
                decks: docSnap.decks,
              }));
              //then we calculate the value of the deck
              get().calculateCollectionValue();
            }
            fetch();
          } catch (e) {
            console.log(e);
          }
      },

      findInCollection: (request) => {
        //we check if one card is already in the current deck
        return get().currentDeck.find((card) => card.id === request.id);
      },

      addToUserDeck: (request, user, deck) => {
        const found = get().findInCollection(request);
        //we check if we have that card, if not we set the current deck with the new card
        if (!found) {
          set((state) => ({
            currentDeck: [...state.currentDeck, request],
          }));
          try {
            //we set it on firebase
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
          //if the card is found in the current deck, we get the index of that array and we change it, then we set it back
          const updatedArray = get().currentDeck;
          updatedArray[find] = request;
          set(() => ({
            currentDeck: updatedArray,
          }));
          get().calculateCollectionValue();
        }
      },

      removeFromUserDeck: (request, userUid,) => {
        //remove on firebase, then filter the currentDeck for that card and return a new array without it
        try {
          deleteDoc(doc(db, "users", userUid, get().currentDeckInfo.id, request.id));
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
        //get the pre-calculated value of all the cards and sum it
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
