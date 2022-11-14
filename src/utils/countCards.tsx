import { iCard } from "../Interfaces";

export default function countCards(card:iCard){
    let keys:string[] = []
    let value:number = 0
    Object.keys(card.tcgplayer.prices).map((cardType) => {
        if (!keys.includes(cardType)) keys.push(cardType);
      });
      keys.forEach((key)=>{
        value +=  card.userDeckInfo.quantity[key]
      })
    return value
  }