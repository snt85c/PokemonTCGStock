import { useEffect, useState } from "react";
import { iCollectionStore } from "../Interfaces";
import { useUserAuth } from "../ProfileComponents/userAuth";
import useCollectionStore from "./useCollectionStore";

export default function CollectionNote() {
  const { user } = useUserAuth();

  const currentNote = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo.note
  );

  const setCurrentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.setCurrentDeckInfo
  );
  const [note, setNewNote] = useState(currentNote ? currentNote : "no notes");
  const [isEditNote, setIsEditNote] = useState(false);

  const handleClick = () => {
    setIsEditNote(false);
    setCurrentDeckInfo(user, note, "note");
  };

  return (
    <>
      {isEditNote ? (
        <div className="flex justify-between">
          <input
            key={2}
            className="bg-gray-500 "
            defaultValue={currentNote}
            size={16}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button
            className="flex w-1/4 text-black justify-center items-center bg-white mx-3 rounded hover:bg-gray-300 duration-300"
            onClick={handleClick}
          >
            ok
          </button>
        </div>
      ) : (
        <div className="text-sm" onClick={() => setIsEditNote(true)}>
          {currentNote ? currentNote : "empty"}
        </div>
      )}
    </>
  );
}
