import { iCard } from "../Interfaces";
import CardCollectionType from "./CardType/CardCollectionType";
import CardSearchType from "./CardType/CardSearchType";
import CardGroupType from "./CardType/CardGroupType";

export default function Card(props: { data: iCard; type: string }) {

  switch (props.type) {
    case "search":
      return (
        <>
          <CardSearchType {...{ card: props.data }} />
        </>
      );
    case "collection":
      return (
        <>
          <CardCollectionType {...{ card: props.data }} />
        </>
      );
    case "group":
      return (
        <>
          <CardGroupType {...{ card: props.data }} />
        </>
      );
  }
  return <></>;
}
