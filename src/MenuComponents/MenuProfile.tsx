import { useNavigate } from "react-router";
import { BiUserCircle } from "react-icons/bi";


export default function MenuProfile(props: {
  setActive: React.Dispatch<
    React.SetStateAction<"" | "search" | "collection" | "home" | "profile">
  >;
}) {
  // const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <div
        aria-label="menu-button-profile"
          onClick={() => {
            // navigate("/profile");
            props.setActive("profile")
          }}
        >
          <BiUserCircle size={30} />
        </div>
        <sub className="group-hover:scale-[1.2] duration-300">Profile</sub>
      </div>
    </>
  );
}
