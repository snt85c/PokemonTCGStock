import { IoMdRemoveCircle } from "react-icons/io";
import useCollectionStore from "../../CollectionComponent/useCollectionStore";
import { iCollectionStore, iCard } from "../../Interfaces";
import { useUserAuth } from "../../ProfileComponents/userAuth";
import useAlertStore, { iAlert } from "../../utils/useAlertStore";

export default function RemoveCardButton(props: { card: iCard }) {
  const { user } = useUserAuth();

  const removeFromUserDeck = useCollectionStore(
    (state: iCollectionStore) => state.removeFromUserDeck
  );
  const setAlert = useAlertStore((state: iAlert) => state.setAlert);
  const removeFromCollection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: iCard
  ) => {
    e.preventDefault();
    if (user) {
      removeFromUserDeck(data, user.uid);
    }
  };

  return (
    <>
      <div className="tooltip tooltip-left" data-tip={"remove card"}>

      <button
        aria-label="remove-button"
        className=" text-slate-500 hover:text-white duration-300"
        onClick={(e) => {
          removeFromCollection(e, props.card);
          setAlert(
            ` removed: ${props.card.name} type: ${
              props.card.userDeckInfo.type.substring(0, 1).toUpperCase() +
              props.card.userDeckInfo.type.substring(1)
            }`,
            "alert-warning"
          );
        }}
      >
        <IoMdRemoveCircle size={50} />
      </button>
      </div>
    </>
  );
}
