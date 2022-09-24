import Card from "../CardComponents/Card";
import { iCard, iFilter } from "../Interfaces";
import { v4 as uuidv4 } from "uuid";
import Filter from "./Filter";

export default function Deck(props: { deck: iCard[]; type: string }) {
  let cardFilter: iFilter = {
    rarity: [],
    set: [],
    series: [],
    subtypes: [],
    releaseDate: [],
    types: [],
  };


  const result = props.deck
    .filter(Boolean) //removes falsy items from list
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

      return <Card key={uuidv4()} type={props.type} data={card} />;
    });

  return (
    <>
      <div className="flex flex-col overflow-scroll h-[80vh] bg-slate-500 text-black">
        {props.deck.length ? (
          <>
            <Filter cardFilter={cardFilter} />
            <div>{result}</div>
          </>
        ) : (
          <div className="flex justify-center items-center m-2">no items</div>
        )}
      </div>
    </>
  );
}
