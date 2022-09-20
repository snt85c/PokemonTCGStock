import { useEffect, useState } from "react";
import Card from "../Card";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";

interface iCard {
  name: string;
  id: number;
  images: { small: string };
}

export default function Searchbar() {
  const [searchRequest, setSearchRequest] = useState<string>("");
  const [resultJSXArray, setResultJSXArray] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setResultJSXArray([]);
    if (searchRequest) {
      const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchRequest}"`;
      fetch(url, {
        method: "GET",
        headers: {
          "X-Auth-Token": "3b7be5e5-54b3-4668-9831-c6f5616d9168",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          const result = data.data.map((card: iCard, i: number) => {
            return <Card key={i} src={card.images.small} />;
          });
          setIsLoading(false);
          setResultJSXArray(result);
        });
    } else {
      setResultJSXArray([]);
    }
  }, [searchTrigger]);

  return (
    <>
      <SearchInput {...{ searchRequest, setSearchRequest }} />
      <SearchButton {...{setSearchTrigger}}/>
      {!isLoading ? (searchRequest ? "READY" : "") : "LOADING"}
      {resultJSXArray.length && <> results: {resultJSXArray.length} </>}
      <div className="flex flex-wrap">{resultJSXArray}</div>
    </>
  );
}
