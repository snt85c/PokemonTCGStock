import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCard, iCollectionStore } from "../Interfaces";
import { db } from "../ProfileComponents/Firebase";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import { useUserAuth } from "../ProfileComponents/userAuth";
import returnPricesKeys from "../utils/returnPricesKeys";

interface iChart {
  label: string;
  data: iData[];
}

interface iData {
  value: number;
  date: Date;
}

export default function CardChart(props: { card: iCard }) {
  const { user } = useUserAuth();
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const userDeckValue = useCollectionStore(
    (state: iCollectionStore) => state.collectionValue
  );

  const deckId = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo.id
  );
  const userDeckInfo = useCollectionStore(
    (state: iCollectionStore) => state.currentDeckInfo
  );
  const [chart, setChart] = useState([
    {
      label: "test",
      data: [{ value: 0, date: new Date() }],
    },
  ]);

  let keys = returnPricesKeys(props.card);
  //this function returns all the prices keys for the card (unlimited, holofoil, etc)

  useEffect(() => {
    async function ttt() {
      const queryRef = collection(
        db,
        "users",
        user.uid,
        "decks",
        deckId,
        "cardDB"
      );
      let instanceData: any = [];
      let result: any = [];
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((instance) => {
          let temp = instance.data();
          temp.result.forEach((item: any) => {
            if (item.id == props.card.id) {
              instanceData.push(item);
            }
          });
        });

        keys.forEach((key) => {
          let chartdata: iChart = { label: "", data: [] };
          chartdata.label = key;
          instanceData.forEach((item: any) => {
            chartdata.data.push({
              value: item.prices[key].market * item.quantity[key] * rate,
              date: item.date.toDate(),
            });
          });
          chartdata.data.sort((a, b) => {
            return Number(a.date) - Number(b.date);
          });
          result.push(chartdata);
        });
      }
      setChart(result);
    }
    ttt();
  }, [userDeckValue, userDeckInfo]);

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
      <Chart
        options={{
          data: chart,
          primaryAxis,
          secondaryAxes,
          dark: isDarkMode,
          //   tooltip: false,
        }}
      />
    </>
  );
}
