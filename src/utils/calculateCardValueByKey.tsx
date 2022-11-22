import { iCard } from "../Interfaces";
import returnPricesKeys from "./returnPricesKeys";

export default function calculateCardValueByKey(card: iCard, key: string) {

  return [card.tcgplayer.prices[key].market * card.userDeckInfo.quantity[key],key];
}
