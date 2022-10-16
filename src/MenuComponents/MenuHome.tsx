import { AiFillHome } from "react-icons/ai";

export default function MenuHome(props: {
  setActive: React.Dispatch<
    React.SetStateAction<"" | "search" | "collection" | "home" | "profile">
  >;
}) {
  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <div
          aria-label="menu-button-home"
          onClick={() => {
            props.setActive("home");
          }}
        >
          <AiFillHome size={30} />
        </div>
        <sub className="group-hover:scale-[1.2] duration-300">Home</sub>
      </div>
    </>
  );
}
