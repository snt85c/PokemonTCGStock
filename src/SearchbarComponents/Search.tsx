import { useEffect, useState } from "react";
import Card from "../CardComponents/Card";
import { iCard, iSearch } from "../Interfaces";
import Deck from "./Deck";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import useDeckStore from "./useSearchStore";

export default function Search() {
  const searchRequest = useDeckStore((state: iSearch) => state.searchRequest);
  const resultJSXArray = useDeckStore((state: iSearch) => state.resultJSXArray);
  const setSearchRequest = useDeckStore(
    (state: iSearch) => state.setSearchRequest
  );
  const setResultJSXArray = useDeckStore(
    (state: iSearch) => state.setResultJSXArray
  );
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  useDeckStore.persist.clearStorage();

  useEffect(() => {
    try {
      if (searchTrigger) {
        const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchRequest}"`;
        fetch(url, {
          method: "GET",
          headers: {
            "X-Auth-Token": "3b7be5e5-54b3-4668-9831-c6f5616d9168",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
            const result = data.data.map((card: iCard, i: number) => {
              return <Card type="search" key={i} data={card} />;
            });
            setResultJSXArray(result);
            setSearchTrigger(false);
          });
      }
    } catch (e) {
      console.log(e);
    }
  }, [searchTrigger]);

  return (
    <>
      <div className="flex justify-center items-center m-5 mb-0">
        <SearchInput {...{ searchRequest, setSearchRequest }} />
        <SearchButton {...{ setSearchTrigger, searchTrigger, searchRequest }} />
      </div>
      <div className="flex justify-center items-center">
        {resultJSXArray.length ? (
          <> results: {resultJSXArray.length} </>
        ) : (
          <></>
        )}
      </div>
      <Deck resultJSXArray={resultJSXArray} />
    </>
  );
}
