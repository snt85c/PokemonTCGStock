import { iCard } from "../Interfaces";

export default function returnPricesKeys(card: iCard) {
  let keys: string[] = [];
  Object.keys(card.tcgplayer.prices).map((cardType) => {
    if (!keys.includes(cardType)) keys.push(cardType);
  });
  return keys;
}
