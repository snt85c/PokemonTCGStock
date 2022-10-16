import DecreaseInCollection from "./DecreaseInCollection";
import IncreaseInCollection from "./IncreaseInCollection";
import ShowQuantity from "../ShowQuantity";
import { v4 as uuidv4 } from "uuid";

export default function CardModifyAmount(props: {
  updateQuantity: (
    type: "add" | "decrease" | "bulk",
    cardType: string,
    newQuantity?: number
  ) => Promise<void>;
  quantity: any;
}) {
  let keys = Object.keys(props.quantity).map((cardType) => (
    <div key={uuidv4()} className="flex flex-col leading-none mt-1 text-xs">
      <div>{cardType}:</div>
      <div className="flex gap-2">
        <DecreaseInCollection
          updateQuantity={props.updateQuantity}
          cardType={cardType}
        />
        <ShowQuantity
          quantity={props.quantity[cardType]}
          updateQuantity={props.updateQuantity}
          cardType={cardType}
        />
        <IncreaseInCollection
          updateQuantity={props.updateQuantity}
          cardType={cardType}
        />
      </div>
    </div>
  ));

  return <div className="flex flex-col">{keys}</div>;
}
