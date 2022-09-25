export default function IncreaseInCollection(props: {
  updateQuantity: (
    type: "add" | "decrease" | "bulk",
    cardType: string,
    newQuantity?: number
  ) => Promise<void>;
  cardType: string;
}) {
  return (
    <button
      onClick={() => {
        props.updateQuantity("add", props.cardType);
      }}
    >
      [+]
    </button>
  );
}
