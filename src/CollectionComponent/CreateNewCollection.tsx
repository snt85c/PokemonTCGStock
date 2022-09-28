import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../ProfileComponents/Firebase";
import { useUserAuth } from "../ProfileComponents/userAuth";
export default function CreateNewCollection() {
  const { user } = useUserAuth();
  async function createNewOnFirebase() {
    const userDeck = doc(db, "users", user.uid);
    let id = Date.now().toString();
    // Atomically add a new region to the "regions" array field.
    const docRef = doc(db, "users", user.uid,"decks", "collection1");
    setDoc(docRef, {
    
    });
      
  }
  return (
    <button
      onClick={() => {
        createNewOnFirebase();
      }}
    >
      create new collection
    </button>
  );
}
