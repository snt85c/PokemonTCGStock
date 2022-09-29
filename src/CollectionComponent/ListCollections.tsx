import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import CreateNewCollection from "./CreateNewCollection";
import { v4 as uuidv4 } from "uuid";
import useCollectionStore from "./useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";

export default function ListCollections() {
  const { user } = useUserAuth();

  const userInfo = useProfileStore((state: iState) => state.userInfo);
  const decks = useCollectionStore((state: iCollectionStore) => state.decks);


  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );

  const result = decks && decks.map((deck: any) => {
    return (
      <button
        key={uuidv4()}
        className="flex px-2 mx-2 justify-center items-center text-black bg-white hover:bg-gray-300  ml-3 rounded duration-300"
        onClick={()=>{setUserDeckFromFirebase(user,deck)}}
      >
        {deck}
      </button>
    );
  });

  return (
    <div className="flex my-2">
      <>{result}</>
      <CreateNewCollection />
    </div>
  );
}
