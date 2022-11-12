import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollectionStore } from "../Interfaces";
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

export default function ChartDeck(props: {
  deckId: string;
}) {
  const { user } = useUserAuth();
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const userDeckValue = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );
  const userDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
  );
  const [isReady, setIsReady] = useState(false)
  const [chart, setChart] = useState([
    {
      label: "",
      data: [{ value: 0, date: new Date() }],
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
      let dayValueOfDeck = 0;
      let date: Date = new Date();
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.size !== 0) {
        //i query all the historical instances of this collection,
        querySnapshot.forEach((instance) => {
          let keys: string[] = [];
          let instanceData = instance.data();
          chartdata.label = props.deckId;
          instanceData.result.forEach((item: any) => {
            // for each i get all the keys from the prices ,
            dayValueOfDeck = 0;
            Object.keys(item.prices).map((cardType) => {
              if (!keys.includes(cardType)) keys.push(cardType);
            });
            instanceData.result.forEach((item: any) => {
              keys.forEach((key) => {
                if (
                  item.prices[key] &&
                  item.prices[key].market &&
                  item.quantity[key] !== 0
                ) {
                  // then for each key i sum and multiply each card for its price and quantity
                  dayValueOfDeck +=
                    item.prices[key].market * item.quantity[key];
                  date = item.date.toDate();
                }
              });
            });
          });
          //i append each result into a new object containing the date of the instance and the total value
          chartdata.data.push({
            value: dayValueOfDeck * rate,
            date: date,
          });
        });
        chartdata.data.sort((a, b) => {
          /**
           *sort it by Date, as Firebase doesn't ensure that the data will be saved chronologically
           *, otherwise i might get the wrong amount in the wrong place
           */
          return Number(a.date) - Number(b.date);
        });
        if (userDeckInfo && props.deckId === userDeckInfo.id) {
          /**
           *to make the chart dynamic, i take the current deck as saved on zustand and i append it
           *at the end of chartdata(i dont need to sort in this case, as it's clearly going
           *to be pushed at the end)
           */
          chartdata.data.push({
            date: new Date(),
            value: userDeckValue * rate,
          });
        }
        setChart([chartdata]);
      }
    }
    if (chart[0].data.length > 2 && rate > 0) {
        setIsReady(true)
    }
    ttt();
  }, [userDeckValue, userDeckInfo, rate]);



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

  /**
   * 
   // const data = chart; DO NOT REMOVE
   // useMemo(() => chart, []);
   *
   * the value used to be memoized, but if i do then i can't update the values when i fetch them,
   * this seems like a big deal on the documentation but it won't work here, so i'm leaving it as a
   * reminder of what could be wrong
   */

  return (
    <>
      {isReady ? (
        <Chart
          style={{ display: isReady ? "flex" : "none" }}
          options={{
            data: chart,
            primaryAxis,
            secondaryAxes,
            dark: isDarkMode,
            tooltip: false,
          }}
        />
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <div>
            <div className="flex justify-center items-center text-amber-500 font-bold  leading-none">
              no data
            </div>
            <div className="flex justify-center items-center text-[0.6rem] leading-none">
              no historical data available
            </div>
          </div>
        </div>
      )}
    </>
  );
}
