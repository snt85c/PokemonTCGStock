export default function Deck(props: { resultJSXArray: JSX.Element[] }) {
  const result = props.resultJSXArray.map((card, index) => {
    return <div key={index}>{card}</div>;//wrapped in the key
  });

  return (
    <>
      <div className="flex flex-col overflow-scroll h-[73vh] ">
        {result.length ? (
          result
        ) : (
          <div className="flex justify-center items-center">no items</div>
        )}
      </div>
    </>
  );
}
