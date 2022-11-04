import { useState } from "react";
import { iCard } from "../Interfaces";
import "../card.css";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import back from "../back.png";

export default function CardView(props: {
  card: iCard;
  setIsCardView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref } = HandleClickOutsideComponent(props.setIsCardView);

  return (
    <>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border-white bg-white  rounded-2xl border-8  animate-pulse  min-w-[70%] "
        style={{ display: isLoaded ? "none" : "flex" }}
      >
        <img src={back} />
      </div>
      <div
        ref={ref}
        className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border-white bg-white rounded-2xl border-8 min-w-[70%]"
        style={{ display: isLoaded ? "flex" : "none" }}
        
      >
        <img
          onLoad={() => {
            setIsLoaded(true);
          }}
          src={props.card.images && props.card.images.large}
        />
      </div>
    </>
  );
}
