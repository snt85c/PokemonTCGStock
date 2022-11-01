import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import Darkmode from "../ProfileComponents/Darkmode";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import CollectionRecap from "./CollectionRecap";

export default function Home() {
  let totalDecksValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  const rate = useProfileStore((state: iState) => state.conversionRate);
  let conversionSym = useProfileStore((state: iState) => state.conversionSym);

  return (
    <>
      <Darkmode />
      <div className="flex flex-col justify-start  sm:px-[10rem] items-center p-5 min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white duration-300 mb-10">
        <h1 className=" font-bold text-xl text-black dark:text-white font-[Phonk]">
          my collections
        </h1>
        <div className="flex flex-col">
          <div className="flex justify-center items-center m-3  dark:bg-gray-500 bg-gray-200 rounded-3xl py-1 px-6">
            total:{" "}
            <span className="font-bold text-2xl text-black dark:text-white">
              {(totalDecksValue * rate).toFixed(2)}{" "}
              {conversionSym.toLocaleUpperCase()}
            </span>
          </div>
        </div>
        <CollectionRecap />
      </div>
    </>
  );
}
