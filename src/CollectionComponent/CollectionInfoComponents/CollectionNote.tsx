import {  useState } from "react";
import { iCollectionStore } from "../../Interfaces";
import useCollectionStore from "../useCollectionStore";


export default function CollectionNote() {

  const currentNote = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo.note
  );

  const setCurrentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.setCurrentDeckInfo
  );
  const [isEditNote, setIsEditNote] = useState(false);
    let changeNote = currentNote
  const handleClick = () => {
    setIsEditNote(false);
    setCurrentDeckInfo(changeNote, "note");
    changeNote = ""
  };

  return (
    <>
      {isEditNote ? (
        <div className="flex justify-between mt-1">
          <input
            key={2}
            className="bg-gray-500 w-full"
            defaultValue={currentNote}
            onChange={(e) => changeNote = e.target.value}
          />
          <button
            className="flex w-1/4 text-black justify-center items-center bg-white mx-3 rounded hover:bg-gray-300 duration-300"
            onClick={handleClick}
          >
            ok
          </button>
        </div>
      ) : (
        <div className="text-sm font-[PlayR]" onClick={() => setIsEditNote(true)}>
          {currentNote ? currentNote : "empty"}
        </div>
      )}
    </>
  );
}
