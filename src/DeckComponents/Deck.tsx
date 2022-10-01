import Card from "../CardComponents/Card";
import { iCard, iFilter } from "../Interfaces";
import { v4 as uuidv4 } from "uuid";
import Filter from "./Filter";
import {  useState } from "react";
import Sort from "./Sort";

export default function Deck(props: { deck: iCard[]; type: string }) {
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState("name");
  const [isSortingAscending,setIsSortingAscending] = useState(true)
  
  let cardFilter: iFilter = {
    rarity: [],
    set: [],
    series: [],
    subtypes: [],
    releaseDate: [],
    types: [],
  };

  const handleClickFilter = (option: string, restore?: string[]) => {
    //we pass the option we want to filter and an array of options in case we want to reset for that configuration
    if (option === "clear") {
      //we are resetting the filter, 
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
        //because we removed all the options, so restore returns empty, or we clicked clear for all 
        setFilter([]);
      }
      return;
    }
    if (filter && !filter.includes(option)) {
      //we check the array of filter, if the new filter is not in the array, we add it
      setFilter([...filter, option]);
    }
  };

 

  let result: JSX.Element[] = props.deck
    .filter((card) => {
      //first, we filter the array for each path were a filter option might be (if not present we return the card, this way we return less card each time )
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
        //then, we scrape the object passed for different path which we save on the cardFilter object, was done manually because im still not sure if anything needs to be added, also, some are arrays some are not
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
      //then, we check our sort state and we do a switch case that return the selected option (ort by name, release date etc etc)
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
    //finally, we return the item from an object of type iCard to an array of JSX.Elements
    .map((card: iCard) => {
      return <Card key={uuidv4()} type={props.type} data={card} />;
    })

    //also also, if triggered, it reverse the order of the cards
    if(isSortingAscending)result.reverse()
   

  return (
    <>
      <div className="flex flex-col overflow-scroll bg-slate-500 text-black min-h-screen  dark:bg-slate-900 dark:text-white duration-300">
        {props.deck.length ? (
          <>
          <div className="rounded-xl bg-white mx-2 p-2 dark:bg-slate-500">

            <Sort {...{ sort, setSort, isSortingAscending,setIsSortingAscending }} />
            <Filter cardFilter={cardFilter} handleClick={handleClickFilter} />
            {filter.length > 0 && (
              <>
                <div className="mx-3 my-1 flex gap-2 text-white">
                  Filtering out: {filter} <div>Results:{result.length}</div>
                </div>
              </>
            )}
            </div>
            <div className="mb-[9rem]">{result}</div>
          </>
        ) : (
          <div className="flex justify-center items-center m-2">no items</div>
        )}
      </div>
    </>
  );
}
