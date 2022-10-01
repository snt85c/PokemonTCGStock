
import { iCollectionStore } from "../../Interfaces";
import useProfileStore, { iState } from "../../ProfileComponents/useProfileStore";
import CollectionValue from "./CollectionValue";
import useCollectionStore from "../useCollectionStore";
import CollectionName from "./CollectionName";
import CollectionNote from "./CollectionNote";
import CollectionCreationDate from "./CollectionCreationDate";

export default function CurrentCollectionInfo() {
 

  const currentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
  );

  const value = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const sym = useProfileStore((state: iState) => state.conversionSym);

  return (
    <>
      {currentDeckInfo && (
        <div className="mx-2">
          <CollectionName />
          <CollectionNote />
          {/* <CollectionCreationDate /> */}
          <CollectionValue />
        </div>
      )}
    </>
  );
}
