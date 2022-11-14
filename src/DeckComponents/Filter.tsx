import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { iFilter } from "../Interfaces";
import Dropdown from "./Dropdown";

export default function Filter(props: {
  cardFilter: iFilter;
  handleClick: (option: string, restore?: string[]) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { ref } = HandleClickOutsideComponent(setIsFilterOpen);

  return (
    <div className="relative pt-1 ">
      <div className="flex flex-row dark:text-black">
        <span
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex w-2/3 justify-center items-center dark:bg-white bg-gray-200  hover:bg-gray-300  ml-3 rounded duration-300 cursor-pointer"
          style={{
            backgroundColor: isFilterOpen ? "#334155" : "",
            color: isFilterOpen ? "white" : "black",
          }}
        >
          {isFilterOpen ? "filters" : "open filter"}
        </span>
        <button
          className="flex w-1/4 justify-center items-center bg-white mx-3 rounded hover:bg-gray-300 duration-300 "
          onClick={() => {
            props.handleClick("clear", []);
            setIsFilterOpen(false);
          }}
        >
          clear
        </button>

        <div
          ref={ref}
          style={{
            display: isFilterOpen ? "flex" : "none",
          }}
          className="absolute z-40 top-10 left-3  w-2/3 flex flex-col duration-300 p-3   bg-white rounded-bl rounded-br"
        >
          {Object.keys(props.cardFilter).map((key) => {
            if (key !== "releaseDate") {
              return (
                // <button
                //   key={uuidv4()}
                //   className="flex w-full justify-center items-center bg-white hover:bg-gray-300 mx-1 px-2 whitespace-nowrap rounded duration-300"
                //   style={
                //     {
                //       // backgroundColor: props.sort === item ? "#334155" : "",
                //       // color: props.sort === item ? "white" : "black",
                //     }
                //   }
                //   onClick={() => {
                //     props.handleClick(key);
                //     setIsFilterOpen(false);
                //   }}
                // >
                //   {key}
                // </button>
                <div key={uuidv4()} className="flex flex-col">
                  <Dropdown
                    keys={key}
                    cardFilter={props.cardFilter}
                    handleClick={props.handleClick}
                    setIsFilterOpen={setIsFilterOpen}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
