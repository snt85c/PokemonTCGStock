import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";
import Deck from "../DeckComponents/Deck";
import useCollectionStore from "./useCollectionStore";
import ListCollections from "./ListCollections";
import CurrentCollectionInfo from "./CollectionInfoComponents/CurrentCollectionInfo";
import Darkmode from "../ProfileComponents/Darkmode";

export default function Collection() {
  const { user } = useUserAuth();
  const userDeck = useCollectionStore(
    (state: iCollectionStore) => state.currentDeck
  );

  useCollectionStore.persist.clearStorage(); //CLEAR STORAGE

  return (
    <>
      {user && (
        <div className="flex flex-col pt-2 bg-slate-500  dark:bg-slate-900 dark:text-white duration-300 text-white">
          <Darkmode />
          <CurrentCollectionInfo />
          <ListCollections />
          <Deck deck={userDeck} type="collection" />
        </div>
      )}
      {!user && <div className="flex flex-col  min-h-screen bg-slate-500 text-white">you need to login first</div>}
    </>
  );
}
