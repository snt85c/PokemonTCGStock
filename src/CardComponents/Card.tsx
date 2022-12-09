import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { useUserAuth } from "../ProfileComponents/userAuth";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollectionStore } from "../Interfaces";
import { useEffect, useState } from "react";
import CardModifyAmount from "./CardModifyAmount/CardModifyAmount";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";
import CardValue from "./CardValue";
import CardShowSearchValue from "./CardModifyAmount/CardShowSearchValue";
import CardView from "./CardView";
import AddCard from "./AddCard";
import { uuidv4 } from "@firebase/util";
import CardCollectionType from "./CardType/CardCollectionType";
import CardSearchType from "./CardType/CardSearchType";
import CardGroupType from "./CardType/CardGroupType";

export default function Card(props: { data: iCard; type: string, subType?:boolean }) {
  const { user } = useUserAuth();

  const [card, setCard] = useState<iCard>(props.data);

  const currentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
  );
  const cardValue = (card: iCard) => {
    if (props.type === "collection") {
      let result = Object.keys(card.userDeckInfo.quantity).reduce(
        (prev, current) =>
          prev +
          card.userDeckInfo.quantity * card.tcgplayer.prices[current].market,
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

  const addOnCollection = async (card: iCard, type: string) => {
    const id = uuidv4();
    const newData = {
      ...card,
      userDeckInfo: {
        id,
        quantity: 1,
        type,
        dateAdded: new Date(),
        value: props.data.tcgplayer.prices[type].market,
      },
    };
    if (user) {
      console.log("add to collection");
      addToUserDeck(newData, user.uid, currentDeckInfo.id);
    }
  };

  async function updateCardQuantity(newData: any) {
    setDoc(
      doc(
        db,
        "users",
        user.uid,
        "decks",
        currentDeckInfo.id,
        "cards",
        newData.id
      ),
      newData
    );
    updateCardOnUserDeck(newData);
    setCard(newData);
  }
  /*
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
                    card.userDeckInfo.quantity + 1,
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
          updateCardQuantity(newDataWithAdjustedValue).then(() => {});
        }
        if (type === "decrease" && card.userDeckInfo.quantity[cardType] > 0) {
          updateCardQuantity(newDataWithAdjustedValue).then(() => {});
        }
        if (type === "bulk") {
          updateCardQuantity(newDataWithAdjustedValue).then(() => {});
        }
      }
    } catch (e) {
      throw new Error("in updateQuantity function");
    }
  };
*/
  const removeFromCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: iCard
  ) => {
    e.preventDefault();
    if (user) {
      removeFromUserDeck(data, user.uid);
    }
  };

  switch (props.type) {
    case "search":
      return (
        <>
          <CardSearchType {...{ data: props.data, card }} />
        </>
      );
    case "collection":
      return (
        <>
          <CardCollectionType {...{ data: props.data, card }} />
        </>
      );
    case "group":
      return (
        <>
          <CardGroupType {...{ data: props.data, card }} />
        </>
      );
  }
  return <></>;
}

{
  /* {
  <div
    className="m-2  p-2 relative flex flex-row justify-between text-white  rounded-xl gap-2 bg-gradient-to-l from-slate-900 to-slate-700"
    onClick={() => {
      console.log(props.data);
    }}
    style={{ display: isLoaded ? "flex" : "none" }}
  >
    <img
      className="absolute h-8 bottom-2 left-2 z-30"
      src={props.data.set.images.symbol}
    />
    <img
      className="absolute  max-w-[4rem] max-h-[3rem] bottom-2 right-2 z-30"
      src={props.data.set.images.logo}
    />

    <div className="flex gap-2 relative w-full">
      <img
        onLoad={() => {
          setIsLoaded(true);
        }}
        onClick={() => {
          if (props.type === "collection") {
            setIsCardView(true);
          }
        }}
        src={props.data.images && props.data.images.small}
        height={50}
        width={120}
      />

      <div className="flex flex-row justify-between w-full">
        <div
          className={`flex flex-col ${
            props.type === "search" ? "justify-evenly" : "justify-between"
          }`}
        >
          <span
            className={`text-[1.3rem] font-extrabold flex justify-between items-center font-[PlayB] leading-none`}
          >
            <span className="pr-2">{props.data.name}</span>
            <span>{" | "}</span>
            <span className="text-gray-400 text-sm pl-2">
              {props.data.id}
            </span>
          </span>
          <div className="min-w-[1/2]">
            {props.type === "group" && <span>group</span>}
            {props.type !== "search" && (
              <CardValue value={card.userDeckInfo.value} />
            )}
          </div>
          <div className="text-[0.7rem] leading-none">
            <div className="flex gap-2">
              series:{" "}
              <span className="font-bold">
                {props.data.set && props.data.set.series}
              </span>
            </div>
            <div className="flex gap-2">
              rarity:{" "}
              <span className="font-bold">
                {props.data.rarity ? props.data.rarity : "n/a"}
              </span>
            </div>
            <div className="flex gap-2">
              set:{" "}
              <span className="font-bold">
                {props.data.set && props.data.set.name}
              </span>
            </div>
          </div>
          {props.type === "collection" && (
            <div className="flex gap-2">
              type:{" "}
              <span className="font-bold text-amber-500">
                {props.data.userDeckInfo && props.data.userDeckInfo.type}
              </span>
            </div>
          )}
          {props.type === "collection" || props.type !== "search" ? (
            <></>
          ) : (
            <CardShowSearchValue
              quantity={
                props.data.tcgplayer && props.data.tcgplayer.prices
              }
            />
          )}
        </div>
      </div>
    </div>
    {props.type === "search" ? (
      <button
        aria-label="card-add-button"
        className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2
        "
        onClick={(e) => {
          setisAddOnCollection(true);
        }}
      >
        {props.data.tcgplayer && props.data.tcgplayer.prices && (
          <IoMdAddCircle size={50} />
        )}
      </button>
    ) : (
      <button
        aria-label="remove-button"
        className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2"
        onClick={(e) => {
          removeFromCollection(e, props.data);
          setAlert(
            ` removed: ${card.name} type: ${
              card.userDeckInfo.type.substring(0, 1).toUpperCase() +
              card.userDeckInfo.type.substring(1)
            }`,
            "alert-warning"
          );
        }}
      >
        <IoMdRemoveCircle size={50} />
      </button>
    )}
    <span className="absolute bottom-0 text-[0.40rem] left-1/2 -translate-x-1/2">
      {card.userDeckInfo && card.userDeckInfo.id}
    </span>
  </div>
}
{isCardView && (
  <CardView card={props.data} setIsCardView={setIsCardView} />
)}
{isAddOnCollection && (
  <AddCard
    {...{ card: props.data, setisAddOnCollection, addOnCollection }}
  />
)} */
}
