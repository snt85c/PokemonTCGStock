
import { iCollectionStore } from "../../Interfaces";
import useStore, { iState } from "../../ProfileComponents/useProfileStore";
import useCollectionStore from "../useCollectionStore";

export default function CollectionValue() {
  const value = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );

  const rate = useStore((state:iState)=> state.conversionRate)
  const sym = useStore((state:iState)=> state.conversionSym)

  return (
    <>
      <b className="flex justify-start items-center m-1">
        total value: {(value * rate).toFixed(2) +" " + sym.toLocaleUpperCase()} 
      </b>
    </>
  );
}
