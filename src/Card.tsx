import { User } from "firebase/auth";
import { setDoc, doc, addDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { IoMdAddCircle } from "react-icons/io";
import { useStore } from "zustand";
import { db } from "./LoginComponents/Firebase";
import { useUserAuth } from "./LoginComponents/userAuth";
import { iCard, iCollection, iSearch } from "./SearchbarComponents/Search";
import useDeckStore from "./store/useDeckStore";
import useCollectionStore from "./store/useCollectionStore";

export default function Card(props: { data: iCard }) {
  const { user } = useUserAuth();

  const setUserDeck = useCollectionStore((state:iCollection) => state.setUserDeck)
  const userDeck = useCollectionStore((state:iCollection) => state.userDeck)

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const saveOnCollection = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: iCard) => {
    e.preventDefault()
    const newData = {...props.data, quantity:1}
    setUserDeck(newData)
    if (user) {
      try {
         await updateDoc(doc(db, "users", user.uid), {
          userDeck: arrayUnion(newData)
        });
        console.log("Document written with ID: ", data.id.toString());
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  return (
    <>
      <motion.div
        variants={item}
        className="m-2 p-2  flex flex-row justify-between border border-black rounded-xl gap-2"
        onClick={() => console.log(props.data)}
      >
        <div className="flex gap-2">
          <img src={props.data.images && props.data.images.small} height={60} width={60} />
          <div>
            <p>name: {props.data.name}</p>
            <p>series: {props.data.set && props.data.set.series}</p>
            <p>rarity: {props.data.rarity ? props.data.rarity : "n/a"}</p>
            <p>quantity: {props.data.quantity? props.data.quantity:0}</p>
          </div>
        </div>
        <button
          className="flex justify-center items-center"
          onClick={(e) => saveOnCollection(e, props.data)}
        >
          <IoMdAddCircle size={40} color={"gray"} />
        </button>
      </motion.div>
    </>
  );
}
