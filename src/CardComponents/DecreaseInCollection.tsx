import {  IoMdRemoveCircle } from "react-icons/io";

export default function DecreaseInCollection(props: {
  updateQuantity: (
    type: "add" | "decrease" | "bulk",
    cardType: string,
    newQuantity?: number
  ) => Promise<void>;
  cardType: string;
}) {
  return (
    <button
      onClick={() => {
        props.updateQuantity("decrease", props.cardType);
      }}
    >
      <IoMdRemoveCircle />
      {/* [-] */}
    </button>
  );
}
