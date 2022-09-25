import { useNavigate } from "react-router";
import { BiUserCircle } from "react-icons/bi";


export default function MenuProfile() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <button
        aria-label="menu-button-profile"
          onClick={() => {
            navigate("/user");
          }}
        >
          <BiUserCircle size={40} />
        </button>
        <sub className="group-hover:scale-[1.2] duration-300">Profile</sub>
      </div>
    </>
  );
}
