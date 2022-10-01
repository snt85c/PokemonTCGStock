export default function SearchButton(props: {
  setSearchTrigger: (value: React.SetStateAction<boolean>) => void;
  searchTrigger: boolean;
  searchRequest: string;
}) {
  return (
    <button
      disabled={props.searchRequest ? false : true}
      className="px-2 rounded border-black border-2 bg-white dark:text-black"
      onClick={() => props.setSearchTrigger(true)}
    >
      {!props.searchTrigger ? "Search" : " LOADING"}
    </button>
  );
}
