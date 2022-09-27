import Card from "../CardComponents/Card";
import { iCard, iFilter } from "../Interfaces";
import { v4 as uuidv4 } from "uuid";
import Filter from "./Filter";
import { useEffect, useState } from "react";
import Sort from "./Sort";

export default function Deck(props: { deck: iCard[]; type: string }) {
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState("name");
  const [isSortingAscending,setIsSortingAscending] = useState(true)

  const handleClick = (option: string, restore?: string[]) => {
    if (option === "clear") {
      const newFilter = filter
        .map((item) => {
          if (restore?.includes(item)) {
            return item;
          }
          return "";
        })
        .filter((item) => item !== "");
      setFilter(newFilter);
      if (!restore?.length) {
        setFilter([]);
      }
      return;
    }
    if (filter && !filter.includes(option)) {
      setFilter([...filter, option]);
    }
  };

  let cardFilter: iFilter = {
    rarity: [],
    set: [],
    series: [],
    subtypes: [],
    releaseDate: [],
    types: [],
  };

  let result: JSX.Element[] = props.deck
    .filter((card) => {
      if (
        !filter.includes(card.rarity) &&
        !filter.includes(card.set.name) &&
        !filter.includes(card.set.series) &&
        !filter.includes(card.subtypes ? card.subtypes[0] : "") &&
        !filter.includes(card.types ? card.types[0] : "")
      )
        return card;
    })
    .map((card: iCard) => {
      try {
        //some values from the API are optional, so i wrap in try/catch for the time being until i figure what is optional and what is not
        if (!cardFilter.rarity.includes(card.rarity)) {
          cardFilter = {
            ...cardFilter,
            rarity: [...cardFilter.rarity, card.rarity],
          };
        }
        if (!cardFilter.set.includes(card.set.name)) {
          cardFilter = {
            ...cardFilter,
            set: [...cardFilter.set, card.set.name],
          };
        }
        if (!cardFilter.series.includes(card.set.series)) {
          cardFilter = {
            ...cardFilter,
            series: [...cardFilter.series, card.set.series],
          };
        }
        if (card.subtypes && !cardFilter.subtypes.includes(card.subtypes[0])) {
          cardFilter = {
            ...cardFilter,
            subtypes: [...cardFilter.subtypes, ...card.subtypes],
          };
        }
        if (!cardFilter.releaseDate.includes(card.set.releaseDate)) {
          cardFilter = {
            ...cardFilter,
            releaseDate: [...cardFilter.releaseDate, card.set.releaseDate],
          };
        }
        if (card.types && !cardFilter.types.includes(card.types[0])) {
          cardFilter = {
            ...cardFilter,
            types: [...cardFilter.types, card.types[0]],
          };
        }
      } catch (e) {
        console.log(e);
      }
      return card;
    })
    .sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "series":
          return a.set.series.localeCompare(b.set.series);
        case "release date":
          return a.set.releaseDate.localeCompare(b.set.releaseDate)
        default:
          return a.number - b.number;
      }
    })
    .map((card: iCard) => {
      return <Card key={uuidv4()} type={props.type} data={card} />;
    })

    if(isSortingAscending)result.reverse()
   

  return (
    <>
      <div className="flex flex-col overflow-scroll bg-slate-500 text-black min-h-screen">
        {props.deck.length ? (
          <>
            <Sort {...{ sort, setSort, isSortingAscending,setIsSortingAscending }} />
            <Filter cardFilter={cardFilter} handleClick={handleClick} />
            {filter.length > 0 && (
              <>
                <div className="mx-3 my-1 flex gap-2 text-white">
                  Filtering out: {filter} <div>Results:{result.length}</div>
                </div>
              </>
            )}
            <div className="mb-[9rem]">{result}</div>
          </>
        ) : (
          <div className="flex justify-center items-center m-2">no items</div>
        )}
      </div>
    </>
  );
}
