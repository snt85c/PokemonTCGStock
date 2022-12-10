import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import Deck from "../DeckComponents/Deck";
import HandleClickOutsideComponent from "../HandleClickOutsideComponent";
import { iCollectionStore } from "../Interfaces";

export default function GroupView(props: {
  setIsGroupView: React.Dispatch<React.SetStateAction<boolean>>;
  cardID: string;
}) {


  const userDeck = useCollectionStore(
    (state: iCollectionStore) => state.currentDeck
  );

  const { ref } = HandleClickOutsideComponent(props.setIsGroupView);
  return (
    <AnimatePresence>
      <motion.div
      ref= {ref}
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // exit={{ opacity: 0 }}
        className="absolute top-0 left-0 w-full h-full bg-white z-50"
      >
        <AiFillCloseCircle
          className="absolute right-2 top-2 z-50 text-gray-500  w-10 h-10 bg-white rounded-full hover:scale-[1.1] hover:text-black duration-300"
          onClick={() => {
            props.setIsGroupView(false);
          }}
          />
          <Deck deck={userDeck} type="group" id={props.cardID} />

      </motion.div>
    </AnimatePresence>
  );
}
