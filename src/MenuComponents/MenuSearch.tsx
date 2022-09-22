import { useNavigate } from "react-router";
import { AiOutlineSearch } from "react-icons/ai";

export default function MenuSearch() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <button
          onClick={() => {
            navigate("/search");
          }}
        >
          <AiOutlineSearch size={40} />
        </button>
        <sub className="group-hover:scale-[1.2] duration-300">Search</sub>
      </div>
    </>
  );
}
