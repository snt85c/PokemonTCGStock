import { AnimatePresence, motion } from "framer-motion";
import { AiFillCloseCircle } from "react-icons/ai";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { iCard } from "../Interfaces";

export default function EditView(props: {
  card: iCard;
  setIsEditView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { ref } = HandleClickOutsideComponent(props.setIsEditView);

  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 left-0 p-3 bg-white dark:bg-slate-900 w-full min-h-screen z-[70]"
        >
          <AiFillCloseCircle
            size={50}
            className="absolute right-2 top-2 z-40 text-gray-500  hover:text-dark dark:hover:text-white duration-300"
            onClick={() => {
              props.setIsEditView(false);
            }}
          />
          <div className="flex flex-col">
            <div>Edit <span className="text-amber-500 font-bold">{props.card.name}</span>{" "}{props.card.id}</div>
            <div className="text-[0.5rem] leading-none text-gray-600">{props.card.userDeckInfo.id}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
