import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import CollectionRecap from "./CollectionRecap";

export default function Home() {
  let totalDecksValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  let conversionSym = useProfileStore((state: iState) => state.conversionSym);

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-slate-500 dark:bg-slate-900 dark:text-white duration-300">
      <h1 className="m-5 font-bold text-xl text-white">Homepage</h1>
      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          total value:{" "}<span className="font-bold text-2xl text-white">{totalDecksValue.toFixed(2)}{" "}
          {conversionSym.toLocaleUpperCase()}</span>
        </div>
      </div>
        <CollectionRecap />
    </div>
  );
}
