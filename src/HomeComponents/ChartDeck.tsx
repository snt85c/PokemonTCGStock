import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import { db } from "../ProfileComponents/Firebase";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";

export interface coll {
  id: string;
  name: string;
  note: string;
  value: number;
  creationDate: Timestamp;
}

interface iChart {
  label: string;
  data: {
    value: number;
    time: number;
  }[];
}

export default function ChartDeck(props: { deckId: string }) {
  const { user } = useUserAuth();

  const rate = useProfileStore((state: iState) => state.conversionRate);

  const [chart, setChart] = useState([
    { label: "temp", data: [{ value: 0, time: 0 },{ value: 0, time: 1 }] },
  ]);

  useEffect(() => {
    async function ttt() {
      const queryRef = collection(
        db,
        "users",
        user.uid,
        "decks",
        props.deckId,
        "cardDB"
      );
      let chartdata: iChart = { label: "", data: [] };
      let counter = 0;
      let dayValueOfDeck = 0;
      const querySnapshot = await getDocs(queryRef);
      if(querySnapshot.size !== 0){
        console.log(querySnapshot.size)
        querySnapshot.forEach((day) => {
          let keys: string[] = [];
          let temp = day.data();
          chartdata.label = props.deckId;
          temp.result.forEach((item: any) => {
          dayValueOfDeck = 0;
          Object.keys(item.prices).map((cardType) => {
            if (!keys.includes(cardType)) keys.push(cardType);
          });
          temp.result.forEach((item: any) => {
            keys.forEach((key) => {
              if (
                item.prices[key] &&
                item.prices[key].market &&
                item.quantity[key] !== 0
                ) {
                  dayValueOfDeck +=
                  (item.prices[key].market * item.quantity[key]);
                  // console.log(item.prices[key].market, item.quantity[key])
                }
              });
            });
          });
          counter++;
          chartdata.data.push({
            value: Math.floor(dayValueOfDeck * rate),
            time: counter,
          });
        }
        );
        setChart([chartdata]);
      }
    }
    ttt();
  }, [user]);

  useEffect(() => {
    console.log(chart);
  }, [chart]);

  const data = chart;
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
      {chart[0].label !== "temp" ? (
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      ) : (
        <div className="flex justify-center items-center h-full">no data</div>
      )}
    </>
  );
}
