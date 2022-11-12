import { iCard } from "../Interfaces";

export default function calculateCardValue(card:iCard){
    let keys:string[] = []
    let value:number = 0
    Object.keys(card.tcgplayer.prices).map((cardType) => {
        if (!keys.includes(cardType)) keys.push(cardType);
      });
      keys.forEach((key)=>{
        value += card.tcgplayer.prices[key].market * card.userDeckInfo.quantity[key]
      })
    let temp = card.userDeckInfo.value = value
    let adjustedCard= {...card, adjustedValue:value, temp}
    return adjustedCard
  }