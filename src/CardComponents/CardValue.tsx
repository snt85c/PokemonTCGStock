import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";

export default function CardValue(props:{value:number}) {

    const collectionValue = useCollectionStore(
        (state: iCollectionStore) => state.collectionValue
      );
      const totalCollectionsValue = useCollectionStore(
        (state: iCollectionStore) => state.totalCollectionsValue
      );

    const rate = useProfileStore((state: iState) => state.conversionRate);
    const sym = useProfileStore((state: iState) => state.conversionSym);
  
  return (
    <>
      <div className="flex flex-col leading-none">
        <div className="font-extrabold text-start">
          {(props.value * rate).toFixed(2) +
            " " +
            sym.toLocaleUpperCase()}
        </div>
        <div className="text-[0.7rem] leading-none italic text-start">
          <span className="font-bold">{((props.value / collectionValue) * 100).toFixed(1)}%</span> of
          collection
        </div>
        <div className="text-[0.7rem] leading-none italic text-start">
          <span className="font-bold">{((props.value / totalCollectionsValue) * 100).toFixed(1)}</span>
          % of total
        </div>
      </div>
    </>
  );
}
