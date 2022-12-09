import { iCard } from "../Interfaces";

export default function calculateCardValueByKey(card: iCard, key: string) {

  return [card.tcgplayer.prices[key].market * card.userDeckInfo.quantity,key];
}
