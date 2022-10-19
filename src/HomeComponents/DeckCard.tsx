import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
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

  interface iChart {
    label: string;
    data: {
      value: number;
      time: number;
    }[];
  }


  const [chart, setChart] = useState([{label:"temp", data:[{value:1, time:1}]}]);

  const sym = useProfileStore((state: iState) => state.conversionSym);

  const totalCollectionsValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function ttt() {
      const queryRef = collection(
        db,
        "users",
        user.uid,
        "decks",
        props.card.id,
        "cardDB"
      );
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach((day) => {
        let dayValueOfDeck = 0;
        let keys: string[] = [];
        let temp = day.data();
        let chartdata: iChart = { label: "", data: [] };
        let counter = 0;
        chartdata.label = props.card.id;
        temp.result.forEach((item: any) => {
          Object.keys(item.prices.prices).map((cardType) => {
            if (!keys.includes(cardType)) keys.push(cardType);
          });
          dayValueOfDeck = 0

          temp.result.forEach((item: any) => {
            keys.forEach((key) => {
              if (item.prices.prices[key] && item.prices.prices[key].market)
                dayValueOfDeck +=
                  item.prices.prices[key] && item.prices.prices[key].market;
                  //NEEDS TO BE MULTIPLIED BY QUANTITY, I DONT HAVE THAT HISTORICAL DATA SAVED ANYWHERE
                  
            });
          });
          counter++;
          chartdata.data.push({
            value: Math.floor(dayValueOfDeck),
            time: counter,
          });
        });
        setChart([chartdata]);
      });
    }
    ttt();
  }, [user]);

  useEffect(() => {
    console.log(chart);
  }, []); 
  
  const data = chart 
  // useMemo(() => chart, []); 
  ///the value used to be memoized, but if i do then i can't update the values when i fetch them 

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: (datum) => datum.time,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: (datum) => datum.value,
      },
    ],
    []
  );
  type MyDatum = { value: number; time: number };
  

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
          {chart ? (
            <Chart
              options={{
                data,
                primaryAxis,
                secondaryAxes,
              }}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              no data
            </div>
          )}
        </div>
        <div className="text-xs mt-2">
          created on:{props.card.creationDate.toDate().toDateString()}
        </div>
      </div>
    </>
  );
}
