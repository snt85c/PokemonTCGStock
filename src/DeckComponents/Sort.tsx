import { v4 as uuidv4 } from "uuid";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
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
        className="flex w-full justify-center items-center bg-white hover:bg-gray-300 mx-1 px-2 whitespace-nowrap rounded duration-300"
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
        className="flex w-full justify-center items-center hover:bg-gray-300 rounded duration-300"
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
    <>
      <div className=" flex justify-between items-center">
        <div className="flex w-full mx-2 whitespace-nowrap font-[PlayR]">sort by:{result}</div>
      </div>
    </>
  );
}
