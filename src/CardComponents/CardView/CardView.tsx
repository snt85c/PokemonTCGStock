import { useState } from "react";
import { iCard } from "../../Interfaces";
import HandleClickOutsideComponent from "../../HandleClickOutsideComponent";
import useProfileStore, {
  iState,
} from "../../ProfileComponents/useProfileStore";
import returnPricesKeys from "../../utils/returnPricesKeys";
import calculateCardValueByKey from "../../utils/calculateCardValueByKey";
import { uuidv4 } from "@firebase/util";
import CardValue from "../CardValue";
import CardViewButtons from "./CardViewButtons";
import EditView from "../EditView";
import { db } from "../../ProfileComponents/Firebase";
import { collection,  getDocs, query, where } from "firebase/firestore";
import SingleCardChart from "./SingleCardChart";

export default function CardView(props: {
  card: iCard;
  setIsCardView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [iseEditView, setIsEditView] = useState(false);
  const { ref } = HandleClickOutsideComponent(props.setIsCardView);
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const sym = useProfileStore((state: iState) => state.conversionSym);

  const values = returnPricesKeys(props.card)
    .map((key) => {
      return calculateCardValueByKey(props.card, key);
    })
    .map((item) => {
      return (
        <div key={uuidv4()} className="flex justify-between">
          <div>{item[1]}</div>
          <div>
            {(item[0] * rate).toFixed(2)} {sym.toUpperCase()}
          </div>
        </div>
      );
    });

  async function getCardsById(cardId: string) {
    console.log(cardId);
    // Get a reference to the "cardDB" collection
    const queryRef = collection(db, "cardsDB");
    const querySnapshot = await getDocs(queryRef);
    const qLength = querySnapshot.size;
    console.time()
    for (let i = 0; i < qLength; i++) {
      const queryRef = query(
        collection(db, "cardsDB", i.toString(), "sets", props.card.set.id,"cards"),
        where("id", "==", cardId)
      );
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach((query) => {
        returnPricesKeys(query.data() as iCard).forEach((key) => {
          console.log(
            (query.data().tcgplayer.prices[key].market * rate).toFixed(2),
            "=>",
            key,
            "on ",
            query.data().fetchedAt.toDate()
          );
        });
      });
    }
    console.timeEnd()

    // Execute the query and get the results
  }

  return (
    <>
      {iseEditView && <EditView {...{ setIsEditView, card: props.card }} />}
      <div
        ref={ref}
        className="flex flex-col  items-center absolute top-0 left-0 min-h-screen  z-40 bg-white dark:bg-slate-900  text-black dark:text-white p-3"
        style={{ display: isLoaded ? "flex" : "none" }}
      >
        <div className="flex justify-between cards">
          <img
            className={`w-2/3 h-2/3 mt-2  border-4 border-r-gray-400 duration-300 rounded-xl`}
            onLoad={() => {
              setIsLoaded(true);
            }}
            onClick={() => console.log(props.card)}
            src={props.card.images && props.card.images.large}
          />
          <CardViewButtons
            {...{
              card: props.card,
              setIsCardView: props.setIsCardView,
              setIsEditView,
            }}
          />
        </div>
        <div className="flex flex-col justify-start w-full m-3 max-h-[50%] overflow-scroll pb-20">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">{props.card.name}</h1>
            <div>
              value:
              {
                <span className="font-bold">
                  <CardValue value={props.card.adjustedValue} />
                </span>
              }
            </div>
          </div>
          <h3 className="text-sm leading-none">{props.card.supertype}</h3>
          <h3 className="text-sm leading-none">{props.card.set.name}</h3>
          <h3 className="text-sm leading-none">
            {" "}
            {props.card.rarity}
            {"  "}
            {props.card.number}/{props.card.nationalPokedexNumbers[0]}
          </h3>
          <div className="my-2">{values}</div>
          <SingleCardChart {...{card:props.card}}/>
        </div>
      </div>
    </>
  );
}
