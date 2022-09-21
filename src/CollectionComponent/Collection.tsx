import {
  getDocs,
  collection,
  DocumentData,
  doc,
  getDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import Card from "../Card";
import { db } from "../LoginComponents/Firebase";
import { useUserAuth } from "../LoginComponents/userAuth";
import { iCard, iCollection, iSearch } from "../SearchbarComponents/Search";
import useCollectionStore from "../store/useCollectionStore";

export default function Collection() {
  const setUserDeck = useCollectionStore(
    (state: iCollection) => state.setUserDeck
  );
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollection) => state.setUserDeckFromFirebase
  );
  const userDeck = useCollectionStore((state: iCollection) => state.userDeck);
  const { user } = useUserAuth();

  const result = userDeck?.map((card: iCard, i: number) => {
    return <Card data={card} key={i} />;
  });

  useCollectionStore.persist.clearStorage();

  useEffect(() => {
    let tempTodoArray: iCard[] = [];
    async function getCardsFromFirestoreAtFirstRender() {
      const ref = doc(db, "users", user.uid);
      const docSnap = await getDoc(ref);
      const result = docSnap.data() as DocumentData;
      result.userDeck.forEach((card: iCard) => {
        tempTodoArray.push(card as iCard);
        console.log(card)
      });
      setUserDeckFromFirebase(tempTodoArray);
    }
    if (user) {
      getCardsFromFirestoreAtFirstRender();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col ">
        <div className="flex flex-col sm:flex-row sm:flex-wrap ">
          {user && user.displayName.split(" ")[0]}'s Cards
        </div>
        {result?.length ? result : <>no items</>}
      </div>
    </>
  );
}
