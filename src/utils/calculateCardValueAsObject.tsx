import { iCard } from "../Interfaces";

export default function calculateCardValue(card:iCard){
    let keys:string[] = []
    let value:number = 0
  
        value += card.tcgplayer.prices[card.userDeckInfo.type].market * card.userDeckInfo.quantity
    let temp = card.userDeckInfo.value = value
    let adjustedCard= {...card, adjustedValue:value, temp}
    return adjustedCard
  }