import { useUserAuth } from "./ProfileComponents/userAuth";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Loading from "./Loading";
import Home from "./HomeComponents/Home";
import Search from "./SearchbarComponents/Search";
import Collection from "./CollectionComponent/Collection";
import Profile from "./ProfileComponents/Profile";
import Menu from "./MenuComponents/Menu";
import NoPage from "./NoPage";
import { setDoc, doc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "./ProfileComponents/Firebase";
import useCollectionStore from "./CollectionComponent/useCollectionStore";
import { iCollectionStore } from "./Interfaces";
import useProfileStore, { iState } from "./ProfileComponents/useProfileStore";
import "./index.css";
import ScreenSizeWarning from "./ScreenSizeWarning";
import SigninPage from "./HomeComponents/SigninPage";

function App() {
  const { user } = useUserAuth();
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );
  const setUserInfo = useProfileStore((state: iState) => state.setUserInfo);
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const isLoading = useRef(true);
  const [translate, setTranslate] = useState<number>(0);

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  useEffect(() => {
    function telegramAlert() {
      fetch(
        `https://api.telegram.org/bot5531898247:AAG8rxOFIKmlwS6PYBVTuXdTGMqIaSpl5eE/sendMessage?chat_id=231233238&text=new visit to PokemonTGCStock: ${
          (user ? user.uid : "unknown", new Date())
        } `
      );
    }
    telegramAlert(); //remove comment to activate
  }, []);

  useEffect(() => {
    isLoading.current = true;
    async function set() {
      try {
        if (user) {
          console.log("logged as: ", user.displayName);
          await setDoc(
            doc(db, "users", user.uid),
            {
              user: {
                displayName: user.displayName && user.displayName.split(" ")[0],
                photoURL: user.photoURL,
                uid: user.uid,
              },
            },
            { merge: true }
            //we rewrite the basic info for the user, or we write them anew
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    set().then(() => {
      if (user) {
        setUserDeckFromFirebase(user.uid);
        setUserInfo(user);
      }
      isLoading.current = false;
    });
  }, [user]);

  setTimeout(() => {
    //makes sure that the loading screen is removed after a certain amount
    isLoading.current = false;
  }, 4000);

  return (
    <>
      <Loading isLoading={isLoading} />
      {user ? (
        <>
          <div className="flex sm:hidden">
            <div className="flex snapclass">
              <Home />
              <Search />
              <Collection />
              <Profile />
            </div>
            <Menu setTranslate={setTranslate} />{" "}
          </div>
          <div className="hidden sm:flex">
            <ScreenSizeWarning />
          </div>
        </>
      ) : (
        <SigninPage />
      )}
    </>
  );
}

export default App;
