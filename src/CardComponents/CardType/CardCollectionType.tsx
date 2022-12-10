import { useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import useCollectionStore from "../../CollectionComponent/useCollectionStore";
import { iCard, iCollectionStore } from "../../Interfaces";
import { useUserAuth } from "../../ProfileComponents/userAuth";
import useAlertStore, { iAlert } from "../../utils/useAlertStore";
import CardValue from "../CardValue";
import CardView from "../CardView";

export default function CardCollectionType(props: {
  data: iCard;
  card: iCard;
  subType?: boolean;
}) {
  const { user } = useUserAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardView, setIsCardView] = useState(false);

  const removeFromUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.removeFromUserDeck
  );
  const setAlert = useAlertStore((state: iAlert) => state.setAlert);

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
                setIsCardView(true);
              }}
              src={props.data.images && props.data.images.small}
              height={50}
              width={120}
            />

            <div className="flex flex-row justify-between w-full py-1">
              <div className={`flex flex-col justify-between`}>
                <div
                  className={`text-[1.3rem] font-extrabold flex flex-col items-start font-[PlayB] leading-none`}
                >
                  <span className="pr-2">{props.data.name}</span>
                  <span className="text-gray-400 text-[0.8rem]">
                    {props.data.id}
                  </span>
                </div>
                <div className="min-w-[1/2]">
                  <CardValue
                    value={props.card.userDeckInfo.value}
                    type="collection"
                  />
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
                <div className="text-sm font-bold flex gap-1">type:<span className="text-amber-500">{props.card.userDeckInfo.type}</span></div>
              </div>
            </div>
          </div>

          <button
            aria-label="remove-button"
            className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2"
            onClick={(e) => {
              removeFromCollection(e, props.data);
              setAlert(
                ` removed: ${props.card.name} type: ${
                  props.card.userDeckInfo.type.substring(0, 1).toUpperCase() +
                  props.card.userDeckInfo.type.substring(1)
                }`,
                "alert-warning"
              );
            }}
          >
            <IoMdRemoveCircle size={50} />
          </button>

          <span className="absolute bottom-0 text-[0.40rem] left-1/2 -translate-x-1/2">
            {props.card.userDeckInfo && props.card.userDeckInfo.id}
          </span>
        </div>
      }
      {isCardView && (
        <CardView card={props.data} setIsCardView={setIsCardView} />
      )}
    </>
  );
}
