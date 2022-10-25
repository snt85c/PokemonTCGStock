import { v4 as uuidv4 } from "uuid";
import useProfileStore, {
  iState,
} from "../../ProfileComponents/useProfileStore";

export default function CardShowSearchValue(props: { quantity: any }) {
  const rate = useProfileStore((state: iState) => state.conversionRate);
  const sym = useProfileStore((state: iState) => state.conversionSym);
  let keys: JSX.Element[] = [];
  if (props.quantity) {
    keys = Object.keys(props.quantity).map((cardType) => (
      <div key={uuidv4()} className="flex leading-none">
        <div className="flex items-center gap-1 leading-none">
          <span className="text-sm leading-none">{cardType}</span>:
          <span className="font-bold text-sm text-amber-500 leading-none">
            {props.quantity && props.quantity[cardType].market
              ? (props.quantity[cardType].market * rate).toFixed(2) +
                " " +
                sym.toUpperCase()
              : "NO DATA"}
          </span>
        </div>
      </div>
    ));
  } else {
    keys = [
      <div key={uuidv4()} className="font-bold mt-1">
        NO DATA
      </div>,
    ];
  }

  return <div className="">{keys}</div>;
}
