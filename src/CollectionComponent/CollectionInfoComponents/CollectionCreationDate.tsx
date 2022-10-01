import { iCollectionStore } from "../../Interfaces";
import { Timestamp } from "firebase/firestore";
import useCollectionStore from "../useCollectionStore";

export default function CollectionCreationDate() {
  const time: Timestamp = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo.creationDate
  );

  return (
    <div className="select-none text-[0.7rem] flex gap-1">
      created on:<span>{time.toDate().toDateString()}</span>
    </div>
  );
}
