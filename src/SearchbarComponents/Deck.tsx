import Card from "../CardComponents/Card";
import { iCard } from "../Interfaces";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export default function Deck(props: { deck: iCard[]; type: string }) {
  let cardFilter: any = {
    rarity: [],
    set: [],
    series: [],
    subtypes: [],
    releaseDate: [],
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const result = props.deck
    .filter((card) => {
      return true;
    }) //filter goes here, right now it just return the object as it is
    .map((card: iCard) => {
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
      if (!cardFilter.subtypes.includes(card.subtypes[0])) {
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
      return <Card type={props.type} key={uuidv4()} data={card} />;
    });

  return (
    <>
      <div className="flex flex-col overflow-scroll h-[80vh] bg-slate-500 text-black">
        {props.deck.length ? (
          <>
            <span
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex justify-center items-center bg-white mx-3 rounded"
            >
              {isFilterOpen ? "close filters" : "open Filter"}
            </span>
            <div
              style={{
                display: isFilterOpen ? "flex" : "none",
                opacity: isFilterOpen ? 1 : 0,
              }}
              className="flex flex-col duration-300 p-3 mx-3  bg-white rounded-bl rounded-br"
            >
              {Object.keys(cardFilter).map((key) => {
                return (
                  <>
                    <b>{key}</b>
                    <select>
                      <option value="">clear filter</option>
                      {cardFilter[key].map((item: any) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </>
                );
              })}
            </div>
            <div>{result}</div>
          </>
        ) : (
          <div className="flex justify-center items-center m-2">no items</div>
        )}
      </div>
    </>
  );
}
