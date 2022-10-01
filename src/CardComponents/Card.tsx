import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { useUserAuth } from "../ProfileComponents/userAuth";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollectionStore } from "../Interfaces";
import { useState } from "react";
import CardModifyAmount from "./CardModifyAmount";
import {
  updateDoc,
  setDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";

export default function Card(props: { data: iCard; type: string }) {
  const { user } = useUserAuth();

  const [card, setCard] = useState<iCard>(props.data);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentDeckInfo = useCollectionStore((state:iCollectionStore) => state.currentDeckInfo)

  const cardValue = (card: iCard) => {
    if (props.type === "collection") {
      let result = Object.keys(card.userDeckInfo.quantity).reduce(
        (prev, current) =>
          prev +
          card.userDeckInfo.quantity[current] *
            card.tcgplayer.prices[current].market,
        0
      );
      return result;
    }
    throw new Error("cardvalue function didn't return a right value");
  };

  const addToUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.addToUserDeck
  );
  const removeFromUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.removeFromUserDeck
  );

  const updateCardOnUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.updateCardOnUserDeck
  );

  const findInCollection = useCollectionStore(
    (state: iCollectionStore) => state.findInCollection
  );

  const [isInCollection, setIsInCollection] = useState<boolean>(
    findInCollection(props.data)
  );

  const addOnCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let newObject: any = {};
    for (let type in props.data.tcgplayer.prices) {
      newObject[type] = 0;
    }
    const newData = {
      ...card,
      userDeckInfo: { quantity: newObject, dateAdded: new Date(), value: 0 },
    };
    if (user) {
      console.log("add to collection");
      addToUserDeck(newData, user.uid,currentDeckInfo.id);
    }
  };

  async function updateCardQuantity( newData: any) {
    setDoc(
      doc(db, "users", user.uid,"decks", currentDeckInfo.id,"cards", newData.id),
      newData
    );
    updateCardOnUserDeck(newData);
    setCard(newData);
  }

  const updateQuantity = async (
    type: "add" | "decrease" | "bulk",
    cardType: string,
    newQuantity: any
  ) => {
    try {
      if (user) {
        const newData = {
          ...card,
          userDeckInfo: {
            ...card.userDeckInfo,
            quantity:
              type === "add"
                ? {
                    ...card.userDeckInfo.quantity,
                    [cardType]: card.userDeckInfo.quantity[cardType] + 1,
                  }
                : type === "decrease"
                ? {
                    ...card.userDeckInfo.quantity,
                    [cardType]: card.userDeckInfo.quantity[cardType] - 1,
                  }
                : {
                    ...card.userDeckInfo.quantity,
                    [cardType]: newQuantity,
                  },
          },
        };
        let adjustedValue = (newData.userDeckInfo.value = cardValue(newData));
        let newDataWithAdjustedValue = { ...newData, adjustedValue };
        if (type === "add" && card.userDeckInfo.quantity[cardType] > -1) {
          updateCardQuantity(newDataWithAdjustedValue).then(() => {
          });
        }
        if (type === "decrease" && card.userDeckInfo.quantity[cardType] > 0) {
          updateCardQuantity(newDataWithAdjustedValue).then(() => {
          });
        }
        if (type === "bulk") {
          updateCardQuantity( newDataWithAdjustedValue).then(() => {
          });
        }
      }
    } catch (e) {
      throw new Error("in updateQuantity function");
    }
  };

  const removeFromCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: iCard
  ) => {
    e.preventDefault();
    if (user) {
      removeFromUserDeck(data, user.uid);
    }
  };

  const rate = useProfileStore((state: iState) => state.conversionRate);
  const sym = useProfileStore((state: iState) => state.conversionSym);

  return (
    <>
      {
        <div
          className="m-2 p-2 relative flex flex-row justify-between text-white  rounded-xl gap-2 bg-gradient-to-l from-slate-900 to-slate-700"
          onClick={() => console.log(props.data)}
          style={{ display: isLoaded ? "flex" : "none" }}
        >
          <img
            className="absolute h-8 bottom-2 left-2 z-30"
            src={props.data.set.images.symbol}
          />
          <img
            className="absolute  max-w-[5rem] max-h-[3rem] bottom-2 right-2 z-30"
            src={props.data.set.images.logo}
          />

          <div className="flex gap-2 relative w-full">
            <img
              onLoad={() => {
                setIsLoaded(true);
              }}
              src={props.data.images && props.data.images.small}
              height={50}
              width={120}
            />

            <div className="flex flex-col w-full">
              <b className="text-2xl flex items-center justify-between">
                <span>{props.data.name}</span>{" "}
                {props.type === "collection" && (
                  <>
                    <span>
                      {(card.userDeckInfo.value * rate).toFixed(2) +
                        " " +
                        sym.toLocaleUpperCase()}
                    </span>
                  </>
                )}
              </b>
              <div>series: {props.data.set && props.data.set.series}</div>
              <div>rarity: {props.data.rarity ? props.data.rarity : "n/a"}</div>
              <div>set:{props.data.set && props.data.set.name}</div>

              {props.type === "collection" && (
                <CardModifyAmount
                  quantity={card.userDeckInfo.quantity}
                  updateQuantity={updateQuantity}
                />
              )}
            </div>
          </div>
          {props.type === "search" ? (
            <button
              aria-label="card-add-button"
              style={{
                display: isInCollection ? "none" : "flex",
              }}
              className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2
              "
              onClick={(e) => {
                addOnCollection(e);
                setIsInCollection(true);
              }}
            >
              <IoMdAddCircle size={50} />
            </button>
          ) : (
            <button
              aria-label="remove-button"
              className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2"
              onClick={(e) => removeFromCollection(e, props.data)}
            >
              <IoMdRemoveCircle size={50} />
            </button>
          )}
        </div>
      }
    </>
  );
}
