import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { useUserAuth } from "../LoginComponents/userAuth";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollectionStore } from "../Interfaces";
import { useState } from "react";
import CardModifyAmount from "./CardModifyAmount";
import { useEffect } from "react";
import { updateDoc, doc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../LoginComponents/Firebase";

export default function Card(props: { data: iCard; type: string }) {
  const { user } = useUserAuth();

  const [card, setCard] = useState<iCard>(props.data);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const deck = useCollectionStore((state: iCollectionStore) => state.userDeck);
  const cardValue = () => {
    if (props.type === "collection") {
      let result = Object.keys(card.userDeckInfo.quantity).reduce(
        (prev, current) =>
          prev +
          card.userDeckInfo.quantity[current] *
            card.tcgplayer.prices[current].market,
        0
      );

      let temp = (card.userDeckInfo.value = result);
      let temp2 = { ...card, temp };
      setCard(temp2);
      return result;
    }
    return -1;
  };


  const addToUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.addToUserDeck
  );
  const removeFromUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.removeFromUserDeck
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
      ...props.data,
      userDeckInfo: { quantity: newObject, dateAdded: new Date(), value: 0 },
    };
    if (user) {
      console.log("add to collection");
      addToUserDeck(newData, user.uid, newData);
    }
  };

  async function updateFirestore(currentData: any, newData: any) {
    await updateDoc(doc(db, "users", user.uid), {
      userDeck: arrayRemove(currentData),
    }).then(async () => {
      await updateDoc(doc(db, "users", user.uid), {
        userDeck: arrayUnion(newData),
      });
    });
  }

  const updateQuantity = async (
    type: "add" | "decrease" | "bulk",
    cardType: string,
    newQuantity: any
  ) => {
    console.log(newQuantity);

    try {
      if (user && !isUpdating) {
        setIsUpdating(true);
        const currentData = { ...card };
        const newData = {
          ...card,
          userDeckInfo: {
            ...card.userDeckInfo,
            value: cardValue(),
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
        if (type === "add" && card.userDeckInfo.quantity[cardType] > -1) {
          updateFirestore(currentData, newData)
            .then(() => {
              setCard(newData);
            })
            .then(() => {});
          setIsUpdating(false);
        }
        if (type === "decrease" && card.userDeckInfo.quantity[cardType] > 0) {
          updateFirestore(currentData, newData).then(() => {
            setCard(newData);
          });
          setIsUpdating(false);
        }
        if (type === "bulk") {
          updateFirestore(currentData, newData).then(() => {
            setCard(newData);
          });
          setIsUpdating(false);
        }
      }
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
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
              width={100}
            />
            <div className="flex flex-col w-full">
              <b className="text-2xl flex justify-between">
                <span>{props.data.name}</span>
                <span>
                  {props.type === "collection" &&
                    card.userDeckInfo.value.toFixed(2)}
                </span>
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
