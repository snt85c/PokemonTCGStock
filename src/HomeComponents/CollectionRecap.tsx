import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../ProfileComponents/Firebase";
import { useUserAuth } from "../ProfileComponents/userAuth";
import DeckCard, { coll } from "./DeckCard";
import { v4 as uuidv4 } from "uuid";

export default function CollectionRecap() {
  const { user } = useUserAuth();

  const [result, setResult] = useState<JSX.Element[]>([])

  useEffect(() => {
    (async () => {
      if (user) {
        let temp:JSX.Element[] = []
        const colRef2 = collection(db, "users", user.uid, "decks");
        await getDocs(colRef2).then((list) => {
          list.forEach((collection) => {
            temp.push(
              <DeckCard key={uuidv4()} card={collection.data() as coll} />
            );
          });
        });
        setResult(temp)
      }
    })();
  }, [user]);

  return <div className="w-full">{result}</div>;
}
