import { iSearchStore } from "../Interfaces";
import Deck from "../DeckComponents/Deck";
import SearchFunction from "./SearchFunction";
import useDeckStore from "./useSearchStore";
import useSearchStore from "./useSearchStore";
import Darkmode from "../ProfileComponents/Darkmode";

export default function Search() {
  const resultJSXArray = useDeckStore(
    (state: iSearchStore) => state.resultJSXArray
  );
  useSearchStore.persist.clearStorage(); //CLEAR STORAGE

  return (
    <>
      <Darkmode />
      <div className="flex justify-center items-center p-5 pt-10 pb-0 bg-slate-500 dark:bg-slate-900 dark:text-white duration-300">
        <SearchFunction />
      </div>

      <div className="flex justify-center items-center bg-slate-500  dark:bg-slate-900 dark:text-white duration-300">
        {resultJSXArray.length ? (
          <div className="m-2 font-[PlayR]"> results: {resultJSXArray.length} </div>
        ) : (
          <></>
        )}
      </div>
      <Deck deck={resultJSXArray} type="search" />
    </>
  );
}
