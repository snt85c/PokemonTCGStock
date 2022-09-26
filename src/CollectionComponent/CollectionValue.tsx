import { iCollectionStore } from "../Interfaces";
import useCollectionStore from "./useCollectionStore";

export default function CollectionValue() {
  const value = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );
  return (
    <>
      <b className="flex justify-center items-center">
        total value: {value.toFixed(2)}
      </b>
    </>
  );
}
