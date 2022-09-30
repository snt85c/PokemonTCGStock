import create from "zustand";
import { devtools } from "zustand/middleware";

const useCardStore = create(
  devtools((set) => ({
    card: {},
    cardValue: 0,

    setCard: (request) => {
      //on render, set an object with all the data to be a Card
      set(() => ({ card: request }));
    },

    setCardValue: (card) => {
      //get all the quantity keys for the card (normal, holo and such, then sum looking for the price of that card multiplied by his quantity)
      let value = Object.keys(card.userDeckInfo.quantity)
        .reduce(
          (prev, current) =>
            prev +
            card.tcgplayer.prices[current].market *
              card.userDeckInfo.quantity[current],
          0
        )
        .toFixed(2);
      set(() => ({ cardValue: value }));
    },
  }))
);

export default useCardStore;
