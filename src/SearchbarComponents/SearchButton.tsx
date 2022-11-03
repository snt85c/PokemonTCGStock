export default function SearchButton(props: {
  setSearchTrigger: (value: React.SetStateAction<boolean>) => void;
  searchTrigger: boolean;
  searchRequest: string;
}) {
  // px-2 rounded border-black border-2 bg-white dark:text-black
  return (
    <div
        className={props.searchRequest?"":"tooltip tooltip-top"}
        data-tip={props.searchRequest  ? "" : "no query requested"}
      >

    <button
      disabled={props.searchRequest ? false : true}
      className={`btn btn-outline btn-sm font-[PlayR] px-2 ${props.searchTrigger ? "loading" : ""} `}
      onClick={() => props.setSearchTrigger(true)}
      >
      {!props.searchTrigger ? "Search" : "Searching"}
    </button>
      </div>
  );
}
