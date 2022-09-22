import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { db } from "../LoginComponents/Firebase";
import { useUserAuth } from "../LoginComponents/userAuth";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollection } from "../Interfaces";
import DecreaseInCollection from "./DecreaseInCollection";
import IncreaseInCollection from "./IncreaseInCollection";
import { useState } from "react";

export default function Card(props: { data: iCard; type: string }) {
  const { user } = useUserAuth();

  const [isUpdating, setIsUpdating] = useState(false);

  const addToUserDeck = useCollectionStore(
    (state: iCollection) => state.addToUserDeck
  );
  const removeFromUserDeck = useCollectionStore(
    (state: iCollection) => state.removeFromUserDeck
  );
  const increaseQuantity = useCollectionStore(
    (state: iCollection) => state.increaseCardQuantity
  );

  const decreaseQuantity = useCollectionStore(
    (state: iCollection) => state.decreaseCardQuantity
  );

  const addOnCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: iCard
  ) => {
    e.preventDefault();
    const newData = {
      ...props.data,
      userDeckInfo: { quantity: 1, dateAdded: new Date() },
    };
    addToUserDeck(newData);
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          userDeck: arrayUnion(newData),
        });
        console.log("Document written with ID: ", data.id.toString());
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const updateQuantity = async (type: string) => {
    //cant believe that firebase doesn't have a method to update nested array directly. instead, i have to remove, then add, then update my  store value at the end otherwise it will skip arrayRemove and go for arrayUnion (as firebase doesnt contain yet the object with that quantity)
    const currentData = { ...props.data };
    const newData = {
      ...props.data,
      userDeckInfo: {
        ...props.data.userDeckInfo,
        quantity:
          type === "add" ? props.data.userDeckInfo.quantity + 1 : props.data.userDeckInfo.quantity - 1,
      },
    };
    if (user && props.data.userDeckInfo.quantity >= 1 && !isUpdating) {
      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "users", user.uid), {
          userDeck: arrayRemove(currentData),
        })
          .then(async () => {
            await updateDoc(doc(db, "users", user.uid), {
              userDeck: arrayUnion(newData),
            });
          })
          .then(() => {
            if (type === "add") {
              increaseQuantity(props.data.id);
            } else {
              decreaseQuantity(props.data.id);
            }
          })
          .then(() => {
            setIsUpdating(false);
          });

        console.log("Document written with ID: ", props.data.id.toString());
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const removeFromCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: iCard
  ) => {
    e.preventDefault();
    removeFromUserDeck(data, user.uid);
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          userDeck: arrayRemove(data),
        });
        console.log("Document removed with ID: ", data.id.toString());
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    }
  };

  return (
    <>
      <div
        className="m-2 p-2  flex flex-row justify-between text-white  rounded-xl gap-2 bg-gradient-to-l from-slate-300 to-slate-700"
        onClick={() => console.log(props.data)}
      >
        <div className="flex gap-2">
          <img
            src={props.data.images && props.data.images.small}
            height={100}
            width={60}
          />
          <div>
            <div className="flex justify-between gap-2">
              <b>{props.data.name}</b>
              <div>
                Value:
                {props.data.cardmarket && props.data.cardmarket.prices.avg1}
              </div>
            </div>
            <p>series: {props.data.set && props.data.set.series}</p>
            <p>rarity: {props.data.rarity ? props.data.rarity : "n/a"}</p>
            {props.type === "collection" && (
              <p className="flex gap-2">
                quantity:
                <IncreaseInCollection
                  id={props.data.id}
                  updateQuantity={updateQuantity}
                />
                {props.data.userDeckInfo ? props.data.userDeckInfo.quantity : 0}
                <DecreaseInCollection
                  id={props.data.id}
                  updateQuantity={updateQuantity}
                />
              </p>
            )}
          </div>
        </div>
        {props.type === "search" && (
          <button
            className="flex justify-center items-center"
            onClick={(e) => addOnCollection(e, props.data)}
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
    </>
  );
}
