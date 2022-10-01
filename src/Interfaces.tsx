import { User } from "firebase/auth";

export interface iCardStore {
  card: iCard;
  cardValue: number;
  setCardValue: (card: any) => void;
  increaseCardQuantity: (
    userUid: string,
    currentData: any,
    newData: any,
    cardType: string
  ) => Promise<boolean>;
  decreaseCardQuantity: (
    userUid: string,
    currentData: any,
    newData: any,
    cardType: string
  ) => Promise<boolean>;
  setBulkQuantity: (
    userUid: string,
    newQuantity: number,
    currentData: any,
    newData: any,
    cardType: string
  ) => Promise<boolean>;
}

export interface iCollectionStore {
  currentDeck: iCard[];
  decks: [];
  totalCollectionsValue:number,
  collectionValue: number;
  currentDeckInfo: {
    id: string;
    name: string;
    creationDate: Date;
    note: string;
  };
  userUID: string;

  setCurrentDeckInfo: (user: User, request: string, type: string) => void;
  createNewCollection: (user: User) => void;
  setUserDeckFromFirebase: (user: User, deck?: string) => void;
  addToUserDeck: (
    request: iCard | iCard[],
    userUid: string,
    deck?: string
  ) => void;
  updateCardOnUserDeck: (request: iCard) => void;
  removeFromUserDeck: (request: iCard | iCard[], userUid: string) => void;
  findInCollection: (request: iCard) => boolean;
  calculateCollectionValue: () => number;
  calculateUserDecksTotalValue: () => Promise<number>;
}

export interface iCard {
  name: string;
  id: number;
  cardmarket: {
    prices: {
      avg1: number;
    };
  };
  tcgplayer: {
    prices: any;
  };
  images: { small: string };
  set: {
    name: string;
    series: string;
    releaseDate: string;
    images: {
      logo: string;
      symbol: string;
    };
  };
  number: number;
  subtypes?: string[];
  rarity: string;
  userDeckInfo: {
    value: number;
    quantity: {
      [key: string]: number;
    };
    dateAdded: Date;
  };
  types?: string[];
}

export interface iFilter {
  rarity: string[];
  set: string[];
  series: string[];
  subtypes: string[];
  releaseDate: string[];
  types: string[];
}

export interface iSearchStore {
  searchRequest: string;
  resultJSXArray: iCard[];
  isLoading: boolean;
  searchTrigger: boolean;

  setSearchRequest: (request: string) => void;
  setIsLoading: (value: boolean) => void;
  setResultJSXArray: (value: JSX.Element[]) => void;
}
