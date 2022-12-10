import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { AiFillCloseCircle } from "react-icons/ai";
import returnPricesKeys from "../utils/returnPricesKeys";
import { iCard, iCollectionStore } from "../Interfaces";
import { uuidv4 } from "@firebase/util";
import useAlertStore, { iAlert } from "../utils/useAlertStore";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { useUserAuth } from "../ProfileComponents/userAuth";

export default function AddCard(props: {
  card: iCard;
  setisAddOnCollection: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { ref } = HandleClickOutsideComponent(props.setisAddOnCollection);
  const setAlert = useAlertStore((store: iAlert) => store.setAlert);
  const addToUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.addToUserDeck
  );
  const { user } = useUserAuth();
  const currentDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
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
  const keys = returnPricesKeys(props.card).map((type) => {
    return (
      <div
        className="cursor-pointer"
        key={uuidv4()}
        onClick={() => {
          addOnCollection(props.card, type);
          setAlert(
            ` adds: ${props.card.name} type: ${
              type.substring(0, 1).toUpperCase() + type.substring(1)
            }`, "alert-success"
          );
        }}
      >
        add {type.substring(0, 1).toUpperCase() + type.substring(1)}
      </div>
    );
  });
  return (
    <>
      <div
        ref={ref}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded w-[70%] min-h-[200px] shadow-black shadow-2xl z-40 p-5 pt-7 flex flex-col justify-between text-black dark:bg-gray-700 dark:text-white"
      >
        <span className="absolute top-0 left-1 text-[0.8rem] text-gray-500 dark:text-gray-400 font-bold">
          {props.card.name}{" "}
          {props.card.id}
        </span>
        <AiFillCloseCircle
          className="absolute right-2 top-2 text-gray-500 w-8 h-8 rounded-full hover:scale-[1.1] hover:text-black dark:hover:text-white duration-300 z-50"
          onClick={() => {
            props.setisAddOnCollection(false);
          }}
        />
        <div>{keys}</div>
        <span
          className="cursor-pointer"
          onClick={() => setAlert("not yet implemented", "alert-error")}
        >
          Add with more options
        </span>
        <span
          className="cursor-pointer"
          onClick={() => setAlert("not yet implemented", "alert-error")}
        >
          Add graded card
        </span>
      </div>
    </>
  );
}
