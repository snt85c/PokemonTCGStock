import { DocumentData, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import Card from "../CardComponents/Card";
import { iCollection, iCard } from "../Interfaces";
import { db } from "../LoginComponents/Firebase";
import { useUserAuth } from "../LoginComponents/userAuth";
import useCollectionStore from "./useCollectionStore";

export default function Collection() {
  const { user } = useUserAuth();

  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollection) => state.setUserDeckFromFirebase
  );
  const userDeck = useCollectionStore((state: iCollection) => state.userDeck);
  const value = useCollectionStore(
    (state: iCollection) => state.collectionValue
  );
  const calculateValue = useCollectionStore(
    (state: iCollection) => state.calculateCollectionValue
  );


  const result = userDeck?.map((card: iCard, i: number) => {
    return <Card type={"collection"} data={card} key={i} />;
  });
  useEffect(() => {
    calculateValue();
  }, [userDeck]);

  useCollectionStore.persist.clearStorage();

  useEffect(() => {

      let tempTodoArray: iCard[] = [];
      async function getCardsFromFirestoreAtFirstRender() {
      console.log("fetching userDeck from Firestore");
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      const result = docSnap.data() as DocumentData;
      result.userDeck.forEach((card: iCard) => {
        tempTodoArray.push(card as iCard);
        console.log(card);
      });
      setUserDeckFromFirebase(tempTodoArray);
    }
    if (user && !userDeck) {
      getCardsFromFirestoreAtFirstRender();
    }
  }, []);

  return (
    <>
      {user && (
        <div className="flex flex-col">
          <h1 className="flex justify-center items-center m-5 mb-0">
            {user.displayName.split(" ")[0]}'s Cards 
          </h1>
          <b className="flex justify-center items-center">total value: {value.toFixed(2)}</b>
          <div className="overflow-scroll h-[73vh]">
            {result?.length ? result : <>no items</>}
          </div>
        </div>
      )}
      {!user && <div>login first</div>}
    </>
  );
}
