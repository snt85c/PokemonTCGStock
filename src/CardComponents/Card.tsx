import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { useUserAuth } from "../LoginComponents/userAuth";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollection } from "../Interfaces";
import DecreaseInCollection from "./DecreaseInCollection";
import IncreaseInCollection from "./IncreaseInCollection";
import { useState } from "react";
import ShowQuantity from "./ShowQuantity";

export default function Card(props: { data: iCard; type: string }) {
  const { user } = useUserAuth();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const addToUserDeck = useCollectionStore(
    (state: iCollection) => state.addToUserDeck
  );
  const removeFromUserDeck = useCollectionStore(
    (state: iCollection) => state.removeFromUserDeck
  );

  const findInCollection = useCollectionStore(
    (state: iCollection) => state.findInCollection
  );

  const [isInCollection, setIsInCollection] = useState<boolean>(
    findInCollection(props.data) 
  );

  const increaseQuantity = useCollectionStore(
    (state: iCollection) => state.increaseCardQuantity
  );

  const decreaseQuantity = useCollectionStore(
    (state: iCollection) => state.decreaseCardQuantity
  );

  const setBulkQuantity = useCollectionStore(
    (state: iCollection) => state.setBulkQuantity
  );

  const addOnCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newData = {
      ...props.data,
      userDeckInfo: { quantity: 1, dateAdded: new Date() },
    };
    if (user) {
      addToUserDeck(newData, user.uid, newData);
    }
  };

  const updateQuantity = async (
    type: "add" | "decrease" | "bulk",
    newQuantity?: number
  ) => {
    if (user && !isUpdating) {
      setIsUpdating(true);
      const currentData = { ...props.data };
      const newData = {
        ...props.data,
        userDeckInfo: {
          ...props.data.userDeckInfo,
          quantity:
            type === "add"
              ? props.data.userDeckInfo.quantity + 1
              : type === "decrease"
              ? props.data.userDeckInfo.quantity - 1
              : newQuantity,
        },
      };
      if (type === "add" && props.data.userDeckInfo.quantity >= 1) {
        await increaseQuantity(
          props.data.id,
          user.uid,
          currentData,
          newData
        ).then(() => {
          setIsUpdating(false);
        });
      }
      if (type === "decrease" && props.data.userDeckInfo.quantity > 1) {
        await decreaseQuantity(
          props.data.id,
          user.uid,
          currentData,
          newData
        ).then(() => {
          setIsUpdating(false);
        });
      }
      if (type === "bulk") {
        const quantity = newQuantity
          ? newQuantity
          : props.data.userDeckInfo.quantity;
        setBulkQuantity(
          props.data.id,
          user.uid,
          quantity,
          currentData,
          newData
        );
      }
      setIsUpdating(false);
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

  return (
    <>
      {
        <div
          className="m-2 p-2  flex flex-row justify-between text-white  rounded-xl gap-2 bg-gradient-to-l from-slate-900 to-slate-700"
          onClick={() => console.log(props.data)}
          style={{ display: isLoaded ? "flex" : "none" }}
        >
          <div className="flex w-full gap-2 ">
            <img
              onLoad={() => {
                setIsLoaded(true);
              }}
              src={props.data.images && props.data.images.small}
              height={100}
              width={60}
            />
            <div className="flex flex-col">
              <div className="flex  gap-2">
                <b>{props.data.name}</b>
                <div>
                  Value:
                  {props.data.cardmarket && props.data.cardmarket.prices.avg1}
                </div>
              </div>
              <div>series: {props.data.set && props.data.set.series}</div>
              <div>rarity: {props.data.rarity ? props.data.rarity : "n/a"}</div>
              {props.type === "collection" && (
                <div className="flex gap-2">
                  quantity:
                  <DecreaseInCollection updateQuantity={updateQuantity} />
                  <ShowQuantity
                    quantity={props.data.userDeckInfo.quantity}
                    updateQuantity={updateQuantity}
                  />
                  <IncreaseInCollection updateQuantity={updateQuantity} />
                </div>
              )}
            </div>
          </div>
          {props.type === "search" && (
            <button
              style={{
                display: isInCollection ? "none" : "flex",
              }}
              className="flex justify-center items-center"
              onClick={(e) => {
                addOnCollection(e);
                setIsInCollection(true);
              }}
            >
              <IoMdAddCircle size={40} color={"gray"} />
            </button>
          )}
          {props.type === "collection" && (
            <button
              className="flex justify-center items-center"
              onClick={(e) => removeFromCollection(e, props.data)}
            >
              <IoMdRemoveCircle size={40} color={"gray"} />
            </button>
          )}
        </div>
      }
    </>
  );
}
