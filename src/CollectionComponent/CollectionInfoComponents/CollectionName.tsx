import {  useState } from "react";
import { iCollectionStore } from "../../Interfaces";
import useCollectionStore from "../useCollectionStore";

export default function CollectionName() {

  const currentName = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo.name
  );

  const setCurrentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.setCurrentDeckInfo
  );

  const [isEditName, setIsEditName] = useState(false);
  let changeName = currentName

  const handleClick = () => {
    setIsEditName(false);
    setCurrentDeckInfo( changeName, "name");
    changeName = ""
  };

  return (
    <>
      {isEditName ? (
        <div className="flex justify-between">
          <input
          key={1}
            className="bg-gray-500 text-[2.5rem] w-full"
            defaultValue={currentName}
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
          className="text-[2.5rem] leading-none font-extrabold font-[PlayB]"
          onClick={() => setIsEditName(true)}
        >
          {currentName ? currentName : "Collection"}
        </div>
      )}
    </>
  );
}
