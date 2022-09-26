import { iCollectionStore, iCard } from "../Interfaces";
import { useUserAuth } from "../LoginComponents/userAuth";
import Deck from "../DeckComponents/Deck";
import useCollectionStore from "./useCollectionStore";
import CollectionValue from "./CollectionValue";

export default function Collection() {
  const { user } = useUserAuth();
  const userDeck = useCollectionStore(
    (state: iCollectionStore) => state.userDeck
  );

  useCollectionStore.persist.clearStorage(); //CLEAR STORAGE

  return (
    <>
      {user && (
        <div className="flex flex-col bg-slate-500 text-white">
          <h1 className="flex justify-center items-center m-5 mb-0">
            {user.displayName.split(" ")[0]}'s Cards
          </h1>
          <CollectionValue />
          <div className="overflow-scroll h-[77vh]">
            <Deck deck={userDeck} type="collection" />
          </div>
        </div>
      )}
      {!user && <div>login first</div>}
    </>
  );
}
