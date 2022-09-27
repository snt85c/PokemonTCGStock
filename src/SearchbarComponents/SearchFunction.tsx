import { useEffect, useState } from "react";
import { iCard, iSearchStore } from "../Interfaces";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import useDeckStore from "./useSearchStore";


export default function SearchFunction() {
  const [searchRequest, setSearchRequest] = useState("");
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);
  const setResultJSXArray = useDeckStore(
    (state: iSearchStore) => state.setResultJSXArray
  );
  useEffect(() => {
    if (searchTrigger && searchRequest !== "") {
    try {
        const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchRequest}"`;
        fetch(url, {
          method: "GET",
          headers: {
            "X-Auth-Token": "3b7be5e5-54b3-4668-9831-c6f5616d9168",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            const result = data.data.map((card: iCard) => {
              return card;
            });
            setResultJSXArray(result);
            setSearchTrigger(false);
          });
        } catch (e) {
          console.log(e);
        }
      }
  }, [searchTrigger]);

  return (
    <>
      <SearchInput {...{ searchRequest, setSearchRequest }} />
      <SearchButton {...{ setSearchTrigger, searchTrigger, searchRequest }} />
    </>
  );
}
