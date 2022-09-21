import { useEffect, useState } from "react";
import Card from "../Card";
import Deck from "./Deck";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import useDeckStore from "../store/useDeckStore";

export interface iCollection{
  userDeck:iCard[] | undefined
  setUserDeck: (request: iCard | iCard[]) => void,
  setUserDeckFromFirebase:(request: iCard | iCard[]) => void,
}
export interface iCard {
  name: string;
  id: number;
  images: { small: string };
  set: { series: string };
  rarity: string;
  quantity:number
}

export interface iSearch {
  searchRequest: string;
  resultJSXArray: JSX.Element[];
  isLoading: boolean;
  searchTrigger: boolean;

  setSearchRequest: (request: string) => void;
  setIsLoading: (value: boolean) => void;
  setResultJSXArray: (value:JSX.Element[]) =>void
}

export default function Search() {
  const searchRequest = useDeckStore((state: iSearch) => state.searchRequest);
  const resultJSXArray = useDeckStore((state:iSearch) => state.resultJSXArray)
  const setSearchRequest = useDeckStore((state: iSearch) => state.setSearchRequest);
  const setResultJSXArray = useDeckStore((state:iSearch)=>state.setResultJSXArray)
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  useDeckStore.persist.clearStorage()

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
              return <Card key={i} data={card} />;
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
      <div className="flex justify-center items-center mt-5">
        <SearchInput {...{ searchRequest, setSearchRequest }} />
        <SearchButton {...{ setSearchTrigger, searchTrigger }} />
      </div>
      <div className="flex justify-center items-center">
        {resultJSXArray.length ? (
          <> results: {resultJSXArray.length} </>
        ) : (
          <></>
        )}
      </div>
      <Deck resultJSXArray={resultJSXArray} />
      <div className="flex justify-center items-center"></div>
    </>
  );
}
