import Card from "../CardComponents/Card";
import { iCard, iFilter } from "../Interfaces";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Sort from "./Sort";
import Filter from "./Filter";
import countCards from "../utils/countCards";
import calculateCardValueAsNumber from "../utils/calculateCardValueAsNumber";

export default function Deck(props: { deck: iCard[]; type: string }) {
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("name");
  const [isSortingAscending, setIsSortingAscending] = useState(true);

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

  function handleRemoveSingleFilter(option: string) {
    let temp = filter.filter((item) => {
      return item !== option;
    });
    setFilter(temp);
  }

  let result: JSX.Element[] = props.deck
    .filter((card) => {
      //first, we comb the array for each path where a filter option might be (if not present we return the card, this way we return less card each time )
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
        /**
         *then, we scrape the object passed for different path which we save on the cardFilter object,
         *was done manually because im still not sure if anything needs to be added, also, some are
         *arrays some are not
         */
        if (props.type === "collection") {
          let totalCardsAmount = countCards(card);
          let adjustedValue = calculateCardValueAsNumber(card);
          card = { ...card, totalCardsAmount, adjustedValue };
        }
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
      //then, we check our sort state and we do a switch case that return the selected option (sort by name, release date etc etc)
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "series":
          return a.set.series.localeCompare(b.set.series);
        case "release date":
          return a.set.releaseDate.localeCompare(b.set.releaseDate);
        case "amount of cards":
          return a.totalCardsAmount - b.totalCardsAmount;
        case "value":
          return a.adjustedValue - b.adjustedValue;
        default:
          return a.number - b.number;
      }
    })
    .filter((card) => {
      /**
       * we filter the array a second time. the first time is to make sure that each time i filter i also
       * remove that key from the filter (in the map) the second time is to remove the key that is been passed
       */
      if (
        !filter.includes(card.rarity) &&
        !filter.includes(card.set.name) &&
        !filter.includes(card.set.series) &&
        !filter.includes(card.subtypes ? card.subtypes[0] : "") &&
        !filter.includes(card.types ? card.types[0] : "")
      )
        return card;
    })
    //finally, we return the item from an object of type iCard to an array of JSX.Elements
    .map((card: iCard) => {
      return <Card key={uuidv4()} type={props.type} data={card} />;
    });

  //also also, if triggered, it uno-reverse the order of the cards
  if (isSortingAscending) result.reverse();

  return (
    <>
      {result.length > 0 && (
        <div className="rounded-xl bg-gray-300 m-2 p-2 dark:bg-slate-500 border border-white shadow-lg">
          <Sort
            {...{
              sort,
              setSort,
              isSortingAscending,
              setIsSortingAscending,
              type: props.type,
            }}
          />
          <Filter {...{ cardFilter, handleClickFilter, type: props.type }} />
        </div>
      )}
      <div className="flex flex-col overflow-scroll bg-white text-black h-[100%]  dark:bg-slate-900 dark:text-white duration-300">
        {props.deck.length ? (
          <>
            {filter.length > 0 && (
              <>
                <div className="mx-3 flex flex-col gap-2 dark:text-white text-black font-[PlayR] leading-none ">
                  <div>
                    <div className="flex mt-1 flex-wrap">
                      Filtering :{" "}
                      {filter.map((item) => (
                        <div
                          key={uuidv4()}
                          className=" border rounded-3xl p-1 px-5 ml-2 mt-1 hover:bg-white hover:text-black cursor-pointer duration-300"
                          onClick={() => handleRemoveSingleFilter(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    {result.length > 0 ? (
                      <>"Results:"{result.length}</>
                    ) : (
                      "no cards found:"
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="pb-[9rem]">{result}</div>
          </>
        ) : (
          <div className="flex justify-center items-center mt-10">
            no cards in this {props.type}
          </div>
        )}
      </div>
    </>
  );
}
