import { prependListener } from "process";
import { useState } from "react";

export default function ShowQuantity(props: {
  quantity: number;
  updateQuantity: (
    type: "add" | "decrease" | "bulk",
    newQuantity: number
  ) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newQuantity, setNewQuantity] = useState<string>(
    props.quantity.toString()
  );
  return (
    <>
      {!isEditing ? (
        <div
          onClick={() => {
            setIsEditing((prev) => !prev);
          }}
        >
          {props.quantity ? props.quantity : 0}
        </div>
      ) : (
        <div>
          <input
            className="text-black"
            size={1}
            type="text"
            pattern="[0-9]*"
            value={newQuantity}
            onChange={(e) =>
              setNewQuantity((v) =>
                e.target.validity.valid ? e.target.value : v
              )
            }
          />
          <button
            className="ml-2 px-2 rounded border-black border-2 bg-gray-800"
            onClick={() => {
              setIsEditing((prev) => !prev);
              props.updateQuantity("bulk", parseInt(newQuantity));
            }}
          >
            confirm
          </button>
        </div>
      )}
    </>
  );
}
