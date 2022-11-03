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
        <div id="collection" className="flex snap-center flex-col h-screen min-w-[100%] sm:px-[10rem] pt-2 bg-white  dark:bg-slate-900 text-black dark:text-white duration-300">
          <Darkmode />
          <CurrentCollectionInfo />
          <ListCollections />
          <Deck deck={userDeck} type="collection" />
        </div>
      )}
      {!user && <div className="flex flex-col text-center min-h-screen bg-slate-500 text-white"></div>}
    </>
  );
}
