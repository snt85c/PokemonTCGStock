import { collection, getDocs, Timestamp } from "firebase/firestore";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import { db } from "../ProfileComponents/Firebase";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";
import { AxisOptions, Chart } from "react-charts";

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
  let keys: string[] = [];

  const totalCollectionsValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );
  const navigate = useNavigate();
  /*
  useEffect(() => {
    //currently useless, dont remember what was the idea behind it, i guess it predates the time i could store data everyday on firebase with cloud functions
    async function  ttt()  {
      const queryRef = collection(
        db,
        "users",
        user.uid,
        "decks",
        props.card.id,
        "cards"
      );
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach((item) => {
        let temp = item.data();
        Object.keys(temp.tcgplayer.prices).map((cardType) => {
          keys.push(cardType);
        });
        // console.log(keys)
      });
    };
    ttt()
  }, [user]);
  */

  type MyDatum = { value: number; time: number };

  const data = useMemo(
    () => [
      {
        label: "a",
        data: [
          {
            value: 15,
            time: 1,
          },
          {
            value: 22,
            time: 2,
          },
          {
            value: 20,
            time: 3,
          },
          {
            value: 28,
            time: 4,
          },
        ],
      },
    ],
    []
  );

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: (datum) => datum.time,
    }),
    []
  );

  const secondaryAxes = 
  useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: (datum) => datum.value,
      },
    ],
    []
  );

  return (
    <>
      <div
        onClick={() => {
          setUserDeckFromFirebase(user.uid, props.card.id);
          navigate("/collection");
        }}
        className="flex flex-col justify-between font-[PlayR] my-3 p-3  border bg-gray-200 border-white dark:border-gray-500 dark:bg-slate-600 rounded-xl w-full  duration-300 "
      >
        <div className="flex justify-between">
          <div className="leading-none">
            <div className="text-lg leading-none font-[PlayB]">
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
                {props.card.value.toFixed(2)}
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
          <Chart
            options={{
              data,
              primaryAxis,
              secondaryAxes,
            }}
          /> 
        </div>
        <div className="text-xs mt-2">
          created on:{props.card.creationDate.toDate().toDateString()}
        </div>
      </div>
    </>
  );
}
