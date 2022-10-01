import { useUserAuth } from "./ProfileComponents/userAuth";
import "./index.css";
import Navbar from "./ProfileComponents/Profile";
import Search from "./SearchbarComponents/Search";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Menu from "./MenuComponents/Menu";
import Home from "./HomeComponents/Home";
import Collection from "./CollectionComponent/Collection";
import { setDoc, doc } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { db } from "./ProfileComponents/Firebase";
import useCollectionStore from "./CollectionComponent/useCollectionStore";
import { iCollectionStore } from "./Interfaces";
import Loading from "./Loading";
import NoPage from "./NoPage";
import useProfileStore, { iState } from "./ProfileComponents/useProfileStore";

function App() {
  const { user } = useUserAuth();

  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollectionStore) => state.setUserDeckFromFirebase
  );

  const setUserInfo = useProfileStore((state: iState) => state.setUserInfo);

  const isLoading = useRef(true);

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
    set()
      .then(() => {
        setUserDeckFromFirebase(user);
        setUserInfo(user);
      })
    
  }, [user]);

  return (
    <>
      {/* <Loading isLoading={isLoading} /> */}
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<Navbar />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Menu />
      </BrowserRouter>
    </>
  );
}

export default App;
