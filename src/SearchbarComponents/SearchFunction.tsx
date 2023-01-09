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
  const APIKEY = process.env.REACT_APP_POKEMON_TCG_API;


  useEffect(() => {
    const listener = (event: { key: string; preventDefault: () => void }) => {
      //detects if the user is pressing the enter key to start a search
      if (event.key === "Enter") {
        event.preventDefault();
        if(searchRequest !== "")
        setSearchTrigger(true)
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  useEffect(() => {
    if (searchTrigger && searchRequest !== "") {
    try {
        const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchRequest}"`;
        fetch(url, {
          method: "GET",
          headers: {
            "X-Auth-Token": APIKEY?APIKEY:"",
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data.data)
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
    <div className="flex gap-2">
      <SearchInput {...{ searchRequest, setSearchRequest }} />
      <SearchButton {...{ setSearchTrigger, searchTrigger, searchRequest }} />
    </div>
  );
}
