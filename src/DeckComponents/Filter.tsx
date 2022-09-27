import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { HandleClickOutsideComponent } from "../HandleClickOutsideComponent";
import Dropdown from "./Dropdown";

export default function Filter(props: {
  cardFilter: any;
  handleClick: (option: string, restore?: string[]) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { ref } = HandleClickOutsideComponent(setIsFilterOpen);

  return (
    <div className="relative">
      <div className="flex flex-row">
        <span
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="flex w-full justify-center items-center bg-white mx-3 rounded"
        >
          {isFilterOpen ? "close filters" : "open Filter"}
        </span>
        <button
          className="flex w-1/4 justify-center items-center bg-white mx-3 rounded"
          onClick={() => props.handleClick("clear", [])}
        >
          clear
        </button>

        <div
          ref={ref}
          style={{
            display: isFilterOpen ? "flex" : "none",
            opacity: isFilterOpen ? 1 : 0,
          }}
          className="absolute z-40 top-7 left-1/2 -translate-x-1/2 w-2/3 flex flex-col duration-300 p-3   bg-white rounded-bl rounded-br"
        >
          {Object.keys(props.cardFilter).map((key) => {
            if (key !== "releaseDate") {
              return (
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
