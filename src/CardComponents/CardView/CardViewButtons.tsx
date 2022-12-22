import { useState } from "react";
import { iCard } from "../../Interfaces";
import AddCardButton from "./AddCardButton";
import CardEditButton from "./CardEditButton";
import CloseCardView from "./CloseCardView";
import RemoveCardButton from "./RemoveCardButton";

export default function CardViewButtons(props: {
  card: iCard;
  setIsCardView: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditView: React.Dispatch<React.SetStateAction<boolean>>
  
}) {
  return (
    <>
      <div className=" flex flex-col">
        <CloseCardView {...{ setIsCardView: props.setIsCardView }} />
        <AddCardButton {...{ card: props.card }} />
        <RemoveCardButton {...{ card: props.card }} />
        <CardEditButton {...{ card: props.card,setIsCardView: props.setIsCardView, setIsEditView:props.setIsEditView }}/>
      </div>
    </>
  );
}
