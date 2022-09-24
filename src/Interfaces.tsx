import { User } from "firebase/auth";

export interface iCardStore{

  increaseCardQuantity: (
    userUid: string,
    currentData: any,
    newData: any
  ) => Promise<boolean>;
  decreaseCardQuantity: (
    userUid: string,
    currentData: any,
    newData: any
  ) => Promise<boolean>;
  setBulkQuantity: (
    userUid: string,
    newQuantity: number,
    currentData: any,
    newData: any
  ) => Promise<boolean>;

}

export interface iCollectionStore {
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
  subtypes?: string[]
  rarity: string;
  userDeckInfo: {
    quantity: number;
    dateAdded: Date;
  };
  types?:string[]
  quantity: number;
}

export interface iFilter {
  rarity: string[],
  set: string[],
  series: string[],
  subtypes: string[],
  releaseDate: string[],
  types:string[]
};

export interface iSearchStore {
  searchRequest: string;
  resultJSXArray: iCard[];
  isLoading: boolean;
  searchTrigger: boolean;

  setSearchRequest: (request: string) => void;
  setIsLoading: (value: boolean) => void;
  setResultJSXArray: (value: JSX.Element[]) => void;
}
