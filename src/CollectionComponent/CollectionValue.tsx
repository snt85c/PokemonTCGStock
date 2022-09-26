
import { iCollectionStore } from "../Interfaces";
import useStore, { iState } from "../LoginComponents/useProfileStore";
import useCollectionStore from "./useCollectionStore";

export default function CollectionValue() {
  const value = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );

  const rate = useStore((state:iState)=> state.conversionRate)
  const sym = useStore((state:iState)=> state.conversionSym)



  return (
    <>
      <b className="flex justify-center items-center">
        total value: {(value * rate).toFixed(2) +" " + sym.toLocaleUpperCase()} 
      </b>
    </>
  );
}
