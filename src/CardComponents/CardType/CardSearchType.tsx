import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { iCard } from "../../Interfaces";
import AddCard from "../AddCard";
import CardShowSearchValue from "../CardModifyAmount/CardShowSearchValue";
import CardView from "../CardView/CardView";
export default function CardSearchType(props: { card: iCard }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardView, setIsCardView] = useState(false);
  const [isAddOnCollection, setisAddOnCollection] = useState(false);

  return (
    <>
      {
        <div
          className="m-2  p-2 relative flex flex-row justify-between text-white  rounded-xl gap-2 bg-gradient-to-l from-slate-900 to-slate-700"
          onClick={() => {
            console.log(props.card);
          }}
          style={{ display: isLoaded ? "flex" : "none" }}
        >
          <img
            className="absolute h-8 bottom-2 left-2 z-30"
            src={props.card.set.images.symbol}
          />
          <img
            className="absolute  max-w-[4rem] max-h-[3rem] bottom-2 right-2 z-30"
            src={props.card.set.images.logo}
          />

          <div className="flex gap-2 relative w-full">
            <img
              onLoad={() => {
                setIsLoaded(true);
              }}
              src={props.card.images && props.card.images.small}
              height={50}
              width={120}
            />

            <div className="flex flex-row justify-between w-full">
              <div className={`flex flex-col justify-evenly`}>
                <div
                  className={`text-[1.3rem] font-extrabold flex flex-col items-start font-[PlayB] leading-none`}
                >
                  <span className="pr-2">{props.card.name}</span>
                  <span className="text-gray-400 text-[0.8rem]">{props.card.id}</span>
                </div>
                <div className="min-w-[1/2]"></div>
                <div className="text-[0.7rem] leading-none">
                  <div className="flex gap-2">
                    series:{" "}
                    <span className="font-bold">
                      {props.card.set && props.card.set.series}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    rarity:{" "}
                    <span className="font-bold">
                      {props.card.rarity ? props.card.rarity : "n/a"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    set:{" "}
                    <span className="font-bold">
                      {props.card.set && props.card.set.name}
                    </span>
                  </div>
                </div>

                <CardShowSearchValue
                  quantity={props.card.tcgplayer && props.card.tcgplayer.prices}
                />
              </div>
            </div>
          </div>

          <button
            aria-label="card-add-button"
            className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2
        "
            onClick={(e) => {
              setisAddOnCollection(true);
            }}
          >
            {props.card.tcgplayer && props.card.tcgplayer.prices && (
              <IoMdAddCircle size={50} />
            )}
          </button>

          <span className="absolute bottom-0 text-[0.40rem] left-1/2 -translate-x-1/2">
            {props.card.userDeckInfo && props.card.userDeckInfo.id}
          </span>
        </div>
      }
      {isCardView && (
        <CardView card={props.card} setIsCardView={setIsCardView} />
      )}
      {isAddOnCollection && (
        <AddCard
          {...{ card: props.card, setisAddOnCollection}}
        />
      )}
    </>
  );
}
