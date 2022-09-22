
export default function DecreaseInCollection(props: {
  id: number;
  updateQuantity: (type: string) => Promise<void>;
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
