import {
  collection,
  getDocs,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import { iCard } from "../Interfaces";
import { db } from "../ProfileComponents/Firebase";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";

interface iChart {
  label: string;
  data: iData[];
}

interface iData {
  value: number;
  date: Date;
}

export default function ChartDeck(props: { deckId: string }) {
  const { user } = useUserAuth();
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const rate = useProfileStore((state: iState) => state.conversionRate);

  const [chart, setChart] = useState([
    {
      label: "temp",
      data: [
        { value: 0, date: new Date() },
        { value: 0, date: new Date() },
      ],
    },
  ]);

  const cardValue = (card: iCard) => {
    /**
     * when calculating the chart, i need to append the latest value at the end which might be different from
     * the one i have historically due to live user interaction. i call this function to calculate the values
     * currently stored
     */
    let result = Object.keys(card.userDeckInfo.quantity).reduce(
      (prev, current) =>
        prev +
        card.userDeckInfo.quantity[current] *
          card.tcgplayer.prices[current].market,
      0
    );

    return result;
  };

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
      let dayValueOfDeck = 0;
      let date: Date = new Date();
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((day) => {
          let keys: string[] = [];
          let daydata = day.data();
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
          chartdata.data.push({
            value: dayValueOfDeck * rate,
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
        let currentDeck: iData = { value: 0, date: new Date() };
        queryCurrentSnapshot.forEach((item) => {
          let temp: iCard = item.data() as iCard;
          currentDeck = {
            ...currentDeck,
            value: currentDeck.value + cardValue(temp) * rate,
          };
        });
        chartdata.data.push(currentDeck);
        setChart([chartdata]);
      }
    }
    ttt();
  }, [user]);
  

  // const data = chart; DO NOT REMOVE
  // useMemo(() => chart, []);
  ///the value used to be memoized, but if i do then i can't update the values when i fetch them

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

 
  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: (datum) => datum.value,
        elementType: "line", //line, area, bar,bubble
        shouldNice: true,
      },
    ],
    []
  );
  type MyDatum = { value: number; date: Date };

  return (
    <>
      {chart[0].label !== "temp" ? (
        <Chart
          options={{
            data: chart,
            primaryAxis,
            secondaryAxes,
            dark: isDarkMode,
            tooltip: false,
          }}
        />
      ) : (
        <div className="flex justify-center items-center h-full">no data</div>
      )}
    </>
  );
}
