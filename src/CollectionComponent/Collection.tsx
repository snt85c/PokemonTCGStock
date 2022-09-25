import { useEffect } from "react";
import Card from "../CardComponents/Card";
import { iCollectionStore, iCard } from "../Interfaces";
import { useUserAuth } from "../LoginComponents/userAuth";
import Deck from "../DeckComponents/Deck";
import useCollectionStore from "./useCollectionStore";

export default function Collection() {
  const { user } = useUserAuth();

  const userDeck = useCollectionStore((state: iCollectionStore) => state.userDeck);
  const value = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );
  const calculateValue = useCollectionStore(
    (state: iCollectionStore) => state.calculateCollectionValue
  );

  useCollectionStore.persist.clearStorage(); //CLEAR STORAGE

  return (
    <>
      {user && (
        <div className="flex flex-col bg-slate-500 text-white">
          <h1 className="flex justify-center items-center m-5 mb-0">
            {user.displayName.split(" ")[0]}'s Cards 
          </h1>
          <b className="flex justify-center items-center">total value: {value.toFixed(2)}</b>
          <div className="overflow-scroll h-[77vh]">
            <Deck deck={userDeck} type="collection"/>
          </div>
        </div>
      )}
      {!user && <div>login first</div>}
    </>
  );
}
