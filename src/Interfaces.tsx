export interface iCollection{
    userDeck:iCard[] | undefined
    collectionValue: number,
    addToUserDeck: (request: iCard | iCard[]) => void,
    setUserDeckFromFirebase:(request: iCard | iCard[]) => void,
    removeFromUserDeck:(request: iCard | iCard[], useruid:string) => void
    increaseCardQuantity:(id:number) => void
    decreaseCardQuantity:(id:number) => void
    calculateCollectionValue: ()=>void
  }
  export interface iCard {
    name: string;
    id: number;
    cardmarket:{
      prices:{
        avg1:number
      }
    }
    images: { small: string };
    set: { series: string };
    rarity: string;
    userDeckInfo:{
      quantity:number
      dateAdded:Date
    }
    quantity:number
  }
  
  export interface iSearch {
    searchRequest: string;
    resultJSXArray: JSX.Element[];
    isLoading: boolean;
    searchTrigger: boolean;
  
    setSearchRequest: (request: string) => void;
    setIsLoading: (value: boolean) => void;
    setResultJSXArray: (value:JSX.Element[]) =>void
  }