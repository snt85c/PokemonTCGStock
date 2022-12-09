import { useState } from "react";
import { CgStack } from "react-icons/cg";
import GroupView from "../GroupView";
import { iCard } from "../../Interfaces";
import CardValue from "../CardValue";
import CardView from "../CardView";
export default function CardGroupType(props: { data: iCard; card: iCard }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGroupView, setIsGroupView] = useState(false);
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
                setIsGroupView(true);
              }}
              src={props.data.images && props.data.images.small}
              height={50}
              width={120}
            />

            <div className="flex flex-row justify-between w-full py-1">
              <div className={`flex flex-col justify-evenly`}>
                <div
                  className={`text-[1.3rem] font-extrabold flex flex-col items-start font-[PlayB] leading-none`}
                >
                  <span className="pr-2">{props.data.name}</span>
                  <span className="text-gray-400 text-[0.8rem]">
                    {props.data.id}
                  </span>
                  <span className="text-gray-400 text-[0.8rem]">group</span>
                </div>
                <div className="min-w-[1/2]">
                  <CardValue
                    value={props.card.userDeckInfo.value}
                    type="group"
                    id={props.card.id}
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
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsGroupView(true);
            }}
            aria-label="remove-button"
            className=" text-slate-500 hover:text-white duration-300 absolute right-2 top-1/2 -translate-y-1/2"
          >
            <CgStack size={35} />
          </button>

          <span className="absolute bottom-0 text-[0.40rem] left-1/2 -translate-x-1/2">
            {props.card.userDeckInfo && props.card.userDeckInfo.id}
          </span>
        </div>
      }
      {isGroupView && (
        <GroupView {...{setIsGroupView, cardID:props.card.id}}/>
      )}
    </>
  );
}
