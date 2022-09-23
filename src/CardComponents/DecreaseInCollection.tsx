
export default function DecreaseInCollection(props: {
  updateQuantity: (type: "add" | "decrease" | "bulk") => Promise<void>;
}) {
  return (
    <button
      onClick={() => {
        props.updateQuantity("decrease");
      }}
    >
      [-]
    </button>
  );
}
