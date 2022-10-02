import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";
import useCollectionStore from "./useCollectionStore";
export default function CreateNewCollection() {
  const { user } = useUserAuth();

  const decks = useCollectionStore((state: iCollectionStore) => state.decks);
  const createNewCollection = useCollectionStore(
    (state: iCollectionStore) => state.createNewCollection
  );

  return (
    decks && (
      <button
        className="flex px-2 mx-2 mt-1 justify-center items-center text-black bg-white hover:bg-gray-300  ml-3 rounded duration-300"
        onClick={() => {
          createNewCollection(user.uid);
        }}
      >
        +
      </button>
    )
  );
}
