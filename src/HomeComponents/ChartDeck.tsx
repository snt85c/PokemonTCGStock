import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
  const [isReady, setIsReady] = useState(false);
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const userDeckValue = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );
  const userDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
  );
  // const [isReady, setIsReady] = useState(false)
  const [chart, setChart] = useState([
    {
      label: "",
      data: [{ value: 0, date: new Date() }],
    },
  ]);

  useEffect(() => {
    async function ttt() {
      const queryRef = collection(db, "users", user.uid, "historicalValue");
      let chartdata: iChart = { label: "", data: [] };
      const querySnapshot = await getDocs(queryRef);
      let size = querySnapshot.size;
      const docs = querySnapshot.docs;
      if (size !== 0) {
        for (let docum in docs) {
          const queryRef = doc(
            db,
            "users",
            user.uid,
            "historicalValue",
            docum,
            props.deckId,
            "value"
          );
          const querySnapshot = await getDoc(queryRef);
          let current = querySnapshot.data();
          chartdata.data.push({
            value: current ? current.totalPrice * rate: 0,
            date: current ? current.date.toDate() : 0,
          });
          if ( chartdata.data.length === size) {
            setIsReady(true);
          }
        }

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
          // chartdata.data.push({
          //   date: new Date(),
          //   value: userDeckValue * rate,
          // });
        }
        setChart([chartdata]);
      }
    }
    // if ( chart.length > 0) {
    //   props.setIsReady(true);
    // }
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
    
    useEffect(() => {
      console.log(chart);
    }, [chart]);
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
      {isReady? (
        <Chart
          // style={{ display: props.isReady ? "flex" : "none" }}
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
            <div className="flex justify-center items-center text-amber-500 font-bold  leading-none animate-pulse">
              Loading
            </div>
            <div className="flex justify-center items-center text-[0.6rem] leading-none">
              the app is fetching historical prices
            </div>
          </div>
        </div>
      )}
    </>
  );
}
