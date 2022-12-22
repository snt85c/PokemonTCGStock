import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { iCard } from "../../Interfaces";
import AddCard from "../AddCard";

export default function AddCardButton(props:{card:iCard}) {
  const [isAddOnCollection, setisAddOnCollection] = useState(false);

  return (
    <>
      <div className="tooltip tooltip-left" data-tip={"add card"}>

      <button
        aria-label="card-add-button"
        className=" text-slate-500 hover:text-white duration-300
  "
        onClick={(e) => {
          e.preventDefault()
          setisAddOnCollection(true);
        }}
      >
        <IoMdAddCircle size={50} />
      </button>
      </div>
      {isAddOnCollection && (
        <AddCard {...{ card: props.card, setisAddOnCollection }} />
      )}
    </>
  );
}
