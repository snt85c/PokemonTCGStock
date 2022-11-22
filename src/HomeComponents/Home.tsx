import useCollectionStore from "../CollectionComponent/useCollectionStore";
import { iCollectionStore } from "../Interfaces";
import Darkmode from "../ProfileComponents/Darkmode";
import useProfileStore, { iState } from "../ProfileComponents/useProfileStore";
import CollectionRecap from "./CollectionRecap";
import { useUserAuth } from "../ProfileComponents/userAuth";
import SigninPage from "./SigninPage";

export default function Home() {
  const { user, googleSignIn, logout } = useUserAuth();
  let totalDecksValue = useCollectionStore(
    (state: iCollectionStore) => state.totalCollectionsValue
  );
  const rate = useProfileStore((state: iState) => state.conversionRate);
  let conversionSym = useProfileStore((state: iState) => state.conversionSym);

  return (
    <>
      <Darkmode />
      <div
        id="home"
        className="snap-center flex flex-col justify-start  sm:px-[10rem] items-center p-5 min-w-[100%] h-screen bg-white dark:bg-slate-900 text-black dark:text-white duration-300"
      >
        <div className="flex flex-col">
          {totalDecksValue > 0 ? (
            <div className="flex justify-center items-center m-3  dark:bg-gray-500 bg-gray-200 rounded-3xl py-1 px-6 select-none">
              total:{" "}
              <span className="font-bold text-2xl text-black dark:text-white">
                {(totalDecksValue * rate).toFixed(2)}{" "}
                {conversionSym.toLocaleUpperCase()}
              </span>
            </div>
          ) : (
            <div
              className="flex justify-center items-center m-3  dark:bg-gray-500 bg-gray-200 rounded-3xl py-1 px-6"
              style={{ display: user ? "flex" : "none" }}
            >
              no data
            </div>
          )}
        </div>
        <div className="flex flex-col overflow-scroll px-1 pb-10 w-full">
          {/* <CollectionRecap /> */}
        </div>
          {!user && (
            <SigninPage />
          )}
      </div>
    </>
  );
}
