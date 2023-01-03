import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import { iCard } from "../../Interfaces";
import { db } from "../../ProfileComponents/Firebase";
import useProfileStore, {
  iState,
} from "../../ProfileComponents/useProfileStore";
import returnPricesKeys from "../../utils/returnPricesKeys";

interface iChart {
  label: string;
  data: iData[];
}

interface iData {
  value: number;
  date: Date;
}

export default function SingleCardChart(props: { card: iCard }) {
  const [isReady, setIsReady] = useState(false);
  let chartdata: iChart = { label: "", data: [] };
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);

  const [chart, setChart] = useState([
    {
      label: "",
      data: [{ value: 0, date: new Date() }],
    },
  ]);

  // Get a reference to the "cardDB" collection
  useEffect(() => {
    (async () => {
      const queryRef = collection(db, "cardsDB");
      const querySnapshot = await getDocs(queryRef);
      const size = querySnapshot.size;
      //   console.time();
      for (let i = 0; i < size; i++) {
        const queryRef = query(
          collection(
            db,
            "cardsDB",
            i.toString(),
            "sets",
            props.card.set.id,
            "cards"
          ),
          where("id", "==", props.card.id)
        );
        const querySnapshot = await getDocs(queryRef);
        querySnapshot.forEach((query) => {
          // returnPricesKeys(query.data() as iCard).forEach((key) => {
            chartdata.data.push({
              value: query.data().tcgplayer.prices[props.card.userDeckInfo.type].market * rate,
              date: query.data().fetchedAt.toDate(),
            });
            if (chartdata.data.length === size) {
              setIsReady(true);
            }
          // });
        });
        chartdata.data.sort((a, b) => {
          /**
           *sort it by Date, as Firebase doesn't ensure that the data will be saved chronologically
           *, otherwise i might get the wrong amount in the wrong place
           */
          return Number(a.date) - Number(b.date);
        });
        // console.timeEnd();
      }
      setChart([chartdata]);
    })();
  }, []);

  useEffect(() => {
    console.log(chart);
  }, [chart]);

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
      <div className="min-h-[10rem] p-2 bg-gray-200 dark:bg-gray-700 rounded-xl">
        {isReady ? (
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
          <div className="min-h-[10rem] flex flex-col justify-center items-center h-full">
            <div>
              <div className="flex justify-center items-center text-amber-500 font-bold  leading-none animate-pulse">
                Loading
              </div>
              <div className="flex justify-center items-center text-[0.6rem] leading-none">
                the app is fetching your historical data
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
