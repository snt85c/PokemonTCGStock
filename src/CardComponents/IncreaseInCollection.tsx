
export default function IncreaseInCollection(props: {
  updateQuantity: (type: "add" | "decrease" | "bulk") => Promise<void>;
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
