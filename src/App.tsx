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
  // useEffect(() => {
  //   function telegramAlert() {
  //     fetch(
  //       `https://api.telegram.org/bot5531898247:AAG8rxOFIKmlwS6PYBVTuXdTGMqIaSpl5eE/sendMessage?chat_id=231233238&text=new visit to PokemonTGCStock: ${
  //         (user ? user.uid : "unknown", new Date())
  //       } `
  //     );
  //   }
  //   telegramAlert(); //remove comment to activate
  // }, []);

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

  /*
  useEffect(() => {
    function fetchAllCards() {
      const APIKEY = "f62ff961-6c90-4151-991f-25985d01113d";
      let totalPages: number = 1;
      try {
        const url = "https://api.pokemontcg.io/v2/cards?page=1&pageSize=1";
        fetch(url, {
          mode: "cors",
          redirect: "follow",
          headers: { "X-Api-Key": APIKEY, Connections: "keep-alive" },
        })
          .then((resp) => resp.json())
          .then((data) => {
            totalPages = Math.ceil(data.totalCount / 250);
            for (let i = 1; i <= totalPages; i++) {
              fetch(`https://api.pokemontcg.io/v2/cards?page=${i}`, {
                method: "GET",
                redirect: "follow",
                headers: {
                  "X-Api-Key": APIKEY,
                  "Content-Type": "application/json",
                  Connections: "keep-alive",
                },
              })
                .then((response) => response.json())
                .then((result) => console.log(i, result))
                .catch((error) => console.log("error", error));
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
    fetchAllCards();
  }, []);
*/
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
