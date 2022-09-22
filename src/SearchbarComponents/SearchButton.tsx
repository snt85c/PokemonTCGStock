import { iSearch } from "../Interfaces";
import useDeckStore from "./useSearchStore";

export default function SearchButton(props: {
  setSearchTrigger: (value: React.SetStateAction<boolean>) => void;
  searchTrigger: boolean;
  searchRequest: string;
}) {
  return (
    <button
      disabled={props.searchRequest?false:true}
      className="px-2 rounded border-black border-2"
      onClick={() => props.setSearchTrigger(true)}
    >
      {!props.searchTrigger ? "Search" : " LOADING"}
    </button>
  );
}
