import { BiEditAlt } from "react-icons/bi";
import { iCard } from "../../Interfaces";
import useAlertStore, { iAlert } from "../../utils/useAlertStore";

export default function CardEditButton(props: {
  card: iCard;
  setIsEditView: React.Dispatch<React.SetStateAction<boolean>>;

}) {
  const setAlert = useAlertStore((store: iAlert) => store.setAlert);

  return (
    <>
      <div className="tooltip tooltip-left" data-tip={"edit card"}>
        <button
          aria-label="remove-button"
          className=" text-slate-500 dark:hover:text-white hover:text-black duration-300"
          onClick={() => {
            setAlert("not yet implemented", "alert-error")
            props.setIsEditView(true);
          }}
        >
          <BiEditAlt size={50} />
        </button>
      </div>
    </>
  );
}
