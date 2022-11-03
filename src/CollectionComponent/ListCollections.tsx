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
    (state: iCollectionStore) => state.currentDeckInfo
  );

  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );

  const result =
    decks &&
    decks.map((deck: any) => {
      return (
        <div
          key={uuidv4()}
          className="tooltip tooltip-bottom"
          data-tip={"switch to " + deck}
        >
          <button
            className="flex px-2 mt-1 justify-center items-center font-[PlayR] text-black bg-gray-300 hover:bg-gray-400  ml-1 rounded duration-300"
            onClick={() => {
              setUserDeckFromFirebase(user.uid, deck);
            }}
            style={{
              backgroundColor:
                currentDeckInfo && currentDeckInfo.id === deck ? "" : "#334155",
              color:
                currentDeckInfo && currentDeckInfo.id === deck ? "" : "white",
            }}
          >
            {deck}
          </button>
        </div>
      );
    });

  return (
    <div className="flex  items-center m-2 mt-0 flex-wrap">
      <>{result}</>
      <CreateNewCollection />
    </div>
  );
}
