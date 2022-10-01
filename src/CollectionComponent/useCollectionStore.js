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
  query,
  where,
} from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";

const useCollectionStore = create(
  devtools(
    persist((set, get) => ({
      userUID: "",
      currentDeck: [],
      currentDeckInfo: null,
      decks: [],
      collectionValue: 0,

      setCurrentDeckInfo: (user, request, type) => {
        console.log(
          { ...get().currentDeckInfo, [type]: request },
          "setCurrentDeckInfo"
        );
        updateDoc(
          doc(db, "users", get().userUID, "decks", get().currentDeckInfo.id),
          { [type]: request }
        );
        set((state) => ({
          currentDeckInfo: { ...state.currentDeckInfo, [type]: request },
        }));
      },

      setUserDeckFromFirebase: async (user, deck) => {
        //we get either the first deck at login or the deck that the user is asking for, plus an array of index to keep note of how many decks are available, and the info of the deck
        if (user) {
          let tempArray = [];
          let tempDocSnap = {};
          let tempDecks = [];
          let tempCdi = {};
          async function fetch() {
            console.log("fetch", deck && deck);
            try {
              const collectionRef = collection(
                db,
                "users",
                user.uid,
                "decks",
                deck ? deck : "deck1",
                "cards"
              );
              const colSnap = await getDocs(collectionRef);
              colSnap.forEach((item) => {
                tempArray.push(item.data());
              });
              const docRef = doc(
                db,
                "users",
                user.uid,
                "decks",
                deck ? deck : "deck1"
              );
              tempDocSnap = (await getDoc(docRef)).data();
              tempCdi = tempDocSnap
                ? tempDocSnap
                : {
                    id: "deck1",
                    name: "",
                    type: "deck",
                    creationDate: new Date(),
                    note: "",
                  };
              const colRef2 = collection(db, "users", user.uid, "decks");
              let list = (await getDocs(colRef2)).size;
              for (let i = 0; i < list; i++) {
                tempDecks.push("deck" + (i + 1));
              }
            } catch (e) {
              console.log(e);
            }
            set(() => ({
              currentDeck: tempArray,
              decks: tempDecks,
              currentDeckInfo: tempCdi,
              userUID: user.uid,
            }));
          }
          fetch().then(() => {
            if (get().decks.length === 0) {
              get().createNewCollection(user);
            }
            get().calculateCollectionValue(user.uid);
          });
          //then we calculate the value of the deck
        }
      },

      createNewCollection: async (user) => {
        if (user) {
          if (/*get().currentDeckInfo && */ get().decks) {
            let newDeckId = "";
            if (get().decks.length !== 0) {
              newDeckId = "deck" + (get().decks.length + 1);
            } else {
              newDeckId = "deck1";
            }

            const collectionRef = doc(
              db,
              "users",
              user.uid,
              "decks",
              newDeckId
            );
            await setDoc(
              collectionRef,
              {
                id: newDeckId,
                name: "",
                type: "deck",
                creationDate: new Date(),
                note: "",
                value: 0,
              },
              { merge: true }
            );
            const newDecksArray = [...get().decks, newDeckId];
            const userRef = doc(db, "users", user.uid);
            updateDoc(userRef, { decks: newDecksArray }, { merge: true });
            set(() => ({
              decks: newDecksArray,
            }));
            console.log("createNewCollection", newDecksArray);
          } else {
            console.log("denied", get().currentDeckInfo, get().decks);
          }
        }
      },

      findInCollection: (request) => {
        //we check if one card is already in the current deck
        return get().currentDeck.find((card) => card.id === request.id);
      },

      addToUserDeck: async (request, user, deck) => {
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
              "decks",
              deck ? deck : "deck1",
              "cards",
              request.id
            );

            await setDoc(docRef, request);
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
          get().calculateCollectionValue(get().userUID);
        }
      },

      removeFromUserDeck: (request, userUid) => {
        //remove on firebase, then filter the currentDeck for that card and return a new array without it
        try {
          deleteDoc(
            doc(
              db,
              "users",
              userUid,
              "decks",
              get().currentDeckInfo.id,
              "cards",
              request.id
            )
          );
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

      calculateCollectionValue: (user) => {
        //get the pre-calculated value of all the cards and sum it
        let value = get()
          .currentDeck.map((card) => card.userDeckInfo.value)
          .reduce((prev, curr) => prev + curr, 0);
        set(() => ({
          collectionValue: value,
        }));
        setDoc(
          doc(db, "users", user, "decks", get().currentDeckInfo.id),
          {
            value: value,
          },
          { merge: true }
        );
      },
      calculateUserDecksTotalValue: async () => {
        let result = 0;

          const queryRef = collection(db, "users", get().userUID, "decks");
          const q = query(queryRef, where("value", ">", 0));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((item) => {
            result += item.data().value;
          });
          console.log(result);
        }
        return result;
      },
    )),

    { name: "collection-storage" }
  )
);

export default useCollectionStore;
