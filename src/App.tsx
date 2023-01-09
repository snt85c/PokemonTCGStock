import { useUserAuth } from "./ProfileComponents/userAuth";
import Loading from "./Loading";
import Home from "./HomeComponents/Home";
import Search from "./SearchbarComponents/Search";
import Collection from "./CollectionComponent/Collection";
import Profile from "./ProfileComponents/Profile";
import Menu from "./MenuComponents/Menu";
import { setDoc, doc } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { db } from "./ProfileComponents/Firebase";
import useCollectionStore from "./CollectionComponent/useCollectionStore";
import { iCollectionStore } from "./Interfaces";
import useProfileStore, { iState } from "./ProfileComponents/useProfileStore";
import "./index.css";
import ScreenSizeWarning from "./ScreenSizeWarning";
import SigninPage from "./HomeComponents/SigninPage";
import Alert from "./utils/Alert";
import pokemon from "pokemontcgsdk";
import telegramAlert from "./utils/TelegramAlert";

function App() {
  const { user } = useUserAuth();
  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );
  const setUserInfo = useProfileStore((state: iState) => state.setUserInfo);
  const isDarkMode = useProfileStore((state: iState) => state.darkmode);
  const isLoading = useRef(true);

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const APIKEY = process.env.REACT_APP_POKEMON_TCG_API;

  pokemon.configure({ apiKey: APIKEY });

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
        setUserDeckFromFirebase(user.uid); // on collection state
        setUserInfo(user); // on profile state
        telegramAlert(user); //comment this function to activate/deactivate
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
      <Alert />
      {user ? (
        <>
          <div className="flex sm:hidden">
            <div className="flex snapclass">
              <Home />
              <Search />
              <Collection />
              <Profile />
            </div>
            <Menu />
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
