import { motion } from "framer-motion";
export default function Deck(props: { resultJSXArray: JSX.Element[] }) {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const result = props.resultJSXArray.map((card, index) => {
    return <div key={index}>{card}</div>;
  });

  return (
    <>
      <div className="flex flex-col  ">
        {result.length ? (
          result
        ) : (
          <div className="flex justify-center items-center">no items</div>
        )}
      </div>
    </>
  );
}
