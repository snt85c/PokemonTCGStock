export default function SearchInput(props: {
  searchRequest: string;
  setSearchRequest:(request: string) => void
}) {
  // className="border-black border-2 rounded mx-2 px-2 dark:text-black"
  return (
    <input
    className="input input-sm border-black bg-white text-black font-[PlayR]"
      placeholder="Search cards"
      defaultValue={props.searchRequest}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchRequest(e.target.value);
      }}
    />
  );
}
