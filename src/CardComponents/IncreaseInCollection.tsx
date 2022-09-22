
export default function IncreaseInCollection(props: {
  id: number;
  updateQuantity: (type: string) => Promise<void>;
}) {


  return (
    <button
      onClick={() => {
        props.updateQuantity("add")
      }}
    >
      [+]
    </button>
  );
}
