import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import { db } from "../ProfileComponents/Firebase";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";

interface iChart {
  label: string;
  data: {
    value: number;
    time: number;
    date: Timestamp;
  }[];
}

export default function ChartDeck(props: { deckId: string }) {
  const { user } = useUserAuth();

  const rate = useProfileStore((state: iState) => state.conversionRate);
  let sorted: any[] = [];

  const [chart, setChart] = useState([
    {
      label: "temp",
      data: [
        { value: 0, time: 0 },
        { value: 0, time: 1 },
      ],
    },
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
      let date: any = 0;
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((day) => {
          let keys: string[] = [];
          let daydata = day.data();
          sorted.push(daydata);
          chartdata.label = props.deckId;
          daydata.result.forEach((item: any) => {
            dayValueOfDeck = 0;
            Object.keys(item.prices).map((cardType) => {
              if (!keys.includes(cardType)) keys.push(cardType);
            });
            daydata.result.forEach((item: any) => {
              keys.forEach((key) => {
                if (
                  item.prices[key] &&
                  item.prices[key].market &&
                  item.quantity[key] !== 0
                ) {
                  dayValueOfDeck +=
                    item.prices[key].market * item.quantity[key];
                  date = item.date.toDate();
                }
              });
            });
          });
          counter++;
          chartdata.data.push({
            value: (dayValueOfDeck * rate),
            time: counter,
            date: date,
          });
        });
        chartdata.data.sort((a, b) => {
          //sort it by Date, as Firebase doesn't ensure that the data will be saved chronologically in the first place, otherwise i might get the wrong amount in the wrong place
          return Number(a.date) - Number(b.date);
        });
        const queryRef = collection(
          db,
          "users",
          user.uid,
          "decks",
          props.deckId,
          "cards"
        );
        //to make the chart dynamic, i take the current deck as saved on firebase and i append it at the end of chartdata(i dont need to sort in this case)
        const queryCurrentSnapshot = await getDocs(queryRef);
        let currentDeck: {
          value: number;
          time: number;
          date: Timestamp;
        } = { value: 0, time: counter + 1, date: new Timestamp(0, 0) };
        queryCurrentSnapshot.forEach((item) => {
          let temp = item.data();
          currentDeck = {
            ...currentDeck,
            value: (currentDeck.value + temp.adjustedValue) * rate,
          };
        });
        chartdata.data.push(currentDeck);
        setChart([chartdata]);
      }
    }
    ttt();
  }, [user]);

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
