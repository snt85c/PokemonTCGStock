import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";

export interface coll {
  id: string;
  name: string;
  note: string;
  value: number;
  creationDate: Timestamp;
}

export default function CollectionCard(props: { card: coll }) {

  const { user } = useUserAuth();

  const sym = useProfileStore((state: iState) => state.conversionSym);

  const totalCollectionsValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );
  const navigate = useNavigate()

  return (
    <div 
    onClick={()=>{
      setUserDeckFromFirebase(user.uid, props.card.id)
      navigate("/collection")
    }}
    className="m-3 p-3  border bg-gray-200 border-white dark:border-gray-500 dark:bg-slate-600 rounded-xl w-4/5 duration-300 ">
      <div className="flex justify-between">
        <div className="leading-none">
          <div className="text-lg leading-none">
            {props.card.name
              ? props.card.name
              : "collection " +
                props.card.id.substring(props.card.id.length - 1)}
          </div>
          <div className="text-sm leading-none">
            {props.card.note ? props.card.note : "no note"}
          </div>
        </div>
        <div>
          <div className="text-lg leading-none">
            <span className="font-bold">
              {props.card.value.toFixed(2)}
              {" " + sym.toUpperCase()}
            </span>
          </div>
          <div className="italic leading-none">
            {((props.card.value / totalCollectionsValue) * 100).toFixed(1)}% of
            total
          </div>
        </div>
      </div>
    </div>
  );
}
