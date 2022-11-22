import { Timestamp } from "firebase/firestore";
import { useState } from "react";
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
  const [isReady, setIsReady] = useState(false);
  let deckId = props.card && props.card.id;

  return (
    <>
      <div className="flex flex-col justify-between font-[PlayR] my-3 p-3  border bg-gray-200 border-white dark:border-gray-500 dark:bg-slate-600 rounded-xl min-w-full  duration-300 shadow-lg">
        <div className="flex justify-between">
          <div className="leading-none">
            <a
              href="#collection"
              className="text-lg leading-none font-[PlayB] cursor-pointer"
              onClick={() => {
                setUserDeckFromFirebase(user.uid, props.card.id);
              }}
            >
              {props.card.name
                ? props.card.name
                : "collection " +
                  props.card.id.substring(props.card.id.length - 1)}
            </a>
            <div className="text-sm leading-none my-2">
              {props.card.note ? props.card.note : ""}
            </div>
          </div>
          {props.card.value > 0 && (
            <div className="min-w-[1/2]">
              <div className="text-lg leading-none whitespace-nowrap">
                <span className="font-[PlayB]">
                  {(props.card.value * rate).toFixed(2)}
                  {" " + sym.toUpperCase()}
                </span>
              </div>
              <div className="italic leading-none whitespace-nowrap">
                {((props.card.value / totalCollectionsValue) * 100).toFixed(1)}%
                of total
              </div>
            </div>
          )}
        </div>
        <div className="h-[5rem] p-3 mx-2 relative md:h-[10rem]" 
        style={{display:isReady?"flex":"none"}}>
          <ChartDeck {...{ deckId, isReady, setIsReady }} />
        </div>
        <div className="text-xs mt-2">
          created on:{props.card.creationDate.toDate().toDateString()}
        </div>
      </div>
    </>
  );
}
