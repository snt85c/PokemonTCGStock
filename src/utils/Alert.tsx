import { AnimatePresence, motion } from "framer-motion";
import useAlertStore, { iAlert } from "./useAlertStore";

export default function Alert() {
  const alertText = useAlertStore((state: iAlert) => state.alert);
  const type = useAlertStore((state:iAlert)=> state.type  )

  return (
    <AnimatePresence>
      {alertText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={` absolute top-10 left-5 w-[90%] alert ${type} shadow-lg z-50  `}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{alertText}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
