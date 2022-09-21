import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const useDeckStore = create(
  devtools(
    persist((set) => ({
      searchRequest: "",
      resultJSXArray: [<></>],
      isLoading: false,
      searchTrigger: false,
      setSearchRequest: (request) => set(() => ({ searchRequest: request })),
      setIsLoading: (request) => set(() => ({ isLoading: request })),
      setResultJSXArray: (request) => set(() => ({ resultJSXArray: request })),
    })),
    { name: "deck-storage" }
  )
);

export default useDeckStore;
