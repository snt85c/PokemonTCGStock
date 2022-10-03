import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";
import useCollectionStore from "./useCollectionStore";
import { IoMdAddCircle } from "react-icons/io";

export default function CreateNewCollection() {
  const { user } = useUserAuth();

  const decks = useCollectionStore((state: iCollectionStore) => state.decks);
  const createNewCollection = useCollectionStore(
    (state: iCollectionStore) => state.createNewCollection
  );

  return (
    decks && (
      <div
      className="tooltip tooltip-bottom"
      data-tip="create new collection"
    >
      <button
        className=" ml-3 flex justify-center items-center hover:text-gray-300 duration-300"
        onClick={() => {
          createNewCollection(user.uid);
        }}
      >
        <IoMdAddCircle size={29}/>
      </button></div>
    )
  );
}
