import logo from "./TCGStock_Logo_3000x3000.png";

export default function Loading(props:{isLoading:React.MutableRefObject<boolean>}) {
  return (
    <>
      {
      props.isLoading.current &&
       (
        <>
        <div className="absolute z-40 top-0 min-w-full min-h-screen backdrop-blur duration-300 bg-white"></div>
        <img
          src={logo}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 duration-300 w-[50%]"
          />
          </>
      )}
    </>
  );
}
