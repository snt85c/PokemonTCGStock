export default function SearchButton(props: {
  setSearchTrigger: (value: React.SetStateAction<boolean>) => void;
}) {
  return (
    <button
      className="px-2 rounded border-black border-2"
      onClick={() => props.setSearchTrigger((prev)=>!prev)}
    >
      Search
    </button>
  );
}
