export default function SearchInput(props: {
  searchRequest: string;
  // setSearchRequest: React.Dispatch<React.SetStateAction<string>>;
  setSearchRequest:(request: string) => void
}) {
  return (
    <input
      placeholder="search"
      className="border-black border-2 rounded mx-2 px-2"
      defaultValue={props.searchRequest}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchRequest(e.target.value);
      }}
    />
  );
}
