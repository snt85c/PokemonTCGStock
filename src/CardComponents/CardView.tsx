import { useState } from "react";
import { iCard } from "../Interfaces";
import "../card.css";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { AiFillCloseCircle } from "react-icons/ai";
import back from "../back.png";
import CardChart from "./CardChart";
import calculateCardValueAsNumber from "../utils/calculateCardValueAsNumber";
export default function CardView(props: {
  card: iCard;
  setIsCardView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref } = HandleClickOutsideComponent(props.setIsCardView);

 
  return (
    <>
      <AiFillCloseCircle
        className="absolute right-1 top-1 z-50 text-gray-500  w-10 h-10 bg-white rounded-full hover:scale-[1.1] hover:text-black duration-300"
        onClick={() => {
          props.setIsCardView(false);
        }}
      />
      <div
        className="absolute 
        top-0 left-0
         z-40 border-white bg-white  rounded-2xl border-8  animate-pulse  min-w-[70%] "
        style={{ display: isLoaded ? "none" : "flex" }}
      >
        <img src={back} />
      </div>
      <div
        ref={ref}
        className="flex flex-col  items-center absolute top-0 left-0 min-h-full z-40 border-white bg-white rounded-2xl border-8 min-w-[70%]"
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
          <h1 className="text-lg font-bold">{props.card.name}</h1>
          <h3 className="text-sm leading-none">{props.card.supertype}</h3>
          <h3 className="text-sm leading-none">{props.card.set.name}</h3>
          <h3 className="text-sm leading-none">
            {" "}
            {props.card.rarity}
            {"  "}
            {props.card.number}/{props.card.nationalPokedexNumbers[0]}
          </h3>
          <div className="min-h-[7rem] m-5">
            <CardChart {...{ card: props.card }} />
          </div>
          <div>{calculateCardValueAsNumber(props.card)}</div>
        </div>
      </div>
    </>
  );
}
