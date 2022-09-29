import { iCollectionStore, iCard } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";
import Deck from "../DeckComponents/Deck";
import useCollectionStore from "./useCollectionStore";
import CollectionValue from "./CollectionValue";
import CreateNewCollection from "./CreateNewCollection";
import ListCollections from "./ListCollections";

export default function Collection() {
  const { user } = useUserAuth();
  const userDeck = useCollectionStore(
    (state: iCollectionStore) => state.currentDeck
  );

  useCollectionStore.persist.clearStorage(); //CLEAR STORAGE

  return (
    <>
      {user && (
        <div className="flex flex-col bg-slate-500 text-white">
          <div className="m-5flex justify-center items-center">
            <span className="flex justify-center pt-2">{user.displayName.split(" ")[0]}'s Cards</span>
            <CollectionValue />
          </div>
          <ListCollections />
          <Deck deck={userDeck} type="collection" />
        </div>
      )}
      {!user && <div>login first</div>}
    </>
  );
}
