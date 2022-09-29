import { useNavigate } from "react-router";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


export default function MenuCollection() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center  gap-1 group">
        <button
        aria-label="menu-button-collection"
          onClick={() => {
            navigate("/collection");
          }}
        >
          <MdOutlineCollectionsBookmark size={30} />
        </button>
        <sub className="group-hover:scale-[1.2] duration-300">Collection</sub>
      </div>
    </>
  );
}
