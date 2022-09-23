import {
  UserAuthContextProvider,
  useUserAuth,
} from "./LoginComponents/userAuth";
import Navbar from "./LoginComponents/Profile";
import Search from "./SearchbarComponents/Search";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Menu from "./MenuComponents/Menu";
import Home from "./HomeComponents/Home";
import Collection from "./CollectionComponent/Collection";
import { setDoc, doc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "./LoginComponents/Firebase";
import useCollectionStore from "./CollectionComponent/useCollectionStore";
import { iCollection } from "./Interfaces";

function App() {
  const { user } = useUserAuth();

  const setUserDeckFromFirebase = useCollectionStore(
    (state: iCollection) => state.setUserDeckFromFirebase
  );

  useEffect(() => {
    async function set() {
      if (user) {
        console.log("logged as: ", user.displayName);
        try {
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
          );
          setUserDeckFromFirebase(user);
        } catch (err) {
          console.log(err);
        }
      }
    }
    set();
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<Navbar />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
        <Menu />
      </BrowserRouter>
    </>
  );
}

export default App;
