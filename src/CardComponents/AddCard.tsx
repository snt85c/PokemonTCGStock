import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { AiFillCloseCircle } from "react-icons/ai";
import returnPricesKeys from "../utils/returnPricesKeys";
import { iCard } from "../Interfaces";
import { uuidv4 } from "@firebase/util";

export default function AddCard(props: {
  card:iCard
  setisAddOnCollection: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { ref } = HandleClickOutsideComponent(props.setisAddOnCollection);
 const keys = returnPricesKeys(props.card).map((item)=>{return <div id={uuidv4()}>{item}</div>})
  return (
    <>
        <div
          ref={ref}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded w-[70%] min-h-[200px] shadow-black shadow-2xl z-40 p-5 flex flex-col justify-between text-black dark:bg-gray-700 dark:text-white"
        >
          <AiFillCloseCircle
            className="absolute right-2 top-2 text-gray-500 w-8 h-8 rounded-full hover:scale-[1.1] hover:text-black dark:hover:text-white duration-300 z-50"
            onClick={() => {
              props.setisAddOnCollection(false);
            }}
          />
          <div>{keys}</div>
          <span>Add with more options</span>
          <span>Add graded card</span>
        </div>
    </>
  );
}
