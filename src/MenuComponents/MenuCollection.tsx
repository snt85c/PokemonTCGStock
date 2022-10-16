import { useNavigate } from "react-router";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


export default function MenuCollection(props: {
  setActive: React.Dispatch<
    React.SetStateAction<"" | "search" | "collection" | "home" | "profile">
  >;
}) {
  // const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <div
        aria-label="menu-button-collection"
          onClick={() => {
            props.setActive("collection")
            // navigate("/collection");
          }}
        >
          <MdOutlineCollectionsBookmark size={30} />
        </div>
        <sub className="group-hover:scale-[1.2] duration-300">Collection</sub>
      </div>
    </>
  );
}
