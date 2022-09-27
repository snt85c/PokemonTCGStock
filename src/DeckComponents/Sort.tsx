import { v4 as uuidv4 } from "uuid";

export default function Sort(props: {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  isSortingAscending: boolean;
  setIsSortingAscending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const sort = ["name", "series", "release date", "asc"];

  const result = sort.map((item) => {
    return item !== "asc" ? (
      <button
        key={uuidv4()}
        className="flex w-full justify-center items-center bg-white mx-2 rounded duration-300"
        style={{ backgroundColor: props.sort === item ? "#334155" : "white" }}
        onClick={() => {
          props.setSort(item);
        }}
      >
        {item}
      </button>
    ) : (
      <button
        key={uuidv4()}
        className="flex w-full justify-center items-center bg-white mx-2 rounded duration-300"
        style={{ backgroundColor: props.sort === item ? "#334155" : "white" }}
        onClick={() => {
          props.setIsSortingAscending(!props.isSortingAscending);
        }}
      >
        {item}
      </button>
    );
  });

  return <div className="flex justify-between items-center  p-1">{result}</div>;
}
