import { iCollectionStore } from "../Interfaces";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import useCollectionStore from "./useCollectionStore";

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
          <div className="text-[2.5rem] leading-none">
            {currentDeckInfo.name ? currentDeckInfo.name : "collection"}
          </div>
          <div>{currentDeckInfo.note ? currentDeckInfo.note : "no notes"}</div>
          <b className="flex  items-center">
            total value:{" "}
            {(value * rate).toFixed(2) + " " + sym.toLocaleUpperCase()}
          </b>
          <div></div>
        </div>
      )}
    </>
  );
}
