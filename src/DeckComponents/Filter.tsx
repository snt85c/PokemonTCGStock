import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Filter(props: { cardFilter: any }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <span
        onClick={() => setIsFilterOpen((prev) => !prev)}
        className="flex justify-center items-center bg-white mx-3 rounded"
      >
        {isFilterOpen ? "close filters" : "open Filter"}
      </span>
      <div
        style={{
          display: isFilterOpen ? "flex" : "none",
          opacity: isFilterOpen ? 1 : 0,
        }}
        className="flex flex-col duration-300 p-3 mx-3  bg-white rounded-bl rounded-br"
      >
        {Object.keys(props.cardFilter).map((key) => {
          return (
            <div key={uuidv4()} className="flex flex-col">
              <b>{key}</b>
              <select>
                <option value="">clear filter</option>
                {props.cardFilter[key].map((item: any) => (
                  <option key={uuidv4()} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </>
  );
}
