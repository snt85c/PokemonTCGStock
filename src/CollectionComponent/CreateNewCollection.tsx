import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";
import useCollectionStore from "./useCollectionStore";
export default function CreateNewCollection() {
  const { user } = useUserAuth();

  const createNewCollection = useCollectionStore((state:iCollectionStore)=> state.createNewCollection)

  return (
    <button
      className="flex px-2 mx-2 justify-center items-center text-black bg-white hover:bg-gray-300  ml-3 rounded duration-300"
      onClick={() => {
        createNewCollection(user);
      }}
    >
      new
    </button>
  );
}
