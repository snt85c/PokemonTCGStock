import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./Firebase";
import { useUserAuth } from "./userAuth";
import Dropdown from "react-dropdown";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";

export default function CollectionDelete() {
  const { user } = useUserAuth();
  const [options, setOptions] = useState<any[]>([]);
  const deleteCollection = useCollectionStore(
    (state: iCollectionStore) => state.deleteCollection
  );

  async function getCollections() {
    if (user) {
      let temp: any[] = [];

      const colRef2 = collection(db, "users", user.uid, "decks");
      let list = await getDocs(colRef2);
      list.forEach((item) => {
        temp.push(item.data().id);
      });
      setOptions(temp);
    }
  }
  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div className="leading-1">
      <span>delete collections?</span>
      <Dropdown
        className="bg-white dark:text-black"
        options={options}
        placeholder="collections"
        onChange={(e) => {deleteCollection(e.value); getCollections()}}
      />
    </div>
  );
}
