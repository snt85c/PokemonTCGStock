import { iCard } from "../Interfaces";

export default function returnPricesKeys(card: iCard) {
  let keys: string[] = [];
  if (card.tcgplayer) {//if there is data for the prices
    Object.keys(card.tcgplayer.prices).map((cardType) => {
      if (!keys.includes(cardType)) keys.push(cardType);
    });
  } else {//otherwise returns
    keys.push("NO DATA");
  }
  return keys;
}
