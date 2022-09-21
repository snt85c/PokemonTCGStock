export default function SearchButton(props: {
  setSearchTrigger: (value: React.SetStateAction<boolean>) => void;
  searchTrigger:boolean
}) {
  return (
    <button
      className="px-2 rounded border-black border-2"
      onClick={() => props.setSearchTrigger(true)}
    >
      {!props.searchTrigger ?  "Search"  : " LOADING"}
    </button>
  );
}
