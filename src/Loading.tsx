import { AnimatePresence, motion } from "framer-motion";
import logo from "./img/TCGStock_Logo_3000x3000.png";

export default function Loading(props: {
  isLoading: React.MutableRefObject<boolean>;
}) {
  return (
    <AnimatePresence>
      {props.isLoading.current && (
        <>
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-40 top-0 min-w-full min-h-screen backdrop-blur duration-300 bg-white"
          >
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={logo}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 duration-300 w-[50%]"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
