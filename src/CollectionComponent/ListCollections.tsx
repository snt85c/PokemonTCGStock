import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import CreateNewCollection from "./CreateNewCollection";
import { v4 as uuidv4 } from "uuid";
import useCollectionStore from "./useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";

export default function ListCollections() {
  const { user } = useUserAuth();

  const decks = useCollectionStore((state: iCollectionStore) => state.decks);
  const currentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo)

  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );

  const result =
    decks &&
    decks.map((deck: any) => {
      return (
        <button
          key={uuidv4()}
          className="flex px-2 mt-1 justify-center items-center text-black bg-white hover:bg-gray-300  ml-1 rounded duration-300"
          onClick={() => {
            setUserDeckFromFirebase(user, deck);
          }}
          style={{
            backgroundColor: currentDeckInfo.id === deck ? "#334155" : "",
            color: currentDeckInfo.id === deck ? "white" : "",
          }}
        >
          {deck}
        </button>
      );
    });

  return (
    <div className="flex m-2 flex-wrap">
      <>{result}</>
      <CreateNewCollection />
    </div>
  );
}
