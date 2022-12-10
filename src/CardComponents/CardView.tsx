import { useState } from "react";
import { iCard, iCollectionStore } from "../Interfaces";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { AiFillCloseCircle } from "react-icons/ai";
import calculateCardValueAsNumber from "../utils/calculateCardValueAsNumber";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import returnPricesKeys from "../utils/returnPricesKeys";
import calculateCardValueByKey from "../utils/calculateCardValueByKey";
import { uuidv4 } from "@firebase/util";
import "../card.css";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { useUserAuth } from "../ProfileComponents/userAuth";
import AddCard from "./AddCard";
import { IoMdAddCircle } from "react-icons/io";

export default function CardView(props: {
  card: iCard;
  setIsCardView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useUserAuth();
  const currentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref } = HandleClickOutsideComponent(props.setIsCardView);
  const sym = useProfileStore((state: iState) => state.conversionSym);
  const [isAddOnCollection, setisAddOnCollection] = useState(false);

  const addToUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.addToUserDeck
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
        value: props.card.tcgplayer.prices[type].market,
      },
    };
    if (user) {
      console.log("add to collection");
      addToUserDeck(newData, user.uid, currentDeckInfo.id);
    }
  };

  const values = returnPricesKeys(props.card)
    .map((key) => {
      return calculateCardValueByKey(props.card, key);
    })
    .map((item) => {
      return (
        <div key={uuidv4()} className="flex justify-between">
          <div>{item[1]}</div>
          <div>
            {item[0]} {sym.toUpperCase()}
          </div>
        </div>
      );
    });

  return (
    <>
      <AiFillCloseCircle
        className="absolute right-2 top-2 z-50 text-gray-500  w-10 h-10 bg-white rounded-full hover:scale-[1.1] hover:text-black duration-300"
        onClick={() => {
          props.setIsCardView(false);
        }}
      />
      <div
        ref={ref}
        className="flex flex-col  items-center absolute top-0 left-0 min-h-full z-40 bg-white dark:bg-slate-900  min-w-[70%] text-black dark:text-white p-3 pb-[10rem]"
        style={{ display: isLoaded ? "flex" : "none" }}
      >
        <img
          className={`w-1/2 h-1/2 mt-2 border-4 border-r-gray-400 duration-300 rounded-xl `}
          onLoad={() => {
            setIsLoaded(true);
          }}
          onClick={() => console.log(props.card)}
          src={props.card.images && props.card.images.large}
        />
        <div className="flex flex-col justify-start w-full m-3">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">{props.card.name}</h1>
            <div>
              value:
              {
                <span className="font-bold">
                  {calculateCardValueAsNumber(props.card).toFixed(2)}
                  {sym.toUpperCase()}
                </span>
              }
            </div>
          </div>
          <h3 className="text-sm leading-none">{props.card.supertype}</h3>
          <h3 className="text-sm leading-none">{props.card.set.name}</h3>
          <h3 className="text-sm leading-none">
            {" "}
            {props.card.rarity}
            {"  "}
            {props.card.number}/{props.card.nationalPokedexNumbers[0]}
          </h3>
          <div className="my-2">{values}</div>
          <div className="min-h-[10rem] m-5 mx-7 bg-gray-200 dark:bg-gray-700 p-1 px-3 rounded-xl">
            <button
              aria-label="card-add-button"
              className=" text-slate-500 hover:text-white duration-300 absolute right-1 top-20 -translate-y-1/2
        "
              onClick={(e) => {
                setisAddOnCollection(true);
              }}
            >
              {props.card.tcgplayer && props.card.tcgplayer.prices && (
                <IoMdAddCircle size={50} />
              )}
            </button>
            {isAddOnCollection && (
              <AddCard
                {...{ card: props.card, setisAddOnCollection, addOnCollection }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
