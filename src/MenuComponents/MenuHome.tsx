import { useNavigate } from "react-router";
import { AiFillHome } from "react-icons/ai";

export default function MenuHome() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <button
        aria-label="menu-button-home"
          onClick={() => {
            navigate("/");
          }}
        >
          <AiFillHome size={40} />
        </button>
        <sub className="group-hover:scale-[1.2] duration-300">Home</sub>
      </div>
    </>
  );
}
