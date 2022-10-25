import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";
import ChartDeck from "./ChartDeck";

export interface coll {
  id: string;
  name: string;
  note: string;
  value: number;
  creationDate: Timestamp;
}

export default function DeckCard(props: { card: coll }) {
  const { user } = useUserAuth();

  const sym = useProfileStore((state: iState) => state.conversionSym);
  const rate = useProfileStore((state: iState) => state.conversionRate);

  const totalCollectionsValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-between font-[PlayR] my-3 p-3  border bg-gray-200 border-white dark:border-gray-500 dark:bg-slate-600 rounded-xl w-full  duration-300 ">
        <div className="flex justify-between">
          <div className="leading-none">
            <div
              className="text-lg leading-none font-[PlayB] cursor-pointer"
              onClick={() => {
                setUserDeckFromFirebase(user.uid, props.card.id);
                navigate("/collection");
              }}
            >
              {props.card.name
                ? props.card.name
                : "collection " +
                  props.card.id.substring(props.card.id.length - 1)}
            </div>
            <div className="text-sm leading-none my-2">
              {props.card.note ? props.card.note : "no note"}
            </div>
          </div>
          <div className="min-w-[1/2]">
            <div className="text-lg leading-none whitespace-nowrap">
              <span className="font-[PlayB]">
                {(props.card.value * rate).toFixed(2) }
                {" " + sym.toUpperCase()}
              </span>
            </div>
            <div className="italic leading-none whitespace-nowrap">
              {((props.card.value / totalCollectionsValue) * 100).toFixed(1)}%
              of total
            </div>
          </div>
        </div>
        <div className="h-[7rem] p-2 relative">
          <ChartDeck deckId={props.card.id} />
        </div>
        <div className="text-xs mt-2">
          created on:{props.card.creationDate.toDate().toDateString()}
        </div>
      </div>
    </>
  );
}
