import logo from "./TCGStock_Logo_3000x3000.png";

export default function Loading(props:{isLoading:React.MutableRefObject<boolean>}) {
  return (
    <>
      {props.isLoading.current && (
        <img
          src={logo}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        />
      )}
    </>
  );
}
