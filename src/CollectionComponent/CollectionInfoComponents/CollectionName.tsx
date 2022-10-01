import {  useState } from "react";
import { iCollectionStore } from "../../Interfaces";
import { useUserAuth } from "../../ProfileComponents/userAuth";
import useCollectionStore from "../useCollectionStore";

export default function CollectionName() {
  const { user } = useUserAuth();

  const currentName = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo.name
  );

  const setCurrentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.setCurrentDeckInfo
  );

  const [isEditName, setIsEditName] = useState(false);
  let changeName = ""

  const handleClick = () => {
    setIsEditName(false);
    setCurrentDeckInfo(user, changeName, "name");
    changeName = ""
  };

  return (
    <>
      {isEditName ? (
        <div className="flex justify-between">
          <input
          key={1}
            className="bg-gray-500 text-[2.5rem]"
            defaultValue={currentName}
            size={8}
            onChange={(e) => changeName = e.target.value}
          />
          <button
            className="flex w-1/4 text-black justify-center items-center bg-white mx-3 rounded hover:bg-gray-300 duration-300"
            onClick={handleClick}
          >
            ok
          </button>
        </div>
      ) : (
        <div
          className="text-[2.5rem] leading-none font-extrabold"
          onClick={() => setIsEditName(true)}
        >
          {currentName ? currentName : "Collection"}
        </div>
      )}
    </>
  );
}
