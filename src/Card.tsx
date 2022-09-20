export default function Card(props: { src: string }) {
  return (
    <>
      <div className="m-2">
        <img src={props.src} height={100} width={100} />
      </div>
    </>
  );
}
