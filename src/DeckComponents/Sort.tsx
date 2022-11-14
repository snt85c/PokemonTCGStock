import { v4 as uuidv4 } from "uuid";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { useState } from "react";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
export default function Sort(props: {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  isSortingAscending: boolean;
  setIsSortingAscending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const sort = ["name", "series", "release date", "amount", "value", "asc"];
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { ref } = HandleClickOutsideComponent(setIsSortOpen);

  const result = sort.map((item) => {
    return item !== "asc" ? (
      <button
        key={uuidv4()}
        className="flex justify-center items-center bg-white hover:bg-gray-300 mx-1 px-2 whitespace-nowrap rounded duration-300"
        style={{
          backgroundColor: props.sort === item ? "#334155" : "",
          color: props.sort === item ? "white" : "black",
        }}
        onClick={() => {
          props.setSort(item);
        }}
      >
        {item}
      </button>
    ) : (
      <button
        key={uuidv4()}
        className="flex w-full justify-center items-center text-black hover:bg-gray-300 rounded duration-300"
        onClick={() => {
          props.setIsSortingAscending(!props.isSortingAscending);
        }}
      >
        {props.isSortingAscending ? (
          <HiSortDescending size={20} />
        ) : (
          <HiSortAscending size={20} />
        )}
      </button>
    );
  });

  return (
    <div className="relative">
      <span
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex w-2/3 justify-center items-center dark:bg-white bg-gray-200  hover:bg-gray-300  ml-3 rounded duration-300 cursor-pointer"
        style={{
          backgroundColor: isSortOpen ? "#334155" : "",
          color: isSortOpen ? "white" : "black",
        }}
      >
        {isSortOpen ? "filters" : "open sorts"}
      </span>
      <div
        ref={ref}
        style={{
          display: isSortOpen ? "flex" : "none",
        }}
        className="absolute z-40 top-[4rem] left-3  w-2/3 flex flex-col duration-300 p-3 bg-white rounded-bl rounded-br"
      >
        <div className=" flex flex-col">
            sort by:{result}
        </div>
      </div>
    </div>
  );
}
