import { User } from "firebase/auth";

export interface iCollection {
  userDeck: iCard[];
  collectionValue: number;
  setUserDeckFromFirebase: (user: User) => void;
  addToUserDeck: (
    request: iCard | iCard[],
    userUid: string,
    newData: any
  ) => void;
  removeFromUserDeck: (request: iCard | iCard[], userUid: string) => void;
  findInCollection: (request: iCard) => boolean;
  increaseCardQuantity: (
    id: number,
    userUid: string,
    currentData: any,
    newData: any
  ) => Promise<boolean>;
  decreaseCardQuantity: (
    id: number,
    userUid: string,
    currentData: any,
    newData: any
  ) => Promise<boolean>;
  setBulkQuantity: (
    id: number,
    userUid: string,
    newQuantity: number,
    currentData: any,
    newData: any
  ) => void;
  calculateCollectionValue: () => void;
}

export interface iCard {
  name: string;
  id: number;
  cardmarket: {
    prices: {
      avg1: number;
    };
  };
  images: { small: string };
  set: { name:string, series: string; releaseDate:string };
  subtypes: string[]
  rarity: string;
  userDeckInfo: {
    quantity: number;
    dateAdded: Date;
  };
  quantity: number;
}

export interface iSearch {
  searchRequest: string;
  resultJSXArray: iCard[];
  isLoading: boolean;
  searchTrigger: boolean;

  setSearchRequest: (request: string) => void;
  setIsLoading: (value: boolean) => void;
  setResultJSXArray: (value: JSX.Element[]) => void;
}
